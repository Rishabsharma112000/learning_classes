// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;
  console.log(token);
  if (!token) return res.status(400).json({ message: 'Token is required' });

  try {
    // Verify the token using Google's tokeninfo endpoint
    const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);

    const { email, name, picture, sub: googleId } = response.data;

    // TODO: Save user to DB or find existing user
    const user = {
      googleId,
      email,
      name,
      picture,
    };

    // For now, just return the user
    res.status(200).json({ message: 'User authenticated', user });
  } catch (error) {
    console.error('Error verifying token:', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
