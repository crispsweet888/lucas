/**
 * POST /api/lead
 * Recebe o formulário da lista de espera e grava o lead no Google Sheets
 * através de um Web App do Google Apps Script (ver integrations/google-apps-script.gs).
 *
 * Variável de ambiente obrigatória (Vercel → Settings → Environment Variables):
 *   SHEETS_WEBHOOK_URL = https://script.google.com/macros/s/XXXXX/exec
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { nome, whatsapp, email, site } = req.body || {};

  // Honeypot: campo invisível preenchido = bot. Responde ok sem gravar.
  if (site) {
    return res.status(200).json({ ok: true });
  }

  const cleanNome = String(nome || '').trim().slice(0, 120);
  const cleanWhats = String(whatsapp || '').replace(/[^\d()+\-\s]/g, '').trim().slice(0, 20);
  const cleanEmail = String(email || '').trim().toLowerCase().slice(0, 160);

  if (cleanNome.length < 2 || cleanWhats.replace(/\D/g, '').length < 10 || !EMAIL_RE.test(cleanEmail)) {
    return res.status(400).json({ ok: false, error: 'Dados inválidos' });
  }

  const webhookUrl = process.env.SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('SHEETS_WEBHOOK_URL não configurada');
    return res.status(500).json({ ok: false, error: 'Integração não configurada' });
  }

  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: cleanNome,
        whatsapp: cleanWhats,
        email: cleanEmail,
        origem: 'landing-lote-01',
        data: new Date().toISOString()
      }),
      redirect: 'follow' // Apps Script responde com redirect 302
    });

    if (!upstream.ok) {
      throw new Error('Apps Script respondeu ' + upstream.status);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Falha ao gravar lead:', err);
    return res.status(502).json({ ok: false, error: 'Falha ao gravar o lead' });
  }
};
