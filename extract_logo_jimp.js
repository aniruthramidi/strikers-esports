import { Jimp } from 'jimp';

async function main() {
  console.log("Reading image...");
  const image = await Jimp.read('/Users/aniruthreddy/.gemini/antigravity/brain/2d7d668e-222f-459a-becd-54ef9af0fdfb/media__1783606283715.png');
  
  console.log("Processing pixels...");
  image.scan((x, y, idx) => {
    const r = image.bitmap.data[idx + 0];
    const g = image.bitmap.data[idx + 1];
    const b = image.bitmap.data[idx + 2];
    
    // If pixel is near white, make it transparent
    if (r > 240 && g > 240 && b > 240) {
      image.bitmap.data[idx + 3] = 0; // Alpha
    }
  });
  
  console.log("Autocropping borders...");
  try {
    image.autocrop();
  } catch (e) {
    console.log("Autocrop skipped or failed:", e.message);
  }
  
  console.log("Writing to target path...");
  await image.write('/Users/aniruthreddy/.gemini/antigravity/scratch/strikers-esports/public/logo_transparent.png');
  console.log("SUCCESS: logo_transparent.png created!");
}

main().catch(err => {
  console.error("ERROR:", err);
});
