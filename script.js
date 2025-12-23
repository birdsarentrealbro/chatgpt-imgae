document.getElementById('generate').addEventListener('click', async () => {
  const file = document.getElementById('image').files[0];
  const prompt = document.getElementById('prompt').value;

  if (!prompt) return alert("Enter a prompt!");

  const formData = new FormData();
  if (file) formData.append('image', file);
  formData.append('prompt', prompt);

  const response = await fetch('https://YOUR_VERCEL_FUNCTION_URL/generate', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  document.getElementById('result').src = data.imageUrl;
});
