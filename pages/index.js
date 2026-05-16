import { useState } from "react";
import Head from "next/head";

const Y = "#F5A800";
const BG = "#0D0D0D";
const DK = "#1A1A1A";

const nichosOpcoes = [
  { value: "ecommerce",    label: "E-commerce" },
  { value: "servicos",     label: "Prestação de Serviços" },
  { value: "consultoria",  label: "Consultoria" },
  { value: "estetica",     label: "Serviços Estéticos" },
  { value: "eventos",      label: "Eventos" },
  { value: "infoprodutos", label: "Infoprodutos" },
  { value: "outro",        label: "Outro" },
];

const universais = [
  { id: "nome",         label: "Nome da empresa",                                 type: "text",     ph: "Ex: Selet Joias" },
  { id: "site",         label: "Site da empresa",                                 type: "text",     ph: "Ex: selet.com.br" },
  { id: "nicho_desc",   label: "Nicho de atuação",                                type: "text",     ph: "Ex: E-commerce de joias" },
  { id: "subnicho",     label: "Subnicho de atuação",                             type: "text",     ph: "Ex: Semijoias femininas" },
  { id: "micronicho",   label: "Micronicho (se existir)",                         type: "text",     ph: "Ex: Semijoias para formatura" },
  { id: "modelo",       label: "Modelo de negócio",                               type: "select",   opts: ["B2C (vende ao consumidor final)", "B2B (vende para empresas)", "Ambos"] },
  { id: "capacidade",   label: "Capacidade de atendimento",                       type: "select",   opts: ["Local (cidade/região)", "Nacional (todo o Brasil)", "Mundial (internacional)"] },
  { id: "concorrentes", label: "Concorrentes conhecidos",                         type: "textarea", ph: "Liste os principais concorrentes" },
  { id: "referencias",  label: "Referências de mercado",                          type: "textarea", ph: "Marcas que admira ou se inspira" },
  { id: "redes",        label: "Redes sociais (links)",                           type: "textarea", ph: "Instagram, TikTok, LinkedIn..." },
  { id: "seguidores",   label: "Seguidores na rede principal",                    type: "text",     ph: "Ex: 12.500 no Instagram" },
  { id: "ceo_aparece",  label: "Tem CEO ou fundador(a) que aparece publicamente?",type: "select",   opts: ["Sim", "Não", "Em construção"] },
  { id: "ceo_perfil",   label: "Se sim, perfil pessoal e seguidores",             type: "text",     ph: "Ex: @sabrinanunesfj — 919K" },
  { id: "historia",     label: "História de origem da empresa",                   type: "textarea", ph: "Ex: Fundada com R$500 em 2016..." },
  { id: "ticket",       label: "Ticket médio por venda/cliente",                  type: "text",     ph: "Ex: R$150 por pedido" },
  { id: "investimento", label: "Investimento mensal em mídia paga",               type: "select",   opts: ["Até R$1.000/mês", "R$1.000 a R$3.000/mês", "R$3.000 a R$10.000/mês", "Acima de R$10.000/mês", "Ainda não invisto"] },
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

const nichoPergs = {
  ecommerce: [
    { id: "plataforma",   label: "Plataforma de e-commerce",                type: "select",   opts: ["Shopify","Nuvemshop","VTEX","WooCommerce","Loja Integrada","Outra"] },
    { id: "tiktok_shop",  label: "Tem TikTok Shop ativado?",                type: "select",   opts: ["Sim","Não","Quero ativar"] },
    { id: "marketplaces", label: "Está em algum marketplace?",              type: "textarea", ph: "Ex: Mercado Livre, Amazon..." },
    { id: "embaixadores", label: "Tem programa de embaixadores/afiliados?", type: "select",   opts: ["Sim — programa estruturado","Sim — parcerias pontuais","Não","Quero criar"] },
    { id: "embax_excl",   label: "Tem embaixador exclusivo?",               type: "select",   opts: ["Sim","Não","Em negociação"] },
    { id: "collab",       label: "Já fez collab com influenciadores?",      type: "textarea", ph: "Ex: @influencer1..." },
    { id: "comunidade",   label: "Tem comunidade de clientes com nome?",    type: "text",     ph: "Ex: Céu Lovers..." },
    { id: "kit_presente", label: "Tem produto especial para presente?",     type: "select",   opts: ["Sim","Não","Em desenvolvimento"] },
    { id: "sazonalidade", label: "Tem produtos sazonais ou de ocasião?",    type: "textarea", ph: "Ex: Formatura, Natal..." },
    { id: "crm_ecomm",    label: "Usa CRM ou automação de marketing?",      type: "text",     ph: "Ex: Klaviyo, RD Station..." },
    { id: "brinde",       label: "Usa brinde no carrinho ou cashback?",     type: "select",   opts: ["Sim","Não","Quero implementar"] },
    { id: "retencao",     label: "Como faz retenção de clientes?",          type: "textarea", ph: "Ex: E-mail pós-compra, WhatsApp..." },
  ],
  servicos: [
    { id: "tipo_servico", label: "Qual tipo de serviço oferece?",           type: "textarea", ph: "Descreva o que faz e para quem" },
    { id: "fmt_entrega",  label: "Como entrega o serviço?",                 type: "select",   opts: ["Presencial","Online (remoto)","Híbrido"] },
    { id: "captacao",     label: "Como capta clientes hoje?",               type: "textarea", ph: "Ex: Indicação, redes sociais..." },
    { id: "ciclo_venda",  label: "Ciclo médio de venda",                    type: "select",   opts: ["Menos de 1 semana","1 a 2 semanas","1 mês","Mais de 1 mês"] },
    { id: "autoridade",   label: "Principais porquês de autoridade",        type: "textarea", ph: "Ex: anos de experiência..." },
    { id: "cases",        label: "Tem cases ou depoimentos públicos?",      type: "select",   opts: ["Sim — publicados nas redes","Sim — mas não divulgados","Não tenho ainda"] },
    { id: "recorrencia",  label: "Contrato recorrente ou venda única?",     type: "select",   opts: ["Recorrente (mensalidade)","Venda única","Ambos"] },
    { id: "linkedin",     label: "Usa LinkedIn como canal de prospecção?",  type: "select",   opts: ["Sim — ativo","Sim — mas pouco","Não uso","Quero usar"] },
  ],
  consultoria: [
    { id: "area_cons",      label: "Qual área de consultoria?",              type: "textarea", ph: "Ex: Financeira, marketing, RH..." },
    { id: "publico_cons",   label: "Perfil do cliente ideal",                type: "textarea", ph: "Ex: Pequenas empresas..." },
    { id: "fmt_cons",       label: "Formato de entrega",                     type: "select",   opts: ["Sessões individuais","Programa estruturado","Retainer mensal","Workshop","Online","Híbrido"] },
    { id: "ticket_cons",    label: "Ticket médio da consultoria",            type: "text",     ph: "Ex: R$5.000 por projeto" },
    { id: "captacao_cons",  label: "Como capta clientes hoje?",              type: "textarea", ph: "Ex: Indicação, LinkedIn..." },
    { id: "autoridade_cons",label: "Principais porquês de autoridade",       type: "textarea", ph: "Ex: 15 anos de experiência..." },
    { id: "cases_cons",     label: "Tem cases ou resultados de clientes?",   type: "select",   opts: ["Sim — publicados ativamente","Sim — não divulgo bem","Poucos ainda"] },
    { id: "linkedin_cons",  label: "Usa LinkedIn como canal de autoridade?", type: "select",   opts: ["Sim — ativo","Sim — pouco ativo","Não uso","Quero usar"] },
    { id: "pb_cons",        label: "Vendido pelo perfil pessoal ou empresa?",type: "select",   opts: ["Perfil pessoal","Empresa / marca","Ambos"] },
  ],
  estetica: [
    { id: "tipo_est",     label: "Qual tipo de serviço estético?",            type: "textarea", ph: "Ex: Design de sobrancelhas, lash..." },
    { id: "modelo_est",   label: "Modelo de atendimento",                     type: "select",   opts: ["Studio próprio","A domicílio","Clínica / salão","Híbrido"] },
    { id: "ticket_est",   label: "Ticket médio por atendimento",              type: "text",     ph: "Ex: R$120 por sessão" },
    { id: "recorr_est",   label: "Recorrência média dos clientes",            type: "select",   opts: ["Semanal","Quinzenal","Mensal","A cada 2–3 meses","Única vez"] },
    { id: "portfolio_est",label: "Tem portfólio visual publicado?",           type: "select",   opts: ["Sim — atualizado regularmente","Sim — raramente atualizo","Não tenho"] },
    { id: "rosto_est",    label: "O profissional é o rosto da marca?",        type: "select",   opts: ["Sim — aparece nos conteúdos","Às vezes","Não"] },
    { id: "cert_est",     label: "Tem certificações que usa como autoridade?",type: "textarea", ph: "Ex: Formada pela Academia X..." },
  ],
  eventos: [
    { id: "tipo_ev",      label: "Qual tipo de evento organiza?",             type: "textarea", ph: "Ex: Casamentos, corporativos..." },
    { id: "porte_ev",     label: "Porte médio dos eventos",                   type: "select",   opts: ["Pequeno (até 50 pessoas)","Médio (50 a 300)","Grande (acima de 300)","Varia muito"] },
    { id: "ticket_ev",    label: "Ticket médio por evento",                   type: "text",     ph: "Ex: R$15.000 por cerimônia" },
    { id: "captac_ev",    label: "Como capta clientes?",                      type: "textarea", ph: "Ex: Indicação, Instagram, feiras..." },
    { id: "cases_ev",     label: "Quantos eventos realizados como cases?",    type: "text",     ph: "Ex: +150 casamentos desde 2018" },
    { id: "parceiros_ev", label: "Tem parceiros estratégicos?",               type: "textarea", ph: "Ex: fotógrafos, buffets..." },
  ],
  infoprodutos: [
    { id: "tipo_info",   label: "Qual tipo de infoproduto?",                  type: "select",   opts: ["Curso online gravado","Mentoria individual","Mentoria em grupo","Comunidade paga","Ebook","Programa ao vivo","Múltiplos formatos"] },
    { id: "plat_info",   label: "Plataforma para hospedar/vender",            type: "text",     ph: "Ex: Hotmart, Kiwify..." },
    { id: "ticket_info", label: "Ticket médio do produto principal",          type: "text",     ph: "Ex: R$997 o curso" },
    { id: "audiencia",   label: "Tamanho da audiência total",                 type: "text",     ph: "Ex: 45K Instagram + 12K YouTube" },
    { id: "lancamento",  label: "Usa estratégia de lançamento?",              type: "select",   opts: ["Sim — lançamentos periódicos","Sim — perpétuo (evergreen)","Não — venda direta","Quero implementar"] },
    { id: "afil_info",   label: "Tem programa de afiliados?",                 type: "select",   opts: ["Sim — ativo","Sim — programa próprio","Não tenho","Quero criar"] },
  ],
  outro: [
    { id: "desc_outro",   label: "Descreva o modelo de negócio",              type: "textarea", ph: "O que faz, como gera receita..." },
    { id: "prod_outro",   label: "Vende produto, serviço ou ambos?",          type: "select",   opts: ["Produto físico","Produto digital","Serviço","Produto + Serviço"] },
    { id: "captacao_out", label: "Como capta clientes hoje?",                 type: "textarea", ph: "Ex: Indicação, redes sociais..." },
    { id: "ciclo_outro",  label: "Ciclo médio de venda",                      type: "select",   opts: ["Imediato","Menos de 1 semana","1 a 2 semanas","1 mês ou mais"] },
  ],
};

const css = {
  wrap:     { background: BG, minHeight: "100vh", fontFamily: "Arial,sans-serif", color: "#fff", fontSize: 13 },
  body:     { maxWidth: 700, margin: "0 auto", padding: "32px 18px" },
  card:     { background: DK, border: "1px solid #2a2a2a", borderRadius: 8, padding: "20px 22px", marginBottom: 14 },
  label:    { fontSize: 11, color: "#888", marginBottom: 5, display: "block" },
  input:    { width: "100%", background: "#111", border: "1px solid #2a2a2a", borderRadius: 5, padding: "8px 11px", color: "#fff", fontSize: 12, outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", background: "#111", border: "1px solid #2a2a2a", borderRadius: 5, padding: "8px 11px", color: "#fff", fontSize: 12, outline: "none", resize: "vertical", minHeight: 65, boxSizing: "border-box" },
  select:   { width: "100%", background: "#111", border: "1px solid #2a2a2a", borderRadius: 5, padding: "8px 11px", color: "#fff", fontSize: 12, outline: "none", boxSizing: "border-box" },
  btn:      { background: Y, border: "none", borderRadius: 6, padding: "10px 22px", color: "#000", fontWeight: 700, fontSize: 13, cursor: "pointer" },
  btnSm:    { background: "transparent", border: "1px solid #2a2a2a", borderRadius: 5, padding: "6px 14px", color: "#666", fontSize: 11, cursor: "pointer" },
  tag:      { display: "inline-block", background: Y, color: "#000", fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 3, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 },
  progress: { background: "#1a1a1a", borderRadius: 99, height: 2, marginBottom: 20, overflow: "hidden" },
  divider:  { border: "none", borderTop: "1px solid #1f1f1f", margin: "14px 0" },
  check:    { display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 12, color: "#aaa", cursor: "pointer" },
};

function Field({ q, val, onChange }) {
  if (q.type === "text")     return <input    style={css.input}    placeholder={q.ph||""} value={val||""} onChange={e=>onChange(e.target.value)} />;
  if (q.type === "textarea") return <textarea style={css.textarea} placeholder={q.ph||""} value={val||""} onChange={e=>onChange(e.target.value)} />;
  if (q.type === "select")   return <select style={css.select} value={val||""} onChange={e=>onChange(e.target.value)}><option value="">Selecione...</option>{q.opts.map(o=><option key={o} value={o}>{o}</option>)}</select>;
  return null;
}

export default function Home() {
  const [nicho,  setNicho]  = useState("");
  const [vals,   setVals]   = useState({});
  const [checks, setChecks] = useState({});
  const [step,   setStep]   = useState(1);
  const [done,   setDone]   = useState(false);

  const set = (id, v) => setVals(p => ({ ...p, [id]: v }));
  const tog = (id)    => setChecks(p => ({ ...p, [id]: !p[id] }));

  const handleSend = async () => {
    const ads    = plataformasAds.filter(p => checks[p.id]).map(p => p.label).join(", ") || "Nenhum";
    const canais = canaisAtivos.filter(p =>  checks[p.id]).map(p => p.label).join(", ")  || "Nenhum";
    const extras = (nichoPergs[nicho] || []).reduce((a, q) => { a[q.id] = vals[q.id] || ""; return a; }, {});
    const payload = { nicho, data: { ...vals, plataformas_ads: ads, canais_ativos: canais, ...extras } };
    // Salva no localStorage para o painel acessar
    const existing = JSON.parse(localStorage.getItem("sfo_clients") || "[]");
    const newClient = { id: Date.now().toString(), ...payload, status: "aguardando", createdAt: new Date().toLocaleString("pt-BR"), report: null };
    localStorage.setItem("sfo_clients", JSON.stringify([newClient, ...existing]));
    setDone(true);
  };

  const CheckBox = ({ item }) => (
    <div style={css.check} onClick={() => tog(item.id)}>
      <div style={{ width:14,height:14,borderRadius:3,border:"1px solid "+(checks[item.id]?Y:"#444"),background:checks[item.id]?Y:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
        {checks[item.id] && <span style={{ color:"#000",fontSize:9,fontWeight:900 }}>✓</span>}
      </div>
      {item.label}
    </div>
  );

  if (done) return (
    <div style={css.wrap}>
      <Head><title>SFO — Briefing enviado</title></Head>
      <div style={css.body}>
        <div style={{ ...css.card, textAlign:"center", padding:"44px 20px" }}>
          <div style={{ width:44,height:44,borderRadius:"50%",background:"#052e16",border:"1px solid #166534",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:20,color:"#4ade80" }}>✓</div>
          <div style={{ fontSize:18,fontWeight:800,marginBottom:6 }}>Briefing <span style={{ color:Y }}>enviado com sucesso</span></div>
          <div style={{ fontSize:12,color:"#555",maxWidth:360,margin:"0 auto 20px",lineHeight:1.8 }}>
            As respostas de <strong style={{ color:"#aaa" }}>{vals.nome||"seu cliente"}</strong> foram registradas.
          </div>
          <button style={css.btn} onClick={() => { setStep(1); setVals({}); setChecks({}); setNicho(""); setDone(false); }}>Preencher novo briefing</button>
        </div>
      </div>
    </div>
  );

  const progress = ((step - 1) / 4) * 100;
  const stepLabels = ["","Tipo de negócio","Informações gerais","Canais e mídia", nichosOpcoes.find(n=>n.value===nicho)?.label||"Perguntas específicas"];

  return (
    <div style={css.wrap}>
      <Head><title>SFO — Briefing de Benchmarking</title></Head>
      <div style={{ background:"#111",borderBottom:"1px solid #222",padding:"12px 24px",display:"flex",alignItems:"center" }}>
        <span style={{ fontSize:20,fontWeight:900,color:Y,letterSpacing:".02em" }}>SFO</span>
        <span style={{ fontSize:11,color:"#444",marginLeft:12 }}>Briefing de Benchmarking</span>
      </div>
      <div style={css.body}>
        <div style={{ marginBottom:14 }}>
          <span style={css.tag}>Briefing</span>
          <div style={{ fontSize:17,fontWeight:800,marginTop:2 }}>{stepLabels[step]} <span style={{ fontSize:11,color:"#444",fontWeight:400 }}>Passo {step} de 4</span></div>
        </div>
        <div style={css.progress}><div style={{ background:Y,height:"100%",width:progress+"%",borderRadius:99,transition:"width .4s" }} /></div>

        {step===1 && (
          <div style={css.card}>
            <label style={css.label}>Selecione o segmento da empresa</label>
            <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:18,marginTop:8 }}>
              {nichosOpcoes.map(n => (
                <button key={n.value} style={{ background:nicho===n.value?Y:"#111",border:nicho===n.value?"1px solid "+Y:"1px solid #2a2a2a",borderRadius:5,padding:"9px 16px",color:nicho===n.value?"#000":"#888",fontWeight:nicho===n.value?700:400,fontSize:12,cursor:"pointer",flex:"1 1 130px" }} onClick={()=>setNicho(n.value)}>{n.label}</button>
              ))}
            </div>
            <button style={{ ...css.btn,opacity:nicho?1:.35,cursor:nicho?"pointer":"not-allowed",width:"100%" }} onClick={()=>nicho&&setStep(2)}>Continuar</button>
          </div>
        )}

        {step===2 && (
          <div style={css.card}>
            {universais.map(q => (
              <div key={q.id} style={{ marginBottom:14 }}>
                <label style={css.label}>{q.label}</label>
                <Field q={q} val={vals[q.id]} onChange={v=>set(q.id,v)} />
              </div>
            ))}
            <div style={{ display:"flex",gap:8,marginTop:4 }}>
              <button style={{ ...css.btnSm,flex:1,padding:"10px" }} onClick={()=>setStep(1)}>Voltar</button>
              <button style={{ ...css.btn,flex:2 }} onClick={()=>setStep(3)}>Continuar</button>
            </div>
          </div>
        )}

        {step===3 && (
          <div style={css.card}>
            <div style={{ fontSize:12,fontWeight:600,color:Y,marginBottom:10 }}>Plataformas de anúncio utilizadas</div>
            {plataformasAds.map(p => <CheckBox key={p.id} item={p} />)}
            <div style={css.divider} />
            <div style={{ fontSize:12,fontWeight:600,color:Y,marginBottom:10 }}>Canais digitais ativos</div>
            {canaisAtivos.map(p => <CheckBox key={p.id} item={p} />)}
            <div style={css.divider} />
            {[
              {id:"crm_tool",  label:"CRM ou ferramenta de automação",      type:"text",    ph:"Ex: RD Station, Klaviyo..."},
              {id:"freq_post", label:"Frequência de postagem nas redes",     type:"select",  opts:["Diariamente","3 a 5 vezes por semana","1 a 2 vezes por semana","Raramente"]},
              {id:"tiktok_seg",label:"TikTok: seguidores e média de views",  type:"text",    ph:"Ex: 8.200 seguidores, 3.000 views/vídeo"},
              {id:"obs_digital",label:"Observações sobre presença digital",  type:"textarea",ph:"Dificuldades, o que já tentou..."},
            ].map(q => (
              <div key={q.id} style={{ marginBottom:14 }}>
                <label style={css.label}>{q.label}</label>
                <Field q={q} val={vals[q.id]} onChange={v=>set(q.id,v)} />
              </div>
            ))}
            <div style={{ display:"flex",gap:8 }}>
              <button style={{ ...css.btnSm,flex:1,padding:"10px" }} onClick={()=>setStep(2)}>Voltar</button>
              <button style={{ ...css.btn,flex:2 }} onClick={()=>setStep(4)}>Continuar</button>
            </div>
          </div>
        )}

        {step===4 && nicho && (
          <div style={css.card}>
            {(nichoPergs[nicho]||[]).map(q => (
              <div key={q.id} style={{ marginBottom:14 }}>
                <label style={css.label}>{q.label}</label>
                <Field q={q} val={vals[q.id]} onChange={v=>set(q.id,v)} />
              </div>
            ))}
            <div style={{ marginBottom:14 }}>
              <label style={css.label}>Informação adicional para a análise</label>
              <textarea style={css.textarea} placeholder="Contexto extra, desafios, objetivos..." value={vals.obs_final||""} onChange={e=>set("obs_final",e.target.value)} />
            </div>
            <div style={{ display:"flex",gap:8 }}>
              <button style={{ ...css.btnSm,flex:1,padding:"10px" }} onClick={()=>setStep(3)}>Voltar</button>
              <button style={{ ...css.btn,flex:2 }} onClick={handleSend}>Enviar briefing</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
