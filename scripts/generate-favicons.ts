import sharp from 'sharp';
import Logo from '../src/components/Logo';
import { renderToString } from 'react-dom/server';
import { encode } from 'ico-endec';
import { writeFileSync } from 'fs';
import path from 'path';

const sizes = {
  'favicon-16x16.png': 16,
  'favicon-32x32.png': 32,
  'apple-touch-icon.png': 180,
  'logo192.png': 192,
  'logo512.png': 512
};

async function generateIcons() {
  // 确保 Logo 组件渲染为正确的 SVG
  const svgString = renderToString(
    Logo({ 
      size: 1024,
      className: "text-primary" 
    })
  );
  
  // 移除 React 相关属性，保留纯 SVG
  const cleanSvgString = svgString
    .replace(/data-reactroot=""/g, '')
    .replace(/class=/g, 'className=');
  
  const svgBuffer = Buffer.from(cleanSvgString);

  // 生成各种尺寸的 PNG
  for (const [filename, size] of Object.entries(sizes)) {
    await sharp(svgBuffer)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(path.join(process.cwd(), 'public', filename));
    
    console.log(`Generated ${filename}`);
  }

  // 生成 favicon.ico
  const icoSizes = [16, 32, 48];
  const icoBuffers = await Promise.all(
    icoSizes.map(size =>
      sharp(svgBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toBuffer()
    )
  );

  // 将多个尺寸的 PNG 合并为一个 ICO 文件
  const icoData = encode(icoBuffers.map((buffer, index) => ({
    width: icoSizes[index],
    height: icoSizes[index],
    data: buffer,
    bpp: 32
  })));

  writeFileSync(
    path.join(process.cwd(), 'public', 'favicon.ico'),
    Buffer.from(icoData)
  );
  
  console.log('Generated favicon.ico');
}

// 添加错误处理
generateIcons().catch(error => {
  console.error('Error generating icons:', error);
  process.exit(1);
}); 