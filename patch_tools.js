const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, 'src/app/(tools)');

const files = fs.readdirSync(toolsDir).map(d => path.join(toolsDir, d, 'page.tsx')).filter(f => fs.existsSync(f));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Skip if it doesn't have the wrong import
  if (!content.includes('import ToolLayout from "@/components/ToolLayout"')) {
    continue;
  }

  // 1. Fix the import
  content = content.replace('import ToolLayout from "@/components/ToolLayout";', 'import { ToolLayout } from "@/components/tool-layout";');

  // 2. Fix the props
  // Match: <ToolLayout\s+title="([^"]+)"\s+description="([^"]+)"\s+icon=\{[^}]+\}\s*>
  content = content.replace(/<ToolLayout\s+title="([^"]+)"\s+description="([^"]+)"\s+icon=\{[^}]+\}\s*>/g, (match, p1, p2) => {
    // Generate an ID from the title
    const id = p1.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `<ToolLayout id="${id}" name="${p1}" description="${p2}">`;
  });

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Patched ${file}`);
}
