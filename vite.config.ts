import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "rewrite-patient-app",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url) {
            const url = req.url.split("?")[0];
            if (url === "/patient-app" || url === "/patient-app/") {
              req.url = "/patient-app/index.html" + (req.url.includes("?") ? "?" + req.url.split("?")[1] : "");
            }
          }
          next();
        });
      },
    },
  ],
});
