/**
 * ALAIBASICS — Webhook Google Sheets (Google Apps Script)
 *
 * COMO INSTALAR (5 minutos):
 * 1. Crie uma planilha no Google Sheets chamada "Leads ALAIBASICS".
 *    Na primeira linha, crie os cabeçalhos: Data | Nome | WhatsApp | E-mail | Origem
 * 2. Na planilha: Extensões → Apps Script. Apague o conteúdo e cole este arquivo.
 * 3. Clique em "Implantar" → "Nova implantação" → tipo "App da Web".
 *      - Executar como: Eu (sua conta)
 *      - Quem pode acessar: Qualquer pessoa
 * 4. Autorize e copie a URL gerada (termina em /exec).
 * 5. No painel da Vercel: Settings → Environment Variables →
 *      SHEETS_WEBHOOK_URL = <URL copiada>
 *    Depois faça um redeploy.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    sheet.appendRow([
      data.data || new Date().toISOString(),
      data.nome || '',
      data.whatsapp || '',
      data.email || '',
      data.origem || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
