const Anthropic = require("@anthropic-ai/sdk").default;

function buildPrompt(d) {
  return `Você é um especialista sênior em benchmarking competitivo e estratégia digital para agências de performance no Brasil.

Com base nos dados abaixo de um cliente real, gere um relatório completo de benchmarking de mercado.

DADOS DO CLIENTE:
- Empresa: ${d.nome || "N/A"} | Site: ${d.site || "N/A"}
- Segmento: ${d.segmento || "N/A"} | Nicho: ${d.nicho || "N/A"} | Subnicho: ${d.subnicho || "N/A"}
- Modelo: ${d.modelo_negocio || "N/A"} | Capacidade: ${d.capacidade || "N/A"}
- Concorrentes mencionados: ${d.concorrentes || "N/A"}
- Referências: ${d.referencias || "N/A"}
- Seguidores: ${d.seguidores || "N/A"} | CEO visível: ${d.ceo_aparece || "N/A"} | Perfil CEO: ${d.ceo_perfil || "N/A"}
- Ticket médio: ${d.ticket_medio || "N/A"} | Investimento em Ads: ${d.investimento_ads || "N/A"}
- Plataformas Ads: ${d.plataformas_ads || "N/A"} | Canais ativos: ${d.canais_ativos || "N/A"}
- CRM: ${d.crm || "N/A"} | Frequência de posts: ${d.freq_postagem || "N/A"}
- Observações: ${d.obs_final || d.obs_digital || "N/A"}

INSTRUÇÕES:
- Identifique e analise os principais concorrentes do cliente
- Use nomes reais de empresas e marcas brasileiras do setor
- O plano de ação deve ser prático e baseado no contexto real do cliente
- Inclua pelo menos 4 concorrentes na análise

Retorne SOMENTE o JSON abaixo preenchido. Sem texto antes, sem texto depois, sem markdown:

{"empresa":"${d.nome || "Empresa"}","segmento":"${d.segmento || ""}","nicho":"${d.nicho || ""}","subnicho":"${d.subnicho || ""}","data_analise":"Maio 2026","resumo_executivo":"3 a 5 frases com os principais insights estratégicos","panorama_mercado":{"descricao":"Descrição do mercado em 3-4 frases com dados reais do Brasil","tamanho":"Estimativa do tamanho do mercado brasileiro neste segmento","tendencias":["Tendência 1","Tendência 2","Tendência 3","Tendência 4"],"oportunidades_gerais":["Oportunidade 1","Oportunidade 2","Oportunidade 3"]},"concorrentes":[{"nome":"Nome","site":"site.com.br","posicionamento":"Como se posiciona no mercado","pontos_fortes":["Forte 1","Forte 2"],"pontos_fracos":["Fraco 1","Fraco 2"],"estrategia_digital":"Como usa o digital","estrategia_ads":"Como investe em mídia paga","diferenciais":"O que os diferencia","nota":8}],"comparativo":[{"criterio":"Presença no Instagram","cliente":"Situação atual do cliente","mercado":"Referência dos top players"},{"criterio":"Investimento em Ads","cliente":"...","mercado":"..."},{"criterio":"Estratégia de conteúdo","cliente":"...","mercado":"..."},{"criterio":"CRM e automação","cliente":"...","mercado":"..."},{"criterio":"Presença de CEO/fundador","cliente":"...","mercado":"..."},{"criterio":"Programa de fidelidade","cliente":"...","mercado":"..."}],"diagnostico":{"pontos_fortes":["Ponto forte 1","Ponto forte 2","Ponto forte 3"],"gaps":["Gap 1","Gap 2","Gap 3","Gap 4"],"oportunidades":["Op 1","Op 2","Op 3","Op 4"],"ameacas":["Ameaça 1","Ameaça 2","Ameaça 3"]},"plano_acao":{"curto_prazo":[{"acao":"Descrição detalhada","prazo":"30 dias","impacto":"Alto","categoria":"Ads"},{"acao":"Descrição detalhada","prazo":"30 dias","impacto":"Alto","categoria":"Conteúdo"},{"acao":"Descrição detalhada","prazo":"45 dias","impacto":"Médio","categoria":"CRM"},{"acao":"Descrição detalhada","prazo":"60 dias","impacto":"Alto","categoria":"Posicionamento"}],"medio_prazo":[{"acao":"Descrição detalhada","prazo":"3 meses","impacto":"Alto","categoria":"Estratégia"},{"acao":"Descrição detalhada","prazo":"3 meses","impacto":"Alto","categoria":"Produto"},{"acao":"Descrição detalhada","prazo":"4 meses","impacto":"Médio","categoria":"Parceria"},{"acao":"Descrição detalhada","prazo":"6 meses","impacto":"Alto","categoria":"Retenção"}],"longo_prazo":[{"acao":"Descrição detalhada","prazo":"6 meses","impacto":"Alto","categoria":"Marca"},{"acao":"Descrição detalhada","prazo":"9 meses","impacto":"Alto","categoria":"Expansão"},{"acao":"Descrição detalhada","prazo":"12 meses","impacto":"Alto","categoria":"Autoridade"},{"acao":"Descrição detalhada","prazo":"12 meses","impacto":"Médio","categoria":"Tecnologia"}]}}`;
}

export default async function handler(req, res) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { clientData } = req.body;
  if (!clientData) return res.status(400).json({ error: "Dados do cliente não enviados." });

  try {
    console.log("Gerando para:", clientData.nome);
    console.log("API Key presente:", !!process.env.ANTHROPIC_API_KEY);

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [{ role: "user", content: buildPrompt(clientData) }],
    });

    const txt = message.content?.find(b => b.type === "text")?.text || "";
    let raw = txt.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    const s = raw.indexOf("{");
    const e = raw.lastIndexOf("}");
    if (s !== -1 && e !== -1 && e > s) raw = raw.slice(s, e + 1);

    const report = JSON.parse(raw);
    return res.status(200).json({ report });
  } catch (err) {
    console.error("Erro:", err.message);
    return res.status(500).json({ error: err.message });
  }
}

export const config = { maxDuration: 60 };
