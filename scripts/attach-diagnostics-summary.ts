import fs from 'fs';
import path from 'path';

const commitMsgFile = process.argv[2] || '.git/COMMIT_EDITMSG';
const commitMsgFilePath = path.resolve(process.cwd(), commitMsgFile);

const diagnosticsJsonFilePath = path.join(__dirname, '..', 'diagnostics', 'latest.json');
if (!fs.existsSync(diagnosticsJsonFilePath)) {
  process.exit(0);
}

const diagnosticsData = JSON.parse(fs.readFileSync(diagnosticsJsonFilePath, 'utf-8'));

const diagnosticsSummary = [
  `[Diagnostics]`,
  `Total Time: ${diagnosticsData.totalTime}ms`,
  `Instantiations: ${diagnosticsData.instantiations}`,
  `Memory Used: ${(diagnosticsData.memoryUsedBytes / 1024 / 1024).toFixed(2)} MB`,
].join('\n');

const original = fs.readFileSync(commitMsgFilePath, 'utf8');
fs.writeFileSync(commitMsgFilePath, `${original.trim()}\n\n${diagnosticsSummary}\n`);
