import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

// Locate the compiled C++ backend binary.
function backendBin(): string {
  if (process.env.NUMERICORE_BIN) return process.env.NUMERICORE_BIN;
  const base = resolve(import.meta.dirname, '..', 'NumeriCore-backend', 'build');
  for (const name of ['numericore.exe', 'numericore']) {
    const p = join(base, name);
    if (existsSync(p)) return p;
  }
  return join(base, 'numericore');
}

// Dev-only bridge: POST /api/calculate pipes the request body through the
// backend binary's stdin and returns its stdout verbatim (already JSON).
function numericoreBridge(): Plugin {
  return {
    name: 'numericore-bridge',
    configureServer(server) {
      server.middlewares.use('/api/calculate', (req, res) => {
        const sendErr = (status: number, code: string, message: string) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, data: null, error: { code, message } }));
        };

        if (req.method !== 'POST') return sendErr(405, 'METHOD_NOT_ALLOWED', 'Use POST.');

        const bin = backendBin();
        if (!existsSync(bin)) {
          return sendErr(500, 'BACKEND_MISSING', `numericore binary not found at ${bin}. Build the backend first.`);
        }

        let body = '';
        let tooBig = false;
        req.on('data', (c) => {
          body += c;
          if (body.length > 1024 * 1024) {
            tooBig = true;
            req.destroy();
          }
        });
        req.on('end', () => {
          if (tooBig) return sendErr(413, 'INPUT_TOO_LARGE', 'Request too large.');

          const child = spawn(bin, [], { timeout: 10000 });
          let out = '';
          let errout = '';
          child.stdout.on('data', (d) => (out += d));
          child.stderr.on('data', (d) => (errout += d));
          child.on('error', (e) => sendErr(500, 'BACKEND_SPAWN_ERROR', e.message));
          child.on('close', (code) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              out ||
                JSON.stringify({
                  success: false,
                  data: null,
                  error: { code: 'BACKEND_NO_OUTPUT', message: errout || `exit ${code}` },
                }),
            );
          });
          child.stdin.write(body);
          child.stdin.end();
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), numericoreBridge()],
});
