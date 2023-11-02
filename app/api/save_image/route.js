// pages/api/saveImage.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const { imageData, imageName } = req.body;

    if (!imageData) {
      return res.status(400).json({ success: false, message: 'No image data found.' });
    }

    const base64Data = imageData.replace(/^data:image\/jpeg;base64,/, '');
    const binaryData = Buffer.from(base64Data, 'base64');

    const finalImageName = imageName ? `${imageName}.jpg` : `image_${Date.now()}.jpg`;

    const directory = './public/'; // Replace with your desired directory path

    fs.writeFile(path.join(directory, finalImageName), binaryData, (error) => {
      if (error) {
        console.error('Error saving the image:', error);
        return res.status(500).json({ success: false, message: 'Error saving the image' });
      } else {
        console.log('Image saved successfully');
        return res.status(200).json({ success: true, message: 'Image saved successfully' });
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ success: false, message: 'Unexpected error occurred' });
  }
}
