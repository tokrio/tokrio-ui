const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src/img');
const componentList = [];

//generateImageImport => node ./generateImageImports.js

try {
  fs.unlinkSync(path.join(__dirname, 'src/img/FileImports.ts'));
  console.log('File delete');
} catch (err) {
  console.error(err);
  return
}

fs.readdir(directoryPath, function (err, files) {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }

  files.forEach(function (fileName) {
    
    if (fileName.endsWith('.png') || fileName.endsWith('.svg') || fileName.endsWith('.jpg') || fileName.endsWith('.webp')) {

      const words = fileName.split('.')[0].split('_');
      const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
      const componentName = capitalizedWords.join('');
      const filePath = `./${fileName}`;
      componentList.push(componentName);
      const importStatement = `import ${componentName} from '${filePath}';\n`;
      fs.appendFileSync(path.join(__dirname, 'src/img/FileImports.ts'), importStatement);
    }

  });

  const exportStatement = `export { ${componentList.join(', ')} };`;
  fs.appendFileSync(path.join(__dirname, 'src/img/FileImports.ts'), exportStatement);
  console.log('File scan success.');
});
