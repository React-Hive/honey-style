import fs from 'fs';
import path from 'path';

const jsonPath = path.join(__dirname, '..', 'diagnostics', 'latest.json');
if (!fs.existsSync(jsonPath)) process.exit(0);

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

const summary = [
  `[Diagnostics]`,
  `Total Time: ${data.totalTime}ms`,
  `Instantiations: ${data.instantiations}`,
  `Memory Used: ${(data.memoryUsedBytes / 1024 / 1024).toFixed(2)} MB`,
].join('\n');

fs.appendFileSync('.git/COMMIT_EDITMSG', '\n' + summary + '\n');
