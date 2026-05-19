import { useState, useEffect } from "react";

const Y = "#F5A800";
const SHEETDB = "https://sheetdb.io/api/v1/44exyyh6x9z7c";

const nichosOpcoes = [
  { value: "ecommerce",    label: "E-commerce",            icon: "🛒" },
  { value: "servicos",     label: "Prestação de Serviços", icon: "💼" },
  { value: "consultoria",  label: "Consultoria",           icon: "🧠" },
  { value: "estetica",     label: "Serviços Estéticos",    icon: "💅" },
  { value: "eventos",      label: "Eventos",               icon: "🎪" },
  { value: "infoprodutos", label: "Infoprodutos",          icon: "🎓" },
  { value: "outro",        label: "Outro",                 icon: "➕" },
];

const universais = [
  { id: "nome",         label: "Nome da empresa",                                             type: "text",     placeholder: "Ex: Selet Joias" },
  { id: "site",         label: "Site da empresa",                                             type: "text",     placeholder: "Ex: selet.com.br" },
  { id: "nicho_desc",   label: "Nicho de atuação",                                            type: "text",     placeholder: "Ex: E-commerce de joias" },
  { id: "subnicho",     label: "Subnicho de atuação",                                         type: "text",     placeholder: "Ex: Semijoias femininas" },
  { id: "micronicho",   label: "Micronicho (se existir)",                                     type: "text",     placeholder: "Ex: Semijoias para formatura" },
  { id: "modelo",       label: "Modelo de negócio",                                           type: "select",   options: ["B2C (vende ao consumidor final)", "B2B (vende para empresas)", "Ambos (B2C e B2B)"] },
  { id: "capacidade",   label: "Capacidade de atendimento",                                   type: "select",   options: ["Local (cidade/região)", "Nacional (todo o Brasil)", "Mundial (internacional)"] },
  { id: "concorrentes", label: "Concorrentes conhecidos",                                     type: "textarea", placeholder: "Liste os principais concorrentes que conhece" },
  { id: "referencias",  label: "Referências de mercado",                                      type: "textarea", placeholder: "Ex: Empresas que considera referência no seu setor" },
  { id: "redes",        label: "Redes sociais da empresa (cole os links)",                    type: "textarea", placeholder: "Instagram, TikTok, LinkedIn, YouTube..." },
  { id: "seguidores",   label: "Quantos seguidores tem na rede principal?",                   type: "text",     placeholder: "Ex: 12.500 no Instagram" },
  { id: "ceo_aparece",  label: "Tem CEO ou fundador(a) que aparece publicamente pela marca?", type: "select",   options: ["Sim", "Não", "Em construção"] },
  { id: "ceo_perfil",   label: "Se sim, qual o perfil pessoal e quantos seguidores tem?",     type: "text",     placeholder: "Ex: @sabrinanunesfj — 919K seguidores" },
  { id: "historia",     label: "Qual é a história de origem da empresa?",                     type: "textarea", placeholder: "Ex: Fundada com R$500 em 2016, empresa familiar..." },
  { id: "ticket",       label: "Qual o ticket médio por venda/cliente?",                      type: "text",     placeholder: "Ex: R$150 por pedido" },
  { id: "investimento", label: "Qual o investimento mensal disponível para mídia paga?",      type: "select",   options: ["Até R$1.000/mês", "R$1.000 a R$3.000/mês", "R$3.000 a R$10.000/mês", "Acima de R$10.000/mês", "Ainda não invisto em mídia paga"] },
];

const plataformasAds = [
  { id: "ads_meta",     label: "Meta Ads (Facebook/Instagram)" },
  { id: "ads_google",   label: "Google Ads" },
  { id: "ads_tiktok",   label: "TikTok Ads" },
  { id: "ads_youtube",  label: "YouTube Ads" },
  { id: "ads_linkedin", label: "LinkedIn Ads" },
  { id: "ads_nenhum",   label: "Ainda não invisto em mídia paga" },
];

const canaisAtivos = [
  { id: "canal_instagram", label: "Instagram" },
  { id: "canal_tiktok",    label: "TikTok" },
  { id: "canal_youtube",   label: "YouTube" },
  { id: "canal_linkedin",  label: "LinkedIn" },
  { id: "canal_whatsapp",  label: "WhatsApp (vendas ativo)" },
  { id: "canal_email",     label: "E-mail marketing" },
  { id: "canal_blog",      label: "Blog / SEO" },
];

