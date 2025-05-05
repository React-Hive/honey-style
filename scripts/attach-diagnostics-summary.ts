import fs from 'fs';
import path from 'path';

const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals));

  return `${size} ${sizes[i]}`;
};

const formatSeconds = (seconds: number, decimals = 2): string => {
  if (seconds < 60) {
    return `${seconds} s`;
  }

  return `${(seconds / 60).toFixed(decimals)} min`;
};

const commitMsgFile = process.argv[2] || '.git/COMMIT_EDITMSG';
const commitMsgFilePath = path.resolve(process.cwd(), commitMsgFile);

const diagnosticsJsonFilePath = path.join(__dirname, '..', 'diagnostics', 'latest.json');
if (!fs.existsSync(diagnosticsJsonFilePath)) {
  process.exit(0);
}

const diagnosticsData = JSON.parse(fs.readFileSync(diagnosticsJsonFilePath, 'utf-8'));

const diagnosticsSummary = [
  `[Diagnostics]`,
  `Files: ${diagnosticsData.files}`,
  `Identifiers: ${diagnosticsData.identifiers}`,
  `Symbols: ${diagnosticsData.symbols}`,
  `Types: ${diagnosticsData.types}`,
  `Instantiations: ${diagnosticsData.instantiations}`,
  `Assignability Cache Size: ${formatBytes(diagnosticsData.assignabilityCacheSize)}`,
  `Identity Cache Size: ${formatBytes(diagnosticsData.identityCacheSize)}`,
  `Subtype Cache Size: ${formatBytes(diagnosticsData.subtypeCacheSize)}`,
  `Strict Subtype Cache Size: ${formatBytes(diagnosticsData.strictSubtypeCacheSize)}`,
  `Memory Used: ${formatBytes(diagnosticsData.memoryUsed)}`,
  `Check Time: ${formatSeconds(diagnosticsData.checkTime)}`,
  `Total Time: ${formatSeconds(diagnosticsData.totalTime)}`,
].join('\n');

const original = fs.readFileSync(commitMsgFilePath, 'utf8');
fs.writeFileSync(commitMsgFilePath, `${original.trim()}\n\n${diagnosticsSummary}\n`);
