import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

function saveContentPlugin(): Plugin {
  return {
    name: 'save-content-middleware',
    configureServer(server) {
      server.middlewares.use('/api/save-content', (req, res, next) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const targetFile = path.resolve(process.cwd(), 'src/data/birthdayContent.ts');
              const fileContent = `import { BirthdayConfig } from '../types';

/**
 * =======================================================================
 * SAVED PERSONAL BIRTHDAY CONTENT CONFIGURATION
 * =======================================================================
 * Permanently saved for production and ready for Netlify deployment.
 * =======================================================================
 */

export const initialBirthdayConfig: BirthdayConfig = ${JSON.stringify(data, null, 2)};
`;
              fs.writeFileSync(targetFile, fileContent, 'utf-8');
              console.log('[Content Sync] Successfully saved edited birthday content to src/data/birthdayContent.ts');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'Content saved to birthdayContent.ts' }));
            } catch (err: any) {
              console.error('[Content Sync Error]', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Failed to save' }));
            }
          });
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), saveContentPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
