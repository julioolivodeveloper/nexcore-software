const fetch = require('node-fetch');

async function setupAdmin() {
  try {
    const response = await fetch('http://localhost:3003/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'jojulioneto1@gmail.com',
        password: 'Julioolivo94@',
        name: 'Admin Julio'
      })
    });

    const data = await response.json();
    console.log('✓ Usuario admin registrado:', data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

setupAdmin();
