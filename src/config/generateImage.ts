// Function to generate a default image based on a text and background color
import Jimp from "jimp";
export async function generateDefaultImage(text: any, backgroundColor: string): Promise<Buffer> {

  const image = new Jimp(500, 500, backgroundColor); // Set background color
  const font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE); // Use a white font for visibility
  const textX = Math.max(
    0,
    (image.getWidth() - Jimp.measureText(font, text)) / 2
  );
  const textY = Math.max(
    0,
    (image.getHeight() - Jimp.measureTextHeight(font, text, image.getWidth())) /
      2
  );
  image.print(font, textX, textY, text);
  return image.getBufferAsync(Jimp.MIME_JPEG);
}

// Function to generate a random color
export function generateRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


export const sanitizeFileName = (fileName: string) => {
  return fileName.replace(/[^a-zA-Z0-9-_.]/g, "").replace(/\s+/g, "_");
};
