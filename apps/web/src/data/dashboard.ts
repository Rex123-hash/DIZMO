import {
  createIncidentFromExtraction,
  demoDepots,
  demoShelters,
  demoSlackMessages,
  demoVolunteers,
  extractReport,
  type FieldReport,
  generateSituationBrief,
  type Incident,
  type ResponseTask,
} from "@dizmo/core";

const reportTexts = [
  "Shelter North has only 12 water crates left. 80 people inside and two buses arriving.",
  "Family of 5 stranded near Ward 8 bridge checkpoint. Water rising. One elderly person. Need rescue verification.",
  "Riverside Gym capacity nearing limit. Four more families can be accepted before overflow.",
  "Medical assistance needed in Central District. One resident has a leg injury and needs support.",
  "Road blocked due to flooding near Main Road. Driver route needs rerouting.",
];

const reports: FieldReport[] = reportTexts.map((rawText, index) => ({
  id: `ui-report-${index + 1}`,
  channelId: "C-DEMO",
  rawText,
  reporter: "demo-coordinator",
  createdAt: new Date(Date.now() - index * 11 * 60_000).toISOString(),
}));

export const incidents: Incident[] = reports.map((report, index) => {
  const extracted = extractReport(report);
  const incident = createIncidentFromExtraction(extracted, report.id);

  return {
    ...incident,
    id: `inc-${index + 1}`,
    status: index === 2 ? "acknowledged" : index === 3 ? "assigned" : "open",
    createdAt: report.createdAt,
    updatedAt: new Date(Date.now() - index * 9 * 60_000).toISOString(),
  };
});

export const tasks: ResponseTask[] = [
  {
    id: "task-water-north",
    incidentId: "inc-1",
    title: "Dispatch 25 water crates from Central Depot",
    owner: "Asha",
    status: "approved",
    priority: "high",
    createdAt: new Date(Date.now() - 6 * 60_000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60_000).toISOString(),
  },
  {
    id: "task-ward-8",
    incidentId: "inc-2",
    title: "Verify rescue request at Ward 8 bridge",
    owner: "Omar",
    status: "in_progress",
    priority: "critical",
    createdAt: new Date(Date.now() - 10 * 60_000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60_000).toISOString(),
  },
];

export const dashboardData = {
  incidents,
  tasks,
  shelters: demoShelters,
  depots: demoDepots,
  volunteers: demoVolunteers,
  messages: demoSlackMessages,
  brief: generateSituationBrief(incidents, tasks, [
    {
      id: "audit-1",
      type: "task_created",
      actor: "Amaan",
      subjectId: "task-water-north",
      message: "Amaan approved water dispatch to Shelter North.",
      createdAt: new Date(Date.now() - 2 * 60_000).toISOString(),
    },
  ]),
};
