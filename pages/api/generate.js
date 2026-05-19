const Anthropic = require("@anthropic-ai/sdk").default;

function buildPrompt(d) {
  const dados = [
    "Empresa: " + (d.nome || "N/A"),
    "Site: " + (d.site || "N/A"),
    "Segmento: " + (d.segmento || "N/A"),
    "Nicho: " + (d.nicho || "N/A"),
    "Subnicho: " + (d.subnicho || "N/A"),
    "Concorrentes: " + (d.concorrentes || "N/A"),
    "Referencias: " + (d.referencias || "N/A"),
    "Seguidores: " + (d.seguidores || "N/A"),
    "CEO visivel: " + (d.ceo_aparece || "N/A"),
    "Perfil CEO: " + (d.ceo_perfil || "N/A"),
    "Ticket medio: " + (d.ticket_medio || "N/A"),
    "Investimento Ads: " + (d.investimento_ads || "N/A"),
    "Plataformas Ads: " + (d.plataformas_ads || "N/A"),
    "Canais ativos: " + (d.canais_ativos || "N/A"),
    "CRM: " + (d.crm || "N/A"),
    "Observacoes: " + (d.obs_final || d.obs_digital || "N/A"),
  ].join("\n");

  return (
    "Voce e um especialista em benchmarking competitivo para agencias de performance no Brasil.\n\n" +
    "DADOS DO CLIENTE:\n" + dados + "\n\n" +
    "Gere um relatorio completo de benchmarking com pelo menos 4 concorrentes reais do mercado brasileiro.\n\n" +
    "Retorne APENAS um JSON valido com esta estrutura (sem markdown, sem texto fora do JSON):\n" +
    '{\n' +
    '  "empresa": "' + (d.nome || "Empresa") + '",\n' +
    '  "segmento": "' + (d.segmento || "") + '",\n' +
    '  "nicho": "' + (d.nicho || "") + '",\n' +
    '  "subnicho": "' + (d.subnicho || "") + '",\n' +
    '  "data_analise": "Maio 2026",\n' +
    '  "resumo_executivo": "Insira 3 a 5 frases com os principais insights",\n' +
    '  "panorama_mercado": {\n' +
    '    "descricao": "Descricao do mercado",\n' +
    '    "tamanho": "Estimativa do mercado brasileiro",\n' +
    '    "tendencias": ["Tendencia 1", "Tendencia 2", "Tendencia 3"],\n' +
    '    "oportunidades_gerais": ["Oportunidade 1", "Oportunidade 2"]\n' +
    '  },\n' +
    '  "concorrentes": [\n' +
    '    {\n' +
    '      "nome": "Nome do concorrente",\n' +
    '      "site": "site.com.br",\n' +
    '      "posicionamento": "Como se posiciona",\n' +
    '      "pontos_fortes": ["Forte 1", "Forte 2"],\n' +
    '      "pontos_fracos": ["Fraco 1", "Fraco 2"],\n' +
    '      "estrategia_digital": "Como usa o digital",\n' +
    '      "estrategia_ads": "Como investe em ads",\n' +
    '      "diferenciais": "O que os diferencia",\n' +
    '      "nota": 8\n' +
    '    }\n' +
    '  ],\n' +
    '  "comparativo": [\n' +
    '    {"criterio": "Presenca no Instagram", "cliente": "Situacao atual", "mercado": "Referencia top players"},\n' +
    '    {"criterio": "Investimento em Ads", "cliente": "...", "mercado": "..."},\n' +
    '    {"criterio": "Estrategia de conteudo", "cliente": "...", "mercado": "..."},\n' +
    '    {"criterio": "CRM e automacao", "cliente": "...", "mercado": "..."},\n' +
    '    {"criterio": "Presenca de CEO", "cliente": "...", "mercado": "..."}\n' +
    '  ],\n' +
    '  "diagnostico": {\n' +
    '    "pontos_fortes": ["Forte 1", "Forte 2", "Forte 3"],\n' +
    '    "gaps": ["Gap 1", "Gap 2", "Gap 3"],\n' +
    '    "oportunidades": ["Op 1", "Op 2", "Op 3"],\n' +
    '    "ameacas": ["Ameaca 1", "Ameaca 2"]\n' +
    '  },\n' +
    '  "plano_acao": {\n' +
    '    "curto_prazo": [\n' +
    '      {"acao": "Descricao", "prazo": "30 dias", "impacto": "Alto", "categoria": "Ads"},\n' +
    '      {"acao": "Descricao", "prazo": "45 dias", "impacto": "Alto", "categoria": "Conteudo"},\n' +
    '      {"acao": "Descricao", "prazo": "60 dias", "impacto": "Medio", "categoria": "CRM"}\n' +
    '    ],\n' +
    '    "medio_prazo": [\n' +
    '      {"acao": "Descricao", "prazo": "3 meses", "impacto": "Alto", "categoria": "Estrategia"},\n' +
    '      {"acao": "Descricao", "prazo": "4 meses", "impacto": "Alto", "categoria": "Parceria"},\n' +
    '      {"acao": "Descricao", "prazo": "6 meses", "impacto": "Medio", "categoria": "Retencao"}\n' +
    '    ],\n' +
    '    "longo_prazo": [\n' +
    '      {"acao": "Descricao", "prazo": "6 meses", "impacto": "Alto", "categoria": "Marca"},\n' +
    '      {"acao": "Descricao", "prazo": "9 meses", "impacto": "Alto", "categoria": "Expansao"},\n' +
    '      {"acao": "Descricao", "prazo": "12 meses", "impacto": "Alto", "categoria": "Autoridade"}\n' +
    '    ]\n' +
    '  }\n' +
    '}'
  );
}

export default async function handler(req, res) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { clientData } = req.body;
  if (!clientData) {
    return res.status(400).json({ error: "Dados do cliente nao enviados." });
  }

  try {
    console.log("Gerando para:", clientData.nome);
    console.log("API Key presente:", !!process.env.ANTHROPIC_API_KEY);

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [{ role: "user", content: buildPrompt(clientData) }],
    });

    const txt = message.content.find(function(b) { return b.type === "text"; });
    const rawText = txt ? txt.text : "";

    var raw = rawText.replace(/```json/gi, "").replace(/```/gi, "").trim();
    var start = raw.indexOf("{");
    var end = raw.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      raw = raw.slice(start, end + 1);
    }

    var report = JSON.parse(raw);
    return res.status(200).json({ report: report });
  } catch (err) {
    console.error("Erro:", err.message);
    return res.status(500).json({ error: err.message });
  }
}

export const config = { maxDuration: 60 };
