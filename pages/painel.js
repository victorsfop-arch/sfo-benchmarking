import { useState, useEffect, useRef } from "react";
import Head from "next/head";

const Y = "#F5A800";
const BG = "#0D0D0D";
const DK = "#1A1A1A";

const ADMIN_USER = process.env.NEXT_PUBLIC_ADMIN_USER || "sfo";
const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || "sfo2026";

const nichosOpcoes = [
  { value: "ecommerce",    label: "E-commerce" },
  { value: "servicos",     label: "Prestação de Serviços" },
  { value: "consultoria",  label: "Consultoria" },
  { value: "estetica",     label: "Serviços Estéticos" },
  { value: "eventos",      label: "Eventos" },
  { value: "infoprodutos", label: "Infoprodutos" },
  { value: "outro",        label: "Outro" },
];

const LOADING_STEPS = [
  "Iniciando análise de mercado...",
  "Identificando concorrentes do nicho...",
  "Analisando perfis nas redes sociais...",
  "Verificando programas de embaixadores...",
  "Analisando estratégias de mídia paga...",
  "Mapeando estratégias de conteúdo...",
  "Identificando oportunidades...",
  "Estruturando plano de ação...",
  "Compilando relatório final...",
];

const css = {
  wrap:      { background: BG, minHeight: "100vh", fontFamily: "Arial,sans-serif", color: "#fff", fontSize: 13 },
  nav:       { background: "#111", borderBottom: "1px solid #222", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo:      { fontSize: 20, fontWeight: 900, color: Y, letterSpacing: ".02em" },
  body:      { maxWidth: 820, margin: "0 auto", padding: "24px 18px" },
  card:      { background: DK, border: "1px solid #2a2a2a", borderRadius: 8, padding: "18px 20px", marginBottom: 14 },
  btn:       { background: Y, border: "none", borderRadius: 6, padding: "10px 22px", color: "#000", fontWeight: 700, fontSize: 13, cursor: "pointer" },
  btnSm:     { background: "transparent", border: "1px solid #2a2a2a", borderRadius: 5, padding: "5px 12px", color: "#666", fontSize: 11, cursor: "pointer" },
  btnDanger: { background: "transparent", border: "1px solid #7f1d1d", borderRadius: 5, padding: "5px 12px", color: "#ef4444", fontSize: 11, cursor: "pointer" },
  input:     { width: "100%", background: "#111", border: "1px solid #2a2a2a", borderRadius: 5, padding: "8px 11px", color: "#fff", fontSize: 12, outline: "none", boxSizing: "border-box" },
  label:     { fontSize: 11, color: "#888", marginBottom: 5, display: "block" },
  tag:       { display: "inline-block", background: Y, color: "#000", fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 3, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 },
  ins:       { background: "#1a1400", borderLeft: "3px solid " + Y, borderRadius: "0 6px 6px 0", padding: "8px 12px", fontSize: 11, color: "#ccc", lineHeight: 1.6, marginTop: 8 },
  errBox:    { background: "#1c0a0a", border: "1px solid #7f1d1d", borderRadius: 6, padding: "10px 14px", color: "#f87171", fontSize: 12, marginBottom: 12 },
  statusBadge: (s) => ({
    display: "inline-block", fontSize: 10, padding: "2px 8px", borderRadius: 3, fontWeight: 700,
    background: s === "pronto" ? "#052e16" : s === "gerando" ? "#1c1400" : "#111",
    color:      s === "pronto" ? "#4ade80" : s === "gerando" ? Y          : "#555",
    border:     "1px solid " + (s === "pronto" ? "#166534" : s === "gerando" ? "#3d2f00" : "#2a2a2a"),
  }),
};

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function LoginView({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [erro, setErro] = useState("");
  const handle = () => { if (user===ADMIN_USER&&pass===ADMIN_PASS) onLogin(); else setErro("Usuário ou senha incorretos."); };
  return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:BG }}>
      <div style={{ width:340 }}>
        <div style={{ textAlign:"center",marginBottom:28 }}>
          <div style={{ fontSize:26,fontWeight:900,color:Y,letterSpacing:".02em",marginBottom:4 }}>SFO</div>
          <div style={{ fontSize:11,color:"#444",textTransform:"uppercase",letterSpacing:".1em" }}>Acesso restrito · Painel da agência</div>
        </div>
        <div style={css.card}>
          <div style={{ marginBottom:14 }}>
            <label style={css.label}>Usuário</label>
            <input style={css.input} type="text" value={user} onChange={e=>{setUser(e.target.value);setErro("");}} onKeyDown={e=>e.key==="Enter"&&handle()} />
          </div>
          <div style={{ marginBottom:18 }}>
            <label style={css.label}>Senha</label>
            <input style={css.input} type="password" value={pass} onChange={e=>{setPass(e.target.value);setErro("");}} onKeyDown={e=>e.key==="Enter"&&handle()} />
          </div>
          {erro && <div style={{ ...css.errBox,marginBottom:14 }}>{erro}</div>}
          <button style={{ ...css.btn,width:"100%" }} onClick={handle}>Entrar</button>
        </div>
      </div>
    </div>
  );
}