const perguntasPorNicho = {
  ecommerce: {
    titulo: "E-commerce", icone: "🛒",
    perguntas: [
      { id: "plataforma",           label: "Qual plataforma de e-commerce usa?",               type: "select",   options: ["Shopify", "Nuvemshop", "VTEX", "WooCommerce", "Loja Integrada", "Outra"] },
      { id: "tiktok_shop",          label: "Tem TikTok Shop ativado?",                         type: "select",   options: ["Sim", "Não", "Quero ativar"] },
      { id: "marketplaces",         label: "Está em algum marketplace?",                       type: "textarea", placeholder: "Ex: Mercado Livre, Amazon, Shopee..." },
      { id: "embaixadores",         label: "Tem programa de embaixadores ou afiliados?",       type: "select",   options: ["Sim — programa estruturado", "Sim — parcerias pontuais", "Não", "Quero criar"] },
      { id: "embaixador_exclusivo", label: "Tem embaixador exclusivo?",                        type: "select",   options: ["Sim", "Não", "Em negociação"] },
      { id: "collab",               label: "Já fez collab com influenciadores?",               type: "textarea", placeholder: "Ex: Já trabalhamos com @influencer1..." },
      { id: "comunidade",           label: "Tem comunidade de clientes com nome próprio?",     type: "text",     placeholder: "Ex: Céu Lovers, Franciscats..." },
      { id: "kit_presente",         label: "Tem produto especial para presente?",              type: "select",   options: ["Sim", "Não", "Em desenvolvimento"] },
      { id: "sazonalidade",         label: "Tem produtos sazonais ou de ocasião?",             type: "textarea", placeholder: "Ex: Coleções de formatura, Natal..." },
      { id: "crm_ecomm",            label: "Usa CRM ou ferramenta de automação?",              type: "text",     placeholder: "Ex: Klaviyo, RD Station, HubSpot..." },
      { id: "brinde",               label: "Usa brinde no carrinho ou cashback?",              type: "select",   options: ["Sim", "Não", "Quero implementar"] },
      { id: "retencao",             label: "Como faz retenção de clientes hoje?",              type: "textarea", placeholder: "Ex: E-mail pós-compra, WhatsApp..." },
    ],
  },
  servicos: {
    titulo: "Prestação de Serviços", icone: "💼",
    perguntas: [
      { id: "tipo_servico",  label: "Qual tipo de serviço oferece?",                type: "textarea", placeholder: "Descreva brevemente o que faz e para quem" },
      { id: "fmt_entrega",   label: "Como entrega o serviço?",                      type: "select",   options: ["Presencial", "Online (remoto)", "Híbrido"] },
      { id: "captacao",      label: "Como capta clientes hoje?",                    type: "textarea", placeholder: "Ex: Indicação, redes sociais, Google..." },
      { id: "ciclo_venda",   label: "Qual o ciclo médio de venda?",                 type: "select",   options: ["Menos de 1 semana", "1 a 2 semanas", "1 mês", "Mais de 1 mês"] },
      { id: "autoridade",    label: "Quais seus principais porquês de autoridade?", type: "textarea", placeholder: "Ex: Anos de experiência, certificações, cases..." },
      { id: "cases",         label: "Tem cases ou depoimentos públicos?",           type: "select",   options: ["Sim — publicados nas redes", "Sim — mas não divulgados", "Não tenho ainda"] },
      { id: "proposta",      label: "Como é feita a proposta comercial?",           type: "select",   options: ["Presencial", "Via WhatsApp", "E-mail", "Plataforma (ex: Proposify)", "Não formalizo"] },
      { id: "recorrencia",   label: "Tem contrato recorrente ou venda única?",      type: "select",   options: ["Recorrente (mensalidade)", "Venda única", "Ambos"] },
      { id: "linkedin",      label: "Usa LinkedIn como canal de prospecção?",       type: "select",   options: ["Sim — ativo", "Sim — mas pouco", "Não uso", "Quero usar"] },
      { id: "ceo_servico",   label: "O(a) fundador(a) é a face da marca nas redes?",type: "select",  options: ["Sim — perfil pessoal ativo", "Às vezes", "Não — só o perfil da empresa"] },
    ],
  },
  consultoria: {
    titulo: "Consultoria", icone: "🧠",
    perguntas: [
      { id: "area_cons",       label: "Qual área de consultoria?",                              type: "textarea", placeholder: "Ex: Consultoria financeira, marketing, RH..." },
      { id: "publico_cons",    label: "Para quem consulta? (perfil do cliente ideal)",          type: "textarea", placeholder: "Ex: Pequenas empresas do varejo, startups..." },
      { id: "fmt_cons",        label: "Formato de entrega",                                     type: "select",   options: ["Sessões individuais (1:1)", "Programa estruturado", "Retainer mensal", "Workshop / imersão presencial", "Online", "Híbrido"] },
      { id: "ticket_cons",     label: "Qual o ticket médio da consultoria?",                    type: "text",     placeholder: "Ex: R$5.000 por projeto, R$2.500/mês" },
      { id: "ciclo_cons",      label: "Qual o ciclo médio de venda?",                           type: "select",   options: ["Menos de 1 semana", "1 a 2 semanas", "1 mês", "Mais de 1 mês"] },
      { id: "captacao_cons",   label: "Como capta clientes hoje?",                              type: "textarea", placeholder: "Ex: Indicação, LinkedIn, palestras..." },
      { id: "autoridade_cons", label: "Quais seus principais porquês de autoridade?",           type: "textarea", placeholder: "Ex: 15 anos de experiência, ex-diretor de empresa X..." },
      { id: "cases_cons",      label: "Tem cases ou resultados de clientes que publica?",       type: "select",   options: ["Sim — publicados ativamente", "Sim — tenho mas não divulgo bem", "Poucos ainda"] },
      { id: "linkedin_cons",   label: "Usa LinkedIn como canal de autoridade e captação?",      type: "select",   options: ["Sim — perfil ativo com conteúdo", "Sim — pouco ativo", "Não uso", "Quero usar"] },
      { id: "pb_cons",         label: "A consultoria é vendida pelo perfil pessoal ou empresa?",type: "select",   options: ["Perfil pessoal (personal brand)", "Empresa / marca", "Ambos"] },
      { id: "proposta_cons",   label: "Como faz a proposta comercial?",                         type: "select",   options: ["Reunião + proposta por e-mail", "WhatsApp direto", "Plataforma (ex: Proposify)", "Não formalizo"] },
      { id: "recorr_cons",     label: "Tem clientes em contrato recorrente?",                   type: "select",   options: ["Sim — maioria recorrente", "Misto", "Não — venda única"] },
    ],
  },
  estetica: {
    titulo: "Serviços Estéticos", icone: "💅",
    perguntas: [
      { id: "tipo_est",      label: "Qual tipo de serviço estético oferece?",                  type: "textarea", placeholder: "Ex: Design de sobrancelhas, lash, micropigmentação..." },
      { id: "modelo_est",    label: "Modelo de atendimento",                                   type: "select",   options: ["Studio próprio", "Atendimento a domicílio", "Clínica / salão", "Híbrido"] },
      { id: "agenda_est",    label: "Como gerencia a agenda?",                                 type: "select",   options: ["WhatsApp manual", "Google Agenda", "App de agendamento (Trinks, Booksy...)", "Sistema próprio"] },
      { id: "ticket_est",    label: "Qual o ticket médio por atendimento?",                    type: "text",     placeholder: "Ex: R$120 por sessão" },
      { id: "recorr_est",    label: "Qual a recorrência média dos seus clientes?",             type: "select",   options: ["Semanal", "Quinzenal", "Mensal", "A cada 2–3 meses", "Única vez"] },
      { id: "portfolio_est", label: "Tem portfólio visual publicado (antes/depois)?",          type: "select",   options: ["Sim — atualizado regularmente", "Sim — raramente atualizo", "Não tenho portfólio público"] },
      { id: "dep_est",       label: "Coleta depoimentos de clientes ativos?",                  type: "select",   options: ["Sim — publica nas redes", "Sim — guarda mas não publica", "Não coleta"] },
      { id: "rosto_est",     label: "O(a) profissional é o rosto da marca?",                  type: "select",   options: ["Sim — aparece nos conteúdos", "Às vezes", "Não — só o espaço e os trabalhos aparecem"] },
      { id: "reativ_est",    label: "Tem estratégia de reativação de clientes sumidos?",       type: "select",   options: ["Sim — WhatsApp ativo", "Sim — outro canal", "Não faço isso"] },
      { id: "cert_est",      label: "Tem certificações ou formações que usa como autoridade?", type: "textarea", placeholder: "Ex: Formada pela Academia X, certificada pela marca Y..." },
    ],
  },
  eventos: {
    titulo: "Eventos", icone: "🎪",
    perguntas: [
      { id: "tipo_ev",      label: "Qual tipo de evento produz/organiza?",              type: "textarea", placeholder: "Ex: Casamentos, corporativos, formaturas..." },
      { id: "porte_ev",     label: "Qual o porte médio dos eventos?",                   type: "select",   options: ["Pequeno (até 50 pessoas)", "Médio (50 a 300 pessoas)", "Grande (acima de 300 pessoas)", "Varia muito"] },
      { id: "ticket_ev",    label: "Qual o ticket médio por evento?",                   type: "text",     placeholder: "Ex: R$15.000 por cerimônia" },
      { id: "captac_ev",    label: "Como capta clientes para eventos?",                 type: "textarea", placeholder: "Ex: Indicação, Instagram, feiras, Google..." },
      { id: "portfolio_ev", label: "Tem portfólio visual publicado (fotos/vídeos)?",    type: "select",   options: ["Sim — atualizado regularmente", "Sim — raramente atualizo", "Não tenho portfólio público"] },
      { id: "cases_ev",     label: "Quantos eventos realizados tem como cases?",        type: "text",     placeholder: "Ex: +150 casamentos realizados desde 2018" },
      { id: "parceiros_ev", label: "Tem parceiros estratégicos?",                       type: "textarea", placeholder: "Liste fotógrafos, buffets, floricultura etc." },
      { id: "feiras_ev",    label: "Participa de feiras ou eventos do setor?",          type: "select",   options: ["Sim — regularmente", "Esporadicamente", "Não"] },
      { id: "dep_ev",       label: "Coleta depoimentos dos clientes após os eventos?",  type: "select",   options: ["Sim — publica nas redes", "Sim — guarda mas não publica", "Não coleta"] },
      { id: "sazon_ev",     label: "Tem alta e baixa temporada? Como lida com isso?",   type: "textarea", placeholder: "Ex: Dezembro e março são os meses mais movimentados..." },
    ],
  },
  infoprodutos: {
    titulo: "Infoprodutos", icone: "🎓",
    perguntas: [
      { id: "tipo_info",   label: "Qual tipo de infoproduto oferece?",                        type: "select",   options: ["Curso online gravado", "Mentoria individual", "Mentoria em grupo", "Comunidade paga", "Ebook / material digital", "Programa ao vivo (turmas)", "Múltiplos formatos"] },
      { id: "plat_info",   label: "Qual plataforma usa para hospedar/vender?",                type: "text",     placeholder: "Ex: Hotmart, Kiwify, Eduzz, Teachable..." },
      { id: "ticket_info", label: "Qual o ticket médio do produto principal?",                type: "text",     placeholder: "Ex: R$997 o curso, R$3.000 a mentoria" },
      { id: "audiencia",   label: "Qual o tamanho da sua audiência total (todas as redes)?",  type: "text",     placeholder: "Ex: 45K Instagram + 12K YouTube + 8K e-mail" },
      { id: "lista_email", label: "Tem lista de e-mail? Se sim, qual o tamanho?",             type: "text",     placeholder: "Ex: 6.500 contatos ativos" },
      { id: "lancamento",  label: "Usa estratégia de lançamento?",                            type: "select",   options: ["Sim — lançamentos periódicos (PLO/PL)", "Sim — lançamento perpétuo (evergreen)", "Não — venda direta", "Quero implementar"] },
      { id: "autor_info",  label: "Quais seus principais porquês de autoridade no nicho?",    type: "textarea", placeholder: "Ex: 10 anos de experiência, X alunos formados..." },
      { id: "cases_info",  label: "Tem cases de alunos com resultados comprovados?",          type: "select",   options: ["Sim — publicados ativamente", "Sim — tenho mas não divulgo bem", "Poucos ainda"] },
      { id: "pb_info",     label: "Seu produto é vendido pela marca ou perfil pessoal?",      type: "select",   options: ["Perfil pessoal (personal brand)", "Marca/empresa", "Ambos"] },
      { id: "comuni_info", label: "Tem comunidade de alunos ativa?",                          type: "select",   options: ["Sim — grupo WhatsApp/Telegram", "Sim — área de membros", "Não tenho ainda"] },
      { id: "afil_info",   label: "Tem programa de afiliados?",                               type: "select",   options: ["Sim — ativo na Hotmart/Kiwify", "Sim — programa próprio", "Não tenho", "Quero criar"] },
      { id: "funil_info",  label: "Usa funil de captura? (lead magnet, isca digital)",        type: "select",   options: ["Sim — ativo e funcionando", "Sim — mas precisa otimizar", "Não uso funil"] },
    ],
  },
  outro: {
    titulo: "Outro", icone: "➕",
    perguntas: [
      { id: "desc_outro",  label: "Descreva o modelo de negócio com suas próprias palavras",    type: "textarea", placeholder: "O que a empresa faz, como gera receita e quem são os clientes..." },
      { id: "prod_outro",  label: "A empresa vende produto, serviço ou ambos?",                 type: "select",   options: ["Produto físico", "Produto digital", "Serviço", "Produto + Serviço"] },
      { id: "capt_outro",  label: "Como capta clientes hoje?",                                  type: "textarea", placeholder: "Ex: Indicação, redes sociais, eventos, prospecção ativa..." },
      { id: "autor_outro", label: "Quais seus principais diferenciais e porquês de autoridade?",type: "textarea", placeholder: "Ex: anos de experiência, método próprio, resultados, prêmios..." },
      { id: "ciclo_outro", label: "Qual o ciclo médio de venda?",                               type: "select",   options: ["Imediato (compra no impulso)", "Menos de 1 semana", "1 a 2 semanas", "1 mês ou mais"] },
      { id: "obs_outro",   label: "Alguma informação adicional relevante sobre o negócio?",     type: "textarea", placeholder: "Contexto, desafios, objetivos..." },
    ],
  },
};

