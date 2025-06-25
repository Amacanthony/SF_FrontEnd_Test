import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::", // for local dev if needed
    port: 8080
  },
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT) || 8080,
    strictPort: true,
    allowedHosts: ['sf-frontend-test.onrender.com']
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
