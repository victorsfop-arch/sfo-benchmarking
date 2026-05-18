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
  return `Você é um especialista sênior em benchmarking digital e estratégia de posicionamento da Agência SFO.

Use todo o seu conhecimento de mercado para gerar um benchmarking de posicionamento COMPLETO em português do Brasil para o cliente abaixo. Seja específico e preciso com dados reais que você conhece. Quando não tiver certeza de um dado, use "a verificar".

DADOS DO CLIENTE:
- Empresa: ${d.nome} | Site: ${d.site}
- Segmento: ${nichoLabel} | Nicho: ${d.nicho_desc} | Subnicho: ${d.subnicho} | Micronicho: ${d.micronicho || "Não definido"}
- Modelo: ${d.modelo} | Capacidade: ${d.capacidade}
- Concorrentes conhecidos: ${d.concorrentes}
- Referências de mercado: ${d.referencias}
- Redes sociais: ${d.redes} | Seguidores rede principal: ${d.seguidores}
- CEO visível: ${d.ceo_aparece} ${d.ceo_perfil ? "— " + d.ceo_perfil : ""}
- História: ${d.historia}
- Ticket médio: ${d.ticket} | Investimento em mídia: ${d.investimento}
- Plataformas de ads: ${d.plataformas_ads || "Não informado"}
- Canais ativos: ${d.canais_ativos || "Não informado"}

Gere TOP 5 concorrentes do nicho e TOP 5 do subnicho. Para cada um analise: seguidores, CEO visível, programa de embaixadores, TikTok Ads, TikTok Shop, Google Ads, estratégia principal, funil e criativos.

Responda APENAS com JSON válido, sem texto antes ou depois. Seja conciso — máximo 2-3 frases por campo de texto:

{"posicionamento":{"nicho":"","subnicho":"","micronicho":"","porcques":["p1","p2","p3"],"diagnostico":"max 2 frases"},"ranking_nicho":[{"posicao":1,"nome":"","handle":"","instagram":"","tiktok":"","embaixador":"sim/não","ceo_visivel":"sim/não","google_ads":"sim/não","anuncios":"sim/não","rede_forte":"","posicionamento":"max 1 frase"}],"ranking_subnicho":[{"posicao":1,"nome":"","handle":"","instagram":"","tiktok":"","embaixador":"sim/não","ceo_visivel":"sim/não","google_ads":"sim/não","anuncios":"sim/não","rede_forte":"","posicionamento":"max 1 frase"}],"analise_detalhada":[{"nome":"","handle":"","site":"","estrategia_principal":"max 2 frases","redes":{"instagram":"","tiktok":"","youtube":""},"ceo":{"tem":false,"nome":"","perfil_pessoal":"","seguidores":"","exclusivo":false},"embaixadores":{"tem_programa":false,"tipo":"","exclusivo":false,"descricao":"max 1 frase"},"tiktok_ads":"sim/não","tiktok_shop":"sim/não","google_ads":"sim/não","email_marketing":"sim/não","whatsapp_vendas":"sim/não","funil":{"topo":"max 1 frase","meio":"max 1 frase","fundo":"max 1 frase"},"insight":"max 2 frases"}],"oportunidades":[{"titulo":"","descricao":"max 2 frases"}],"plano_acao":{"curto_prazo":["a1","a2","a3"],"medio_prazo":["a1","a2","a3"],"longo_prazo":["a1","a2","a3"]},"metricas":[{"nome":"","meta":"","descricao":"max 1 frase"}]}`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { clientData, nicho } = req.body;
  if (!clientData || !nicho) return res.status(400).json({ error: "Dados incompletos" });

  try {
    console.log("Iniciando geração para:", clientData.nome);

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 8000,
      messages: [{ role: "user", content: buildPrompt(clientData, nicho) }],
    });

    const txt = message.content?.find(b => b.type === "text")?.text || "";
    console.log("Texto recebido (primeiros 200 chars):", txt.slice(0, 200));

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
      console.error("Erro no parse JSON:", parseErr.message);
      console.error("Raw text completo:", raw);
      return res.status(500).json({ 
        error: "Parse error: " + parseErr.message,
        rawPreview: raw.slice(0, 300)
      });
    }

    return res.status(200).json({ report });
  } catch (err) {
    console.error("Erro completo:", err.message);
    return res.status(500).json({ error: err.message || "Erro desconhecido na API" });
  }
}
