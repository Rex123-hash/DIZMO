param(
  [string]$ProjectId = "atlasaccess",
  [string]$Region = "us-central1",
  [string]$Repository = "dizmo",
  [switch]$SkipMcp,
  [switch]$DeployWeb,
  [switch]$DeploySlack
)

$ErrorActionPreference = "Stop"

function Ensure-Command($Name) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "$Name is required but was not found on PATH."
  }
}

function Ensure-Secret($Name, $Value) {
  $previousErrorActionPreference = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  gcloud secrets describe $Name --project $ProjectId --format "value(name)" 1>$null 2>$null
  $exists = $LASTEXITCODE -eq 0
  $ErrorActionPreference = $previousErrorActionPreference

  if (-not $exists) {
    gcloud secrets create $Name --project $ProjectId --replication-policy automatic | Out-Host
  }

  $tempFile = New-TemporaryFile
  try {
    Set-Content -LiteralPath $tempFile -Value $Value -NoNewline
    gcloud secrets versions add $Name --project $ProjectId --data-file $tempFile | Out-Host
  }
  finally {
    Remove-Item -LiteralPath $tempFile -Force -ErrorAction SilentlyContinue
  }
}

Ensure-Command gcloud

gcloud config set project $ProjectId | Out-Host

gcloud services enable `
  run.googleapis.com `
  cloudbuild.googleapis.com `
  artifactregistry.googleapis.com `
  secretmanager.googleapis.com `
  --project $ProjectId | Out-Host

$repoExists = gcloud artifacts repositories list `
  --location $Region `
  --project $ProjectId `
  --filter "name:$Repository" `
  --format "value(name)"

if (-not $repoExists) {
  gcloud artifacts repositories create $Repository `
    --repository-format docker `
    --location $Region `
    --description "DIZMO container images" `
    --project $ProjectId | Out-Host
}

$registry = "$Region-docker.pkg.dev/$ProjectId/$Repository"
$mcpImage = "$registry/dizmo-relief-mcp:latest"
$slackImage = "$registry/dizmo-slack-app:latest"
$webImage = "$registry/dizmo-web:latest"

if (-not $SkipMcp) {
  gcloud builds submit . `
    --config deploy/cloudbuild.relief-mcp.yaml `
    --substitutions "_IMAGE=$mcpImage" `
    --project $ProjectId | Out-Host

  gcloud run deploy dizmo-relief-mcp `
    --image $mcpImage `
    --region $Region `
    --platform managed `
    --allow-unauthenticated `
    --port 8080 `
    --memory 512Mi `
    --cpu 1 `
    --min-instances 0 `
    --max-instances 3 `
    --project $ProjectId | Out-Host
}

$mcpUrl = gcloud run services describe dizmo-relief-mcp `
  --region $Region `
  --project $ProjectId `
  --format "value(status.url)"

Write-Host "Relief MCP deployed: $mcpUrl"

if ($DeployWeb) {
  gcloud builds submit . `
    --config deploy/cloudbuild.web.yaml `
    --substitutions "_IMAGE=$webImage" `
    --project $ProjectId | Out-Host

  gcloud run deploy dizmo-web `
    --image $webImage `
    --region $Region `
    --platform managed `
    --allow-unauthenticated `
    --port 8080 `
    --memory 512Mi `
    --cpu 1 `
    --min-instances 0 `
    --max-instances 3 `
    --project $ProjectId | Out-Host

  $webUrl = gcloud run services describe dizmo-web `
    --region $Region `
    --project $ProjectId `
    --format "value(status.url)"

  Write-Host "Web dashboard deployed: $webUrl"
}

if ($DeploySlack) {
  $required = @("SLACK_BOT_TOKEN", "SLACK_SIGNING_SECRET", "SLACK_APP_TOKEN", "SLACK_RESPONSE_CHANNEL_ID")
  foreach ($name in $required) {
    if (-not [Environment]::GetEnvironmentVariable($name)) {
      throw "Set environment variable $name before deploying the Slack app."
    }
  }

  Ensure-Secret "dizmo-slack-bot-token" $env:SLACK_BOT_TOKEN
  Ensure-Secret "dizmo-slack-signing-secret" $env:SLACK_SIGNING_SECRET
  Ensure-Secret "dizmo-slack-app-token" $env:SLACK_APP_TOKEN

  gcloud builds submit . `
    --config deploy/cloudbuild.slack-app.yaml `
    --substitutions "_IMAGE=$slackImage" `
    --project $ProjectId | Out-Host

  gcloud run deploy dizmo-slack-app `
    --image $slackImage `
    --region $Region `
    --platform managed `
    --no-allow-unauthenticated `
    --port 8080 `
    --memory 512Mi `
    --cpu 1 `
    --min-instances 1 `
    --max-instances 2 `
    --no-cpu-throttling `
    --set-secrets "SLACK_BOT_TOKEN=dizmo-slack-bot-token:latest,SLACK_SIGNING_SECRET=dizmo-slack-signing-secret:latest,SLACK_APP_TOKEN=dizmo-slack-app-token:latest" `
    --set-env-vars "SLACK_RESPONSE_CHANNEL_ID=$env:SLACK_RESPONSE_CHANNEL_ID,MCP_SERVER_URL=$mcpUrl,USE_LOCAL_SEARCH=false,LIVE_DATA_ONLY=true,ALLOW_DEMO_DATA=false" `
    --project $ProjectId | Out-Host

  $slackUrl = gcloud run services describe dizmo-slack-app `
    --region $Region `
    --project $ProjectId `
    --format "value(status.url)"

  Write-Host "Slack app deployed: $slackUrl"
}
else {
  Write-Host "Slack app skipped. Re-run with -DeploySlack after exporting Slack secrets."
}
