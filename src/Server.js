const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

// Mock user database
const users = [
  { id: 1, email: 'highyogesh@gmail.com', password: 'password123' },
  // Add more users as needed
];

// Mock token database
const tokens = {};

// Send email function
const sendEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tcethiru@gmail.com',
      pass: 'Yogesh140@',
    },
  });

  const mailOptions = {
    from: 'tcethiru@gmail.com',
    to: email,
    subject: 'Password Reset',
    text: `Click the following link to reset your password: http://localhost:3000/reset-password?token=${token}`,
  };

  await transporter.sendMail(mailOptions);
};

// API endpoint for resetting password
app.post('/api/reset-password', (req, res) => {
  const { email } = req.body;
  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const token = crypto.randomBytes(20).toString('hex');
  tokens[token] = { email, createdAt: new Date() };

  sendEmail(email, token)
    .then(() => res.json({ message: 'Password reset link sent successfully' }))
    .catch((error) => res.status(500).json({ error: 'Failed to send email' }));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