// ── LOADING OVERLAY ───────────────────────────────────────────────────────────
function LoadingOverlay({ progress, step }) {
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ width:480,background:DK,border:"1px solid #2a2a2a",borderRadius:10,padding:"32px 36px" }}>
        <div style={{ fontSize:10,fontWeight:700,color:Y,textTransform:"uppercase",letterSpacing:".1em",marginBottom:16 }}>Gerando benchmarking</div>
        <div style={{ fontSize:14,fontWeight:700,marginBottom:20,color:"#fff",minHeight:22 }}>{step}</div>
        <div style={{ background:"#111",borderRadius:99,height:6,overflow:"hidden",marginBottom:10 }}>
          <div style={{ background:Y,height:"100%",width:progress+"%",borderRadius:99,transition:"width .6s ease" }} />
        </div>
        <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:"#555" }}>
          <span>Análise em andamento</span>
          <span style={{ color:Y,fontWeight:700 }}>{Math.round(progress)}%</span>
        </div>
        <div style={{ marginTop:20,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6 }}>
          {LOADING_STEPS.map((s,i) => {
            const done    = (i/LOADING_STEPS.length)*100 < progress;
            const current = Math.floor((progress/100)*LOADING_STEPS.length)===i;
            return (
              <div key={i} style={{ display:"flex",alignItems:"center",gap:5,fontSize:10,color:done?"#4ade80":current?Y:"#333" }}>
                <div style={{ width:6,height:6,borderRadius:"50%",background:done?"#4ade80":current?Y:"#2a2a2a",flexShrink:0 }} />
                <span style={{ lineHeight:1.3 }}>{s}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── RELATÓRIO ─────────────────────────────────────────────────────────────────
function RelatorioView({ client, onBack, onUpdate }) {
  const reportRef = useRef(null);
  const r = client.report;

  const handlePDF = () => {
    const style = document.createElement("style");
    style.innerHTML = `@media print { body { background: #0D0D0D !important; color: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } .no-print { display: none !important; } }`;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => document.head.removeChild(style), 1000);
  };

  if (!r) return <div style={css.body}><div style={css.card}>Nenhum relatório disponível.</div></div>;

  const Badge = ({ val }) => {
    const pos = val==="sim"; const neg = val==="não";
    return <span style={{ background:pos?"#052e16":neg?"#1c0a0a":"#111",color:pos?"#4ade80":neg?"#f87171":"#666",border:"1px solid "+(pos?"#166534":neg?"#7f1d1d":"#2a2a2a"),fontSize:9,padding:"1px 6px",borderRadius:3,fontWeight:700 }}>{val||"—"}</span>;
  };

  return (
    <div style={css.body}>
      <div className="no-print" style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18 }}>
        <button style={css.btnSm} onClick={onBack}>Voltar ao painel</button>
        <div style={{ display:"flex",gap:8 }}>
          <button style={{ ...css.btn,fontSize:11,padding:"7px 16px" }} onClick={onUpdate}>Atualizar relatório</button>
          <button style={{ ...css.btnSm,borderColor:"#3d2f00",color:Y }} onClick={handlePDF}>Baixar PDF</button>
        </div>
      </div>

      <div ref={reportRef}>
        <div style={{ ...css.card,borderColor:"#2a2000",background:"#0d0d00",marginBottom:14 }}>
          <div style={{ fontSize:10,fontWeight:700,color:Y,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8 }}>Benchmarking de Posicionamento · SFO · 2026</div>
          <div style={{ fontSize:20,fontWeight:900,marginBottom:4 }}>{client.data.nome}</div>
          <div style={{ fontSize:12,color:"#555",marginBottom:14 }}>{client.data.nicho_desc} · {client.data.capacidade} · Gerado em {client.updatedAt||client.createdAt}</div>
          <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
            {[["Nicho",r.posicionamento?.nicho],["Subnicho",r.posicionamento?.subnicho],["Micronicho",r.posicionamento?.micronicho]].map(([l,v])=>(
              <div key={l} style={{ background:"#111",border:"1px solid #2a2a2a",borderRadius:5,padding:"7px 12px" }}>
                <div style={{ fontSize:9,color:"#444",textTransform:"uppercase",letterSpacing:".05em" }}>{l}</div>
                <div style={{ fontSize:12,fontWeight:700,marginTop:2 }}>{v||"—"}</div>
              </div>
            ))}
          </div>
        </div>

        {r.posicionamento && (
          <div style={css.card}>
            <span style={css.tag}>Posicionamento</span>
            <div style={{ fontSize:15,fontWeight:800,marginBottom:10 }}>Análise de autoridade atual</div>
            {(r.posicionamento.porcques||[]).map((p,i)=>(
              <div key={i} style={{ display:"flex",gap:8,marginBottom:6,fontSize:12 }}>
                <span style={{ color:Y,fontWeight:700,flexShrink:0 }}>{i+1}.</span>
                <span style={{ color:"#ccc" }}>{p}</span>
              </div>
            ))}
            {r.posicionamento.diagnostico&&<div style={css.ins}><strong>Diagnóstico:</strong> {r.posicionamento.diagnostico}</div>}
          </div>
        )}

        {r.ranking_nicho?.length>0&&(
          <div style={css.card}>
            <span style={css.tag}>Ranking · Nicho</span>
            <div style={{ fontSize:15,fontWeight:800,marginBottom:10 }}>Top 5 — Concorrentes diretos</div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%",borderCollapse:"separate",borderSpacing:"0 4px",fontSize:11 }}>
                <thead>
                  <tr style={{ color:"#444",fontSize:9,textTransform:"uppercase",letterSpacing:".04em" }}>
                    {["#","Marca","Instagram","TikTok","Embaixador","CEO","Google Ads","Anúncios","Rede forte"].map(h=>(
                      <th key={h} style={{ padding:"0 8px 4px",textAlign:h==="#"||h==="Marca"?"left":"center",fontWeight:500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {r.ranking_nicho.map((c,i)=>(
                    <tr key={i}>
                      <td style={{ background:DK,border:"1px solid #222",borderRight:"none",borderRadius:"5px 0 0 5px",padding:"8px",fontWeight:800,color:i===0?Y:i===1?"#888":i===2?"#a16207":"#555" }}>{c.posicao}º</td>
                      <td style={{ background:DK,border:"1px solid #222",borderLeft:"none",borderRight:"none",padding:"8px" }}><div style={{ fontWeight:700 }}>{c.nome}</div><div style={{ color:"#444",fontSize:10 }}>{c.handle}</div></td>
                      <td style={{ background:DK,border:"1px solid #222",borderLeft:"none",borderRight:"none",padding:"8px",textAlign:"center" }}>{c.instagram}</td>
                      <td style={{ background:DK,border:"1px solid #222",borderLeft:"none",borderRight:"none",padding:"8px",textAlign:"center" }}>{c.tiktok}</td>
                      <td style={{ background:DK,border:"1px solid #222",borderLeft:"none",borderRight:"none",padding:"8px",textAlign:"center" }}><Badge val={c.embaixador} /></td>
                      <td style={{ background:DK,border:"1px solid #222",borderLeft:"none",borderRight:"none",padding:"8px",textAlign:"center" }}><Badge val={c.ceo_visivel} /></td>
                      <td style={{ background:DK,border:"1px solid #222",borderLeft:"none",borderRight:"none",padding:"8px",textAlign:"center" }}><Badge val={c.google_ads} /></td>
                      <td style={{ background:DK,border:"1px solid #222",borderLeft:"none",borderRight:"none",padding:"8px",textAlign:"center" }}><Badge val={c.anuncios} /></td>
                      <td style={{ background:DK,border:"1px solid #222",borderLeft:"none",borderRadius:"0 5px 5px 0",padding:"8px",textAlign:"center",color:"#888" }}>{c.rede_forte}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {r.analise_detalhada?.map((comp,idx)=>(
          <div key={idx} style={css.card}>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12,paddingBottom:10,borderBottom:"1px solid #1f1f1f" }}>
              <div style={{ width:24,height:24,borderRadius:"50%",background:Y,color:"#000",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:11,flexShrink:0 }}>{idx+1}</div>
              <div>
                <div style={{ fontSize:14,fontWeight:800 }}>{comp.nome}</div>
                <div style={{ fontSize:10,color:"#555" }}>{comp.handle} · {comp.site}</div>
              </div>
            </div>
            {comp.estrategia_principal&&<div style={{ ...css.ins,marginBottom:10 }}><strong>Estratégia principal:</strong> {comp.estrategia_principal}</div>}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:8 }}>
              {[
                ["Redes Sociais",Object.entries(comp.redes||{}).map(([k,v])=>[k,v])],
                ["CEO Visível",comp.ceo?[["Tem",comp.ceo.tem?"sim":"não"],["Nome",comp.ceo.nome],["Perfil",comp.ceo.perfil_pessoal],["Seguidores",comp.ceo.seguidores],["Exclusivo",comp.ceo.exclusivo?"sim":"não"]]:null],
                ["Embaixadores",comp.embaixadores?[["Programa",comp.embaixadores.tem_programa?"sim":"não"],["Tipo",comp.embaixadores.tipo],["Exclusivo",comp.embaixadores.exclusivo?"sim":"não"]]:null],
                ["Ads & CRM",[["TikTok Ads",comp.tiktok_ads],["TikTok Shop",comp.tiktok_shop],["Google Ads",comp.google_ads],["E-mail",comp.email_marketing],["WhatsApp",comp.whatsapp_vendas],["CRM",comp.crm]]],
              ].map(([title,rows])=>(
                <div key={title} style={{ background:"#111",border:"1px solid #1f1f1f",borderRadius:6,padding:10 }}>
                  <div style={{ fontSize:9,fontWeight:700,color:Y,textTransform:"uppercase",letterSpacing:".06em",marginBottom:6 }}>{title}</div>
                  {rows?rows.map(([l,v])=>(
                    <div key={l} style={{ display:"flex",justifyContent:"space-between",fontSize:10,padding:"2px 0",borderBottom:"1px solid #1a1a1a" }}>
                      <span style={{ color:"#555",textTransform:"capitalize" }}>{l}</span>
                      <span style={{ fontWeight:600,color:"#ccc" }}>{v||"—"}</span>
                    </div>
                  )):<div style={{ fontSize:10,color:"#333" }}>Não identificado</div>}
                </div>
              ))}
            </div>
            {comp.funil&&(
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:8 }}>
                {[["Topo de funil",comp.funil.topo],["Meio de funil",comp.funil.meio],["Fundo de funil",comp.funil.fundo]].map(([l,v])=>(
                  <div key={l} style={{ background:"#111",border:"1px solid #1f1f1f",borderRadius:6,padding:10 }}>
                    <div style={{ fontSize:9,fontWeight:700,color:Y,textTransform:"uppercase",letterSpacing:".06em",marginBottom:5 }}>{l}</div>
                    <div style={{ fontSize:11,color:"#aaa",lineHeight:1.5 }}>{v}</div>
                  </div>
                ))}
              </div>
            )}
            {comp.insight&&<div style={css.ins}><strong>Insight SFO:</strong> {comp.insight}</div>}
          </div>
        ))}

        {r.oportunidades?.length>0&&(
          <div style={css.card}>
            <span style={css.tag}>Diagnóstico</span>
            <div style={{ fontSize:15,fontWeight:800,marginBottom:10 }}>Oportunidades identificadas</div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
              {r.oportunidades.map((o,i)=>(
                <div key={i} style={{ background:"#111",border:"1px solid #1f1f1f",borderRadius:6,padding:14 }}>
                  <div style={{ fontWeight:700,fontSize:12,marginBottom:5,color:Y }}>{o.titulo}</div>
                  <div style={{ fontSize:11,color:"#888",lineHeight:1.6 }}>{o.descricao}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {r.plano_acao&&(
          <div style={css.card}>
            <span style={css.tag}>Plano de Ação</span>
            <div style={{ fontSize:15,fontWeight:800,marginBottom:10 }}>Estratégia de crescimento</div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10 }}>
              {[["Curto Prazo · 1 mês",r.plano_acao.curto_prazo],["Médio Prazo · 3–6 meses",r.plano_acao.medio_prazo],["Longo Prazo · 12+ meses",r.plano_acao.longo_prazo]].map(([l,items])=>(
                <div key={l} style={{ background:"#111",border:"1px solid #1f1f1f",borderRadius:6,padding:14 }}>
                  <div style={{ fontSize:9,fontWeight:700,color:Y,textTransform:"uppercase",letterSpacing:".06em",marginBottom:10 }}>{l}</div>
                  {(items||[]).map((item,i)=>(
                    <div key={i} style={{ display:"flex",gap:6,marginBottom:6,fontSize:11,color:"#aaa" }}>
                      <span style={{ color:Y,flexShrink:0,marginTop:1 }}>—</span>{item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {r.metricas?.length>0&&(
          <div style={css.card}>
            <span style={css.tag}>Mensuração</span>
            <div style={{ fontSize:15,fontWeight:800,marginBottom:10 }}>Indicadores de crescimento</div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9 }}>
              {r.metricas.map((m,i)=>(
                <div key={i} style={{ background:"#111",border:"1px solid #1f1f1f",borderRadius:6,padding:12 }}>
                  <div style={{ fontWeight:700,fontSize:11,marginBottom:2 }}>{m.nome}</div>
                  <div style={{ color:Y,fontWeight:700,fontSize:11,marginBottom:4 }}>{m.meta}</div>
                  <div style={{ fontSize:10,color:"#444",lineHeight:1.5 }}>{m.descricao}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ textAlign:"center",padding:"16px 0 4px",fontSize:10,color:"#222" }}>
          Agência SFO · Benchmarking de Posicionamento · {client.data.nome} · {client.updatedAt||client.createdAt}
        </div>
      </div>
    </div>
  );
}

// ── APP PAINEL ────────────────────────────────────────────────────────────────
export default function Painel() {
  const [authed,       setAuthed]       = useState(false);
  const [clients,      setClients]      = useState([]);
  const [view,         setView]         = useState("lista");
  const [selected,     setSelected]     = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress,  setGenProgress]  = useState(0);
  const [genStep,      setGenStep]      = useState("");

  useEffect(() => {
    const auth = sessionStorage.getItem("sfo_auth");
    if (auth === "1") setAuthed(true);
    const saved = JSON.parse(localStorage.getItem("sfo_clients") || "[]");
    setClients(saved);
  }, []);

  const handleLogin = () => { setAuthed(true); sessionStorage.setItem("sfo_auth","1"); };
  const handleLogout = () => { setAuthed(false); sessionStorage.removeItem("sfo_auth"); };

  const handleGenerate = async (client) => {
    setIsGenerating(true);
    setGenProgress(5);
    setGenStep(LOADING_STEPS[0]);

    let p = 5;
    const interval = setInterval(() => {
      p = Math.min(p + (Math.random()*4+1), 88);
      const idx = Math.min(Math.floor((p/100)*LOADING_STEPS.length), LOADING_STEPS.length-1);
      setGenProgress(p);
      setGenStep(LOADING_STEPS[idx]);
    }, 900);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientData: client.data, nicho: client.nicho }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao gerar");

      clearInterval(interval);
      setGenProgress(100);
      setGenStep("Relatório concluído!");
      await new Promise(r => setTimeout(r, 800));

      const updated = clients.map(c => c.id === client.id
        ? { ...c, status:"pronto", report: json.report, updatedAt: new Date().toLocaleString("pt-BR") }
        : c
      );
      setClients(updated);
      localStorage.setItem("sfo_clients", JSON.stringify(updated));
      if (selected?.id === client.id) setSelected(updated.find(c => c.id === client.id));
    } catch (err) {
      clearInterval(interval);
      alert("Erro ao gerar: " + err.message);
    } finally {
      setIsGenerating(false);
      setGenProgress(0);
      setGenStep("");
    }
  };

  const handleDelete = (id) => {
    const updated = clients.filter(c => c.id !== id);
    setClients(updated);
    localStorage.setItem("sfo_clients", JSON.stringify(updated));
    if (selected?.id === id) { setSelected(null); setView("lista"); }
  };

  if (!authed) return <LoginView onLogin={handleLogin} />;

  return (
    <div style={css.wrap}>
      <Head><title>SFO — Painel da Agência</title></Head>
      {isGenerating && <LoadingOverlay progress={genProgress} step={genStep} />}

      <div style={css.nav}>
        <span style={css.logo}>SFO</span>
        <div style={{ display:"flex",gap:8,alignItems:"center" }}>
          <a href="/" style={{ ...css.btnSm,textDecoration:"none",display:"inline-block" }}>Formulário</a>
          <button style={css.btnSm} onClick={handleLogout}>Sair</button>
        </div>
      </div>

      {view === "lista" && (
        <div style={css.body}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20 }}>
            <div>
              <span style={css.tag}>Painel da Agência</span>
              <div style={{ fontSize:17,fontWeight:800,marginTop:2 }}>Clientes <span style={{ color:Y }}>cadastrados</span></div>
            </div>
          </div>
          {clients.length === 0 ? (
            <div style={{ ...css.card,textAlign:"center",padding:"40px 20px" }}>
              <div style={{ fontSize:13,fontWeight:600,color:"#444",marginBottom:6 }}>Nenhum briefing cadastrado</div>
              <div style={{ fontSize:12,color:"#333" }}>Compartilhe o formulário com seus clientes para começar.</div>
            </div>
          ) : clients.map(c => (
            <div key={c.id} style={{ ...css.card,display:"flex",alignItems:"center",gap:14 }}>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap" }}>
                  <span style={{ fontWeight:700,fontSize:14 }}>{c.data.nome||"Sem nome"}</span>
                  <span style={css.statusBadge(c.status)}>
                    {c.status==="pronto"?"Relatório pronto":c.status==="gerando"?"Gerando...":"Aguardando geração"}
                  </span>
                </div>
                <div style={{ fontSize:11,color:"#555" }}>
                  {nichosOpcoes.find(n=>n.value===c.nicho)?.label} &nbsp;&middot;&nbsp;
                  {c.data.nicho_desc} &nbsp;&middot;&nbsp;
                  {c.data.capacidade} &nbsp;&middot;&nbsp;
                  <span style={{ color:"#3a3a3a" }}>{c.createdAt}</span>
                </div>
              </div>
              <div style={{ display:"flex",gap:6,flexShrink:0 }}>
                {c.status==="pronto" && <button style={css.btnSm} onClick={()=>{setSelected(c);setView("relatorio");}}>Ver relatório</button>}
                <button style={{ ...css.btn,fontSize:11,padding:"6px 14px" }} onClick={()=>handleGenerate(c)}>
                  {c.status==="pronto"?"Atualizar":"Gerar"}
                </button>
                <button style={css.btnDanger} onClick={()=>handleDelete(c.id)}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "relatorio" && selected && (
        <RelatorioView
          client={clients.find(c=>c.id===selected.id)||selected}
          onBack={()=>setView("lista")}
          onUpdate={()=>handleGenerate(clients.find(c=>c.id===selected.id)||selected)}
        />
      )}
    </div>
  );
}
