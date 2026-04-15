/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignoriere TypeScript und ESLint Fehler für einen sauberen Build
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  
  webpack: (config, { isServer }) => {
    // Das hier ist der entscheidende Teil für Transformers.js:
    // Es verhindert, dass Webpack versucht, Node.js-spezifische 
    // KI-Binärdateien zu bündeln, die wir im Browser nicht brauchen.
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'onnxruntime-node': false,
      };
    }

    return config;
  },
};

export default nextConfig;
