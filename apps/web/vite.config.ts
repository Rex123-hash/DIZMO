import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
  preview: {
    allowedHosts: [
      "dizmo-web-cmpaxhkkma-uc.a.run.app",
      "dizmo-web-526660427489.us-central1.run.app",
      ".run.app",
    ],
  },
});
