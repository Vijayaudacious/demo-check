import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";
import path from "path";
import dotenv from "dotenv";
import theme from "./theme";
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  root: path.join(__dirname, "src"),
  publicDir: path.join(__dirname, "public"),
  plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
  server: {
    port: 3000,
  },
  build: {
    outDir: path.join(__dirname, "build"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          antd: ["antd"],
        },
      },
    },
  },
  define: { "process.env": process.env },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: theme,
      },
    },
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.join(__dirname, "src"),
      },
      {
        find: /^~/,
        replacement: "",
      },
    ],
  },
});
