const Anthropic = require("@anthropic-ai/sdk").default;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const nichosOpcoes = [
  { value: "ecommerce",    label: "E-commerce" },
  { value: "servicos",     label: "Prestação de Serviços" },
  { value: "consultoria",  label: "Consultoria" },
  { value: "estetica",     label: "Serviços Estéticos" },
  { value: "eventos",      label: "Eventos" },
  { value: "infoprodutos", label: "Infoprodutos" },
  { value: "outro",        label: "Outro" },
];

function buildPrompt(client_data, nicho) {
  const d = client_data;
  const nichoLabel = nichosOpcoes.find(n => n.value === nicho)?.label || nicho;
  return "Voce e um especialista em benchmarking digital da Agencia SFO. Gere um benchmarking COMPLETO em portugues do Brasil para o cliente abaixo. Seja conciso, maximo 2 frases por campo de texto longo.\n\nDADOS DO CLIENTE:\n" +
    "- Empresa: " + d.nome + " | Site: " + d.site + "\n" +
    "- Segmento: " + nichoLabel + " | Nicho: " + d.nicho_desc + " | Subnicho: " + d.subnicho + "\n" +
    "- Modelo: " + d.modelo + " | Capacidade: " + d.capacidade + "\n" +
    "- Concorrentes: " + d.concorrentes + "\n" +
    "- Referencias: " + d.referencias + "\n" +
    "- Seguidores: " + d.seguidores + " | CEO: " + d.ceo_aparece + " " + (d.ceo_perfil || "") + "\n" +
    "- Ticket: " + d.ticket + " | Investimento: " + d.investimento + "\n\n" +
    "Gere TOP 5 concorrentes do nicho e TOP 5 do subnicho. Responda APENAS com JSON valido, sem texto antes ou depois:\n\n" +
    '{"posicionamento":{"nicho":"","subnicho":"","micronicho":"","porcques":["","",""],"diagnostico":""},' +
    '"ranking_nicho":[{"posicao":1,"nome":"","handle":"","instagram":"","tiktok":"","embaixador":"sim/nao","ceo_visivel":"sim/nao","google_ads":"sim/nao","anuncios":"sim/nao","rede_forte":"","posicionamento":""}],' +
    '"ranking_subnicho":[{"posicao":1,"nome":"","handle":"","instagram":"","tiktok":"","embaixador":"sim/nao","ceo_visivel":"sim/nao","google_ads":"sim/nao","anuncios":"sim/nao","rede_forte":"","posicionamento":""}],' +
    '"analise_detalhada":[{"nome":"","handle":"","site":"","estrategia_principal":"","redes":{"instagram":"","tiktok":"","youtube":""},"ceo":{"tem":false,"nome":"","perfil_pessoal":"","seguidores":"","exclusivo":false},"embaixadores":{"tem_programa":false,"tipo":"","exclusivo":false,"descricao":""},"tiktok_ads":"","tiktok_shop":"","google_ads":"","email_marketing":"","whatsapp_vendas":"","funil":{"topo":"","meio":"","fundo":""},"insight":""}],' +
    '"oportunidades":[{"titulo":"","descricao":""}],' +
    '"plano_acao":{"curto_prazo":["","",""],"medio_prazo":["","",""],"longo_prazo":["","",""]},' +
    '"metricas":[{"nome":"","meta":"","descricao":""}]}';
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { clientData, nicho } = req.body;
  if (!clientData || !nicho) return res.status(400).json({ error: "Dados incompletos" });

  try {
    console.log("Iniciando geracao para:", clientData.nome);

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4000,
      messages: [{ role: "user", content: buildPrompt(clientData, nicho) }],
    });

    console.log("stop_reason:", message.stop_reason);

    const txt = message.content?.find(b => b.type === "text")?.text || "";
    console.log("Texto (200 chars):", txt.slice(0, 200));

    let raw = txt.replace(/```json|```/g, "").trim();
    const jsonStart = raw.indexOf("{");
    const jsonEnd   = raw.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      raw = raw.slice(jsonStart, jsonEnd + 1);
    }

    let report;
    try {
      report = JSON.parse(raw);
    } catch (parseErr) {
      console.error("Parse error:", parseErr.message);
      console.error("Raw:", raw.slice(0, 500));
      return res.status(500).json({ error: "Erro ao interpretar resposta da IA. Tente novamente." });
    }

    return res.status(200).json({ report });
  } catch (err) {
    console.error("Erro:", err.message);
    return res.status(500).json({ error: err.message || "Erro desconhecido" });
  }
}
