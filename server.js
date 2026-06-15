const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.post('/send-verification-code', async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: 'Email and code are required' });
  }

  try {
    await resend.emails.send({
      from: 'noreply@resend.dev',
      to: email,
      subject: 'E-Sınav Doğrulama Kodu',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px;">
          <h2 style="color: #6366f1;">E-Sınav Doğrulama Kodunuz</h2>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #6366f1; font-size: 48px; letter-spacing: 8px; margin: 0;">${code}</h1>
          </div>
          <p style="color: #666;">Bu kod 120 saniye geçerlidir.</p>
        </div>
      `
    });
    
    res.json({ success: true, message: 'Code sent successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
