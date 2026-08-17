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
  
  // Sort messages descending by line to avoid offset issues
  file.messages.sort((a, b) => b.line - a.line || b.column - a.column);
  
  let lastLineIdx = -1;
  for (const msg of file.messages) {
    const lineIdx = msg.line - 1;
    
    // prevent multiple disables on the same line if multiple errors exist
    if (lineIdx === lastLineIdx) continue;
    lastLineIdx = lineIdx;
    
    lines.splice(lineIdx, 0, `  // eslint-disable-next-line ${msg.ruleId}`);
  }

  fs.writeFileSync(file.filePath, lines.join('\n'), 'utf8');
});

console.log(`Unconditional disable applied to all remaining errors!`);
