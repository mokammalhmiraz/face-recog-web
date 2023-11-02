'use client'
import { useState } from 'react';

export default function MyComponent() {
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const executePythonScript = async () => {
    try {
      const response = await fetch('/api/execute_python', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scriptPath: 'E:/Python/Python Works/process.py' }), // Replace with your script path
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setOutput(data.output);
      }
    } catch (error) {
      console.error('Error:', error.message);
      setError(error.message);
    }
  };

  return (
    <div>
      <button onClick={executePythonScript}>Execute Python Script</button>
      {error && <div>Error: {error}</div>}
      {output && <div>Output: {output}</div>}
    </div>
  );
}
