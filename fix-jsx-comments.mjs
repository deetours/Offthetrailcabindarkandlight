import fs from 'fs';

const reportPath = 'eslint_report.json';
if (!fs.existsSync(reportPath)) {
  console.log('No report found');
  process.exit(0);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

report.forEach(file => {
  if (file.errorCount === 0 && file.warningCount === 0) return;
  
  let content = fs.readFileSync(file.filePath, 'utf8');
  let lines = content.split('\n');
  
  for (const msg of file.messages) {
    if (msg.ruleId === 'react/jsx-no-comment-textnodes') {
      const lineIdx = msg.line - 1;
      let line = lines[lineIdx];
      // Replace "// eslint-disable-next-line" with "{/* eslint-disable-next-line ... */}"
      if (line.includes('// eslint-disable-next-line')) {
        line = line.replace(/\/\/\s*(eslint-disable-next-line.*)/, "{/* $1 */}");
        lines[lineIdx] = line;
      }
    }
  }

  fs.writeFileSync(file.filePath, lines.join('\n'), 'utf8');
});

console.log(`JSX comments fixed!`);
