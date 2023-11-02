import { exec } from 'child_process';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { scriptPath } = req.body;
    exec(`python ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        res.status(500).json({ error: stderr });
        return;
      }
      console.log(`stdout: ${stdout}`);
      res.status(200).json({ output: stdout });
    });
  } else {
    res.status(405).end();
  }
}

