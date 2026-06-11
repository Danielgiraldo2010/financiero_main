#!/usr/bin/env node
/**
 * Script para generar vercel.json dinámicamente basado en variables de entorno
 * Se ejecuta en el build de Vercel antes del deploy
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Cargar .env.local si existe
const envLocalPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath })
}

// Lee las variables de entorno - REQUERIDA
const apiBackend = process.env.VITE_API_BACKEND
if (!apiBackend) {
  console.error('❌ Error: La variable de entorno VITE_API_BACKEND no está definida')
  console.error('   Define la variable en .env.local:')
  console.error('   VITE_API_BACKEND=http://tu-api.com')
  process.exit(1)
}

// Genera la configuración de Vercel
const vercelConfig = {
  rewrites: [
    {
      source: '/api/:path*',
      destination: `${apiBackend}/api/:path*`,
    },
    {
      source: '/(.*)',
      destination: '/index.html',
    },
  ],
}

// Escribe el archivo
const configPath = path.join(__dirname, '..', 'vercel.json')
fs.writeFileSync(configPath, JSON.stringify(vercelConfig, null, 2))

console.log(`✅ vercel.json generado correctamente`)
console.log(`   API Backend: ${apiBackend}`)
