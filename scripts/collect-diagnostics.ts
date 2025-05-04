import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const toCamelCase = (str: string): string =>
  str
    .replace(/[\/]/g, '') // remove slashes
    .split(/[\s_]+/)
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toLowerCase() + word.slice(1)
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join('');

const diagnosticsDir = path.join(__dirname, '..', 'diagnostics');
fs.mkdirSync(diagnosticsDir, { recursive: true });

const raw = execSync(
  'node --max-old-space-size=4096 ./node_modules/typescript/bin/tsc --project ./tsconfig.build.json --extendedDiagnostics',
  { encoding: 'utf8' },
);

const metrics: Record<string, number | string> = {};

for (const line of raw.split('\n')) {
  const match = line.match(/^(.+?):\s+([\d.]+)([A-Za-z]*)$/);
  if (!match) {
    continue;
  }

  let [, key, value, unit] = match;

  key = toCamelCase(key.trim());

  let num = parseFloat(value);
  if (unit === 'K') {
    num *= 1024; // convert kilobytes to bytes
    key += 'Bytes';
  }

  if (unit === 'M') {
    num *= 1024 * 1024;
    key += 'Bytes';
  }

  metrics[key] = Math.round(num * 1000) / 1000;
}

const output = JSON.stringify(metrics, null, 2);
const timestamp = new Date().toISOString().replace(/:/g, '-');

fs.writeFileSync(path.join(diagnosticsDir, `${timestamp}.json`), output);
fs.writeFileSync(path.join(diagnosticsDir, `latest.json`), output);
