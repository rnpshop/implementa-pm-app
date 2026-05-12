// @ts-nocheck
import { useState, useEffect, useCallback } from "react";

const SUPABASE_URL = "https://duorzwckifuyxlyioqma.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1b3J6d2NraWZ1eXhseWlvcW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NTQ3MTgsImV4cCI6MjA5NDEzMDcxOH0.AyMdUciCs6m9pyB64HlBRRss-w2YL_n5nPTdV_1W-q4";
const H = { apikey:SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}`, "Content-Type":"application/json", Prefer:"return=representation" };

const api = {
  get: async (t,p="") => { const r=await fetch(`${SUPABASE_URL}/rest/v1/${t}?${p}`,{headers:H}); return r.json(); },
  post: async (t,b) => { const r=await fetch(`${SUPABASE_URL}/rest/v1/${t}`,{method:"POST",headers:H,body:JSON.stringify(b)}); return r.json(); },
  patch: async (t,m,b) => { const q=Object.entries(m).map(([k,v])=>`${k}=eq.${v}`).join("&"); const r=await fetch(`${SUPABASE_URL}/rest/v1/${t}?${q}`,{method:"PATCH",headers:H,body:JSON.stringify(b)}); return r.json(); },
};

const auth = {
  signUp: async (email,password,name) => {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/signup`, { method:"POST", headers:{ apikey:SUPABASE_KEY, "Content-Type":"application/json" }, body:JSON.stringify({ email, password, data:{ name } }) });
    return r.json();
  },
  signIn: async (email,password) => {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, { method:"POST", headers:{ apikey:SUPABASE_KEY, "Content-Type":"application/json" }, body:JSON.stringify({ email, password }) });
    return r.json();
  },
  signInGoogle: () => {
    window.location.href = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${window.location.origin}`;
  },
  signOut: async (token) => {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, { method:"POST", headers:{ apikey:SUPABASE_KEY, Authorization:`Bearer ${token}` } });
  },
  getUser: async (token) => {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers:{ apikey:SUPABASE_KEY, Authorization:`Bearer ${token}` } });
    return r.json();
  }
};

const C={bg:"#0A0D12",surface:"#111520",card:"#161B27",border:"#1E2535",accent:"#00E5A0",accentDim:"#00E5A015",accentBorder:"#00E5A030",warn:"#F59E0B",danger:"#EF4444",purple:"#A78BFA",text:"#E8EDF5",muted:"#6B7A99",subtle:"#2A3248"};
const FONT="'DM Mono','Courier New',monospace";
const FONT_D="'Syne','Arial Black',sans-serif";
const PHASES=["Kickoff","Design","Desenvolvimento","QA","Homologação","Go-live"];
const STATUS={"on-track":{label:"No prazo",color:C.accent,bg:"#00E5A015"},"at-risk":{label:"Em risco",color:C.warn,bg:"#F59E0B15"},"delayed":{label:"Atrasado",color:C.danger,bg:"#EF444415"},"done":{label:"Concluído",color:C.purple,bg:"#A78BFA15"}};
const PTYPES=[{id:"logo",label:"Logotipo / marca",icon:"🎨"},{id:"content",label:"Conteúdo (textos)",icon:"📝"},{id:"photos",label:"Fotos dos produtos",icon:"📷"},{id:"access",label:"Acesso a sistemas",icon:"🔑"},{id:"approval",label:"Aprovação de layout",icon:"✅"},{id:"payment",label:"Pagamento de etapa",icon:"💳"},{id:"briefing",label:"Briefing incompleto",icon:"📋"},{id:"domain",label:"Configuração de domínio",icon:"🌐"},{id:"products",label:"Cadastro de produtos",icon:"🛒"},{id:"feedback",label:"Feedback em aberto",icon:"💬"},{id:"other",label:"Outro",icon:"⚠️"}];
const URGENCY=[{id:"low",label:"Baixa",color:C.accent},{id:"medium",label:"Média",color:C.warn},{id:"high",label:"Alta",color:C.danger}];
const CHANNELS=[{id:"email",label:"E-mail",icon:"📧"},{id:"whatsapp",label:"WhatsApp",icon:"💬"},{id:"both",label:"Ambos",icon:"📡"}];

const inp={background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontFamily:FONT,fontSize:13,padding:"10px 14px",outline:"none",width:"100%",boxSizing:"border-box"};
const btnP={background:C.accent,color:"#000",border:"none",borderRadius:8,fontFamily:FONT_D,fontWeight:700,fontSize:13,padding:"10px 20px",cursor:"pointer"};
const btnG={background:"transparent",border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,fontFamily:FONT,fontSize:13,padding:"10px 20px",cursor:"pointer"};
const btnW={background:C.warn+"20",border:`1px solid ${C.warn}40`,borderRadius:8,color:C.warn,fontFamily:FONT,fontSize:11,padding:"7px 12px",cursor:"pointer"};
const btnA={background:C.accentDim,border:`1px solid ${C.accentBorder}`,borderRadius:8,color:C.accent,fontFamily:FONT,fontSize:11,padding:"7px 12px",cursor:"pointer"};

const Badge=({status})=>{ const s=STATUS[status]||STATUS["on-track"]; return <span style={{background:s.bg,color:s.color,border:`1px solid ${s.color}30`,borderRadius:4,padding:"2px 10px",fontSize:11,fontFamily:FONT,fontWeight:600}}>{s.label}</span>; };
const PhaseBar=({phase})=>(<div style={{display:"flex",gap:3}}>{PHASES.map((_,i)=><div key={i} style={{height:4,flex:1,borderRadius:2,background:i<phase?C.accent:i===phase?C.warn:C.border}}/>)}</div>);
const Ring=({value=0,size=50,stroke=4})=>{ const r=(size-stroke)/2,circ=2*Math.PI*r,offset=circ-(value/100)*circ; const color=value===100?C.purple:value>60?C.accent:value>30?C.warn:C.danger; return(<svg width={size} height={size} style={{transform:"rotate(-90deg)",flexShrink:0}}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={stroke}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"/><text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill={color} fontSize={11} fontFamily={FONT} fontWeight="700" style={{transform:"rotate(90deg)",transformOrigin:"center"}}>{value}%</text></svg>); };
const Spinner=({small=false})=>(<div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:small?4:60}}><div style={{width:small?16:32,height:small?16:32,border:`${small?2:3}px solid ${C.border}`,borderTop:`${small?2:3}px solid ${C.accent}`,borderRadius:"50%",animation:"spin .8s linear infinite"}}/></div>);
const StatCard=({label,value,color,icon})=>(<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"18px 20px",display:"flex",alignItems:"center",gap:14,flex:1,minWidth:120}}><span style={{fontSize:24}}>{icon}</span><div><div style={{color:C.muted,fontSize:10,fontFamily:FONT,letterSpacing:"0.1em",textTransform:"uppercase"}}>{label}</div><div style={{color:color||C.text,fontSize:26,fontFamily:FONT_D,fontWeight:800,lineHeight:1.1}}>{value}</div></div></div>);

// ── LOGIN SCREEN ─────────────────────────────────────────────
const LoginScreen = ({ onLogin }) => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      let data;
      if (mode === "login") {
        data = await auth.signIn(email, password);
      } else {
        data = await auth.signUp(email, password, name);
      }
      if (data.access_token) {
        localStorage.setItem("sb_token", data.access_token);
        localStorage.setItem("sb_user", JSON.stringify(data.user));
        onLogin(data.access_token, data.user);
      } else {
        setError(data.error_description || data.msg || "Erro ao autenticar");
      }
    } catch(e) { setError("Erro de conexão"); }
    setLoading(false);
  };

  return (
    <div style={{background:C.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONT}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap'); *{box-sizing:border-box} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:40,width:420,maxWidth:"90vw"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontFamily:FONT_D,fontWeight:800,fontSize:24,color:C.accent}}>IMPLEMENTA</div>
          <div style={{color:C.muted,fontSize:11,letterSpacing:"0.15em"}}>ECOMMERCE PM</div>
        </div>

        <div style={{display:"flex",gap:0,marginBottom:24,background:C.surface,borderRadius:10,padding:4}}>
          {[["login","Entrar"],["signup","Cadastrar"]].map(([m,l])=>(
            <button key={m} onClick={()=>setMode(m)} style={{flex:1,background:mode===m?C.card:"transparent",border:`1px solid ${mode===m?C.border:"transparent"}`,borderRadius:8,color:mode===m?C.text:C.muted,fontFamily:FONT,fontSize:13,padding:"8px",cursor:"pointer"}}>{l}</button>
          ))}
        </div>

        {error && <div style={{background:C.danger+"15",border:`1px solid ${C.danger}40`,borderRadius:8,padding:"10px 14px",color:C.danger,fontSize:12,marginBottom:16}}>{error}</div>}

        {mode==="signup" && (
          <div style={{marginBottom:12}}>
            <label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>NOME COMPLETO</label>
            <input style={inp} placeholder="Seu nome" value={name} onChange={e=>setName(e.target.value)}/>
          </div>
        )}
        <div style={{marginBottom:12}}>
          <label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>E-MAIL</label>
          <input style={inp} type="email" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
        </div>
        <div style={{marginBottom:20}}>
          <label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>SENHA</label>
          <input style={inp} type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{...btnP,width:"100%",marginBottom:12,opacity:loading?0.6:1}}>
          {loading?<Spinner small/>:mode==="login"?"Entrar":"Criar conta"}
        </button>

        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <div style={{flex:1,height:1,background:C.border}}/>
          <span style={{color:C.muted,fontSize:11}}>ou</span>
          <div style={{flex:1,height:1,background:C.border}}/>
        </div>

        <button onClick={auth.signInGoogle} style={{...btnG,width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Entrar com Google
        </button>
      </div>
    </div>
  );
};

// ── MAIN APP ─────────────────────────────────────────────────
export default function App() {
  const [token, setToken] = useState(localStorage.getItem("sb_token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("sb_user")||"null"));
  const [projects,setProjects]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);
  const [view,setView]=useState("dashboard");
  const [sel,setSel]=useState(null);
  const [tab,setTab]=useState("tasks");
  const [tasks,setTasks]=useState([]);
  const [pendings,setPendings]=useState([]);
  const [messages,setMessages]=useState([]);
  const [pulse,setPulse]=useState(false);
  const [saving,setSaving]=useState(false);
  const [newMsg,setNewMsg]=useState("");
  const [newTask,setNewTask]=useState("");
  const [assignee,setAssignee]=useState("Ana");
  const [filterSt,setFilterSt]=useState("all");
  const [showNP,setShowNP]=useState(false);
  const [newProj,setNewProj]=useState({name:"",client:"",deadline:""});
  const [showPend,setShowPend]=useState(false);
  const [pendForm,setPendForm]=useState({type:"photos",note:"",urgency:"medium",channel:"email",days_blocking:1});
  const [pendStep,setPendStep]=useState(1);
  const [renotify,setRenotify]=useState(null);

  useEffect(()=>{ const t=setInterval(()=>setPulse(p=>!p),2000); return ()=>clearInterval(t); },[]);

  const handleLogin = (t, u) => { setToken(t); setUser(u); };

  const handleLogout = async () => {
    await auth.signOut(token);
    localStorage.removeItem("sb_token");
    localStorage.removeItem("sb_user");
    setToken(null); setUser(null);
  };

  // Verificar token na URL (retorno do Google)
  useEffect(()=>{
    const hash = window.location.hash;
    if(hash && hash.includes("access_token")) {
      const params = new URLSearchParams(hash.substring(1));
      const t = params.get("access_token");
      if(t) {
        auth.getUser(t).then(u => {
          localStorage.setItem("sb_token", t);
          localStorage.setItem("sb_user", JSON.stringify(u));
          setToken(t); setUser(u);
          window.history.replaceState(null,"",window.location.pathname);
        });
      }
    }
  },[]);

  const loadProjects = useCallback(async()=>{
    setLoading(true); setError(null);
    try {
      const projs = await api.get("projects","order=created_at.desc");
      const enriched = await Promise.all((projs||[]).map(async(p)=>{
        const [tks,pnds,msgs] = await Promise.all([
          api.get("tasks",`project_id=eq.${p.id}&order=created_at.asc`),
          api.get("pendings",`project_id=eq.${p.id}&order=sent_at.desc`),
          api.get("messages",`project_id=eq.${p.id}&order=created_at.asc`),
        ]);
        const progress=tks.length>0?Math.round((tks.filter(t=>t.done).length/tks.length)*100):0;
        const daysLeft=p.deadline?Math.ceil((new Date(p.deadline)-new Date())/86400000):null;
        return{...p,tasks:tks,pendings:pnds,messages:msgs,progress,daysLeft};
      }));
      setProjects(enriched);
    } catch(e){ setError(e.message); }
    setLoading(false);
  },[]);

  useEffect(()=>{ if(token) loadProjects(); },[token,loadProjects]);

  if(!token) return <LoginScreen onLogin={handleLogin}/>;

  const refreshSel=async(id)=>{
    const [tks,pnds,msgs]=await Promise.all([
      api.get("tasks",`project_id=eq.${id}&order=created_at.asc`),
      api.get("pendings",`project_id=eq.${id}&order=sent_at.desc`),
      api.get("messages",`project_id=eq.${id}&order=created_at.asc`),
    ]);
    const progress=tks.length>0?Math.round((tks.filter(t=>t.done).length/tks.length)*100):0;
    setTasks(tks);setPendings(pnds);setMessages(msgs);
    setSel(prev=>({...prev,tasks:tks,pendings:pnds,messages:msgs,progress}));
    setProjects(prev=>prev.map(p=>p.id===id?{...p,tasks:tks,pendings:pnds,messages:msgs,progress}:p));
  };

  const openProject=(proj)=>{ setSel(proj);setTab("tasks");setTasks(proj.tasks||[]);setPendings(proj.pendings||[]);setMessages(proj.messages||[]); };

  const createProject=async()=>{
    if(!newProj.name||!newProj.client) return;
    setSaving(true);
    try{ await api.post("projects",{name:newProj.name,client:newProj.client,phase:0,status:"on-track",progress:0,deadline:newProj.deadline||null}); setShowNP(false);setNewProj({name:"",client:"",deadline:""}); await loadProjects(); }catch(e){alert("Erro: "+e.message);}
    setSaving(false);
  };

  const addTask=async()=>{
    if(!newTask.trim()||!sel) return; setSaving(true);
    try{ await api.post("tasks",{project_id:sel.id,title:newTask,assignee,done:false,phase:sel.phase||0}); setNewTask(""); await refreshSel(sel.id); }catch(e){alert("Erro: "+e.message);}
    setSaving(false);
  };

  const toggleTask=async(task)=>{ try{ await api.patch("tasks",{id:task.id},{done:!task.done}); await refreshSel(sel.id); }catch(e){alert("Erro: "+e.message);} };
  const sendMessage=async()=>{ if(!newMsg.trim()||!sel) return; try{ await api.post("messages",{project_id:sel.id,from_role:"team",text:newMsg}); setNewMsg(""); await refreshSel(sel.id); }catch(e){alert("Erro: "+e.message);} };

  const savePending=async()=>{
    if(!sel) return; setSaving(true);
    try{
      if(renotify){ await api.patch("pendings",{id:renotify.id},{...pendForm,sent_at:new Date().toISOString()}); }
      else{ await api.post("pendings",{project_id:sel.id,...pendForm,status:"open",sent_at:new Date().toISOString()}); }
      await refreshSel(sel.id); setPendStep(3);
    }catch(e){alert("Erro: "+e.message);}
    setSaving(false);
  };

  const resolvePending=async(id)=>{ try{ await api.patch("pendings",{id},{status:"resolved"}); await refreshSel(sel.id); }catch(e){alert("Erro: "+e.message);} };
  const advancePhase=async()=>{ if(!sel||sel.phase>=PHASES.length-1) return; const phase=sel.phase+1; try{ await api.patch("projects",{id:sel.id},{phase}); setSel(prev=>({...prev,phase})); setProjects(prev=>prev.map(p=>p.id===sel.id?{...p,phase}:p)); }catch(e){alert("Erro: "+e.message);} };
  const openPendModal=(existing=null)=>{ setRenotify(existing); setPendForm(existing?{type:existing.type,note:existing.note||"",urgency:existing.urgency,channel:existing.channel,days_blocking:existing.days_blocking||1}:{type:"photos",note:"",urgency:"medium",channel:"email",days_blocking:1}); setPendStep(1);setShowPend(true); };

  const totalPend=projects.reduce((a,p)=>a+(p.pendings||[]).filter(x=>x.status==="open").length,0);
  const stats={total:projects.length,onTrack:projects.filter(p=>p.status==="on-track").length,atRisk:projects.filter(p=>p.status==="at-risk").length,delayed:projects.filter(p=>p.status==="delayed").length};
  const filtered=filterSt==="all"?projects:projects.filter(p=>p.status===filterSt);
  const allOpenPendings=projects.flatMap(p=>(p.pendings||[]).filter(x=>x.status==="open").map(x=>({...x,project:p})));
  const navItems=[{id:"dashboard",label:"Dashboard",icon:"◈"},{id:"projects",label:"Projetos",icon:"⬡"},{id:"pendings",label:"Pendências",icon:"⚠",badge:totalPend,bc:C.warn},{id:"alerts",label:"Alertas",icon:"◉",badge:stats.delayed+stats.atRisk,bc:C.danger}];

  const PendModal=()=>{
    const pt=PTYPES.find(t=>t.id===pendForm.type);
    const urg=URGENCY.find(u=>u.id===pendForm.urgency);
    const emailPrev=`Assunto: [${sel?.name}] Ação necessária: ${pt?.label}\n\nOlá, equipe ${sel?.client}!\n\nO andamento do projeto depende de uma ação da sua parte.\n\n📌 Pendência: ${pt?.icon} ${pt?.label}${pendForm.note?`\n📝 Detalhe: ${pendForm.note}`:""}\n🚨 Urgência: ${urg?.label}\n⏳ Bloqueando há: ${pendForm.days_blocking} dia(s)\n\nEquipe Implementa Ecommerce`;
    const whatsPrev=`*[${sel?.name}]* — Pendência 🔔\n\nOlá! Precisamos da sua ajuda:\n\n*${pt?.icon} ${pt?.label}*${pendForm.note?`\n${pendForm.note}`:""}\n*Urgência:* ${urg?.label}\n*Bloqueando há:* ${pendForm.days_blocking}d\n\nEnvie assim que possível! 🙏`;
    return(
      <div style={{position:"fixed",inset:0,background:"#000C",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:28,width:560,maxWidth:"100%",maxHeight:"92vh",overflowY:"auto"}}>
          <div style={{display:"flex",gap:6,marginBottom:22,alignItems:"center"}}>
            {["Configurar","Prévia","Enviado"].map((s,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:22,height:22,borderRadius:"50%",background:pendStep>i+1?C.accent:pendStep===i+1?C.accentDim:C.subtle,border:`1px solid ${pendStep>=i+1?C.accent:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:pendStep>i+1?"#000":pendStep===i+1?C.accent:C.muted,fontWeight:700}}>{pendStep>i+1?"✓":i+1}</div>
                <span style={{fontSize:12,color:pendStep===i+1?C.text:C.muted,fontFamily:FONT}}>{s}</span>
                {i<2&&<div style={{width:18,height:1,background:C.border}}/>}
              </div>
            ))}
          </div>
          {pendStep===1&&<>
            <div style={{fontFamily:FONT_D,fontSize:18,fontWeight:800,marginBottom:18}}>{renotify?"Renotificar":"Registrar Pendência"}</div>
            <div style={{marginBottom:14}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:8}}>TIPO</label><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>{PTYPES.map(t=>(<button key={t.id} onClick={()=>setPendForm(f=>({...f,type:t.id}))} style={{background:pendForm.type===t.id?C.accentDim:C.surface,border:`1px solid ${pendForm.type===t.id?C.accent:C.border}`,borderRadius:8,color:pendForm.type===t.id?C.accent:C.muted,fontFamily:FONT,fontSize:12,padding:"8px 10px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:8}}>{t.icon} {t.label}</button>))}</div></div>
            <div style={{marginBottom:12}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>DETALHE</label><textarea style={{...inp,minHeight:64,resize:"vertical"}} placeholder="Descreva o que está faltando..." value={pendForm.note} onChange={e=>setPendForm(f=>({...f,note:e.target.value}))}/></div>
            <div style={{display:"flex",gap:12,marginBottom:12,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:130}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:8}}>URGÊNCIA</label><div style={{display:"flex",gap:6}}>{URGENCY.map(u=><button key={u.id} onClick={()=>setPendForm(f=>({...f,urgency:u.id}))} style={{flex:1,background:pendForm.urgency===u.id?u.color+"20":C.surface,border:`1px solid ${pendForm.urgency===u.id?u.color:C.border}`,borderRadius:6,color:pendForm.urgency===u.id?u.color:C.muted,fontFamily:FONT,fontSize:11,padding:"7px 2px",cursor:"pointer"}}>{u.label}</button>)}</div></div>
              <div style={{flex:1,minWidth:110}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:8}}>DIAS BLOQUEANDO</label><input type="number" style={inp} min={0} value={pendForm.days_blocking} onChange={e=>setPendForm(f=>({...f,days_blocking:parseInt(e.target.value)||0}))}/></div>
            </div>
            <div style={{marginBottom:20}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:8}}>CANAL</label><div style={{display:"flex",gap:8}}>{CHANNELS.map(c=><button key={c.id} onClick={()=>setPendForm(f=>({...f,channel:c.id}))} style={{flex:1,background:pendForm.channel===c.id?C.accentDim:C.surface,border:`1px solid ${pendForm.channel===c.id?C.accent:C.border}`,borderRadius:8,color:pendForm.channel===c.id?C.accent:C.muted,fontFamily:FONT,fontSize:13,padding:"10px",cursor:"pointer"}}>{c.icon} {c.label}</button>)}</div></div>
            <div style={{display:"flex",gap:10}}><button onClick={()=>setPendStep(2)} style={{...btnP,flex:1}}>Ver Prévia →</button><button onClick={()=>setShowPend(false)} style={btnG}>Cancelar</button></div>
          </>}
          {pendStep===2&&<>
            <div style={{fontFamily:FONT_D,fontSize:18,fontWeight:800,marginBottom:14}}>Prévia da Notificação</div>
            {(pendForm.channel==="email"||pendForm.channel==="both")&&<><div style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",marginBottom:6}}>📧 E-MAIL</div><pre style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",fontSize:12,fontFamily:FONT,color:C.text,whiteSpace:"pre-wrap",marginBottom:14,lineHeight:1.7}}>{emailPrev}</pre></>}
            {(pendForm.channel==="whatsapp"||pendForm.channel==="both")&&<><div style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",marginBottom:6}}>💬 WHATSAPP</div><pre style={{background:"#075E5414",border:"1px solid #075E5440",borderRadius:10,padding:"12px 14px",fontSize:12,fontFamily:FONT,color:C.text,whiteSpace:"pre-wrap",marginBottom:14,lineHeight:1.7}}>{whatsPrev}</pre></>}
            <div style={{display:"flex",gap:10}}><button onClick={savePending} disabled={saving} style={{...btnP,flex:1,opacity:saving?0.6:1}}>{saving?<Spinner small/>:"✓ Confirmar Envio"}</button><button onClick={()=>setPendStep(1)} style={btnG}>← Editar</button></div>
          </>}
          {pendStep===3&&(<div style={{textAlign:"center",padding:"20px 0"}}><div style={{fontSize:48,marginBottom:12}}>✅</div><div style={{fontFamily:FONT_D,fontSize:20,fontWeight:800,color:C.accent,marginBottom:8}}>Pendência Salva!</div><button onClick={()=>{setShowPend(false);setTab("pendings");}} style={{...btnP,padding:"12px 28px"}}>Ver Pendências</button></div>)}
        </div>
      </div>
    );
  };

  return(
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:FONT,color:C.text,display:"flex"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#111520}::-webkit-scrollbar-thumb{background:#1E2535;border-radius:4px}.ch{transition:border-color .2s,transform .2s;cursor:pointer}.ch:hover{border-color:#00E5A050!important;transform:translateY(-2px)}.nb{transition:all .2s}.nb:hover{background:#00E5A015!important;color:#00E5A0!important}textarea{font-family:${FONT};color:${C.text}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {showPend&&<PendModal/>}

      {showNP&&(<div style={{position:"fixed",inset:0,background:"#000A",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:32,width:420,maxWidth:"90vw"}}><div style={{fontFamily:FONT_D,fontSize:20,fontWeight:800,marginBottom:22}}>Novo Projeto</div>{[["Nome do projeto","name","Ex: Loja XYZ"],["Cliente","client","Ex: XYZ LTDA"]].map(([l,k,ph])=>(<div key={k} style={{marginBottom:12}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>{l.toUpperCase()}</label><input style={inp} placeholder={ph} value={newProj[k]} onChange={e=>setNewProj(p=>({...p,[k]:e.target.value}))}/></div>))}<div style={{marginBottom:20}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>DATA DE ENTREGA</label><input type="date" style={inp} value={newProj.deadline} onChange={e=>setNewProj(p=>({...p,deadline:e.target.value}))}/></div><div style={{display:"flex",gap:10}}><button onClick={createProject} disabled={saving} style={{...btnP,flex:1,opacity:saving?0.6:1}}>{saving?"Criando...":"Criar Projeto"}</button><button onClick={()=>setShowNP(false)} style={btnG}>Cancelar</button></div></div></div>)}

      {/* SIDEBAR */}
      <div style={{width:220,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",padding:"28px 0",minHeight:"100vh",position:"sticky",top:0}}>
        <div style={{padding:"0 24px 28px"}}>
          <div style={{fontFamily:FONT_D,fontWeight:800,fontSize:18,color:C.accent}}>IMPLEMENTA</div>
          <div style={{color:C.muted,fontSize:10,letterSpacing:"0.15em"}}>ECOMMERCE PM</div>
        </div>
        <nav style={{flex:1,padding:"0 12px",display:"flex",flexDirection:"column",gap:4}}>
          {navItems.map(n=>(<button key={n.id} className="nb" onClick={()=>{setView(n.id);setSel(null);}} style={{background:view===n.id?C.accentDim:"transparent",border:view===n.id?`1px solid ${C.accentBorder}`:"1px solid transparent",borderRadius:8,color:view===n.id?C.accent:C.muted,fontFamily:FONT,fontSize:13,padding:"10px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,textAlign:"left"}}><span style={{fontSize:16}}>{n.icon}</span>{n.label}{n.badge>0&&<span style={{marginLeft:"auto",background:n.bc,color:"#fff",borderRadius:20,fontSize:10,fontWeight:700,padding:"1px 7px"}}>{n.badge}</span>}</button>))}
        </nav>
        <div style={{padding:"20px 16px 0",borderTop:`1px solid ${C.border}`,marginTop:24}}>
          <button onClick={()=>setShowNP(true)} style={{...btnP,width:"100%",fontSize:12,marginBottom:8}}>+ Novo Projeto</button>
        </div>
        <div style={{padding:"12px 16px 0"}}>
          <div style={{color:C.muted,fontSize:10,marginBottom:8}}>
            <span style={{color:pulse?C.accent:C.muted,transition:"color .5s"}}>●</span> {projects.filter(p=>p.status!=="done").length} ativos · <span style={{color:C.accent}}>DB ✓</span>
          </div>
          <div style={{color:C.muted,fontSize:11,marginBottom:4}}>👤 {user?.email}</div>
          <button onClick={handleLogout} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:6,color:C.muted,fontFamily:FONT,fontSize:11,padding:"6px 12px",cursor:"pointer",width:"100%"}}>Sair</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{flex:1,overflow:"auto",padding:"36px 40px"}}>
        {error&&(<div style={{background:"#EF444415",border:"1px solid #EF444440",borderRadius:10,padding:"12px 16px",marginBottom:20,color:C.danger,fontSize:13}}>⚠ Erro: {error} — <button onClick={loadProjects} style={{background:"none",border:"none",color:C.accent,cursor:"pointer",fontFamily:FONT,fontSize:13}}>Tentar novamente</button></div>)}

        {sel?(
          <div>
            <button onClick={()=>setSel(null)} style={{background:"transparent",border:"none",color:C.muted,fontFamily:FONT,fontSize:13,cursor:"pointer",marginBottom:22,display:"flex",alignItems:"center",gap:6}}>← Voltar</button>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:12}}>
              <div><div style={{fontFamily:FONT_D,fontSize:26,fontWeight:800}}>{sel.name}</div><div style={{color:C.muted,fontSize:13,marginTop:4}}>{sel.client}{sel.deadline&&` · Entrega: ${new Date(sel.deadline).toLocaleDateString("pt-BR")}`}</div></div>
              <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                <Badge status={sel.status}/>
                {pendings.filter(x=>x.status==="open").length>0&&(<span style={{background:C.warn+"20",color:C.warn,border:`1px solid ${C.warn}40`,borderRadius:4,padding:"2px 10px",fontSize:11,fontFamily:FONT}}>⚠ {pendings.filter(x=>x.status==="open").length} pendência(s)</span>)}
                <Ring value={sel.progress||0} size={52}/>
                {(sel.phase||0)<PHASES.length-1&&(<button onClick={advancePhase} style={{...btnP,fontSize:11,padding:"8px 14px"}}>Avançar Fase →</button>)}
              </div>
            </div>
            <div style={{marginBottom:22}}><div style={{color:C.muted,fontSize:11,marginBottom:8,letterSpacing:"0.08em"}}>FASE: {PHASES[sel.phase||0].toUpperCase()}</div><PhaseBar phase={sel.phase||0}/></div>
            <div style={{display:"flex",marginBottom:22,borderBottom:`1px solid ${C.border}`}}>
              {[["tasks","Tarefas"],["pendings",`Pendências${pendings.filter(x=>x.status==="open").length>0?` (${pendings.filter(x=>x.status==="open").length})`:""}`],["messages","Comunicação"]].map(([id,label])=>(<button key={id} onClick={()=>setTab(id)} style={{background:"transparent",border:"none",borderBottom:tab===id?`2px solid ${id==="pendings"?C.warn:C.accent}`:"2px solid transparent",color:tab===id?(id==="pendings"?C.warn:C.accent):C.muted,fontFamily:FONT,fontSize:13,padding:"10px 20px",cursor:"pointer",marginBottom:-1}}>{label}</button>))}
            </div>

            {tab==="tasks"&&(<div><div style={{display:"flex",gap:10,marginBottom:16}}><input style={{...inp,flex:1}} placeholder="Nova tarefa..." value={newTask} onChange={e=>setNewTask(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTask()}/><select style={{...inp,width:130}} value={assignee} onChange={e=>setAssignee(e.target.value)}>{["Ana","Pedro","Lucas","Carla","Rafael","Juliana"].map(n=><option key={n}>{n}</option>)}</select><button onClick={addTask} disabled={saving} style={{...btnP,opacity:saving?0.6:1}}>+ Add</button></div>{tasks.length===0?<div style={{color:C.muted,textAlign:"center",padding:40,fontSize:13}}>Nenhuma tarefa ainda.</div>:tasks.map(t=>(<div key={t.id} onClick={()=>toggleTask(t)} className="ch" style={{background:C.card,border:`1px solid ${t.done?C.accent+"30":C.border}`,borderRadius:10,padding:"13px 18px",display:"flex",alignItems:"center",gap:14,marginBottom:8,opacity:t.done?0.65:1}}><div style={{width:18,height:18,borderRadius:4,border:`2px solid ${t.done?C.accent:C.border}`,background:t.done?C.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{t.done&&<span style={{color:"#000",fontSize:11}}>✓</span>}</div><span style={{flex:1,textDecoration:t.done?"line-through":"none",color:t.done?C.muted:C.text,fontSize:14}}>{t.title}</span><span style={{background:C.subtle,color:C.muted,borderRadius:4,padding:"2px 10px",fontSize:11}}>{t.assignee}</span></div>))}</div>)}

            {tab==="pendings"&&(<div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><span style={{color:pendings.filter(x=>x.status==="open").length>0?C.danger:C.accent,fontFamily:FONT,fontSize:13,fontWeight:600}}>{pendings.filter(x=>x.status==="open").length} pendência(s) em aberto</span><button onClick={()=>openPendModal()} style={{...btnP,fontSize:12,padding:"8px 16px"}}>+ Registrar</button></div>{pendings.filter(x=>x.status==="open").length===0&&pendings.filter(x=>x.status==="resolved").length===0&&(<div style={{textAlign:"center",padding:48}}><div style={{fontSize:36,marginBottom:10}}>🎉</div><div style={{fontFamily:FONT_D,color:C.accent}}>Sem pendências!</div></div>)}{pendings.filter(x=>x.status==="open").map(p=>{const pt=PTYPES.find(t=>t.id===p.type);const urg=URGENCY.find(u=>u.id===p.urgency);const ch=CHANNELS.find(c=>c.id===p.channel);return(<div key={p.id} style={{background:urg?.color+"08",border:`1px solid ${urg?.color}35`,borderRadius:12,padding:"16px 18px",marginBottom:10}}><div style={{display:"flex",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}><span style={{fontSize:22}}>{pt?.icon}</span><div style={{flex:1}}><div style={{fontFamily:FONT_D,fontWeight:700,fontSize:14}}>{pt?.label}</div>{p.note&&<div style={{color:C.muted,fontSize:12,marginTop:4}}>{p.note}</div>}<div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}><span style={{background:urg?.color+"20",color:urg?.color,border:`1px solid ${urg?.color}40`,borderRadius:4,padding:"1px 8px",fontSize:11,fontFamily:FONT}}>{urg?.label}</span><span style={{background:C.subtle,color:C.muted,borderRadius:4,padding:"1px 8px",fontSize:11,fontFamily:FONT}}>{ch?.icon} {ch?.label}</span><span style={{background:C.subtle,color:C.muted,borderRadius:4,padding:"1px 8px",fontSize:11,fontFamily:FONT}}>⏳ {p.days_blocking}d</span></div></div><div style={{display:"flex",gap:8}}><button onClick={()=>openPendModal(p)} style={btnW}>🔔 Renotificar</button><button onClick={()=>resolvePending(p.id)} style={btnA}>✓ Resolver</button></div></div></div>);})}{pendings.filter(x=>x.status==="resolved").length>0&&(<div style={{marginTop:16}}><div style={{color:C.muted,fontSize:11,letterSpacing:"0.1em",marginBottom:10}}>RESOLVIDAS</div>{pendings.filter(x=>x.status==="resolved").map(p=>{const pt=PTYPES.find(t=>t.id===p.type);return(<div key={p.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 16px",marginBottom:8,display:"flex",alignItems:"center",gap:12,opacity:0.55}}><span style={{fontSize:18}}>{pt?.icon}</span><span style={{flex:1,textDecoration:"line-through",color:C.muted,fontSize:13}}>{pt?.label}</span><span style={{color:C.accent,fontSize:12}}>✓ Resolvido</span></div>);})}</div>)}</div>)}

            {tab==="messages"&&(<div><div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20,marginBottom:14,maxHeight:360,overflowY:"auto",display:"flex",flexDirection:"column",gap:12}}>{messages.length===0?<div style={{color:C.muted,textAlign:"center",padding:40,fontSize:13}}>Nenhuma mensagem ainda.</div>:messages.map((m,i)=>(<div key={i} style={{display:"flex",justifyContent:m.from_role==="team"?"flex-end":"flex-start"}}><div style={{background:m.from_role==="team"?C.accentDim:C.subtle,border:`1px solid ${m.from_role==="team"?C.accentBorder:C.border}`,borderRadius:10,padding:"10px 14px",maxWidth:"72%"}}><div style={{fontSize:10,color:C.muted,marginBottom:4}}>{m.from_role==="team"?"📤 Equipe":"📥 Cliente"} · {new Date(m.created_at).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</div><div style={{fontSize:13}}>{m.text}</div></div></div>))}</div><div style={{display:"flex",gap:10}}><input style={{...inp,flex:1}} placeholder="Escreva uma mensagem..." value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMessage()}/><button onClick={sendMessage} style={btnP}>Enviar</button></div></div>)}
          </div>
        ):loading?<Spinner/>:(
          <>
            {view==="dashboard"&&(<div><div style={{fontFamily:FONT_D,fontSize:30,fontWeight:800,marginBottom:4}}>Dashboard</div><div style={{color:C.muted,fontSize:13,marginBottom:26}}>Olá, {user?.email} 👋</div><div style={{display:"flex",gap:12,marginBottom:28,flexWrap:"wrap"}}><StatCard label="Total" value={stats.total} icon="⬡"/><StatCard label="No Prazo" value={stats.onTrack} color={C.accent} icon="◎"/><StatCard label="Em Risco" value={stats.atRisk} color={C.warn} icon="◉"/><StatCard label="Atrasados" value={stats.delayed} color={C.danger} icon="◈"/><StatCard label="Pendências" value={totalPend} color={totalPend>0?C.warn:C.accent} icon="⚠"/></div>{projects.length===0?<div style={{textAlign:"center",padding:60,color:C.muted}}><div style={{fontSize:40,marginBottom:12}}>⬡</div><div style={{fontFamily:FONT_D,fontSize:18,color:C.accent}}>Nenhum projeto ainda</div><div style={{fontSize:13,marginTop:8}}>Clique em "+ Novo Projeto" para começar</div></div>:<><div style={{fontFamily:FONT_D,fontSize:18,fontWeight:800,marginBottom:14}}>Projetos Ativos</div><div style={{display:"flex",flexDirection:"column",gap:10}}>{projects.map(p=>{const op=(p.pendings||[]).filter(x=>x.status==="open").length;return(<div key={p.id} className="ch" onClick={()=>openProject(p)} style={{background:C.card,border:`1px solid ${op>0?C.warn+"40":C.border}`,borderRadius:12,padding:"16px 22px",display:"flex",alignItems:"center",gap:18,flexWrap:"wrap"}}><Ring value={p.progress||0} size={46}/><div style={{flex:1,minWidth:150}}><div style={{fontFamily:FONT_D,fontWeight:700,fontSize:15}}>{p.name}</div><div style={{color:C.muted,fontSize:12,marginTop:2}}>{p.client}</div><div style={{marginTop:8}}><PhaseBar phase={p.phase||0}/></div></div><div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}><div style={{display:"flex",gap:6}}><Badge status={p.status}/>{op>0&&<span style={{background:C.warn+"20",color:C.warn,border:`1px solid ${C.warn}40`,borderRadius:4,padding:"2px 8px",fontSize:11,fontFamily:FONT}}>⚠ {op}</span>}</div><div style={{color:p.daysLeft<0?C.danger:p.daysLeft<7?C.warn:C.muted,fontSize:12}}>{p.daysLeft===null?"Sem prazo":p.daysLeft<0?`${Math.abs(p.daysLeft)}d de atraso`:p.daysLeft===0?"Hoje":`${p.daysLeft}d restantes`}</div></div></div>);})}</div></>}</div>)}

            {view==="projects"&&(<div><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:26,flexWrap:"wrap",gap:12}}><div><div style={{fontFamily:FONT_D,fontSize:30,fontWeight:800,marginBottom:4}}>Projetos</div><div style={{color:C.muted,fontSize:13}}>{filtered.length} projeto(s)</div></div><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{[["all","Todos"],["on-track","No prazo"],["at-risk","Em risco"],["delayed","Atrasados"],["done","Concluídos"]].map(([val,label])=>(<button key={val} onClick={()=>setFilterSt(val)} style={{background:filterSt===val?C.accentDim:"transparent",border:`1px solid ${filterSt===val?C.accentBorder:C.border}`,borderRadius:6,color:filterSt===val?C.accent:C.muted,fontFamily:FONT,fontSize:12,padding:"6px 14px",cursor:"pointer"}}>{label}</button>))}</div></div>{filtered.length===0?<div style={{textAlign:"center",padding:60,color:C.muted,fontSize:13}}>Nenhum projeto nesta categoria.</div>:<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:14}}>{filtered.map(p=>{const op=(p.pendings||[]).filter(x=>x.status==="open").length;return(<div key={p.id} className="ch" onClick={()=>openProject(p)} style={{background:C.card,border:`1px solid ${op>0?C.warn+"40":C.border}`,borderRadius:14,padding:20}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}><div><div style={{fontFamily:FONT_D,fontWeight:700,fontSize:15}}>{p.name}</div><div style={{color:C.muted,fontSize:12,marginTop:3}}>{p.client}</div></div><Ring value={p.progress||0} size={48}/></div><PhaseBar phase={p.phase||0}/><div style={{marginTop:10,fontSize:11,color:C.muted}}>{PHASES[p.phase||0]}</div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12}}><Badge status={p.status}/>{op>0&&<span style={{color:C.warn,fontSize:12}}>⚠ {op}</span>}</div></div>);})}</div>}</div>)}

            {view==="pendings"&&(<div><div style={{fontFamily:FONT_D,fontSize:30,fontWeight:800,marginBottom:4}}>Central de Pendências</div><div style={{color:C.muted,fontSize:13,marginBottom:28}}>{allOpenPendings.length} pendência(s) bloqueando projetos</div>{allOpenPendings.length===0?<div style={{textAlign:"center",padding:80}}><div style={{fontSize:48,marginBottom:16}}>🎉</div><div style={{fontFamily:FONT_D,fontSize:22,color:C.accent}}>Nenhuma pendência!</div></div>:["high","medium","low"].map(u=>{const items=allOpenPendings.filter(x=>x.urgency===u);if(!items.length) return null;const urg=URGENCY.find(x=>x.id===u);return(<div key={u} style={{marginBottom:28}}><div style={{color:urg.color,fontFamily:FONT_D,fontWeight:700,fontSize:15,marginBottom:12}}>{u==="high"?"🔴":u==="medium"?"🟡":"🟢"} URGÊNCIA {urg.label.toUpperCase()} — {items.length}</div>{items.map(item=>{const pt=PTYPES.find(t=>t.id===item.type);const ch=CHANNELS.find(c=>c.id===item.channel);return(<div key={item.id} className="ch" onClick={()=>{openProject(item.project);setTab("pendings");}} style={{background:urg.color+"08",border:`1px solid ${urg.color}30`,borderRadius:12,padding:"16px 20px",marginBottom:10,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}><span style={{fontSize:24}}>{pt?.icon}</span><div style={{flex:1,minWidth:180}}><div style={{fontFamily:FONT_D,fontWeight:700,fontSize:14}}>{item.project.name}</div><div style={{color:C.muted,fontSize:12,marginTop:2}}>{item.project.client} · {pt?.label}</div>{item.note&&<div style={{color:C.muted,fontSize:11,marginTop:4}}>{item.note}</div>}</div><div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}><span style={{color:C.danger,fontFamily:FONT,fontSize:12,fontWeight:600}}>⏳ {item.days_blocking}d</span><span style={{color:C.muted,fontSize:11}}>{ch?.icon} {ch?.label}</span></div></div>);})}</div>);})}</div>)}

            {view==="alerts"&&(<div><div style={{fontFamily:FONT_D,fontSize:30,fontWeight:800,marginBottom:4}}>Central de Alertas</div><div style={{color:C.muted,fontSize:13,marginBottom:28}}>Projetos que precisam de atenção</div>{projects.filter(p=>p.status==="delayed").length>0&&(<div style={{marginBottom:24}}><div style={{color:C.danger,fontFamily:FONT_D,fontWeight:700,fontSize:15,marginBottom:12}}>🔴 ATRASADOS</div>{projects.filter(p=>p.status==="delayed").map(p=>(<div key={p.id} className="ch" onClick={()=>{openProject(p);setTab("pendings");}} style={{background:"#EF444408",border:"1px solid #EF444430",borderRadius:12,padding:"16px 20px",marginBottom:10,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}><div style={{flex:1}}><div style={{fontFamily:FONT_D,fontWeight:700}}>{p.name}</div><div style={{color:C.muted,fontSize:12}}>{p.client}</div></div><div style={{color:C.danger,fontFamily:FONT,fontWeight:600}}>{Math.abs(p.daysLeft||0)}d de atraso</div></div>))}</div>)}{projects.filter(p=>p.status==="at-risk").length>0&&(<div style={{marginBottom:24}}><div style={{color:C.warn,fontFamily:FONT_D,fontWeight:700,fontSize:15,marginBottom:12}}>🟡 EM RISCO</div>{projects.filter(p=>p.status==="at-risk").map(p=>(<div key={p.id} className="ch" onClick={()=>openProject(p)} style={{background:"#F59E0B08",border:"1px solid #F59E0B30",borderRadius:12,padding:"16px 20px",marginBottom:10,display:"flex",alignItems:"center",gap:16}}><div style={{flex:1}}><div style={{fontFamily:FONT_D,fontWeight:700}}>{p.name}</div><div style={{color:C.muted,fontSize:12}}>{p.client}</div></div><div style={{color:C.warn,fontFamily:FONT,fontWeight:600}}>{p.daysLeft}d restantes</div><Ring value={p.progress||0} size={44}/></div>))}</div>)}{stats.delayed===0&&stats.atRisk===0&&(<div style={{textAlign:"center",padding:80}}><div style={{fontSize:48,marginBottom:16}}>✦</div><div style={{fontFamily:FONT_D,fontSize:20,color:C.accent}}>Tudo sob controle!</div></div>)}</div>)}
          </>
        )}
      </div>
    </div>
  );
}
