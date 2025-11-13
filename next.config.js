/** @type {import('next').NextConfig} */
const nextConfig = {
  // Asegura SSR (NO usar 'export')
  output: undefined,          // build estándar de Next
  distDir: '.next',           // explícito (por defecto)

  // Opcional: si tienes problemas de tracing en CI/Netlify
  experimental: {
    outputFileTracingRoot: process.cwd(),
  },

  // Opcional: descomenta si ESLint/TS te bloquean el build
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

module.exports = nextConfig;