# ALAIBASICS — Landing Page (Lote 01)

Landing page estática + função serverless para captura de leads, pronta para deploy na **Vercel**.

## Estrutura

```
├── index.html                        # Landing page (HTML/CSS/JS inline, sem build)
├── assets/
│   ├── logo_1.png / logo_1.jpeg      # Selo circular (favicon, hero, footer / og:image)
│   └── logo_2.png / logo_2.jpeg      # Wordmark horizontal (header)
│                                     # .png = fundo transparente, gerado dos JPEGs do cliente
├── api/
│   └── lead.js                       # POST /api/lead → grava lead no Google Sheets
├── integrations/
│   └── google-apps-script.gs         # Webhook a colar no Apps Script da planilha
├── client-reference/
│   └── original-landing.html         # Versão original enviada pelo cliente (referência)
├── vercel.json                       # Headers de segurança e cache
└── .vercelignore                     # Exclui arquivos internos do deploy
```

## Deploy na Vercel

1. `npm i -g vercel` (ou use o dashboard com Git)
2. Na raiz do projeto: `vercel` → depois `vercel --prod`
3. **Domínio .com.br**: Vercel → Settings → Domains → adicionar `seudominio.com.br`.
   No registro.br, aponte:
   - `A` @ → `76.76.21.21`
   - `CNAME` www → `cname.vercel-dns.com`

## Integração Google Sheets (lista de espera)

1. Siga as instruções no topo de [integrations/google-apps-script.gs](integrations/google-apps-script.gs)
2. Na Vercel: Settings → Environment Variables → `SHEETS_WEBHOOK_URL` = URL `/exec` do Apps Script
3. Redeploy. Teste enviando o formulário — a linha deve aparecer na planilha.

Sem a variável configurada, o formulário exibe mensagem de erro amigável (não perde silenciosamente).

## Checkout Yampi (pré-venda)

1. No painel Yampi, cadastre o produto **Camiseta Lote 01** com as variações:
   - **Camiseta Avulsa** — tamanhos P/M/G · cores Preto/Creme/Cinza
   - **Kit 3 Peças** — combinação de tamanhos/cores escolhida no checkout
2. Gere o link de checkout de cada oferta
3. Em [index.html](index.html), localize `const CONFIG` e cole os links em `checkout.avulsa` e `checkout.kit`
4. No mesmo bloco `CONFIG` ajuste **preços** exibidos e o **estoque** da barra de disponibilidade

> Enquanto os links estiverem vazios, os botões "Comprar" levam para a lista de espera — a página nunca quebra.

## Fotos do produto

A página usa composições em CSS como placeholder premium. Quando as fotos chegarem:
- Hero: procurar o comentário `>>> FOTO DO PRODUTO` em index.html
- Seção escassez: comentário `>>> FOTO DE UNBOXING`

## Teste local

```
vercel dev
```
(ou abra index.html direto no navegador — tudo funciona exceto o POST /api/lead)
