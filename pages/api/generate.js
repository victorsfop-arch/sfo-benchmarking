const Anthropic = require("@anthropic-ai/sdk").default;

function buildPrompt(d, nicho) {
  const dados =
    "Empresa: " + (d.nome || "N/A") + "\n" +
    "Site: " + (d.site || "N/A") + "\n" +
    "Segmento: " + (d.segmento || nicho || "N/A") + "\n" +
    "Nicho: " + (d.nicho_desc || d.nicho || "N/A") + "\n" +
    "Subnicho: " + (d.subnicho || "N/A") + "\n" +
    "Micronicho: " + (d.micronicho || "N/A") + "\n" +
    "Modelo: " + (d.modelo_negocio || "N/A") + "\n" +
    "Capacidade: " + (d.capacidade || "N/A") + "\n" +
    "Concorrentes: " + (d.concorrentes || "N/A") + "\n" +
    "Referencias: " + (d.referencias || "N/A") + "\n" +
    "Seguidores: " + (d.seguidores || "N/A") + "\n" +
    "CEO visivel: " + (d.ceo_aparece || "N/A") + "\n" +
    "Perfil CEO: " + (d.ceo_perfil || "N/A") + "\n" +
    "Ticket medio: " + (d.ticket_medio || "N/A") + "\n" +
    "Investimento Ads: " + (d.investimento_ads || "N/A") + "\n" +
    "Plataformas Ads: " + (d.plataformas_ads || "N/A") + "\n" +
    "Canais ativos: " + (d.canais_ativos || "N/A") + "\n" +
    "CRM: " + (d.crm || "N/A") + "\n" +
    "Observacoes: " + (d.obs_final || d.obs_digital || "N/A");

  return (
    "Voce e um especialista em benchmarking digital da Agencia SFO.\n\n" +
    "Gere um benchmarking COMPLETO em portugues do Brasil para o cliente abaixo.\n\n" +
    "DADOS DO CLIENTE:\n" + dados + "\n\n" +
    "INSTRUCOES:\n" +
    "- Gere TOP 5 concorrentes do nicho e TOP 5 do subnicho com dados reais do mercado brasileiro\n" +
    "- Inclua analise detalhada de pelo menos 5 concorrentes\n" +
    "- Seja especifico: use nomes reais de empresas, handles reais de Instagram\n" +
    "- O plano de acao deve ser pratico e baseado no contexto do cliente\n\n" +
    "Retorne APENAS o JSON abaixo preenchido, sem texto antes, sem texto depois, sem markdown:\n\n" +
    '{"posicionamento":{"nicho":"nicho real do cliente","subnicho":"subnicho real","micronicho":"micronicho se existir","porcques":["porque de autoridade 1","porque 2","porque 3","porque 4","porque 5"],"diagnostico":"diagnostico honesto do posicionamento atual"},' +
    '"ranking_nicho":[{"posicao":1,"nome":"Nome da marca","handle":"@handle","instagram":"XXk seguidores","tiktok":"XXk ou nao tem","embaixador":"sim","ceo_visivel":"sim","google_ads":"sim","anuncios":"sim","rede_forte":"Instagram","posicionamento":"como se posiciona"}],' +
    '"ranking_subnicho":[{"posicao":1,"nome":"Nome da marca","handle":"@handle","instagram":"XXk","tiktok":"XXk","embaixador":"nao","ceo_visivel":"sim","google_ads":"nao","anuncios":"sim","rede_forte":"TikTok","posicionamento":"como se posiciona"}],' +
    '"analise_detalhada":[{"nome":"Nome","handle":"@handle","site":"site.com.br","estrategia_principal":"estrategia em 2 frases","redes":{"instagram":"seguidores e frequencia","tiktok":"seguidores ou nao tem","youtube":"canal ou nao tem"},"ceo":{"tem":true,"nome":"Nome CEO","perfil_pessoal":"@perfil","seguidores":"XXk","exclusivo":false},"embaixadores":{"tem_programa":true,"tipo":"tipo do programa","exclusivo":false,"descricao":"descricao do programa"},"tiktok_ads":"sim ou nao e como usa","tiktok_shop":"sim ou nao","google_ads":"sim ou nao e como usa","email_marketing":"sim ou nao e frequencia","whatsapp_vendas":"sim ou nao","crm":"ferramenta ou nao usa","funil":{"topo":"estrategia de topo","meio":"estrategia de meio","fundo":"estrategia de fundo"},"insight":"insight estrategico para o cliente"}],' +
    '"oportunidades":[{"titulo":"Titulo da oportunidade","descricao":"descricao detalhada"}],' +
    '"plano_acao":{"curto_prazo":["acao 1 em 30 dias","acao 2 em 30 dias","acao 3 em 45 dias","acao 4 em 60 dias"],"medio_prazo":["acao 1 em 3 meses","acao 2 em 4 meses","acao 3 em 6 meses"],"longo_prazo":["acao 1 em 6 meses","acao 2 em 9 meses","acao 3 em 12 meses"]},' +
    '"metricas":[{"nome":"Nome do KPI","meta":"meta numerica","descricao":"como medir"}]}'
  );
}

export default async function handler(req, res) {
  console.log("CHAVE:", process.env.ANTHROPIC_API_KEY ? "PRESENTE" : "AUSENTE");
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { clientData, nicho } = req.body;
  if (!clientData) {
    return res.status(400).json({ error: "Dados do cliente nao enviados." });
  }

  try {
    console.log("Iniciando geracao para:", clientData.nome);
    console.log("API Key presente:", !!process.env.ANTHROPIC_API_KEY);

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 8000,
      messages: [{ role: "user", content: buildPrompt(clientData, nicho) }],
    });

    console.log("stop_reason:", message.stop_reason);

    const block = message.content.find(function(b) { return b.type === "text"; });
    var raw = block ? block.text : "";

    raw = raw.replace(/```json/gi, "").replace(/```/gi, "").trim();

    var start = raw.indexOf("{");
    var end = raw.lastIndexOf("}");
    if (start !== -1 && end > start) {
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