const S = {
  wrap:     { background: "#0D0D0D", minHeight: "100vh", padding: "0 0 60px", fontFamily: "'Segoe UI', Arial, sans-serif", color: "#fff" },
  header:   { background: "#111", borderBottom: "1px solid #222", padding: "18px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo:     { fontSize: 22, fontWeight: 900, color: Y, letterSpacing: 1 },
  subtitle: { fontSize: 11, color: "#444" },
  body:     { maxWidth: 760, margin: "0 auto", padding: "28px 20px" },
  secTitle: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: Y, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 },
  card:     { background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: 10, padding: "20px 22px", marginBottom: 16 },
  label:    { fontSize: 12, color: "#aaa", marginBottom: 6, display: "block" },
  input:    { width: "100%", background: "#111", border: "1px solid #333", borderRadius: 6, padding: "9px 12px", color: "#fff", fontSize: 12, outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", background: "#111", border: "1px solid #333", borderRadius: 6, padding: "9px 12px", color: "#fff", fontSize: 12, outline: "none", resize: "vertical", minHeight: 70, boxSizing: "border-box" },
  select:   { width: "100%", background: "#111", border: "1px solid #333", borderRadius: 6, padding: "9px 12px", color: "#fff", fontSize: 12, outline: "none", boxSizing: "border-box" },
  checkRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 12, color: "#ccc", cursor: "pointer" },
  nichoBtn: (sel) => ({ background: sel ? Y : "#1A1A1A", border: sel ? "2px solid " + Y : "1px solid #333", borderRadius: 8, padding: "10px 14px", color: sel ? "#000" : "#aaa", fontWeight: sel ? 700 : 400, fontSize: 12, cursor: "pointer", flex: "1 1 130px" }),
  btn:      { background: Y, border: "none", borderRadius: 8, padding: "13px 32px", color: "#000", fontWeight: 700, fontSize: 14, cursor: "pointer", width: "100%", marginTop: 8 },
  btnBack:  { background: "#222", border: "none", borderRadius: 8, padding: "13px 32px", color: "#aaa", fontWeight: 700, fontSize: 14, cursor: "pointer", flex: 1, marginTop: 8 },
  progress: { background: "#222", borderRadius: 99, height: 4, marginBottom: 24, overflow: "hidden" },
  progFill: (p) => ({ background: Y, height: "100%", width: p + "%", borderRadius: 99, transition: "width .4s" }),
  divider:  { border: "none", borderTop: "1px solid #222", margin: "16px 0" },
  tag:      { display: "inline-block", background: "#2a1f00", color: Y, border: "1px solid " + Y, fontSize: 9, padding: "1px 7px", borderRadius: 99, fontWeight: 700, marginLeft: 6 },
  errBox:   { background: "#2b0d0d", border: "1px solid #991b1b", borderRadius: 8, padding: "12px 16px", color: "#f87171", fontSize: 12, marginBottom: 12 },
};

