import FormData from 'form-data';
import fetch from 'node-fetch';

export const config = {
  api: { bodyParser: false } // for file uploads
};

export default async function handler(req, res) {
  try {
    const data = await new Promise((resolve, reject) => {
      let body = [];
      req.on('data', chunk => body.push(chunk));
      req.on('end', () => resolve(Buffer.concat(body)));
      req.on('error', err => reject(err));
    });

    // Using formidable to parse form-data (npm install formidable)
    const formidable = (await import('formidable')).default;
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).send("Error parsing files");

      const prompt = fields.prompt;
      let formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('size', '1024x1024');

      if (files.image) {
        formData.append('image', fs.createReadStream(files.image[0].filepath));
        formData.append('mask', fs.createReadStream(files.image[0].filepath));
      }

      const response = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
        body: formData
      });

      const json = await response.json();
      res.status(200).json({ imageUrl: json.data[0].url });
    });

  } catch (e) {
    console.error(e);
    res.status(500).send("Error generating image");
  }
}
