const fs = require('fs');

const filesToFix = [
  'src/app/(tools)/image-to-pdf/page.tsx',
  'src/app/(tools)/pdf-merger/page.tsx',
  'src/app/(tools)/pdf-password/page.tsx',
  'src/app/(tools)/pdf-resizer/page.tsx',
  'src/app/(tools)/pdf-splitter/page.tsx',
];

for (const file of filesToFix) {
  let content = fs.readFileSync(file, 'utf8');
  // Fix Blob instantiation
  content = content.replace(/new Blob\(\[(.*?)\]/g, 'new Blob([$1 as any]');
  // Fix pdf-password
  if (file.includes('pdf-password')) {
    content = content.replace('{ password }', '{ password } as any');
  }
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed', file);
}

// Fix number-namer
let numberNamer = fs.readFileSync('src/app/(tools)/number-namer/page.tsx', 'utf8');
numberNamer = numberNamer.replace(/1000n/g, 'BigInt(1000)');
numberNamer = numberNamer.replace(/0n/g, 'BigInt(0)');
fs.writeFileSync('src/app/(tools)/number-namer/page.tsx', numberNamer, 'utf8');
console.log('Fixed number-namer');

// Fix secret-sharing
let secretSharing = fs.readFileSync('src/app/(tools)/secret-sharing/page.tsx', 'utf8');
secretSharing = secretSharing.replace('arrayBufferToBase64(iv)', 'arrayBufferToBase64(iv.buffer)');
fs.writeFileSync('src/app/(tools)/secret-sharing/page.tsx', secretSharing, 'utf8');
console.log('Fixed secret-sharing');
