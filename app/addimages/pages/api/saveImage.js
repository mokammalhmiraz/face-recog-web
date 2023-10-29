// pages/api/saveImage.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { imageData, imageName } = req.body;
  const directoryPath = path.join(process.cwd(), 'custom-directory', imageName);

  // Remove the prefix from the base64 data
  const base64Data = imageData.replace(/^data:image\/jpeg;base64,/, '');

  // Save the image to the specified directory
  fs.writeFile(directoryPath, base64Data, 'base64', (error) => {
    if (error) {
      console.error('Error saving the image:', error);
      res.status(500).send('Error saving the image');
    } else {
      res.status(200).send('Image saved successfully');
    }
  });
}
