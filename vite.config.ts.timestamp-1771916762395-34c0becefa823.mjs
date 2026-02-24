// vite.config.ts
import { defineConfig } from "file:///app/webapp/node_modules/vite/dist/node/index.js";
import react from "file:///app/webapp/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///app/webapp/node_modules/pp-tagger/dist/index.js";
var __vite_injected_original_dirname = "/app/webapp";
var vite_config_default = defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: true,
    hmr: {
      overlay: false
      // Disables the error overlay if you only want console errors
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwL3dlYmFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2FwcC93ZWJhcHAvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2FwcC93ZWJhcHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQge2RlZmluZUNvbmZpZ30gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHtjb21wb25lbnRUYWdnZXJ9IGZyb20gXCJwcC10YWdnZXJcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoe21vZGV9KSA9PiAoe1xuICAgIHBsdWdpbnM6IFtcbiAgICAgICAgcmVhY3QoKSxcbiAgICAgICAgbW9kZSA9PT0gJ2RldmVsb3BtZW50JyAmJlxuICAgICAgICBjb21wb25lbnRUYWdnZXIoKSxcbiAgICBdLmZpbHRlcihCb29sZWFuKSxcbiAgICByZXNvbHZlOiB7XG4gICAgICAgIGFsaWFzOiB7XG4gICAgICAgICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgICBob3N0OiAnMC4wLjAuMCcsXG4gICAgICAgIHBvcnQ6IDUxNzMsXG4gICAgICAgIGFsbG93ZWRIb3N0czogdHJ1ZSxcbiAgICAgICAgaG1yOiB7XG4gICAgICAgICAgICBvdmVybGF5OiBmYWxzZSAvLyBEaXNhYmxlcyB0aGUgZXJyb3Igb3ZlcmxheSBpZiB5b3Ugb25seSB3YW50IGNvbnNvbGUgZXJyb3JzXG4gICAgICAgIH1cbiAgICB9LFxufSkpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtTixTQUFRLG9CQUFtQjtBQUM5TyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVEsdUJBQXNCO0FBSDlCLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUMsS0FBSSxPQUFPO0FBQUEsRUFDckMsU0FBUztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sU0FBUyxpQkFDVCxnQkFBZ0I7QUFBQSxFQUNwQixFQUFFLE9BQU8sT0FBTztBQUFBLEVBQ2hCLFNBQVM7QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNILEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN4QztBQUFBLEVBQ0o7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLGNBQWM7QUFBQSxJQUNkLEtBQUs7QUFBQSxNQUNELFNBQVM7QUFBQTtBQUFBLElBQ2I7QUFBQSxFQUNKO0FBQ0osRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
