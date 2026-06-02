// IMPORTANTE: el backend corre en https://localhost:51953 con SSL self-signed.
// El proxy de Vite resuelve dos problemas simultaneamente:
//   1. CORS: las peticiones salen desde el mismo origen (localhost:5173)
//   2. SSL self-signed: el proxy de Node ignora el cert invalido con secure:false
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "path"
import { tanstackRouter } from "@tanstack/router-plugin/vite"

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
        // LOCAL: apunta al backend local con SSL self-signed
        //target: "https://localhost:5173",
        // PRODUCCION: descomentar y comentar la línea de arriba
        target: "http://financiero.runasp.net",
        changeOrigin: true,
        secure: false, // ignora cert self-signed en local
      },
    },
  },
})