// ─── GENERATING SCREEN ────────────────────────────────────────────────────────

const genMsgs = [
  "Analisando dados do negócio...",
  "Pesquisando concorrentes no mercado...",
  "Mapeando tendências do setor...",
  "Construindo análise comparativa...",
  "Identificando gaps e oportunidades...",
  "Elaborando plano de ação...",
  "Finalizando o relatório...",
];

function GeneratingScreen() {
  const [idx, setIdx] = useState(0);
  const [dots, setDots] = useState(0);
  useEffect(() => {
    const t1 = setInterval(() => setIdx(i => (i + 1) % genMsgs.length), 3500);
    const t2 = setInterval(() => setDots(d => (d + 1) % 4), 500);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);
  return (
    <div style={{ background: "#0D0D0D", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
      <div style={{ fontSize: 28, fontWeight: 900, color: Y, letterSpacing: 2, marginBottom: 4 }}>SFO</div>
      <div style={{ fontSize: 10, color: "#333", marginBottom: 52, letterSpacing: 3, textTransform: "uppercase" }}>Agência de Performance</div>
      <div style={{ position: "relative", width: 64, height: 64, marginBottom: 40 }}>
        <div style={{ width: 64, height: 64, border: "2px solid #222", borderTop: "2px solid " + Y, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 8, height: 8, background: Y, borderRadius: "50%", animation: "pulse 1.5s ease-in-out infinite" }} />
        </div>
      </div>
      <div style={{ fontSize: 12, color: "#555", marginBottom: 10, letterSpacing: 1 }}>GERANDO BENCHMARKING COM IA</div>
      <div key={idx} style={{ fontSize: 14, color: Y, minHeight: 22, animation: "fadeIn .4s ease" }}>{genMsgs[idx]}{".".repeat(dots)}</div>
      <div style={{ marginTop: 56, display: "flex", gap: 32 }}>
        {["Pesquisa", "Análise", "Diagnóstico", "Plano"].map((label, i) => (
          <div key={i} style={{ textAlign: "center", opacity: idx >= i * 1.5 ? 1 : 0.2, transition: "opacity 1s" }}>
            <div style={{ width: 8, height: 8, background: idx >= i * 1.5 ? Y : "#333", borderRadius: "50%", margin: "0 auto 6px", transition: "background 1s" }} />
            <div style={{ fontSize: 10, color: "#444" }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 56, fontSize: 11, color: "#2a2a2a", maxWidth: 300, textAlign: "center", lineHeight: 1.8 }}>
        Isso pode levar de 30 a 60 segundos.<br />Estamos pesquisando o mercado e gerando insights personalizados.
      </div>
    </div>
  );
}

// ─── REPORT COMPONENTS ────────────────────────────────────────────────────────

function ImpactBadge({ impact }) {
  const map = { "Alto": { color: "#22c55e", bg: "#052e16", border: "#15803d" }, "Médio": { color: Y, bg: "#2a1f00", border: "#92400e" }, "Baixo": { color: "#f87171", bg: "#2b0d0d", border: "#991b1b" } };
  const s = map[impact] || map["Médio"];
  return <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontSize: 9, padding: "2px 8px", borderRadius: 99, fontWeight: 700 }}>{impact || "Médio"}</span>;
}

function ScoreCircle({ score }) {
  const n = Number(score) || 7;
  const color = n >= 8 ? "#22c55e" : n >= 6 ? Y : "#f87171";
  return (
    <div style={{ width: 46, height: 46, borderRadius: "50%", border: `2px solid ${color}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0, background: color + "11" }}>
      <span style={{ fontSize: 16, fontWeight: 900, color, lineHeight: 1 }}>{n}</span>
      <span style={{ fontSize: 8, color: color + "99" }}>/10</span>
    </div>
  );
}

function STag({ children, color }) {
  return <span style={{ background: (color || Y) + "18", color: color || Y, border: `1px solid ${(color || Y)}33`, fontSize: 10, padding: "3px 10px", borderRadius: 99 }}>{children}</span>;
}

function SecTitle({ icon, title, count }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: Y, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
      {icon && <span style={{ fontSize: 14 }}>{icon}</span>}
      {title}
      {count && <span style={{ background: "#2a1f00", color: Y, border: "1px solid #3a2a00", fontSize: 9, padding: "1px 8px", borderRadius: 99, fontWeight: 700 }}>{count}</span>}
    </div>
  );
}

function RCard({ children, style }) {
  return <div style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: 12, padding: "22px 24px", marginBottom: 16, ...style }}>{children}</div>;
}

function FullReport({ report: R, onNew }) {
  if (!R) return null;
  return (
    <div style={{ background: "#0D0D0D", minHeight: "100vh", fontFamily: "'Segoe UI', Arial, sans-serif", color: "#fff", paddingBottom: 80 }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}.ru{animation:fadeUp .5s ease both}`}</style>
      <div style={{ background: "#0a0a0a", borderBottom: "1px solid #1a1a1a", padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 20, fontWeight: 900, color: Y, letterSpacing: 1 }}>SFO</span>
          <span style={{ width: 1, height: 20, background: "#2a2a2a" }} />
          <span style={{ fontSize: 12, color: "#555" }}>Benchmarking Report</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{R.empresa}</div>
          <div style={{ fontSize: 11, color: "#444" }}>{R.segmento} · {R.data_analise}</div>
        </div>
      </div>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px" }}>
        {/* Hero */}
        <div className="ru" style={{ background: "linear-gradient(135deg,#1a1200 0%,#0f0f0f 60%)", border: "1px solid #3a2a00", borderRadius: 14, padding: "28px 28px 24px", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            {[R.segmento, R.nicho, R.subnicho].filter(Boolean).map((t, i) => <STag key={i}>{t}</STag>)}
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>{R.empresa}</div>
          <div style={{ fontSize: 12, color: "#555", marginBottom: 18 }}>Análise Competitiva · {R.data_analise}</div>
          <div style={{ width: 40, height: 2, background: Y, marginBottom: 18, borderRadius: 1 }} />
          <SecTitle icon="⚡" title="Resumo executivo" />
          <div style={{ fontSize: 13, color: "#bbb", lineHeight: 1.9 }}>{R.resumo_executivo}</div>
        </div>
        {/* Market */}
        {R.panorama_mercado && (
          <RCard className="ru">
            <SecTitle icon="🌎" title="Panorama do mercado" />
            <div style={{ fontSize: 13, color: "#bbb", lineHeight: 1.9, marginBottom: 20 }}>{R.panorama_mercado.descricao}</div>
            {R.panorama_mercado.tamanho && (
              <div style={{ background: "#111", borderRadius: 8, padding: "10px 14px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                <span>📊</span>
                <div>
                  <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1 }}>Tamanho estimado</div>
                  <div style={{ fontSize: 13, color: "#ccc" }}>{R.panorama_mercado.tamanho}</div>
                </div>
              </div>
            )}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {R.panorama_mercado.tendencias?.length > 0 && (
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 10, color: Y, fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>TENDÊNCIAS</div>
                  {R.panorama_mercado.tendencias.map((t, i) => (
                    <div key={i} style={{ fontSize: 12, color: "#bbb", padding: "8px 0", borderBottom: "1px solid #1f1f1f", lineHeight: 1.6, display: "flex", gap: 8 }}>
                      <span style={{ color: Y, flexShrink: 0 }}>→</span>{t}
                    </div>
                  ))}
                </div>
              )}
              {R.panorama_mercado.oportunidades_gerais?.length > 0 && (
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 10, color: "#22c55e", fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>OPORTUNIDADES</div>
                  {R.panorama_mercado.oportunidades_gerais.map((o, i) => (
                    <div key={i} style={{ fontSize: 12, color: "#bbb", padding: "8px 0", borderBottom: "1px solid #1f1f1f", lineHeight: 1.6, display: "flex", gap: 8 }}>
                      <span style={{ color: "#22c55e", flexShrink: 0 }}>✦</span>{o}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </RCard>
        )}
        {/* Competitors */}
        {R.concorrentes?.length > 0 && (
          <div>
            <SecTitle icon="🔍" title="Análise competitiva" count={`${R.concorrentes.length} players`} />
            {R.concorrentes.map((c, i) => (
              <RCard key={i} style={{ borderLeft: `3px solid ${Y}33` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{c.nome}</div>
                    {c.site && <span style={{ fontSize: 11, color: "#444" }}>{c.site}</span>}
                  </div>
                  <ScoreCircle score={c.nota} />
                </div>
                <div style={{ fontSize: 12, color: "#999", lineHeight: 1.8, marginBottom: 16 }}>{c.posicionamento}</div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>
                  {c.pontos_fortes?.length > 0 && (
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <div style={{ fontSize: 10, color: "#22c55e", fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>PONTOS FORTES</div>
                      {c.pontos_fortes.map((p, j) => <div key={j} style={{ fontSize: 11, color: "#bbb", marginBottom: 5, display: "flex", gap: 6 }}><span style={{ color: "#22c55e", flexShrink: 0 }}>✓</span>{p}</div>)}
                    </div>
                  )}
                  {c.pontos_fracos?.length > 0 && (
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <div style={{ fontSize: 10, color: "#f87171", fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>PONTOS FRACOS</div>
                      {c.pontos_fracos.map((p, j) => <div key={j} style={{ fontSize: 11, color: "#bbb", marginBottom: 5, display: "flex", gap: 6 }}><span style={{ color: "#f87171", flexShrink: 0 }}>✗</span>{p}</div>)}
                    </div>
                  )}
                </div>
                {(c.estrategia_digital || c.estrategia_ads) && (
                  <div style={{ borderTop: "1px solid #222", paddingTop: 14, display: "flex", gap: 16, flexWrap: "wrap" }}>
                    {c.estrategia_digital && <div style={{ flex: 1, minWidth: 160 }}><div style={{ fontSize: 10, color: Y, fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>DIGITAL</div><div style={{ fontSize: 11, color: "#999", lineHeight: 1.7 }}>{c.estrategia_digital}</div></div>}
                    {c.estrategia_ads && <div style={{ flex: 1, minWidth: 160 }}><div style={{ fontSize: 10, color: Y, fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>ADS</div><div style={{ fontSize: 11, color: "#999", lineHeight: 1.7 }}>{c.estrategia_ads}</div></div>}
                  </div>
                )}
                {c.diferenciais && (
                  <div style={{ marginTop: 12, background: "#111", borderRadius: 8, padding: "10px 14px", borderLeft: "2px solid " + Y }}>
                    <span style={{ fontSize: 10, color: Y, fontWeight: 700 }}>DIFERENCIAL: </span>
                    <span style={{ fontSize: 11, color: "#bbb" }}>{c.diferenciais}</span>
                  </div>
                )}
              </RCard>
            ))}
          </div>
        )}
        {/* Comparative */}
        {R.comparativo?.length > 0 && (
          <RCard>
            <SecTitle icon="📊" title="Análise comparativa" />
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #2a2a2a" }}>
                    <th style={{ textAlign: "left", padding: "10px 14px", color: "#555", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Critério</th>
                    <th style={{ textAlign: "left", padding: "10px 14px", color: Y, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{R.empresa}</th>
                    <th style={{ textAlign: "left", padding: "10px 14px", color: "#555", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Referência de Mercado</th>
                  </tr>
                </thead>
                <tbody>
                  {R.comparativo.map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #1a1a1a", background: i % 2 === 0 ? "transparent" : "#141414" }}>
                      <td style={{ padding: "11px 14px", color: "#ccc", fontWeight: 600 }}>{row.criterio}</td>
                      <td style={{ padding: "11px 14px", color: "#aaa" }}>{row.cliente}</td>
                      <td style={{ padding: "11px 14px", color: "#555" }}>{row.mercado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </RCard>
        )}
        {/* Diagnosis */}
        {R.diagnostico && (
          <RCard>
            <SecTitle icon="🎯" title="Diagnóstico" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { key: "pontos_fortes", label: "PONTOS FORTES", color: "#22c55e", bg: "#0a1f0a", border: "#15803d22", icon: "✦" },
                { key: "gaps",          label: "GAPS",           color: "#f87171", bg: "#1f0a0a", border: "#99181822", icon: "✗" },
                { key: "oportunidades", label: "OPORTUNIDADES",  color: Y,         bg: "#1a1200", border: "#92400e22", icon: "→" },
                { key: "ameacas",       label: "AMEAÇAS",        color: "#fb923c", bg: "#1a0e00", border: "#c2410c22", icon: "⚠" },
              ].map(({ key, label, color, bg, border, icon }) =>
                R.diagnostico[key]?.length > 0 ? (
                  <div key={key} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: "16px" }}>
                    <div style={{ fontSize: 10, color, fontWeight: 700, marginBottom: 12, letterSpacing: 1 }}>{label}</div>
                    {R.diagnostico[key].map((item, i) => (
                      <div key={i} style={{ fontSize: 12, color: "#ccc", marginBottom: 8, lineHeight: 1.6, display: "flex", gap: 6 }}>
                        <span style={{ color, flexShrink: 0 }}>{icon}</span>{item}
                      </div>
                    ))}
                  </div>
                ) : null
              )}
            </div>
          </RCard>
        )}
        {/* Action Plan */}
        {R.plano_acao && (
          <RCard>
            <SecTitle icon="📋" title="Plano de ação" />
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {[
                { key: "curto_prazo", label: "CURTO PRAZO",  color: "#22c55e" },
                { key: "medio_prazo", label: "MÉDIO PRAZO",  color: Y },
                { key: "longo_prazo", label: "LONGO PRAZO",  color: "#a78bfa" },
              ].map(({ key, label, color }) =>
                R.plano_acao[key]?.length > 0 ? (
                  <div key={key} style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontSize: 10, color, fontWeight: 700, marginBottom: 14, paddingBottom: 10, borderBottom: `2px solid ${color}33`, letterSpacing: 1 }}>{label}</div>
                    {R.plano_acao[key].map((item, i) => (
                      <div key={i} style={{ background: "#111", borderRadius: 10, padding: "12px 14px", marginBottom: 10, borderLeft: `3px solid ${color}` }}>
                        <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.6, marginBottom: 8 }}>{item.acao}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 10, color: "#444" }}>⏱ {item.prazo}</span>
                          {item.categoria && <span style={{ fontSize: 9, color: "#444", background: "#1a1a1a", border: "1px solid #2a2a2a", padding: "1px 7px", borderRadius: 99 }}>{item.categoria}</span>}
                          <ImpactBadge impact={item.impacto} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null
              )}
            </div>
          </RCard>
        )}
        <div style={{ textAlign: "center", padding: "32px 0 0", borderTop: "1px solid #1a1a1a", marginTop: 8 }}>
          <div style={{ fontSize: 11, color: "#2a2a2a", marginBottom: 20 }}>Relatório gerado por <span style={{ color: Y, fontWeight: 700 }}>SFO Agência de Performance</span> · {R.data_analise}</div>
          <button style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "10px 24px", color: "#666", fontSize: 12, cursor: "pointer" }} onClick={onNew}>← Novo briefing</button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [nicho,    setNicho]    = useState("");
  const [vals,     setVals]     = useState({});
  const [checks,   setChecks]   = useState({});
  const [step,     setStep]     = useState(1);
  const [report,   setReport]   = useState(null);
  const [genError, setGenError] = useState("");

  const set = (id, v) => setVals(p => ({ ...p, [id]: v }));
  const tog = (id)    => setChecks(p => ({ ...p, [id]: !p[id] }));

  const renderField = (q) => (
    <div key={q.id} style={{ marginBottom: 16 }}>
      <label style={S.label}>{q.label}</label>
      {q.type === "text"     && <input    style={S.input}    placeholder={q.placeholder || ""} value={vals[q.id] || ""} onChange={e => set(q.id, e.target.value)} />}
      {q.type === "textarea" && <textarea style={S.textarea} placeholder={q.placeholder || ""} value={vals[q.id] || ""} onChange={e => set(q.id, e.target.value)} />}
      {q.type === "select"   && (
        <select style={S.select} value={vals[q.id] || ""} onChange={e => set(q.id, e.target.value)}>
          <option value="">Selecione...</option>
          {q.options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
    </div>
  );

  const checkBox = (item) => (
    <div key={item.id} style={S.checkRow} onClick={() => tog(item.id)}>
      <div style={{ width: 16, height: 16, borderRadius: 4, border: "2px solid " + (checks[item.id] ? Y : "#444"), background: checks[item.id] ? Y : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {checks[item.id] && <span style={{ color: "#000", fontSize: 10, fontWeight: 900 }}>✓</span>}
      </div>
      {item.label}
    </div>
  );

  const buildFormData = () => {
    const ads    = plataformasAds.filter(p => checks[p.id]).map(p => p.label).join(", ") || "Nenhum";
    const canais = canaisAtivos.filter(p => checks[p.id]).map(p => p.label).join(", ") || "Nenhum";
    const nichoPergs = perguntasPorNicho[nicho]?.perguntas || [];
    const nichoVals  = nichoPergs.reduce((acc, q) => { acc[q.id] = vals[q.id] || ""; return acc; }, {});
    return {
      data_envio: new Date().toLocaleString("pt-BR"),
      segmento: nichosOpcoes.find(n => n.value === nicho)?.label || nicho,
      nome: vals.nome || "", site: vals.site || "",
      nicho: vals.nicho_desc || "", subnicho: vals.subnicho || "", micronicho: vals.micronicho || "",
      modelo_negocio: vals.modelo || "", capacidade: vals.capacidade || "",
      concorrentes: vals.concorrentes || "", referencias: vals.referencias || "",
      redes_sociais: vals.redes || "", seguidores: vals.seguidores || "",
      ceo_aparece: vals.ceo_aparece || "", ceo_perfil: vals.ceo_perfil || "",
      historia: vals.historia || "", ticket_medio: vals.ticket || "",
      investimento_ads: vals.investimento || "", plataformas_ads: ads, canais_ativos: canais,
      crm: vals.crm_tool || "", freq_postagem: vals.freq_post || "",
      tiktok_info: vals.tiktok_seg || "", obs_digital: vals.obs_digital || "",
      ...nichoVals, obs_final: vals.obs_final || "",
    };
  };

  const saveToSheetDB = (data) => {
    try {
      const form = document.createElement("form");
      form.method = "POST"; form.action = SHEETDB; form.target = "sfo_bg_frame"; form.style.display = "none";
      Object.entries(data).forEach(([k, v]) => {
        const inp = document.createElement("input"); inp.name = "data[" + k + "]"; inp.value = v; form.appendChild(inp);
      });
      let iframe = document.getElementById("sfo_bg_frame");
      if (!iframe) { iframe = document.createElement("iframe"); iframe.name = "sfo_bg_frame"; iframe.id = "sfo_bg_frame"; iframe.style.display = "none"; document.body.appendChild(iframe); }
      document.body.appendChild(form); form.submit(); document.body.removeChild(form);
    } catch (e) { console.warn("SheetDB:", e); }
  };

  // ── CHAMA O SERVIDOR — NÃO A API DIRETAMENTE ─────────────────────────────
  const generateReport = async (formData) => {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientData: formData, nicho }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || `Erro HTTP ${response.status}`);
    if (!data.report) throw new Error("Relatório não retornado pelo servidor.");
    return data.report;
  };

  const handleSubmit = async () => {
    setGenError("");
    setStep(5);
    const formData = buildFormData();
    saveToSheetDB(formData);
    try {
      const reportData = await generateReport(formData);
      setReport(reportData);
      setStep(6);
    } catch (e) {
      setGenError("Erro ao gerar o relatório: " + e.message);
      setStep(4);
    }
  };

  const resetAll = () => { setStep(1); setVals({}); setChecks({}); setNicho(""); setReport(null); setGenError(""); };
  const progress = Math.min(((step - 1) / 3) * 100, 100);
  const nichoLabel = nicho ? nichosOpcoes.find(n => n.value === nicho)?.label : "Preencha o formulário";

  if (step === 5) return <GeneratingScreen />;
  if (step === 6) return <FullReport report={report} onNew={resetAll} />;

  return (
    <div style={S.wrap}>
      <div style={S.header}>
        <div><span style={S.logo}>SFO</span><div style={S.subtitle}>Briefing · {nichoLabel}</div></div>
        <div style={{ fontSize: 11, color: "#333" }}>Passo {Math.min(step, 4)} de 4</div>
      </div>
      <div style={S.body}>
        <div style={S.progress}><div style={S.progFill(progress)} /></div>

        {step === 1 && (
          <>
            <div style={S.secTitle}>Passo 1 de 4 · Tipo de negócio</div>
            <div style={S.card}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Qual o segmento da empresa?</div>
              <div style={{ fontSize: 12, color: "#555", marginBottom: 18 }}>A escolha define as perguntas específicas do passo 4.</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                {nichosOpcoes.map(n => <button key={n.value} style={S.nichoBtn(nicho === n.value)} onClick={() => setNicho(n.value)}>{n.icon} {n.label}</button>)}
              </div>
              <button style={{ ...S.btn, opacity: nicho ? 1 : .4, cursor: nicho ? "pointer" : "not-allowed" }} onClick={() => nicho && setStep(2)}>Continuar →</button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div style={S.secTitle}>Passo 2 de 4 · Informações gerais</div>
            <div style={S.card}>
              <div style={{ fontSize: 12, color: "#555", marginBottom: 16 }}>Válido para todos os segmentos.</div>
              {universais.map(renderField)}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={S.btnBack} onClick={() => setStep(1)}>← Voltar</button>
              <button style={{ ...S.btn, flex: 2 }} onClick={() => setStep(3)}>Continuar →</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div style={S.secTitle}>Passo 3 de 4 · Canais e presença digital</div>
            <div style={S.card}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: Y }}>Quais plataformas de anúncio já utiliza?</div>
              {plataformasAds.map(checkBox)}
              <div style={S.divider} />
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: Y }}>Quais canais digitais já usa ativamente?</div>
              {canaisAtivos.map(checkBox)}
              <div style={S.divider} />
              {renderField({ id: "crm_tool",    label: "Usa alguma ferramenta de CRM ou automação?",         type: "text",     placeholder: "Ex: RD Station, HubSpot, Klaviyo, nenhuma..." })}
              {renderField({ id: "freq_post",   label: "Com que frequência posta nas redes sociais?",         type: "select",   options: ["Diariamente", "3 a 5 vezes por semana", "1 a 2 vezes por semana", "Raramente / sem frequência definida"] })}
              {renderField({ id: "tiktok_seg",  label: "Se tem TikTok: quantos seguidores e média de views?", type: "text",     placeholder: "Ex: 8.200 seguidores, média de 3.000 views" })}
              {renderField({ id: "obs_digital", label: "Algo mais sobre sua presença digital atual?",         type: "textarea", placeholder: "Dificuldades, o que já tentou, o que funcionou..." })}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={S.btnBack} onClick={() => setStep(2)}>← Voltar</button>
              <button style={{ ...S.btn, flex: 2 }} onClick={() => setStep(4)}>Continuar →</button>
            </div>
          </>
        )}

        {step === 4 && nicho && perguntasPorNicho[nicho] && (
          <>
            <div style={S.secTitle}>Passo 4 de 4 · {perguntasPorNicho[nicho].icone} {perguntasPorNicho[nicho].titulo}<span style={S.tag}>Personalizado</span></div>
            <div style={S.card}>
              <div style={{ fontSize: 12, color: "#555", marginBottom: 16 }}>Perguntas específicas para {perguntasPorNicho[nicho].titulo.toLowerCase()}.</div>
              {perguntasPorNicho[nicho].perguntas.map(renderField)}
              {renderField({ id: "obs_final", label: "Alguma informação adicional importante para a análise?", type: "textarea", placeholder: "Contexto extra, desafios, objetivos de curto prazo..." })}
            </div>
            {genError && <div style={S.errBox}>⚠️ {genError}</div>}
            <div style={{ display: "flex", gap: 10 }}>
              <button style={S.btnBack} onClick={() => setStep(3)}>← Voltar</button>
              <button style={{ ...S.btn, flex: 2 }} onClick={handleSubmit}>Gerar benchmarking ✦</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
