import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [],
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api/giphy': {
          target: 'https://api.giphy.com/v1',
          changeOrigin: true,
          rewrite: (path) => {
            if (path.includes('?endpoint=')) {
              const url = new URL(path, 'http://localhost');
              const endpoint = url.searchParams.get('endpoint');
              url.searchParams.delete('endpoint');
              return `/${endpoint}${url.search}`;
            }
            // Manejar el formato directo
            return path.replace(/^\/api\/giphy/, '');
          },
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              const url = new URL(proxyReq.path, 'https://api.giphy.com');
              url.searchParams.append('api_key', env.VITE_GIPHY_API_KEY);
              proxyReq.path = url.pathname + url.search;
            });
          },
        },
      },
    },
    build: {
      outDir: 'build',
      assetsDir: 'assets',
      sourcemap: true,
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
        },
      },
    },
    define: {
      'import.meta.env.VITE_GIPHY_API_KEY': JSON.stringify(env.VITE_GIPHY_API_KEY),
    },
  };
});