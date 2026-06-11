// IMPORTANTE: el backend URL se configura via variable de entorno VITE_API_BACKEND
// El proxy de Vite resuelve dos problemas simultaneamente:
//   1. CORS: las peticiones salen desde el mismo origen (localhost:5173)
//   2. SSL self-signed: el proxy de Node ignora el cert invalido con secure:false
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "path"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import { fileURLToPath } from "url"
import fs from "fs"
import dotenv from "dotenv"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Cargar .env.local si existe
const envLocalPath = path.join(__dirname, ".env.local")
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath })
}

// Validar que la variable de entorno esté definida
if (!process.env.VITE_API_BACKEND) {
  throw new Error("La variable de entorno VITE_API_BACKEND no está definida. Define en .env.local")
}

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      routesDirectory: "src/app/router/routes",
      generatedRouteTree: "src/routeTree.gen.ts",
    }),
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        // URL del backend desde variable de entorno (REQUERIDA)
        target: process.env.VITE_API_BACKEND,
        changeOrigin: true,
        secure: false, // ignora cert self-signed en local
      },
    },
  },
})
