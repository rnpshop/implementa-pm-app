// @ts-nocheck
import { useState, useEffect, useCallback } from "react";

const SUPABASE_URL = "https://duorzwckifuyxlyioqma.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1b3J6d2NraWZ1eXhseWlvcW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NTQ3MTgsImV4cCI6MjA5NDEzMDcxOH0.AyMdUciCs6m9pyB64HlBRRss-w2YL_n5nPTdV_1W-q4";
const H = { apikey:SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}`, "Content-Type":"application/json", Prefer:"return=representation" };

const api = {
  get: async (t,p="") => { const r=await fetch(`${SUPABASE_URL}/rest/v1/${t}?${p}`,{headers:H}); return r.json(); },
  post: async (t,b) => { const r=await fetch(`${SUPABASE_URL}/rest/v1/${t}`,{method:"POST",headers:H,body:JSON.stringify(b)}); return r.json(); },
  patch: async (t,m,b) => { const q=Object.entries(m).map(([k,v])=>`${k}=eq.${v}`).join("&"); const r=await fetch(`${SUPABASE_URL}/rest/v1/${t}?${q}`,{method:"PATCH",headers:H,body:JSON.stringify(b)}); return r.json(); },
  del: async (t,m) => { const q=Object.entries(m).map(([k,v])=>`${k}=eq.${v}`).join("&"); await fetch(`${SUPABASE_URL}/rest/v1/${t}?${q}`,{method:"DELETE",headers:H}); },
};

const auth = {
  signUp: async (email,password,name,role) => { const r=await fetch(`${SUPABASE_URL}/auth/v1/signup`,{method:"POST",headers:{apikey:SUPABASE_KEY,"Content-Type":"application/json"},body:JSON.stringify({email,password,data:{name,role}})}); return r.json(); },
  signIn: async (email,password) => { const r=await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`,{method:"POST",headers:{apikey:SUPABASE_KEY,"Content-Type":"application/json"},body:JSON.stringify({email,password})}); return r.json(); },
  signInGoogle: () => { window.location.href=`${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${window.location.origin}`; },
  signOut: async (token) => { await fetch(`${SUPABASE_URL}/auth/v1/logout`,{method:"POST",headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${token}`}}); },
  getUser: async (token) => { const r=await fetch(`${SUPABASE_URL}/auth/v1/user`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${token}`}}); return r.json(); },
};

const C={bg:"#0A0D12",surface:"#111520",card:"#161B27",border:"#1E2535",accent:"#00E5A0",accentDim:"#00E5A015",accentBorder:"#00E5A030",warn:"#F59E0B",danger:"#EF4444",purple:"#A78BFA",blue:"#3B82F6",text:"#E8EDF5",muted:"#6B7A99",subtle:"#2A3248"};
const FONT="'DM Mono','Courier New',monospace";
const FONT_D="'Syne','Arial Black',sans-serif";
const PHASES=["Kickoff","Design","Desenvolvimento","QA","Homologação","Go-live"];
const STATUS={"on-track":{label:"No prazo",color:C.accent,bg:"#00E5A015"},"at-risk":{label:"Em risco",color:C.warn,bg:"#F59E0B15"},"delayed":{label:"Atrasado",color:C.danger,bg:"#EF444415"},"done":{label:"Concluído",color:C.purple,bg:"#A78BFA15"}};

const inp={background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontFamily:FONT,fontSize:13,padding:"10px 14px",outline:"none",width:"100%",boxSizing:"border-box"};
const btnP={background:C.accent,color:"#000",border:"none",borderRadius:8,fontFamily:FONT_D,fontWeight:700,fontSize:13,padding:"10px 20px",cursor:"pointer"};
const btnG={background:"transparent",border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,fontFamily:FONT,fontSize:13,padding:"10px 20px",cursor:"pointer"};

const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap');
  *{box-sizing:border-box}
  body{margin:0;background:#0A0D12}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#111520}::-webkit-scrollbar-thumb{background:#1E2535;border-radius:4px}
  .ch{transition:border-color .2s,transform .2s;cursor:pointer}.ch:hover{border-color:#00E5A050!important;transform:translateY(-2px)}
  .nb{transition:all .2s}.nb:hover{background:#00E5A015!important;color:#00E5A0!important}
  textarea,select,input{font-family:'DM Mono','Courier New',monospace;color:#E8EDF5;-webkit-user-select:text!important;user-select:text!important;caret-color:#00E5A0;pointer-events:auto!important;}input:focus,textarea:focus,select:focus{outline:none;border-color:#00E5A0!important;}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .fade{animation:fadeIn .3s ease}
`;

const Badge=({status})=>{ const s=STATUS[status]||STATUS["on-track"]; return <span style={{background:s.bg,color:s.color,border:`1px solid ${s.color}30`,borderRadius:4,padding:"2px 10px",fontSize:11,fontFamily:FONT,fontWeight:600}}>{s.label}</span>; };
const PhaseBar=({phase})=>(<div style={{display:"flex",gap:3}}>{PHASES.map((_,i)=><div key={i} style={{height:4,flex:1,borderRadius:2,background:i<phase?C.accent:i===phase?C.warn:C.border}}/>)}</div>);
const Ring=({value=0,size=50,stroke=4})=>{ const r=(size-stroke)/2,circ=2*Math.PI*r,offset=circ-(value/100)*circ; const color=value===100?C.purple:value>60?C.accent:value>30?C.warn:C.danger; return(<svg width={size} height={size} style={{transform:"rotate(-90deg)",flexShrink:0}}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={stroke}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"/><text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill={color} fontSize={11} fontFamily={FONT} fontWeight="700" style={{transform:"rotate(90deg)",transformOrigin:"center"}}>{value}%</text></svg>); };
const Spinner=({small=false})=>(<div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:small?4:60}}><div style={{width:small?16:32,height:small?16:32,border:`${small?2:3}px solid ${C.border}`,borderTop:`${small?2:3}px solid ${C.accent}`,borderRadius:"50%",animation:"spin .8s linear infinite"}}/></div>);

// ── LOGIN ────────────────────────────────────────────────────
const LoginScreen=({onLogin})=>{
  const [mode,setMode]=useState("login");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const [role,setRole]=useState("client");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  const handleSubmit=async()=>{
    setLoading(true);setError("");
    try{
      let data;
      if(mode==="login"){ data=await auth.signIn(email,password); }
      else{ data=await auth.signUp(email,password,name,role); }
      if(data.access_token){
        localStorage.setItem("sb_token",data.access_token);
        localStorage.setItem("sb_user",JSON.stringify(data.user));
        onLogin(data.access_token,data.user);
      } else { setError(data.error_description||data.msg||"Erro ao autenticar"); }
    }catch(e){setError("Erro de conexão");}
    setLoading(false);
  };

  useEffect(()=>{
    const hash=window.location.hash;
    if(hash&&hash.includes("access_token")){
      const params=new URLSearchParams(hash.substring(1));
      const t=params.get("access_token");
      if(t){ auth.getUser(t).then(u=>{ localStorage.setItem("sb_token",t);localStorage.setItem("sb_user",JSON.stringify(u));onLogin(t,u);window.history.replaceState(null,"",window.location.pathname); }); }
    }
  },[]);

  const ROLES=[{id:"client",label:"👤 Cliente",desc:"Preencher informações do projeto"},{id:"tech",label:"🔧 Colaborador Técnico",desc:"Executar configurações"},{id:"products",label:"📦 Produtos",desc:"Cadastrar produtos"},{id:"admin",label:"📊 Gestor",desc:"Gerenciar todos os projetos"}];

  return(
    <div style={{background:C.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONT,padding:16}}>
      <style>{GLOBAL_STYLE}</style>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:40,width:460,maxWidth:"100%"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontFamily:FONT_D,fontWeight:800,fontSize:24,color:C.accent}}>IMPLEMENTA</div>
          <div style={{color:C.muted,fontSize:11,letterSpacing:"0.15em"}}>ECOMMERCE PM</div>
        </div>
        <div style={{display:"flex",gap:0,marginBottom:24,background:C.surface,borderRadius:10,padding:4}}>
          {[["login","Entrar"],["signup","Cadastrar"]].map(([m,l])=>(<button key={m} onClick={()=>setMode(m)} style={{flex:1,background:mode===m?C.card:"transparent",border:`1px solid ${mode===m?C.border:"transparent"}`,borderRadius:8,color:mode===m?C.text:C.muted,fontFamily:FONT,fontSize:13,padding:"8px",cursor:"pointer"}}>{l}</button>))}
        </div>
        {error&&<div style={{background:C.danger+"15",border:`1px solid ${C.danger}40`,borderRadius:8,padding:"10px 14px",color:C.danger,fontSize:12,marginBottom:16}}>{error}</div>}
        {mode==="signup"&&<>
          <div style={{marginBottom:12}}>
            <label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>NOME COMPLETO</label>
            <input style={inp} placeholder="Seu nome" value={name} onChange={e=>setName(e.target.value)}/>
          </div>
          <div style={{marginBottom:14}}>
            <label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:8}}>PERFIL DE ACESSO</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {ROLES.map(r=>(<button key={r.id} onClick={()=>setRole(r.id)} style={{background:role===r.id?C.accentDim:C.surface,border:`1px solid ${role===r.id?C.accent:C.border}`,borderRadius:10,color:role===r.id?C.accent:C.muted,fontFamily:FONT,fontSize:11,padding:"10px",cursor:"pointer",textAlign:"left"}}>
                <div style={{fontWeight:600,marginBottom:3}}>{r.label}</div>
                <div style={{fontSize:10,color:C.muted}}>{r.desc}</div>
              </button>))}
            </div>
          </div>
        </>}
        <div style={{marginBottom:12}}>
          <label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>E-MAIL</label>
          <input style={inp} type="email" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
        </div>
        <div style={{marginBottom:20}}>
          <label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>SENHA</label>
          <input style={inp} type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
        </div>
        <button onClick={handleSubmit} disabled={loading} style={{...btnP,width:"100%",marginBottom:12,opacity:loading?0.6:1}}>{loading?<Spinner small/>:mode==="login"?"Entrar":"Criar conta"}</button>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}><div style={{flex:1,height:1,background:C.border}}/><span style={{color:C.muted,fontSize:11}}>ou</span><div style={{flex:1,height:1,background:C.border}}/></div>
        <button onClick={auth.signInGoogle} style={{...btnG,width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Entrar com Google
        </button>
      </div>
    </div>
  );
};


// ── DASHBOARD CLIENTE ────────────────────────────────────────
const ClientDashboard=({user,token,onLogout})=>{
  const [section,setSection]=useState("onboarding");
  const [step,setStep]=useState(0);
  const [saving,setSaving]=useState(false);
  const [projectId,setProjectId]=useState(null);
  const [projectData,setProjectData]=useState(null);
  const [onboarding,setOnboarding]=useState(null);
  const [obSaved,setObSaved]=useState(false);
  const [projectCreated,setProjectCreated]=useState(false);
  const [products,setProducts]=useState([]);
  const [showProdForm,setShowProdForm]=useState(false);
  const [loadingInit,setLoadingInit]=useState(true);
  const [pendings,setPendings]=useState([]);
  const [messages,setMessages]=useState([]);
  const [newMsg,setNewMsg]=useState("");
  const [f_company_name,set_company_name]=useState("");
  const [f_cnpj,set_cnpj]=useState("");
  const [f_email,set_email]=useState(user?.email||"");
  const [f_phone,set_phone]=useState("");
  const [f_address,set_address]=useState("");
  const [f_platform,set_platform]=useState("");
  const [f_platform_login,set_platform_login]=useState("");
  const [f_platform_password,set_platform_password]=useState("");
  const [f_registrobr_login,set_registrobr_login]=useState("");
  const [f_registrobr_password,set_registrobr_password]=useState("");
  const [f_erp,set_erp]=useState("");
  const [f_erp_login,set_erp_login]=useState("");
  const [f_erp_password,set_erp_password]=useState("");
  const [f_gateway_envio,set_gateway_envio]=useState("");
  const [f_gateway_pagamento,set_gateway_pagamento]=useState("");
  const [f_certificado_senha,set_certificado_senha]=useState("");
  const [f_atendimento_info,set_atendimento_info]=useState("");
  const [f_quem_somos,set_quem_somos]=useState("");
  const [f_cores,set_cores]=useState("");
  const [f_categorias,set_categorias]=useState("");
  const [f_redes_sociais,set_redes_sociais]=useState("");
  const [f_referencias_sites,set_referencias_sites]=useState("");
  const form={company_name:f_company_name,cnpj:f_cnpj,email:f_email,phone:f_phone,address:f_address,platform:f_platform,platform_login:f_platform_login,platform_password:f_platform_password,registrobr_login:f_registrobr_login,registrobr_password:f_registrobr_password,erp:f_erp,erp_login:f_erp_login,erp_password:f_erp_password,gateway_envio:f_gateway_envio,gateway_pagamento:f_gateway_pagamento,certificado_senha:f_certificado_senha,atendimento_info:f_atendimento_info,quem_somos:f_quem_somos,cores:f_cores,categorias:f_categorias,redes_sociais:f_redes_sociais,referencias_sites:f_referencias_sites};
  const [prodForm,setProdForm]=useState({code:"",ean:"",name:"",description:"",category:"",price:"",stock:"",weight:"",height:"",width:"",length:""});
  const [images,setImages]=useState([]);
  const [editProd,setEditProd]=useState(null);

  // Carrega projeto vinculado ao cliente
  useEffect(()=>{
    const load=async()=>{
      setLoadingInit(true);
      try{
        const projs=await api.get("projects",`client_user_id=eq.${user.id}&order=created_at.desc`);
        if(projs&&projs.length>0){
          const proj=projs[0];
          setProjectId(proj.id);
          setProjectData(proj);
          setProjectCreated(true);
          const [ob,prods,pnds,msgs]=await Promise.all([
            api.get("onboarding",`project_id=eq.${proj.id}`),
            api.get("products",`project_id=eq.${proj.id}&order=created_at.desc`),
            api.get("pendings",`project_id=eq.${proj.id}&order=sent_at.desc`),
            api.get("messages",`project_id=eq.${proj.id}&order=created_at.asc`),
          ]);
          const obData=ob&&ob.length>0?ob[0]:null;
          setOnboarding(obData);
          setObSaved(!!obData);
          if(obData){
      if(obData.company_name) set_company_name(obData.company_name);
      if(obData.cnpj) set_cnpj(obData.cnpj);
      if(obData.email) set_email(obData.email);
      if(obData.phone) set_phone(obData.phone);
      if(obData.address) set_address(obData.address);
      if(obData.platform) set_platform(obData.platform);
      if(obData.platform_login) set_platform_login(obData.platform_login);
      if(obData.platform_password) set_platform_password(obData.platform_password);
      if(obData.registrobr_login) set_registrobr_login(obData.registrobr_login);
      if(obData.registrobr_password) set_registrobr_password(obData.registrobr_password);
      if(obData.erp) set_erp(obData.erp);
      if(obData.erp_login) set_erp_login(obData.erp_login);
      if(obData.erp_password) set_erp_password(obData.erp_password);
      if(obData.gateway_envio) set_gateway_envio(obData.gateway_envio);
      if(obData.gateway_pagamento) set_gateway_pagamento(obData.gateway_pagamento);
      if(obData.certificado_senha) set_certificado_senha(obData.certificado_senha);
      if(obData.atendimento_info) set_atendimento_info(obData.atendimento_info);
      if(obData.quem_somos) set_quem_somos(obData.quem_somos);
      if(obData.cores) set_cores(obData.cores);
      if(obData.categorias) set_categorias(obData.categorias);
      if(obData.redes_sociais) set_redes_sociais(obData.redes_sociais);
      if(obData.referencias_sites) set_referencias_sites(obData.referencias_sites);
    }
          setProducts(prods||[]);
          setPendings(pnds||[]);
          setMessages(msgs||[]);
          setSection("project");
        }
      }catch(e){console.error(e);}
      setLoadingInit(false);
    };
    load();
  },[user.id]);

  const refreshProject=async(pid)=>{
    const id=pid||projectId;
    if(!id) return;
    const [ob,prods,pnds,msgs,proj]=await Promise.all([
      api.get("onboarding",`project_id=eq.${id}`),
      api.get("products",`project_id=eq.${id}&order=created_at.desc`),
      api.get("pendings",`project_id=eq.${id}&order=sent_at.desc`),
      api.get("messages",`project_id=eq.${id}&order=created_at.asc`),
      api.get("projects",`id=eq.${id}`),
    ]);
    const obData=ob&&ob.length>0?ob[0]:null;
    setOnboarding(obData);
    setObSaved(!!obData);
    if(obData){
      if(obData.company_name) set_company_name(obData.company_name);
      if(obData.cnpj) set_cnpj(obData.cnpj);
      if(obData.email) set_email(obData.email);
      if(obData.phone) set_phone(obData.phone);
      if(obData.address) set_address(obData.address);
      if(obData.platform) set_platform(obData.platform);
      if(obData.platform_login) set_platform_login(obData.platform_login);
      if(obData.platform_password) set_platform_password(obData.platform_password);
      if(obData.erp) set_erp(obData.erp);
      if(obData.gateway_envio) set_gateway_envio(obData.gateway_envio);
      if(obData.gateway_pagamento) set_gateway_pagamento(obData.gateway_pagamento);
      if(obData.atendimento_info) set_atendimento_info(obData.atendimento_info);
      if(obData.quem_somos) set_quem_somos(obData.quem_somos);
      if(obData.cores) set_cores(obData.cores);
      if(obData.categorias) set_categorias(obData.categorias);
      if(obData.redes_sociais) set_redes_sociais(obData.redes_sociais);
      if(obData.referencias_sites) set_referencias_sites(obData.referencias_sites);
    }
    setProducts(prods||[]);
    setPendings(pnds||[]);
    setMessages(msgs||[]);
    if(proj&&proj.length>0) setProjectData(proj[0]);
  };

  // form helpers removed - using direct state
  const pf=(k,type="text",ph="")=>(<input type={type} style={inp} placeholder={ph} value={prodForm[k]||""} onChange={e=>setProdForm(f=>({...f,[k]:e.target.value}))}/>);

  const STEPS=[
    {title:"Dados da Empresa",icon:"🏢",fields:["company_name","cnpj","email","phone","address"]},
    {title:"Plataforma & Domínio",icon:"🌐",fields:["platform","platform_login","platform_password","registrobr_login","registrobr_password"]},
    {title:"Acessos & Integrações",icon:"🔑",fields:["erp","erp_login","erp_password","gateway_envio","gateway_pagamento","certificado_senha"]},
    {title:"Identidade Visual",icon:"🎨",fields:["cores","atendimento_info","quem_somos"]},
    {title:"Conteúdo & Categorias",icon:"📝",fields:["categorias","referencias_sites"]},
    {title:"Redes Sociais",icon:"📱",fields:["redes_sociais"]},
  ];

  const stepFilled=(i)=>STEPS[i].fields.some(k=>{const el=document.getElementById('f_'+k); return (el?.value||form[k]||'').trim().length>0;});

  const readForm=()=>({
    company_name:(document.getElementById("f_company_name")?.value||f_company_name||"").trim(),
    cnpj:(document.getElementById("f_cnpj")?.value||f_cnpj||"").trim(),
    email:(document.getElementById("f_email")?.value||f_email||"").trim(),
    phone:(document.getElementById("f_phone")?.value||f_phone||"").trim(),
    address:(document.getElementById("f_address")?.value||f_address||"").trim(),
    platform:(document.getElementById("f_platform")?.value||f_platform||"").trim(),
    platform_login:(document.getElementById("f_platform_login")?.value||f_platform_login||"").trim(),
    platform_password:(document.getElementById("f_platform_password")?.value||f_platform_password||"").trim(),
    registrobr_login:(document.getElementById("f_registrobr_login")?.value||f_registrobr_login||"").trim(),
    registrobr_password:(document.getElementById("f_registrobr_password")?.value||f_registrobr_password||"").trim(),
    erp:(document.getElementById("f_erp")?.value||f_erp||"").trim(),
    erp_login:(document.getElementById("f_erp_login")?.value||f_erp_login||"").trim(),
    erp_password:(document.getElementById("f_erp_password")?.value||f_erp_password||"").trim(),
    gateway_envio:(document.getElementById("f_gateway_envio")?.value||f_gateway_envio||"").trim(),
    gateway_pagamento:(document.getElementById("f_gateway_pagamento")?.value||f_gateway_pagamento||"").trim(),
    certificado_senha:(document.getElementById("f_certificado_senha")?.value||f_certificado_senha||"").trim(),
    cores:(document.getElementById("f_cores")?.value||f_cores||"").trim(),
    atendimento_info:(document.getElementById("f_atendimento_info")?.value||f_atendimento_info||"").trim(),
    quem_somos:(document.getElementById("f_quem_somos")?.value||f_quem_somos||"").trim(),
    categorias:(document.getElementById("f_categorias")?.value||f_categorias||"").trim(),
    referencias_sites:(document.getElementById("f_referencias_sites")?.value||f_referencias_sites||"").trim(),
    redes_sociais:(document.getElementById("f_redes_sociais")?.value||f_redes_sociais||"").trim(),
  });

  const saveOnboarding=async(final=false)=>{
    const formData=readForm();
    if(!formData.company_name){alert("Preencha o nome da empresa antes de continuar!");return;}
    setSaving(true);
    try{
      let pid=projectId;
      // Cria projeto automaticamente se ainda não existe
      if(!pid){
        const r=await fetch(`${SUPABASE_URL}/rest/v1/rpc/create_project_from_onboarding`,{
          method:"POST",headers:H,
          body:JSON.stringify({
            p_user_id:user.id,
            p_user_email:user.email,
            p_company_name:formData.company_name,
            p_platform:formData.platform||"A definir",
            p_phone:formData.phone||""
          })
        });
        pid=await r.json();
        setProjectId(pid);
        setProjectCreated(true);
        const proj=await api.get("projects",`id=eq.${pid}`);
        if(proj&&proj.length>0) setProjectData(proj[0]);
      }
      // Salva onboarding
      const existing=await api.get("onboarding",`project_id=eq.${pid}`);
      const status=final?"submitted":"draft";
      if(existing&&existing.length>0){
        await api.patch("onboarding",{project_id:pid},{...formData,status});
      } else {
        await api.post("onboarding",{...formData,project_id:pid,status});
      }
      setObSaved(true);
      if(final){
        // Registra pendência de boas-vindas
        const pnds=await api.get("pendings",`project_id=eq.${pid}&type=eq.briefing`);
        if(!pnds||pnds.length===0){
          await api.post("pendings",{
            project_id:pid,type:"briefing",
            note:"Formulário enviado! Nossa equipe irá analisar e entrar em contato.",
            urgency:"low",channel:"email",days_blocking:0,
            status:"open",sent_at:new Date().toISOString()
          });
        }
        await refreshProject(pid);
        setSection("project");
      }
    }catch(e){alert("Erro ao salvar: "+e.message);}
    setSaving(false);
  };

  const handleImage=(e)=>{
    const files=Array.from(e.target.files).slice(0,5-images.length);
    files.forEach(file=>{
      const reader=new FileReader();
      reader.onload=ev=>setImages(prev=>[...prev,ev.target.result].slice(0,5));
      reader.readAsDataURL(file);
    });
  };

  const saveProd=async()=>{
    if(!projectId||!prodForm.name){alert("Preencha o nome do produto!");return;}
    setSaving(true);
    try{
      if(editProd){
        await api.patch("products",{id:editProd},{...prodForm,images,price:parseFloat(prodForm.price)||0,stock:parseInt(prodForm.stock)||0,weight:parseFloat(prodForm.weight)||0});
      } else {
        await api.post("products",{...prodForm,project_id:projectId,price:parseFloat(prodForm.price)||0,stock:parseInt(prodForm.stock)||0,weight:parseFloat(prodForm.weight)||0,images,status:"pending"});
      }
      setProdForm({code:"",ean:"",name:"",description:"",category:"",price:"",stock:"",weight:"",height:"",width:"",length:""});
      setImages([]);setShowProdForm(false);setEditProd(null);
      const d=await api.get("products",`project_id=eq.${projectId}&order=created_at.desc`);
      setProducts(d||[]);
    }catch(e){alert("Erro: "+e.message);}
    setSaving(false);
  };

  const deleteProd=async(id)=>{
    if(!window.confirm("Excluir este produto?")) return;
    await api.del("products",{id});
    setProducts(prev=>prev.filter(p=>p.id!==id));
  };

  const openEditProd=(p)=>{
    setProdForm({code:p.code||"",ean:p.ean||"",name:p.name||"",description:p.description||"",category:p.category||"",price:p.price||"",stock:p.stock||"",weight:p.weight||"",height:p.height||"",width:p.width||"",length:p.length||""});
    setImages(p.images||[]);
    setEditProd(p.id);
    setShowProdForm(true);
  };

  const sendMessage=async()=>{
    if(!newMsg.trim()||!projectId) return;
    await api.post("messages",{project_id:projectId,from_role:"client",text:newMsg});
    setNewMsg("");
    const msgs=await api.get("messages",`project_id=eq.${projectId}&order=created_at.asc`);
    setMessages(msgs||[]);
  };

  const openPendings=pendings.filter(x=>x.status==="open"&&x.type!=="briefing");
  const progress=projectData?.progress||0;
  const phase=projectData?.phase||0;

  const SECTIONS=projectCreated?[
    {id:"project",label:"📊 Meu Projeto"},
    {id:"onboarding",label:"📋 Informações"},
    {id:"products",label:`📦 Produtos${products.length>0?` (${products.length})`:""}`},
    {id:"messages",label:`💬 Mensagens${messages.length>0?` (${messages.length})`:""}`},
  ]:[
    {id:"onboarding",label:"📋 Preencher Formulário"},
  ];

  if(loadingInit) return(
    <div style={{background:C.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{GLOBAL_STYLE}</style>
      <div style={{textAlign:"center"}}>
        <Spinner/>
        <div style={{color:C.muted,fontSize:13,marginTop:12}}>Carregando seu projeto...</div>
      </div>
    </div>
  );

  return(
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:FONT,color:C.text}}>
      <style>{GLOBAL_STYLE}</style>

      {/* HEADER */}
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"12px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:10}}>
        <div>
          <div style={{fontFamily:FONT_D,fontWeight:800,fontSize:16,color:C.accent}}>IMPLEMENTA</div>
          <div style={{color:C.muted,fontSize:9,letterSpacing:"0.15em"}}>PORTAL DO CLIENTE</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {openPendings.length>0&&<span style={{background:C.danger+"20",color:C.danger,border:`1px solid ${C.danger}40`,borderRadius:20,fontSize:11,padding:"3px 10px",fontWeight:600}}>⚠ {openPendings.length} pendência(s)</span>}
          <button onClick={onLogout} style={{...btnG,padding:"6px 12px",fontSize:11}}>Sair</button>
        </div>
      </div>

      {/* TABS */}
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"0 16px",display:"flex",gap:0,overflowX:"auto"}}>
        {SECTIONS.map(s=>(
          <button key={s.id} onClick={()=>setSection(s.id)} style={{background:"transparent",border:"none",borderBottom:section===s.id?`2px solid ${C.accent}`:"2px solid transparent",color:section===s.id?C.accent:C.muted,fontFamily:FONT,fontSize:12,padding:"12px 16px",cursor:"pointer",marginBottom:-1,whiteSpace:"nowrap"}}>{s.label}</button>
        ))}
      </div>

      <div style={{maxWidth:700,margin:"0 auto",padding:"20px 16px"}}>

        {/* ── PRIMEIRO ACESSO — SEM PROJETO ── */}
        {!projectCreated&&section==="onboarding"&&(
          <div style={{background:C.card,border:`1px solid ${C.accentBorder}`,borderRadius:14,padding:20,marginBottom:20}}>
            <div style={{fontSize:32,marginBottom:8,textAlign:"center"}}>👋</div>
            <div style={{fontFamily:FONT_D,fontSize:20,fontWeight:800,textAlign:"center",color:C.accent,marginBottom:8}}>Bem-vindo à Implementa!</div>
            <div style={{color:C.muted,fontSize:13,textAlign:"center",marginBottom:0,lineHeight:1.6}}>
              Preencha o formulário abaixo para iniciarmos seu projeto.<br/>
              Ao enviar, seu projeto será criado automaticamente.
            </div>
          </div>
        )}

        {/* ── MEU PROJETO (DASHBOARD) ── */}
        {section==="project"&&projectCreated&&(
          <div className="fade">
            {/* ALERTAS DE PENDÊNCIAS */}
            {openPendings.length>0&&(
              <div style={{background:C.danger+"10",border:`1px solid ${C.danger}40`,borderRadius:12,padding:"16px 20px",marginBottom:20}}>
                <div style={{fontFamily:FONT_D,fontWeight:700,fontSize:14,color:C.danger,marginBottom:10}}>⚠ Você tem {openPendings.length} pendência(s) que precisam da sua atenção!</div>
                {openPendings.map(p=>{
                  const PTYPES=[{id:"logo",label:"Logotipo",icon:"🎨"},{id:"content",label:"Conteúdo",icon:"📝"},{id:"photos",label:"Fotos",icon:"📷"},{id:"access",label:"Acessos",icon:"🔑"},{id:"approval",label:"Aprovação",icon:"✅"},{id:"payment",label:"Pagamento",icon:"💳"},{id:"briefing",label:"Briefing",icon:"📋"},{id:"domain",label:"Domínio",icon:"🌐"},{id:"products",label:"Produtos",icon:"🛒"},{id:"feedback",label:"Feedback",icon:"💬"},{id:"other",label:"Outro",icon:"⚠️"}];
                  const pt=PTYPES.find(t=>t.id===p.type);
                  return(
                    <div key={p.id} style={{background:C.card,borderRadius:8,padding:"10px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:18}}>{pt?.icon}</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:600}}>{pt?.label}</div>
                        {p.note&&<div style={{color:C.muted,fontSize:12}}>{p.note}</div>}
                      </div>
                      {p.days_blocking>0&&<span style={{color:C.danger,fontSize:11}}>⏳ {p.days_blocking}d</span>}
                    </div>
                  );
                })}
                <button onClick={()=>setSection("messages")} style={{...btnP,fontSize:12,marginTop:8,background:C.danger}}>💬 Falar com a Equipe</button>
              </div>
            )}

            {/* PROGRESSO */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:24,marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:12}}>
                <div>
                  <div style={{fontFamily:FONT_D,fontSize:22,fontWeight:800}}>{projectData?.name}</div>
                  {projectData?.deadline&&<div style={{color:C.muted,fontSize:13,marginTop:4}}>Previsão de entrega: {new Date(projectData.deadline).toLocaleDateString("pt-BR")}</div>}
                </div>
                <Ring value={progress} size={64}/>
              </div>
              <div style={{marginBottom:6}}><Badge status={projectData?.status||"on-track"}/></div>
              <div style={{marginTop:16,marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{color:C.muted,fontSize:11,letterSpacing:"0.08em"}}>FASE ATUAL</span>
                  <span style={{color:C.warn,fontSize:12,fontWeight:600}}>{PHASES[phase]}</span>
                </div>
                <div style={{display:"flex",gap:3,marginBottom:6}}>
                  {PHASES.map((_,i)=><div key={i} style={{height:6,flex:1,borderRadius:3,background:i<phase?C.accent:i===phase?C.warn:C.border,transition:"background .3s"}}/>)}
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  {PHASES.map((ph,i)=><div key={i} style={{flex:1,textAlign:"center",fontSize:9,color:i===phase?C.warn:i<phase?C.accent:C.muted,fontWeight:i===phase?700:400}}>{ph.substring(0,5)}</div>)}
                </div>
              </div>
            </div>

            {/* CARDS RESUMO */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,textAlign:"center",cursor:"pointer"}} onClick={()=>setSection("products")}>
                <div style={{fontSize:28,marginBottom:4}}>📦</div>
                <div style={{fontFamily:FONT_D,fontSize:22,fontWeight:800,color:C.accent}}>{products.length}</div>
                <div style={{color:C.muted,fontSize:12}}>Produtos Enviados</div>
              </div>
              <div style={{background:C.card,border:`1px solid ${openPendings.length>0?C.danger:C.border}`,borderRadius:12,padding:16,textAlign:"center"}}>
                <div style={{fontSize:28,marginBottom:4}}>⚠</div>
                <div style={{fontFamily:FONT_D,fontSize:22,fontWeight:800,color:openPendings.length>0?C.danger:C.accent}}>{openPendings.length}</div>
                <div style={{color:C.muted,fontSize:12}}>Pendências</div>
              </div>
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,textAlign:"center",cursor:"pointer"}} onClick={()=>setSection("messages")}>
                <div style={{fontSize:28,marginBottom:4}}>💬</div>
                <div style={{fontFamily:FONT_D,fontSize:22,fontWeight:800,color:C.blue}}>{messages.length}</div>
                <div style={{color:C.muted,fontSize:12}}>Mensagens</div>
              </div>
              <div style={{background:C.card,border:`1px solid ${obSaved?C.accentBorder:C.warn+"50"}`,borderRadius:12,padding:16,textAlign:"center",cursor:"pointer"}} onClick={()=>setSection("onboarding")}>
                <div style={{fontSize:28,marginBottom:4}}>📋</div>
                <div style={{fontFamily:FONT_D,fontSize:22,fontWeight:800,color:obSaved?C.accent:C.warn}}>{obSaved?"✓":"!"}</div>
                <div style={{color:C.muted,fontSize:12}}>{obSaved?"Briefing Enviado":"Preencher Briefing"}</div>
              </div>
            </div>

            {/* ÚLTIMAS MENSAGENS */}
            {messages.length>0&&(
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{fontFamily:FONT_D,fontSize:14,fontWeight:800}}>💬 Últimas Mensagens</div>
                  <button onClick={()=>setSection("messages")} style={{background:"transparent",border:"none",color:C.accent,fontFamily:FONT,fontSize:12,cursor:"pointer"}}>Ver todas →</button>
                </div>
                {messages.slice(-3).map((m,i)=>(
                  <div key={i} style={{display:"flex",gap:10,marginBottom:8,padding:"8px 10px",background:C.surface,borderRadius:8}}>
                    <span style={{fontSize:14}}>{m.from_role==="client"?"👤":"📤"}</span>
                    <div>
                      <div style={{fontSize:10,color:C.muted,marginBottom:2}}>{m.from_role==="client"?"Você":"Equipe Implementa"} · {new Date(m.created_at).toLocaleDateString("pt-BR")}</div>
                      <div style={{fontSize:13}}>{m.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ONBOARDING ── */}
        {section==="onboarding"&&(
          <div className="fade">
            {obSaved&&(
              <div style={{background:C.accentDim,border:`1px solid ${C.accentBorder}`,borderRadius:10,padding:"10px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
                <span>✅</span>
                <span style={{color:C.accent,fontSize:13}}>Informações salvas! Você pode editar a qualquer momento.</span>
              </div>
            )}
            <div style={{display:"flex",gap:4,marginBottom:20,overflowX:"auto",paddingBottom:4}}>
              {STEPS.map((s,i)=>(
                <button key={i} onClick={()=>setStep(i)} style={{background:step===i?C.accentDim:stepFilled(i)?C.subtle:"transparent",border:`1px solid ${step===i?C.accent:stepFilled(i)?C.accentBorder:C.border}`,borderRadius:8,color:step===i?C.accent:stepFilled(i)?C.text:C.muted,fontFamily:FONT,fontSize:11,padding:"8px 12px",cursor:"pointer",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:5}}>
                  {stepFilled(i)&&step!==i?<span style={{color:C.accent}}>✓</span>:<span>{s.icon}</span>}{s.title}
                </button>
              ))}
            </div>

            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:24}}>
              <div style={{fontFamily:FONT_D,fontSize:17,fontWeight:800,marginBottom:18}}>{STEPS[step].icon} {STEPS[step].title}</div>

              <div style={{display:step===0?"block":"none"}}>
                <div style={{marginBottom:14}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>RAZÃO SOCIAL / NOME DA EMPRESA *</label><input id="f_company_name" style={inp} placeholder="Ex: Loja XYZ LTDA" defaultValue={form.company_name||""}/></div>
                <div style={{marginBottom:14}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>CNPJ</label><input id="f_cnpj" style={inp} placeholder="00.000.000/0001-00" defaultValue={form.cnpj||""}/></div>
                <div style={{marginBottom:14}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>E-MAIL COMERCIAL</label><input id="f_email" type="email" style={inp} placeholder="contato@empresa.com.br" defaultValue={form.email||""}/></div>
                <div style={{marginBottom:14}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>TELEFONE / WHATSAPP</label><input id="f_phone" style={inp} placeholder="(11) 99999-9999" defaultValue={form.phone||""}/></div>
                <div style={{marginBottom:14}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>ENDEREÇO COMPLETO</label><textarea id="f_address" style={{...inp,minHeight:80,resize:"vertical"}} placeholder="Rua, número, bairro, cidade, estado, CEP" defaultValue={form.address||""}/></div>
              </div>
              <div style={{display:step===1?"block":"none"}}>
                <div style={{marginBottom:14}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>PLATAFORMA DE ECOMMERCE</label><select id="f_platform" style={inp} defaultValue={form.platform||""}><option value="">-- Selecione --</option>{["VTEX","Shopify","Nuvemshop","Loja Integrada","Tray","WooCommerce","Magento","Outro"].map(p=><option key={p}>{p}</option>)}</select></div>
                <div style={{marginBottom:14}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>LOGIN DA PLATAFORMA</label><input id="f_platform_login" style={inp} placeholder="usuário ou e-mail" defaultValue={form.platform_login||""}/></div>
                <div style={{marginBottom:14}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>SENHA DA PLATAFORMA</label><input id="f_platform_password" type="password" style={inp} placeholder="••••••••" defaultValue={form.platform_password||""}/></div>
                <div style={{marginBottom:14}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>LOGIN REGISTRO.BR</label><input id="f_registrobr_login" style={inp} placeholder="usuário do registro.br" defaultValue={form.registrobr_login||""}/></div>
                <div style={{marginBottom:14}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>SENHA REGISTRO.BR</label><input id="f_registrobr_password" type="password" style={inp} placeholder="••••••••" defaultValue={form.registrobr_password||""}/></div>
              </div>
              <div style={{display:step===2?"block":"none"}}>
                <div style={{marginBottom:14}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>ERP UTILIZADO</label><input id="f_erp" style={inp} placeholder="Ex: Bling, Tiny, SAP, TOTVS..." defaultValue={form.erp||""}/></div>
                <div style={{marginBottom:14}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>LOGIN DO ERP</label><input id="f_erp_login" style={inp} placeholder="usuário ou e-mail" defaultValue={form.erp_login||""}/></div>
                <div style={{marginBottom:14}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>SENHA DO ERP</label><input id="f_erp_password" type="password" style={inp} placeholder="••••••••" defaultValue={form.erp_password||""}/></div>
                <div style={{marginBottom:14}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>GATEWAY DE ENVIO</label><input id="f_gateway_envio" style={inp} placeholder="Ex: Melhor Envio, Frenet..." defaultValue={form.gateway_envio||""}/></div>
                <div style={{marginBottom:14}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>GATEWAY DE PAGAMENTO</label><input id="f_gateway_pagamento" style={inp} placeholder="Ex: PagSeguro, Mercado Pago..." defaultValue={form.gateway_pagamento||""}/></div>
                <div style={{marginBottom:14}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>SENHA DO CERTIFICADO DIGITAL</label><input id="f_certificado_senha" type="password" style={inp} placeholder="Senha do certificado A1/A3" defaultValue={form.certificado_senha||""}/></div>
                <div style={{background:C.warn+"10",border:`1px solid ${C.warn}30`,borderRadius:8,padding:"10px 14px",fontSize:12,color:C.warn}}>⚠ Envie o certificado .pfx por e-mail ou WhatsApp para a equipe técnica</div>
              </div>
              <div style={{display:step===3?"block":"none"}}>
                <div style={{marginBottom:14}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>CORES DA MARCA</label><textarea id="f_cores" style={{...inp,minHeight:80,resize:"vertical"}} placeholder="Ex: Primária #FF0000, Secundária #000000" defaultValue={form.cores||""}/></div>
                <div style={{background:C.accentDim,border:`1px solid ${C.accentBorder}`,borderRadius:8,padding:"10px 14px",fontSize:12,color:C.accent,marginBottom:14}}>📎 Envie logo e manual da marca por e-mail ou WhatsApp</div>
                <div style={{marginBottom:14}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>INFORMAÇÕES DE ATENDIMENTO</label><textarea id="f_atendimento_info" style={{...inp,minHeight:80,resize:"vertical"}} placeholder="Horário, telefone, e-mail de SAC..." defaultValue={form.atendimento_info||""}/></div>
                <div style={{marginBottom:14}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>QUEM SOMOS</label><textarea id="f_quem_somos" style={{...inp,minHeight:80,resize:"vertical"}} placeholder="Breve descrição da empresa..." defaultValue={form.quem_somos||""}/></div>
              </div>
              <div style={{display:step===4?"block":"none"}}>
                <div style={{marginBottom:14}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>CATEGORIAS E SUBCATEGORIAS</label><textarea id="f_categorias" style={{...inp,minHeight:80,resize:"vertical"}} placeholder="Ex: Camisetas > Masculino, Feminino" defaultValue={form.categorias||""}/></div>
                <div style={{marginBottom:14}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>SITES DE REFERÊNCIA</label><textarea id="f_referencias_sites" style={{...inp,minHeight:80,resize:"vertical"}} placeholder="Links de sites que usa como referência" defaultValue={form.referencias_sites||""}/></div>
              </div>
              <div style={{display:step===5?"block":"none"}}>
                <div style={{marginBottom:14}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>REDES SOCIAIS</label><textarea id="f_redes_sociais" style={{...inp,minHeight:80,resize:"vertical"}} placeholder="Instagram: @loja, Facebook: /loja, TikTok: @loja" defaultValue={form.redes_sociais||""}/></div>
              </div>

              <div style={{display:"flex",justifyContent:"space-between",marginTop:20,gap:10,flexWrap:"wrap"}}>
                <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0} style={{...btnG,opacity:step===0?0.4:1,fontSize:12,padding:"9px 16px"}}>← Anterior</button>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>saveOnboarding(false)} disabled={saving} style={{...btnG,fontSize:12,padding:"9px 16px",color:C.accent,borderColor:C.accentBorder,opacity:saving?0.6:1}}>💾 Salvar Rascunho</button>
                  {step<STEPS.length-1
                    ?<button onClick={()=>setStep(s=>s+1)} style={{...btnP,fontSize:12,padding:"9px 16px"}}>Próximo →</button>
                    :<button onClick={()=>saveOnboarding(true)} disabled={saving} style={{...btnP,fontSize:12,padding:"9px 16px",opacity:saving?0.6:1}}>{saving?<Spinner small/>:"✅ Enviar e Criar Projeto"}</button>
                  }
                </div>
              </div>
            </div>

            <div style={{display:"flex",justifyContent:"center",gap:5,marginTop:14}}>
              {STEPS.map((_,i)=>(<div key={i} style={{width:i===step?20:8,height:7,borderRadius:4,background:i===step?C.accent:stepFilled(i)?C.accentBorder:C.border,transition:"all .3s"}}/>))}
            </div>
          </div>
        )}

        {/* ── PRODUTOS ── */}
        {section==="products"&&(
          <div className="fade">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div>
                <div style={{fontFamily:FONT_D,fontSize:20,fontWeight:800}}>Cadastro de Produtos</div>
                <div style={{color:C.muted,fontSize:12}}>{products.length} produto(s) enviado(s)</div>
              </div>
              <button onClick={()=>{setShowProdForm(true);setEditProd(null);setProdForm({code:"",ean:"",name:"",description:"",category:"",price:"",stock:"",weight:"",height:"",width:"",length:""});setImages([]);}} style={{...btnP,fontSize:12,padding:"9px 16px"}}>+ Adicionar</button>
            </div>

            {showProdForm&&(
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:20}} className="fade">
                <div style={{fontFamily:FONT_D,fontSize:15,fontWeight:800,marginBottom:14}}>{editProd?"✏️ Editar Produto":"📦 Novo Produto"}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  <div><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>CÓD. PRODUTO</label>{pf("code","text","Opcional")}</div>
                  <div><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>EAN / CÓD. BARRAS</label>{pf("ean","text","Opcional")}</div>
                </div>
                <div style={{marginBottom:10}}><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>NOME DO PRODUTO *</label>{pf("name","text","Nome completo do produto")}</div>
                <div style={{marginBottom:10}}><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>DESCRIÇÃO</label><textarea style={{...inp,minHeight:72,resize:"vertical"}} placeholder="Descrição detalhada..." value={prodForm.description||""} onChange={e=>setProdForm(f=>({...f,description:e.target.value}))}/></div>
                <div style={{marginBottom:10}}><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>CATEGORIA</label>{pf("category","text","Ex: Camisetas > Masculino")}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  <div><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>PREÇO (R$)</label>{pf("price","number","0,00")}</div>
                  <div><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>ESTOQUE</label>{pf("stock","number","0")}</div>
                </div>
                <div style={{marginBottom:12}}>
                  <label style={{color:C.muted,fontSize:11,display:"block",marginBottom:8}}>📦 MEDIDAS PARA FRETE</label>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    <div><label style={{color:C.muted,fontSize:10,display:"block",marginBottom:3}}>PESO (kg)</label>{pf("weight","number","0.5")}</div>
                    <div><label style={{color:C.muted,fontSize:10,display:"block",marginBottom:3}}>ALTURA (cm)</label>{pf("height","number","10")}</div>
                    <div><label style={{color:C.muted,fontSize:10,display:"block",marginBottom:3}}>LARGURA (cm)</label>{pf("width","number","15")}</div>
                    <div><label style={{color:C.muted,fontSize:10,display:"block",marginBottom:3}}>COMPRIMENTO (cm)</label>{pf("length","number","20")}</div>
                  </div>
                </div>
                <div style={{marginBottom:16}}>
                  <label style={{color:C.muted,fontSize:11,display:"block",marginBottom:8}}>📸 FOTOS (até 5) — tire pelo celular!</label>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
                    {images.map((img,i)=>(
                      <div key={i} style={{position:"relative"}}>
                        <img src={img} style={{width:72,height:72,objectFit:"cover",borderRadius:8,border:`1px solid ${C.border}`}}/>
                        <button onClick={()=>setImages(prev=>prev.filter((_,j)=>j!==i))} style={{position:"absolute",top:-6,right:-6,background:C.danger,border:"none",borderRadius:"50%",width:18,height:18,color:"#fff",fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                      </div>
                    ))}
                    {images.length<5&&(
                      <label style={{width:72,height:72,border:`2px dashed ${C.border}`,borderRadius:8,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",color:C.muted,fontSize:22,gap:2}}>
                        <span>+</span><span style={{fontSize:9}}>foto</span>
                        <input type="file" accept="image/*" multiple capture="environment" onChange={handleImage} style={{display:"none"}}/>
                      </label>
                    )}
                  </div>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={saveProd} disabled={saving} style={{...btnP,flex:1,opacity:saving?0.6:1}}>{saving?<Spinner small/>:editProd?"✓ Salvar Alterações":"✅ Salvar Produto"}</button>
                  <button onClick={()=>{setShowProdForm(false);setEditProd(null);}} style={btnG}>Cancelar</button>
                </div>
              </div>
            )}

            {products.length===0&&!showProdForm?(
              <div style={{textAlign:"center",padding:48,color:C.muted}}>
                <div style={{fontSize:40,marginBottom:12}}>📦</div>
                <div style={{fontFamily:FONT_D,fontSize:16,color:C.accent}}>Nenhum produto ainda</div>
                <div style={{fontSize:13,marginTop:8}}>Clique em "+ Adicionar" para cadastrar seus produtos</div>
              </div>
            ):(
              <div>
                {products.length>0&&(
                  <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px",marginBottom:14,display:"flex",gap:24,flexWrap:"wrap"}}>
                    <div style={{textAlign:"center"}}><div style={{fontFamily:FONT_D,fontSize:20,fontWeight:800,color:C.accent}}>{products.length}</div><div style={{color:C.muted,fontSize:11}}>Produtos</div></div>
                    <div style={{textAlign:"center"}}><div style={{fontFamily:FONT_D,fontSize:20,fontWeight:800,color:C.blue}}>{products.reduce((a,p)=>a+(parseInt(p.stock)||0),0)}</div><div style={{color:C.muted,fontSize:11}}>Estoque Total</div></div>
                    <div style={{textAlign:"center"}}><div style={{fontFamily:FONT_D,fontSize:20,fontWeight:800,color:C.purple}}>{[...new Set(products.map(p=>p.category).filter(Boolean))].length}</div><div style={{color:C.muted,fontSize:11}}>Categorias</div></div>
                  </div>
                )}
                {products.map(p=>(
                  <div key={p.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:10,display:"flex",gap:12,alignItems:"flex-start"}}>
                    {p.images&&p.images.length>0
                      ?<img src={p.images[0]} style={{width:68,height:68,objectFit:"cover",borderRadius:8,flexShrink:0,border:`1px solid ${C.border}`}}/>
                      :<div style={{width:68,height:68,background:C.subtle,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>📦</div>
                    }
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontFamily:FONT_D,fontWeight:700,fontSize:14}}>{p.name}</div>
                      {p.category&&<div style={{color:C.muted,fontSize:12,marginTop:2}}>{p.category}</div>}
                      <div style={{display:"flex",gap:8,marginTop:6,flexWrap:"wrap"}}>
                        {p.price>0&&<span style={{background:C.accentDim,color:C.accent,borderRadius:4,padding:"1px 8px",fontSize:11}}>R$ {parseFloat(p.price).toFixed(2)}</span>}
                        {p.stock>0&&<span style={{background:C.subtle,color:C.muted,borderRadius:4,padding:"1px 8px",fontSize:11}}>Estoque: {p.stock}</span>}
                        {p.code&&<span style={{background:C.subtle,color:C.muted,borderRadius:4,padding:"1px 8px",fontSize:11}}>#{p.code}</span>}
                        {p.ean&&<span style={{background:C.subtle,color:C.muted,borderRadius:4,padding:"1px 8px",fontSize:11}}>EAN: {p.ean}</span>}
                        {p.weight&&<span style={{background:C.subtle,color:C.muted,borderRadius:4,padding:"1px 8px",fontSize:11}}>{p.weight}kg</span>}
                        {p.images&&p.images.length>1&&<span style={{background:C.subtle,color:C.muted,borderRadius:4,padding:"1px 8px",fontSize:11}}>📷 {p.images.length}</span>}
                      </div>
                      {p.description&&<div style={{color:C.muted,fontSize:11,marginTop:6,lineHeight:1.4}}>{p.description.substring(0,80)}{p.description.length>80?"...":""}</div>}
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
                      <button onClick={()=>openEditProd(p)} style={{background:C.accentDim,border:`1px solid ${C.accentBorder}`,borderRadius:6,color:C.accent,fontFamily:FONT,fontSize:11,padding:"5px 10px",cursor:"pointer"}}>✏️</button>
                      <button onClick={()=>deleteProd(p.id)} style={{background:C.danger+"15",border:`1px solid ${C.danger}40`,borderRadius:6,color:C.danger,fontFamily:FONT,fontSize:11,padding:"5px 10px",cursor:"pointer"}}>🗑</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MENSAGENS ── */}
        {section==="messages"&&(
          <div className="fade">
            <div style={{fontFamily:FONT_D,fontSize:20,fontWeight:800,marginBottom:16}}>💬 Comunicação com a Equipe</div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:14,maxHeight:420,overflowY:"auto",display:"flex",flexDirection:"column",gap:10}}>
              {messages.length===0
                ?<div style={{textAlign:"center",padding:48,color:C.muted}}><div style={{fontSize:32,marginBottom:8}}>💬</div><div>Nenhuma mensagem ainda.</div><div style={{fontSize:12,marginTop:4}}>Use este canal para falar com a equipe Implementa.</div></div>
                :messages.map((m,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:m.from_role==="client"?"flex-end":"flex-start"}}>
                    <div style={{background:m.from_role==="client"?C.accentDim:C.subtle,border:`1px solid ${m.from_role==="client"?C.accentBorder:C.border}`,borderRadius:10,padding:"10px 14px",maxWidth:"78%"}}>
                      <div style={{fontSize:10,color:C.muted,marginBottom:4}}>{m.from_role==="client"?"👤 Você":"📤 Equipe Implementa"} · {new Date(m.created_at).toLocaleDateString("pt-BR")} {new Date(m.created_at).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</div>
                      <div style={{fontSize:13,color:C.text,lineHeight:1.5}}>{m.text}</div>
                    </div>
                  </div>
                ))
              }
            </div>
            <div style={{display:"flex",gap:10}}>
              <textarea style={{...inp,flex:1,minHeight:50,resize:"none"}} placeholder="Digite sua mensagem..." value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),sendMessage())}/>
              <button onClick={sendMessage} style={{...btnP,padding:"10px 20px",alignSelf:"flex-end"}}>Enviar</button>
            </div>
            <div style={{color:C.muted,fontSize:11,marginTop:6}}>Enter para enviar · Shift+Enter para nova linha</div>
          </div>
        )}

      </div>
    </div>
  );
};

                      <div>
                        <div style={{fontSize:10,color:C.muted,marginBottom:2}}>{m.from_role==="team"?"Equipe Implementa":"Você"} · {new Date(m.created_at).toLocaleDateString("pt-BR")}</div>
                        <div style={{fontSize:13,color:C.text}}>{m.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!obSaved&&(
                <div style={{background:C.warn+"10",border:`1px solid ${C.warn}40`,borderRadius:12,padding:16,marginTop:16,display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontSize:24}}>📋</span>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:FONT_D,fontWeight:700,color:C.warn}}>Briefing pendente!</div>
                    <div style={{color:C.muted,fontSize:12}}>Preencha as informações do projeto para darmos início ao desenvolvimento.</div>
                  </div>
                  <button onClick={()=>setSection("onboarding")} style={{...btnP,background:C.warn,fontSize:12,padding:"8px 14px",whiteSpace:"nowrap"}}>Preencher →</button>
                </div>
              )}
            </div>
          )}

          {/* ── INFORMAÇÕES / ONBOARDING ── */}
          {section==="onboarding"&&(
            <div className="fade">
              {obSaved&&(
                <div style={{background:C.accentDim,border:`1px solid ${C.accentBorder}`,borderRadius:10,padding:"10px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
                  <span>✅</span>
                  <span style={{color:C.accent,fontSize:13}}>Informações salvas! Você pode editar a qualquer momento.</span>
                </div>
              )}

              {/* STEP NAV */}
              <div style={{display:"flex",gap:4,marginBottom:20,overflowX:"auto",paddingBottom:4}}>
                {STEPS.map((s,i)=>(
                  <button key={i} onClick={()=>setStep(i)} style={{background:step===i?C.accentDim:stepFilled(i)?C.subtle:"transparent",border:`1px solid ${step===i?C.accent:stepFilled(i)?C.accentBorder:C.border}`,borderRadius:8,color:step===i?C.accent:stepFilled(i)?C.text:C.muted,fontFamily:FONT,fontSize:11,padding:"8px 12px",cursor:"pointer",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:5}}>
                    {stepFilled(i)?<span style={{color:C.accent}}>✓</span>:<span>{s.icon}</span>}{s.title}
                  </button>
                ))}
              </div>

              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:24}} className="fade">
                <div style={{fontFamily:FONT_D,fontSize:17,fontWeight:800,marginBottom:18}}>{STEPS[step].icon} {STEPS[step].title}</div>

                {step===0&&<>
                  {fld("RAZÃO SOCIAL / NOME DA EMPRESA","company_name","text","Ex: Loja XYZ LTDA")}
                  {fld("CNPJ","cnpj","text","00.000.000/0001-00")}
                  {fld("E-MAIL COMERCIAL","email","email","contato@empresa.com.br")}
                  {fld("TELEFONE / WHATSAPP","phone","text","(11) 99999-9999")}
                  {txa("ENDEREÇO COMPLETO","address","Rua, número, bairro, cidade, estado, CEP")}
                </>}
                {step===1&&<>
                  <div style={{marginBottom:14}}>
                    <Label t="PLATAFORMA DE ECOMMERCE"/>
                    <select style={inp} value={form.platform||""} onChange={e=>set_platform(e.target.value)}>
                      <option value="">-- Selecione --</option>
                      {["VTEX","Shopify","Nuvemshop","Loja Integrada","Tray","WooCommerce","Magento","Outro"].map(p=><option key={p}>{p}</option>)}
                    </select>
                  </div>
                  {fld("LOGIN DA PLATAFORMA","platform_login","text","usuário ou e-mail")}
                  {fld("SENHA DA PLATAFORMA","platform_password","password","••••••••")}
                  {fld("LOGIN REGISTRO.BR","registrobr_login","text","usuário do registro.br")}
                  {fld("SENHA REGISTRO.BR","registrobr_password","password","••••••••")}
                </>}
                {step===2&&<>
                  {fld("ERP UTILIZADO","erp","text","Ex: Bling, Tiny, SAP, TOTVS...")}
                  {fld("LOGIN DO ERP","erp_login","text","usuário ou e-mail")}
                  {fld("SENHA DO ERP","erp_password","password","••••••••")}
                  {fld("GATEWAY DE ENVIO","gateway_envio","text","Ex: Melhor Envio, Frenet...")}
                  {fld("GATEWAY DE PAGAMENTO","gateway_pagamento","text","Ex: PagSeguro, Mercado Pago...")}
                  {fld("SENHA DO CERTIFICADO DIGITAL","certificado_senha","password","Senha do certificado A1/A3")}
                  <div style={{background:C.warn+"10",border:`1px solid ${C.warn}30`,borderRadius:8,padding:"10px 14px",fontSize:12,color:C.warn}}>⚠ Envie o certificado .pfx por e-mail ou WhatsApp para a equipe técnica</div>
                </>}
                {step===3&&<>
                  {txa("CORES DA MARCA","cores","Ex: Primária #FF0000, Secundária #000000")}
                  <div style={{background:C.accentDim,border:`1px solid ${C.accentBorder}`,borderRadius:8,padding:"10px 14px",fontSize:12,color:C.accent,marginBottom:14}}>📎 Envie logo e manual da marca por e-mail ou WhatsApp</div>
                  {txa("INFORMAÇÕES DE ATENDIMENTO","atendimento_info","Horário, telefone, e-mail de SAC...")}
                  {txa("QUEM SOMOS","quem_somos","Breve descrição da empresa...")}
                </>}
                {step===4&&<>
                  {txa("CATEGORIAS E SUBCATEGORIAS","categorias","Ex: Camisetas > Masculino, Feminino&#10;Calças > Jeans, Social")}
                  {txa("SITES DE REFERÊNCIA","referencias_sites","Links de sites que usa como referência")}
                </>}
                {step===5&&<>
                  {txa("REDES SOCIAIS","redes_sociais","Instagram: @loja&#10;Facebook: /loja&#10;TikTok: @loja")}
                </>}

                <div style={{display:"flex",justifyContent:"space-between",marginTop:20,gap:10}}>
                  <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0} style={{...btnG,opacity:step===0?0.4:1,fontSize:12,padding:"9px 16px"}}>← Anterior</button>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={saveOnboarding} disabled={saving} style={{...btnG,fontSize:12,padding:"9px 16px",opacity:saving?0.6:1,color:C.accent,borderColor:C.accentBorder}}>{saving?"Salvando...":"💾 Salvar"}</button>
                    {step<STEPS.length-1
                      ?<button onClick={()=>setStep(s=>s+1)} style={{...btnP,fontSize:12,padding:"9px 16px"}}>Próximo →</button>
                      :<button onClick={async()=>{await saveOnboarding();setSection("products");}} disabled={saving} style={{...btnP,fontSize:12,padding:"9px 16px"}}>✅ Concluir e ir para Produtos →</button>
                    }
                  </div>
                </div>
              </div>

              <div style={{display:"flex",justifyContent:"center",gap:5,marginTop:14}}>
                {STEPS.map((_,i)=>(<div key={i} style={{width:i===step?20:8,height:7,borderRadius:4,background:i===step?C.accent:stepFilled(i)?C.accentBorder:C.border,transition:"all .3s"}}/>))}
              </div>
            </div>
          )}

          {/* ── PRODUTOS ── */}
          {section==="products"&&(
            <div className="fade">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div>
                  <div style={{fontFamily:FONT_D,fontSize:20,fontWeight:800}}>Cadastro de Produtos</div>
                  <div style={{color:C.muted,fontSize:12}}>{products.length} produto(s) enviado(s)</div>
                </div>
                <button onClick={()=>{setShowProdForm(true);setEditProd(null);setProdForm({code:"",ean:"",name:"",description:"",category:"",price:"",stock:"",weight:"",height:"",width:"",length:""});setImages([]);}} style={{...btnP,fontSize:12,padding:"9px 16px"}}>+ Adicionar</button>
              </div>

              {showProdForm&&(
                <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:20}} className="fade">
                  <div style={{fontFamily:FONT_D,fontSize:15,fontWeight:800,marginBottom:14}}>{editProd?"✏️ Editar Produto":"📦 Novo Produto"}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                    <div><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>CÓD. PRODUTO</label>{pf("code","text","Opcional")}</div>
                    <div><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>EAN / CÓD. BARRAS</label>{pf("ean","text","Opcional")}</div>
                  </div>
                  <div style={{marginBottom:10}}><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>NOME DO PRODUTO *</label>{pf("name","text","Nome completo do produto")}</div>
                  <div style={{marginBottom:10}}><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>DESCRIÇÃO</label><textarea style={{...inp,minHeight:72,resize:"vertical"}} placeholder="Descrição detalhada do produto..." value={prodForm.description||""} onChange={e=>setProdForm(f=>({...f,description:e.target.value}))}/></div>
                  <div style={{marginBottom:10}}><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>CATEGORIA</label>{pf("category","text","Ex: Camisetas > Masculino")}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                    <div><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>PREÇO (R$)</label>{pf("price","number","0,00")}</div>
                    <div><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>ESTOQUE</label>{pf("stock","number","0")}</div>
                  </div>
                  <div style={{marginBottom:12}}>
                    <label style={{color:C.muted,fontSize:11,display:"block",marginBottom:8}}>📦 MEDIDAS PARA FRETE</label>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      <div><label style={{color:C.muted,fontSize:10,display:"block",marginBottom:3}}>PESO (kg)</label>{pf("weight","number","0.5")}</div>
                      <div><label style={{color:C.muted,fontSize:10,display:"block",marginBottom:3}}>ALTURA (cm)</label>{pf("height","number","10")}</div>
                      <div><label style={{color:C.muted,fontSize:10,display:"block",marginBottom:3}}>LARGURA (cm)</label>{pf("width","number","15")}</div>
                      <div><label style={{color:C.muted,fontSize:10,display:"block",marginBottom:3}}>COMPRIMENTO (cm)</label>{pf("length","number","20")}</div>
                    </div>
                  </div>
                  <div style={{marginBottom:16}}>
                    <label style={{color:C.muted,fontSize:11,display:"block",marginBottom:8}}>📸 FOTOS DO PRODUTO (até 5)</label>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
                      {images.map((img,i)=>(
                        <div key={i} style={{position:"relative"}}>
                          <img src={img} style={{width:72,height:72,objectFit:"cover",borderRadius:8,border:`1px solid ${C.border}`}}/>
                          <button onClick={()=>setImages(prev=>prev.filter((_,j)=>j!==i))} style={{position:"absolute",top:-6,right:-6,background:C.danger,border:"none",borderRadius:"50%",width:18,height:18,color:"#fff",fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                        </div>
                      ))}
                      {images.length<5&&(
                        <label style={{width:72,height:72,border:`2px dashed ${C.border}`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:C.muted,fontSize:22,flexDirection:"column",gap:2}}>
                          <span>+</span>
                          <span style={{fontSize:9}}>foto</span>
                          <input type="file" accept="image/*" multiple capture="environment" onChange={handleImage} style={{display:"none"}}/>
                        </label>
                      )}
                    </div>
                    <div style={{color:C.muted,fontSize:11}}>📱 Toque em + para tirar foto ou escolher da galeria</div>
                  </div>
                  <div style={{display:"flex",gap:10}}>
                    <button onClick={saveProd} disabled={saving} style={{...btnP,flex:1,opacity:saving?0.6:1}}>{saving?<Spinner small/>:editProd?"✓ Salvar Alterações":"✅ Salvar Produto"}</button>
                    <button onClick={()=>{setShowProdForm(false);setEditProd(null);}} style={btnG}>Cancelar</button>
                  </div>
                </div>
              )}

              {/* LISTA DE PRODUTOS */}
              {products.length===0&&!showProdForm?(
                <div style={{textAlign:"center",padding:48,color:C.muted}}>
                  <div style={{fontSize:40,marginBottom:12}}>📦</div>
                  <div style={{fontFamily:FONT_D,fontSize:16,color:C.accent}}>Nenhum produto ainda</div>
                  <div style={{fontSize:13,marginTop:8}}>Clique em "+ Adicionar" para cadastrar seus produtos</div>
                </div>
              ):(
                <div>
                  {/* RESUMO */}
                  {products.length>0&&(
                    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px",marginBottom:14,display:"flex",gap:20,flexWrap:"wrap"}}>
                      <div style={{textAlign:"center"}}><div style={{fontFamily:FONT_D,fontSize:20,fontWeight:800,color:C.accent}}>{products.length}</div><div style={{color:C.muted,fontSize:11}}>Produtos</div></div>
                      <div style={{textAlign:"center"}}><div style={{fontFamily:FONT_D,fontSize:20,fontWeight:800,color:C.blue}}>{products.reduce((a,p)=>a+(parseInt(p.stock)||0),0)}</div><div style={{color:C.muted,fontSize:11}}>Estoque Total</div></div>
                      <div style={{textAlign:"center"}}><div style={{fontFamily:FONT_D,fontSize:20,fontWeight:800,color:C.purple}}>{[...new Set(products.map(p=>p.category).filter(Boolean))].length}</div><div style={{color:C.muted,fontSize:11}}>Categorias</div></div>
                    </div>
                  )}
                  {products.map(p=>(
                    <div key={p.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:10,display:"flex",gap:12,alignItems:"flex-start"}}>
                      {p.images&&p.images.length>0
                        ?<img src={p.images[0]} style={{width:68,height:68,objectFit:"cover",borderRadius:8,flexShrink:0,border:`1px solid ${C.border}`}}/>
                        :<div style={{width:68,height:68,background:C.subtle,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>📦</div>
                      }
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontFamily:FONT_D,fontWeight:700,fontSize:14}}>{p.name}</div>
                        {p.category&&<div style={{color:C.muted,fontSize:12,marginTop:2}}>{p.category}</div>}
                        <div style={{display:"flex",gap:8,marginTop:6,flexWrap:"wrap"}}>
                          {p.price>0&&<span style={{background:C.accentDim,color:C.accent,borderRadius:4,padding:"1px 8px",fontSize:11,fontFamily:FONT}}>R$ {parseFloat(p.price).toFixed(2)}</span>}
                          {p.stock>0&&<span style={{background:C.subtle,color:C.muted,borderRadius:4,padding:"1px 8px",fontSize:11,fontFamily:FONT}}>Estoque: {p.stock}</span>}
                          {p.code&&<span style={{background:C.subtle,color:C.muted,borderRadius:4,padding:"1px 8px",fontSize:11,fontFamily:FONT}}>#{p.code}</span>}
                          {p.ean&&<span style={{background:C.subtle,color:C.muted,borderRadius:4,padding:"1px 8px",fontSize:11,fontFamily:FONT}}>EAN: {p.ean}</span>}
                          {p.weight&&<span style={{background:C.subtle,color:C.muted,borderRadius:4,padding:"1px 8px",fontSize:11,fontFamily:FONT}}>{p.weight}kg</span>}
                          {p.images&&p.images.length>1&&<span style={{background:C.subtle,color:C.muted,borderRadius:4,padding:"1px 8px",fontSize:11,fontFamily:FONT}}>📷 {p.images.length}</span>}
                        </div>
                        {p.description&&<div style={{color:C.muted,fontSize:11,marginTop:6,lineHeight:1.4}}>{p.description.substring(0,80)}{p.description.length>80?"...":""}</div>}
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
                        <button onClick={()=>openEditProd(p)} style={{background:C.accentDim,border:`1px solid ${C.accentBorder}`,borderRadius:6,color:C.accent,fontFamily:FONT,fontSize:11,padding:"5px 10px",cursor:"pointer"}}>✏️</button>
                        <button onClick={()=>deleteProd(p.id)} style={{background:C.danger+"15",border:`1px solid ${C.danger}40`,borderRadius:6,color:C.danger,fontFamily:FONT,fontSize:11,padding:"5px 10px",cursor:"pointer"}}>🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── MENSAGENS ── */}
          {section==="messages"&&(
            <div className="fade">
              <div style={{fontFamily:FONT_D,fontSize:20,fontWeight:800,marginBottom:16}}>💬 Comunicação com a Equipe</div>
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:14,maxHeight:420,overflowY:"auto",display:"flex",flexDirection:"column",gap:10}}>
                {messages.length===0
                  ?<div style={{textAlign:"center",padding:48,color:C.muted}}><div style={{fontSize:32,marginBottom:8}}>💬</div><div>Nenhuma mensagem ainda.</div><div style={{fontSize:12,marginTop:4}}>Use este canal para falar com a equipe Implementa.</div></div>
                  :messages.map((m,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:m.from_role==="client"?"flex-end":"flex-start"}}>
                      <div style={{background:m.from_role==="client"?C.accentDim:C.subtle,border:`1px solid ${m.from_role==="client"?C.accentBorder:C.border}`,borderRadius:10,padding:"10px 14px",maxWidth:"78%"}}>
                        <div style={{fontSize:10,color:C.muted,marginBottom:4}}>{m.from_role==="client"?"👤 Você":"📤 Equipe Implementa"} · {new Date(m.created_at).toLocaleDateString("pt-BR")} {new Date(m.created_at).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</div>
                        <div style={{fontSize:13,color:C.text,lineHeight:1.5}}>{m.text}</div>
                      </div>
                    </div>
                  ))
                }
              </div>
              <div style={{display:"flex",gap:10}}>
                <textarea style={{...inp,flex:1,minHeight:50,resize:"none"}} placeholder="Digite sua mensagem para a equipe..." value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),sendMessage())}/>
                <button onClick={sendMessage} style={{...btnP,padding:"10px 20px",alignSelf:"flex-end"}}>Enviar</button>
              </div>
              <div style={{color:C.muted,fontSize:11,marginTop:6}}>Enter para enviar · Shift+Enter para nova linha</div>
            </div>
          )}

          </>
        )}
      </div>
    </div>
  );
};


// ── DASHBOARD COLABORADOR TÉCNICO ────────────────────────────
const TechDashboard=({user,token,onLogout})=>{
  const [projects,setProjects]=useState([]);
  const [loading,setLoading]=useState(true);
  const [view,setView]=useState("dashboard");
  const [sel,setSel]=useState(null);
  const [checklist,setChecklist]=useState([]);
  const [onboarding,setOnboarding]=useState(null);
  const [products,setProducts]=useState([]);
  const [editComment,setEditComment]=useState(null);
  const [commentText,setCommentText]=useState("");
  const [filterPeriod,setFilterPeriod]=useState("all");
  const [saving,setSaving]=useState(false);

  const loadProjects=useCallback(async()=>{
    setLoading(true);
    const projs=await api.get("projects","order=created_at.desc");
    const enriched=await Promise.all((projs||[]).map(async p=>{
      const [tks,pnds]=await Promise.all([
        api.get("tech_checklist",`project_id=eq.${p.id}`),
        api.get("pendings",`project_id=eq.${p.id}&status=eq.open`),
      ]);
      const done=(tks||[]).filter(t=>t.done||t.column_type==="done").length;
      const total=(tks||[]).length;
      const progress=total>0?Math.round((done/total)*100):0;
      const daysLeft=p.deadline?Math.ceil((new Date(p.deadline)-new Date())/86400000):null;
      const hasStarted=(tks||[]).some(t=>t.done||t.column_type==="done");
      const allDone=total>0&&done===total;
      return{...p,tasks:tks||[],pendings:pnds||[],progress,daysLeft,hasStarted,allDone,totalTasks:total,doneTasks:done};
    }));
    setProjects(enriched);
    setLoading(false);
  },[]);

  useEffect(()=>{loadProjects();},[loadProjects]);

  const openProject=async(proj)=>{
    setSel(proj);setView("project");
    const [ck,ob,prods]=await Promise.all([
      api.get("tech_checklist",`project_id=eq.${proj.id}&order=created_at.asc`),
      api.get("onboarding",`project_id=eq.${proj.id}`),
      api.get("products",`project_id=eq.${proj.id}&order=created_at.desc`),
    ]);
    setChecklist(ck||[]);
    setOnboarding(ob&&ob.length>0?ob[0]:null);
    setProducts(prods||[]);
    if(!ck||ck.length===0){
      await fetch(`${SUPABASE_URL}/rest/v1/rpc/create_tech_checklist`,{method:"POST",headers:H,body:JSON.stringify({p_project_id:proj.id})});
      const ck2=await api.get("tech_checklist",`project_id=eq.${proj.id}&order=created_at.asc`);
      setChecklist(ck2||[]);
    }
  };

  const moveTask=async(task,col)=>{
    const done=col==="done";
    await api.patch("tech_checklist",{id:task.id},{column_type:col,done});
    setChecklist(prev=>prev.map(t=>t.id===task.id?{...t,column_type:col,done}:t));
    // Atualiza progresso do projeto
    const updatedTasks=checklist.map(t=>t.id===task.id?{...t,column_type:col,done}:t);
    const doneCount=updatedTasks.filter(t=>t.done||t.column_type==="done").length;
    const progress=Math.round((doneCount/updatedTasks.length)*100);
    await api.patch("projects",{id:sel.id},{progress});
    setSel(prev=>({...prev,progress}));
  };

  const saveComment=async(task)=>{
    await api.patch("tech_checklist",{id:task.id},{comment:commentText});
    setChecklist(prev=>prev.map(t=>t.id===task.id?{...t,comment:commentText}:t));
    setEditComment(null);setCommentText("");
  };

  const addTask=async(col)=>{
    const title=prompt("Nome da tarefa:");
    if(!title||!sel) return;
    const t=await api.post("tech_checklist",{project_id:sel.id,task:title,column_type:col,done:col==="done",category:"Manual",priority:false});
    setChecklist(prev=>[...prev,(Array.isArray(t)?t[0]:t)]);
  };

  // ── STATS ──
  const allTasks=projects.flatMap(p=>p.tasks||[]);
  const pendingTasks=allTasks.filter(t=>!t.done&&t.column_type!=="done"&&t.column_type!=="pending");
  const priorityTasks=allTasks.filter(t=>t.priority&&!t.done);
  const clientPending=projects.reduce((a,p)=>a+(p.pendings||[]).length,0);
  const newProjs=projects.filter(p=>!p.hasStarted&&!p.allDone&&p.status!=="done");
  const inProgress=projects.filter(p=>p.hasStarted&&!p.allDone&&p.status!=="done");
  const withPending=projects.filter(p=>(p.pendings||[]).length>0);
  const finished=projects.filter(p=>p.allDone||p.status==="done");

  const now=new Date();
  const periodFilter=(t)=>{
    if(filterPeriod==="all") return true;
    const d=new Date(t.created_at||now);
    if(filterPeriod==="today") return d.toDateString()===now.toDateString();
    if(filterPeriod==="week"){ const w=new Date(now); w.setDate(w.getDate()-7); return d>=w; }
    if(filterPeriod==="month"){ const m=new Date(now); m.setDate(m.getDate()-30); return d>=m; }
    return true;
  };
  const doneTasks=allTasks.filter(t=>(t.done||t.column_type==="done")&&periodFilter(t));

  const COLS=[
    {id:"info",label:"📋 Informações e Acessos",color:C.blue},
    {id:"todo",label:"⚙️ Configurações a Realizar",color:C.warn},
    {id:"pending",label:"⚠️ Pendências",color:C.danger},
    {id:"done",label:"✅ Realizadas",color:C.accent},
  ];

  const InfoRow=({label,value,secret=false})=>value?(
    <div style={{padding:"8px 0",borderBottom:`1px solid ${C.border}`,display:"flex",gap:12,flexWrap:"wrap"}}>
      <span style={{color:C.muted,fontSize:12,minWidth:180,flexShrink:0}}>{label}</span>
      <span style={{color:C.text,fontSize:12,fontWeight:600,wordBreak:"break-all"}}>{secret?"••••••••":value}</span>
    </div>
  ):null;

  return(
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:FONT,color:C.text,display:"flex"}}>
      <style>{GLOBAL_STYLE}</style>

      {/* SIDEBAR */}
      <div style={{width:220,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",padding:"24px 0",minHeight:"100vh",position:"sticky",top:0}}>
        <div style={{padding:"0 20px 24px"}}>
          <div style={{fontFamily:FONT_D,fontWeight:800,fontSize:16,color:C.accent}}>IMPLEMENTA</div>
          <div style={{color:C.warn,fontSize:10,letterSpacing:"0.1em"}}>🔧 COLABORADOR</div>
        </div>
        <div style={{flex:1,padding:"0 12px",overflowY:"auto"}}>
          <button className="nb" onClick={()=>setView("dashboard")} style={{background:view==="dashboard"?C.accentDim:"transparent",border:view==="dashboard"?`1px solid ${C.accentBorder}`:"1px solid transparent",borderRadius:8,color:view==="dashboard"?C.accent:C.muted,fontFamily:FONT,fontSize:13,padding:"10px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,width:"100%",textAlign:"left",marginBottom:4}}>◈ Dashboard</button>
          <div style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",padding:"8px 8px 4px"}}>PROJETOS</div>
          {loading?<Spinner small/>:projects.map(p=>{
            const op=(p.pendings||[]).length;
            return(
              <button key={p.id} className="nb" onClick={()=>openProject(p)} style={{background:sel?.id===p.id?C.accentDim:"transparent",border:sel?.id===p.id?`1px solid ${C.accentBorder}`:"1px solid transparent",borderRadius:8,color:sel?.id===p.id?C.accent:C.muted,fontFamily:FONT,fontSize:12,padding:"9px 12px",cursor:"pointer",display:"flex",flexDirection:"column",gap:3,textAlign:"left",width:"100%",marginBottom:3}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontWeight:600,fontSize:12}}>{p.name}</span>
                  {op>0&&<span style={{background:C.danger,color:"#fff",borderRadius:10,fontSize:9,padding:"1px 5px"}}>{op}</span>}
                </div>
                <div style={{fontSize:10,color:C.muted}}>{p.progress||0}% · {PHASES[p.phase||0]}</div>
              </button>
            );
          })}
        </div>
        <div style={{padding:"16px 16px 0",borderTop:`1px solid ${C.border}`}}>
          <div style={{color:C.muted,fontSize:11,marginBottom:6}}>🔧 {user?.email?.split("@")[0]}</div>
          <button onClick={onLogout} style={{...btnG,width:"100%",fontSize:11,padding:"7px"}}>Sair</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{flex:1,overflow:"auto",padding:"28px 32px"}}>

        {/* ── DASHBOARD ── */}
        {view==="dashboard"&&(
          <div>
            <div style={{fontFamily:FONT_D,fontSize:28,fontWeight:800,marginBottom:4}}>Meu Dashboard</div>
            <div style={{color:C.muted,fontSize:13,marginBottom:24}}>Olá, {user?.email?.split("@")[0]} 👋</div>

            {/* KPI CARDS */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:28}}>
              {[
                {label:"Tarefas a Realizar",value:pendingTasks.length,color:C.warn,icon:"⚙️"},
                {label:"Tarefas Prioritárias",value:priorityTasks.length,color:C.danger,icon:"🔴"},
                {label:"Pendentes pelo Cliente",value:clientPending,color:C.warn,icon:"👤"},
                {label:"Novos Projetos",value:newProjs.length,color:C.blue,icon:"🆕"},
                {label:"Em Andamento",value:inProgress.length,color:C.accent,icon:"⚙"},
                {label:"Finalizados",value:finished.length,color:C.purple,icon:"✅"},
              ].map((s,i)=>(
                <div key={i} style={{background:C.card,border:`1px solid ${s.color}30`,borderRadius:12,padding:"16px 14px"}}>
                  <div style={{fontSize:22,marginBottom:6}}>{s.icon}</div>
                  <div style={{fontFamily:FONT_D,fontSize:24,fontWeight:800,color:s.color}}>{s.value}</div>
                  <div style={{color:C.muted,fontSize:11,lineHeight:1.3}}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* TAREFAS EXECUTADAS COM FILTRO */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20,marginBottom:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
                <div style={{fontFamily:FONT_D,fontSize:16,fontWeight:800}}>✅ Tarefas Executadas</div>
                <div style={{display:"flex",gap:6}}>
                  {[["all","Todas"],["today","Hoje"],["week","7 dias"],["month","30 dias"]].map(([v,l])=>(
                    <button key={v} onClick={()=>setFilterPeriod(v)} style={{background:filterPeriod===v?C.accentDim:"transparent",border:`1px solid ${filterPeriod===v?C.accent:C.border}`,borderRadius:6,color:filterPeriod===v?C.accent:C.muted,fontFamily:FONT,fontSize:11,padding:"5px 10px",cursor:"pointer"}}>{l}</button>
                  ))}
                </div>
              </div>
              <div style={{fontFamily:FONT_D,fontSize:36,fontWeight:800,color:C.accent}}>{doneTasks.length}</div>
              <div style={{color:C.muted,fontSize:13}}>tarefas concluídas no período selecionado</div>
            </div>

            {/* COLUNAS DE PROJETOS */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16}}>
              {[
                {label:"🆕 Novos a Iniciar",items:newProjs,color:C.blue},
                {label:"⚙️ Em Andamento",items:inProgress,color:C.accent},
                {label:"⚠️ Com Pendências",items:withPending,color:C.warn},
                {label:"✅ Finalizados",items:finished,color:C.purple},
              ].map((col,ci)=>(
                <div key={ci}>
                  <div style={{color:col.color,fontFamily:FONT_D,fontWeight:700,fontSize:13,marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
                    {col.label} <span style={{background:col.color+"20",borderRadius:10,fontSize:11,padding:"1px 7px"}}>{col.items.length}</span>
                  </div>
                  {col.items.map(p=>(
                    <div key={p.id} className="ch" onClick={()=>openProject(p)} style={{background:C.card,border:`1px solid ${col.color}30`,borderRadius:10,padding:"12px 14px",marginBottom:8}}>
                      <div style={{fontFamily:FONT_D,fontWeight:700,fontSize:13}}>{p.name}</div>
                      <div style={{color:C.muted,fontSize:11,marginTop:2}}>{p.client}</div>
                      <div style={{height:3,background:C.border,borderRadius:2,margin:"8px 0"}}>
                        <div style={{height:"100%",background:col.color,borderRadius:2,width:`${p.progress}%`}}/>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.muted}}>
                        <span>{p.doneTasks}/{p.totalTasks} tarefas</span>
                        <span>{p.daysLeft===null?"—":p.daysLeft<0?`${Math.abs(p.daysLeft)}d atraso`:`${p.daysLeft}d`}</span>
                      </div>
                    </div>
                  ))}
                  {col.items.length===0&&<div style={{border:`2px dashed ${C.border}`,borderRadius:10,padding:"16px",textAlign:"center",color:C.muted,fontSize:12}}>Nenhum projeto</div>}
                </div>
              ))}
            </div>

            {/* TAREFAS PRIORITÁRIAS */}
            {priorityTasks.length>0&&(
              <div style={{marginTop:20,background:"#EF444408",border:"1px solid #EF444430",borderRadius:12,padding:20}}>
                <div style={{color:C.danger,fontFamily:FONT_D,fontWeight:700,fontSize:15,marginBottom:12}}>🔴 Tarefas Prioritárias</div>
                {priorityTasks.map(t=>{
                  const proj=projects.find(p=>p.id===t.project_id);
                  return(
                    <div key={t.id} style={{background:C.card,borderRadius:8,padding:"10px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:16}}>🔴</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:600}}>{t.task}</div>
                        <div style={{color:C.muted,fontSize:11}}>{proj?.name}</div>
                      </div>
                      <button onClick={()=>openProject(proj)} style={{...btnP,fontSize:11,padding:"5px 10px"}}>Abrir →</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── QUADRO DO PROJETO ── */}
        {view==="project"&&sel&&(
          <div>
            <button onClick={()=>{setView("dashboard");setSel(null);}} style={{background:"transparent",border:"none",color:C.muted,fontFamily:FONT,fontSize:13,cursor:"pointer",marginBottom:20,display:"flex",alignItems:"center",gap:6}}>← Voltar</button>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:12}}>
              <div>
                <div style={{fontFamily:FONT_D,fontSize:24,fontWeight:800}}>{sel.name}</div>
                <div style={{color:C.muted,fontSize:13}}>{sel.client} · {sel.progress||0}% concluído</div>
              </div>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <Ring value={sel.progress||0} size={52}/>
              </div>
            </div>

            {/* TABS DO PROJETO */}
            <div style={{display:"flex",marginBottom:20,borderBottom:`1px solid ${C.border}`,overflowX:"auto"}}>
              {[["board","📋 Quadro"],["info","📄 Dados do Cliente"],["products",`📦 Produtos (${products.length})`]].map(([id,label])=>(
                <button key={id} onClick={()=>setSel(prev=>({...prev,_tab:id}))} style={{background:"transparent",border:"none",borderBottom:(sel._tab||"board")===id?`2px solid ${C.accent}`:"2px solid transparent",color:(sel._tab||"board")===id?C.accent:C.muted,fontFamily:FONT,fontSize:13,padding:"10px 16px",cursor:"pointer",marginBottom:-1,whiteSpace:"nowrap"}}>{label}</button>
              ))}
            </div>

            {/* QUADRO KANBAN 4 COLUNAS */}
            {(sel._tab||"board")==="board"&&(
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,overflowX:"auto"}}>
                {COLS.map(col=>(
                  <div key={col.id} style={{minWidth:220}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,padding:"8px 10px",background:col.color+"15",borderRadius:8,border:`1px solid ${col.color}30`}}>
                      <span style={{color:col.color,fontSize:12,fontWeight:700,fontFamily:FONT}}>{col.label}</span>
                      <span style={{background:col.color+"20",color:col.color,borderRadius:10,fontSize:10,padding:"1px 7px"}}>{checklist.filter(t=>t.column_type===col.id).length}</span>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:8,minHeight:100}}>
                      {checklist.filter(t=>t.column_type===col.id).map(task=>(
                        <div key={task.id} style={{background:C.card,border:`1px solid ${task.priority?C.danger+"50":C.border}`,borderRadius:10,padding:"12px 14px"}}>
                          <div style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:8}}>
                            {task.priority&&<span style={{fontSize:14,flexShrink:0}}>🔴</span>}
                            <div style={{flex:1,fontSize:13,fontWeight:600,color:C.text,lineHeight:1.4}}>{task.task}</div>
                          </div>
                          {task.comment&&(
                            <div style={{background:C.subtle,borderRadius:6,padding:"6px 8px",fontSize:11,color:C.muted,marginBottom:8}}>💬 {task.comment}</div>
                          )}
                          {editComment===task.id?(
                            <div style={{marginBottom:8}}>
                              <textarea style={{...inp,minHeight:50,fontSize:12,resize:"none"}} value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Adicione um comentário..."/>
                              <div style={{display:"flex",gap:6,marginTop:4}}>
                                <button onClick={()=>saveComment(task)} style={{...btnP,fontSize:10,padding:"4px 10px"}}>Salvar</button>
                                <button onClick={()=>setEditComment(null)} style={{...btnG,fontSize:10,padding:"4px 10px"}}>×</button>
                              </div>
                            </div>
                          ):(
                            <button onClick={()=>{setEditComment(task.id);setCommentText(task.comment||"");}} style={{background:"transparent",border:"none",color:C.muted,fontFamily:FONT,fontSize:11,cursor:"pointer",padding:0,marginBottom:8}}>💬 {task.comment?"Editar":"Comentar"}</button>
                          )}
                          {/* MOVER ENTRE COLUNAS */}
                          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                            {COLS.filter(c=>c.id!==col.id).map(c=>(
                              <button key={c.id} onClick={()=>moveTask(task,c.id)} style={{background:c.color+"15",border:`1px solid ${c.color}30`,borderRadius:4,color:c.color,fontFamily:FONT,fontSize:9,padding:"3px 6px",cursor:"pointer"}}>→ {c.label.split(" ")[1]||c.label.split(" ")[0]}</button>
                            ))}
                          </div>
                        </div>
                      ))}
                      <button onClick={()=>addTask(col.id)} style={{background:"transparent",border:`1px dashed ${C.border}`,borderRadius:8,color:C.muted,fontFamily:FONT,fontSize:11,padding:"8px",cursor:"pointer"}}>+ Adicionar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* DADOS DO CLIENTE */}
            {sel._tab==="info"&&(
              <div>
                {!onboarding?<div style={{textAlign:"center",padding:48,color:C.muted}}><div style={{fontSize:36,marginBottom:12}}>⏳</div><div>Cliente ainda não preencheu o formulário</div></div>
                :<div style={{display:"grid",gap:4}}>
                  {[["Empresa",onboarding.company_name],["CNPJ",onboarding.cnpj],["E-mail",onboarding.email],["Telefone",onboarding.phone],["Endereço",onboarding.address],["Plataforma",onboarding.platform],["Login Plataforma",onboarding.platform_login],["Senha Plataforma",onboarding.platform_password,true],["Login Registro.br",onboarding.registrobr_login],["Senha Registro.br",onboarding.registrobr_password,true],["ERP",onboarding.erp],["Login ERP",onboarding.erp_login],["Senha ERP",onboarding.erp_password,true],["Gateway Envio",onboarding.gateway_envio],["Gateway Pagamento",onboarding.gateway_pagamento],["Senha Certificado",onboarding.certificado_senha,true],["Cores",onboarding.cores],["Categorias",onboarding.categorias],["Redes Sociais",onboarding.redes_sociais],["Quem Somos",onboarding.quem_somos],["Atendimento",onboarding.atendimento_info]].map(([l,v,s])=><InfoRow key={l} label={l} value={v} secret={s}/>)}
                </div>}
              </div>
            )}

            {/* PRODUTOS */}
            {sel._tab==="products"&&(
              <div>
                {products.length===0?<div style={{textAlign:"center",padding:48,color:C.muted}}><div style={{fontSize:36}}>📦</div><div style={{marginTop:8}}>Nenhum produto cadastrado pelo cliente ainda</div></div>
                :<div>{products.map(p=>(
                  <div key={p.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",marginBottom:8,display:"flex",gap:10,alignItems:"center"}}>
                    {p.images&&p.images.length>0?<img src={p.images[0]} style={{width:48,height:48,objectFit:"cover",borderRadius:6,flexShrink:0}}/>:<div style={{width:48,height:48,background:C.subtle,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>📦</div>}
                    <div style={{flex:1}}>
                      <div style={{fontFamily:FONT_D,fontWeight:700,fontSize:13}}>{p.name}</div>
                      <div style={{color:C.muted,fontSize:11}}>{p.category} · R$ {parseFloat(p.price||0).toFixed(2)}</div>
                    </div>
                    <span style={{background:p.cataloged?C.accentDim:C.subtle,color:p.cataloged?C.accent:C.muted,borderRadius:4,padding:"2px 8px",fontSize:11}}>{p.cataloged?"✓ Cadastrado":"Pendente"}</span>
                  </div>
                ))}</div>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ── DASHBOARD PRODUTOS ────────────────────────────────────────
const ProductsDashboard=({user,token,onLogout})=>{
  const [projects,setProjects]=useState([]);
  const [loading,setLoading]=useState(true);
  const [sel,setSel]=useState(null);
  const [products,setProducts]=useState([]);
  const [saving,setSaving]=useState(false);
  const [filterStatus,setFilterStatus]=useState("all");

  const loadProjects=useCallback(async()=>{
    setLoading(true);
    const projs=await api.get("projects","order=created_at.desc");
    const enriched=await Promise.all((projs||[]).map(async p=>{
      const prods=await api.get("products",`project_id=eq.${p.id}`);
      const total=(prods||[]).length;
      const cataloged=(prods||[]).filter(x=>x.cataloged).length;
      const marketplace=(prods||[]).filter(x=>x.marketplace).length;
      return{...p,products:prods||[],total,cataloged,pendingCatalog:total-cataloged,marketplace,pendingMarket:total-marketplace};
    }));
    setProjects(enriched);
    setLoading(false);
  },[]);

  useEffect(()=>{loadProjects();},[loadProjects]);

  const openProject=async(proj)=>{
    setSel(proj);
    const prods=await api.get("products",`project_id=eq.${proj.id}&order=created_at.desc`);
    setProducts(prods||[]);
  };

  const toggleCataloged=async(prod)=>{
    const now=new Date().toISOString();
    const update={cataloged:!prod.cataloged,cataloged_at:!prod.cataloged?now:null};
    await api.patch("products",{id:prod.id},update);
    setProducts(prev=>prev.map(p=>p.id===prod.id?{...p,...update}:p));
    setProjects(prev=>prev.map(p=>{
      if(p.id!==sel.id) return p;
      const prods=p.products.map(x=>x.id===prod.id?{...x,...update}:x);
      const cataloged=prods.filter(x=>x.cataloged).length;
      return{...p,products:prods,cataloged,pendingCatalog:prods.length-cataloged};
    }));
  };

  const toggleMarketplace=async(prod)=>{
    const now=new Date().toISOString();
    const update={marketplace:!prod.marketplace,marketplace_at:!prod.marketplace?now:null};
    await api.patch("products",{id:prod.id},update);
    setProducts(prev=>prev.map(p=>p.id===prod.id?{...p,...update}:p));
  };

  // TOTAIS GLOBAIS
  const allProds=projects.flatMap(p=>p.products||[]);
  const totalAll=allProds.length;
  const totalCat=allProds.filter(x=>x.cataloged).length;
  const totalMkt=allProds.filter(x=>x.marketplace).length;

  const filtered=filterStatus==="all"?products:filterStatus==="pending"?products.filter(p=>!p.cataloged):filterStatus==="cataloged"?products.filter(p=>p.cataloged&&!p.marketplace):products.filter(p=>p.marketplace);

  return(
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:FONT,color:C.text,display:"flex"}}>
      <style>{GLOBAL_STYLE}</style>

      {/* SIDEBAR */}
      <div style={{width:220,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",padding:"24px 0",minHeight:"100vh",position:"sticky",top:0}}>
        <div style={{padding:"0 20px 24px"}}>
          <div style={{fontFamily:FONT_D,fontWeight:800,fontSize:16,color:C.accent}}>IMPLEMENTA</div>
          <div style={{color:C.purple,fontSize:10,letterSpacing:"0.1em"}}>📦 PRODUTOS</div>
        </div>
        <div style={{flex:1,padding:"0 12px",overflowY:"auto"}}>
          <button className="nb" onClick={()=>setSel(null)} style={{background:!sel?C.accentDim:"transparent",border:!sel?`1px solid ${C.accentBorder}`:"1px solid transparent",borderRadius:8,color:!sel?C.accent:C.muted,fontFamily:FONT,fontSize:13,padding:"10px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,width:"100%",textAlign:"left",marginBottom:8}}>◈ Visão Geral</button>
          <div style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",padding:"4px 8px 6px"}}>PROJETOS</div>
          {loading?<Spinner small/>:projects.map(p=>(
            <button key={p.id} className="nb" onClick={()=>openProject(p)} style={{background:sel?.id===p.id?C.accentDim:"transparent",border:sel?.id===p.id?`1px solid ${C.accentBorder}`:"1px solid transparent",borderRadius:8,color:sel?.id===p.id?C.accent:C.muted,fontFamily:FONT,fontSize:12,padding:"9px 12px",cursor:"pointer",display:"flex",flexDirection:"column",gap:3,textAlign:"left",width:"100%",marginBottom:3}}>
              <span style={{fontWeight:600}}>{p.name}</span>
              <span style={{fontSize:10}}>📦 {p.total} · ✓ {p.cataloged} · ⏳ {p.pendingCatalog}</span>
            </button>
          ))}
        </div>
        <div style={{padding:"16px 16px 0",borderTop:`1px solid ${C.border}`}}>
          <div style={{color:C.muted,fontSize:11,marginBottom:6}}>📦 {user?.email?.split("@")[0]}</div>
          <button onClick={onLogout} style={{...btnG,width:"100%",fontSize:11,padding:"7px"}}>Sair</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{flex:1,overflow:"auto",padding:"28px 32px"}}>

        {!sel?(
          // ── VISÃO GERAL ──
          <div>
            <div style={{fontFamily:FONT_D,fontSize:28,fontWeight:800,marginBottom:4}}>Dashboard de Produtos</div>
            <div style={{color:C.muted,fontSize:13,marginBottom:24}}>Controle de cadastro e anúncios</div>

            {/* KPIs GLOBAIS */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:28}}>
              {[
                {label:"Total de Produtos",value:totalAll,color:C.text,icon:"📦"},
                {label:"Cadastrados no Sistema",value:totalCat,color:C.accent,icon:"✅"},
                {label:"Faltam Cadastrar",value:totalAll-totalCat,color:C.warn,icon:"⏳"},
                {label:"Anunciados Marketplace",value:totalMkt,color:C.purple,icon:"🛒"},
                {label:"Faltam Anunciar",value:totalAll-totalMkt,color:C.danger,icon:"📢"},
              ].map((s,i)=>(
                <div key={i} style={{background:C.card,border:`1px solid ${s.color}30`,borderRadius:12,padding:"16px 14px"}}>
                  <div style={{fontSize:22,marginBottom:6}}>{s.icon}</div>
                  <div style={{fontFamily:FONT_D,fontSize:26,fontWeight:800,color:s.color}}>{s.value}</div>
                  <div style={{color:C.muted,fontSize:11,lineHeight:1.3}}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* COLUNAS DE PROJETOS */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
              {projects.map(p=>(
                <div key={p.id} className="ch" onClick={()=>openProject(p)} style={{background:C.card,border:`1px solid ${p.pendingCatalog>0?C.warn+"40":C.border}`,borderRadius:12,padding:18}}>
                  <div style={{fontFamily:FONT_D,fontWeight:700,fontSize:15,marginBottom:4}}>{p.name}</div>
                  <div style={{color:C.muted,fontSize:12,marginBottom:12}}>{p.client}</div>

                  {/* BARRA CADASTRO */}
                  <div style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.muted,marginBottom:4}}>
                      <span>Cadastrados no sistema</span>
                      <span style={{color:C.accent}}>{p.cataloged}/{p.total}</span>
                    </div>
                    <div style={{height:6,background:C.border,borderRadius:3}}>
                      <div style={{height:"100%",background:C.accent,borderRadius:3,width:`${p.total>0?(p.cataloged/p.total)*100:0}%`,transition:"width .5s"}}/>
                    </div>
                  </div>

                  {/* BARRA MARKETPLACE */}
                  <div>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.muted,marginBottom:4}}>
                      <span>Anunciados marketplace</span>
                      <span style={{color:C.purple}}>{p.marketplace}/{p.total}</span>
                    </div>
                    <div style={{height:6,background:C.border,borderRadius:3}}>
                      <div style={{height:"100%",background:C.purple,borderRadius:3,width:`${p.total>0?(p.marketplace/p.total)*100:0}%`,transition:"width .5s"}}/>
                    </div>
                  </div>

                  <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
                    {p.pendingCatalog>0&&<span style={{background:C.warn+"20",color:C.warn,borderRadius:4,padding:"2px 8px",fontSize:11}}>⏳ {p.pendingCatalog} a cadastrar</span>}
                    {p.pendingMarket>0&&<span style={{background:C.purple+"20",color:C.purple,borderRadius:4,padding:"2px 8px",fontSize:11}}>📢 {p.pendingMarket} a anunciar</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ):(
          // ── LISTA DE PRODUTOS DO PROJETO ──
          <div>
            <button onClick={()=>setSel(null)} style={{background:"transparent",border:"none",color:C.muted,fontFamily:FONT,fontSize:13,cursor:"pointer",marginBottom:20,display:"flex",alignItems:"center",gap:6}}>← Voltar</button>
            <div style={{fontFamily:FONT_D,fontSize:24,fontWeight:800,marginBottom:4}}>{sel.name}</div>
            <div style={{color:C.muted,fontSize:13,marginBottom:20}}>{sel.client} · {products.length} produto(s)</div>

            {/* KPIs DO PROJETO */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10,marginBottom:20}}>
              {[
                {label:"Total",value:products.length,color:C.text,icon:"📦"},
                {label:"Cadastrados",value:products.filter(p=>p.cataloged).length,color:C.accent,icon:"✅"},
                {label:"Faltam",value:products.filter(p=>!p.cataloged).length,color:C.warn,icon:"⏳"},
                {label:"No Marketplace",value:products.filter(p=>p.marketplace).length,color:C.purple,icon:"🛒"},
                {label:"Faltam Anunciar",value:products.filter(p=>!p.marketplace).length,color:C.danger,icon:"📢"},
              ].map((s,i)=>(
                <div key={i} style={{background:C.card,border:`1px solid ${s.color}20`,borderRadius:10,padding:"12px 14px"}}>
                  <div style={{fontSize:20,marginBottom:4}}>{s.icon}</div>
                  <div style={{fontFamily:FONT_D,fontSize:22,fontWeight:800,color:s.color}}>{s.value}</div>
                  <div style={{color:C.muted,fontSize:11}}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* FILTROS */}
            <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
              {[["all","Todos"],["pending","Pendentes"],["cataloged","Cadastrados"],["marketplace","No Marketplace"]].map(([v,l])=>(
                <button key={v} onClick={()=>setFilterStatus(v)} style={{background:filterStatus===v?C.accentDim:"transparent",border:`1px solid ${filterStatus===v?C.accentBorder:C.border}`,borderRadius:6,color:filterStatus===v?C.accent:C.muted,fontFamily:FONT,fontSize:12,padding:"6px 14px",cursor:"pointer"}}>{l}</button>
              ))}
            </div>

            {/* LISTA */}
            {filtered.map(p=>(
              <div key={p.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:10,display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
                {p.images&&p.images.length>0?<img src={p.images[0]} style={{width:56,height:56,objectFit:"cover",borderRadius:8,flexShrink:0}}/>:<div style={{width:56,height:56,background:C.subtle,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>📦</div>}
                <div style={{flex:1,minWidth:150}}>
                  <div style={{fontFamily:FONT_D,fontWeight:700,fontSize:14}}>{p.name}</div>
                  <div style={{color:C.muted,fontSize:12,marginTop:2}}>{p.category}</div>
                  <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}>
                    {p.code&&<span style={{background:C.subtle,color:C.muted,borderRadius:4,padding:"1px 6px",fontSize:11}}>#{p.code}</span>}
                    {p.ean&&<span style={{background:C.subtle,color:C.muted,borderRadius:4,padding:"1px 6px",fontSize:11}}>EAN:{p.ean}</span>}
                    <span style={{background:C.subtle,color:C.muted,borderRadius:4,padding:"1px 6px",fontSize:11}}>R$ {parseFloat(p.price||0).toFixed(2)}</span>
                    <span style={{background:C.subtle,color:C.muted,borderRadius:4,padding:"1px 6px",fontSize:11}}>Estoque: {p.stock}</span>
                  </div>
                </div>
                <div style={{display:"flex",gap:8,flexDirection:"column",alignItems:"flex-end"}}>
                  <button onClick={()=>toggleCataloged(p)} style={{background:p.cataloged?C.accentDim:C.subtle,border:`1px solid ${p.cataloged?C.accent:C.border}`,borderRadius:8,color:p.cataloged?C.accent:C.muted,fontFamily:FONT,fontSize:11,padding:"6px 12px",cursor:"pointer",whiteSpace:"nowrap"}}>
                    {p.cataloged?"✅ Cadastrado":"⬜ Marcar Cadastrado"}
                  </button>
                  <button onClick={()=>toggleMarketplace(p)} style={{background:p.marketplace?C.purple+"20":C.subtle,border:`1px solid ${p.marketplace?C.purple:C.border}`,borderRadius:8,color:p.marketplace?C.purple:C.muted,fontFamily:FONT,fontSize:11,padding:"6px 12px",cursor:"pointer",whiteSpace:"nowrap"}}>
                    {p.marketplace?"🛒 Anunciado":"⬜ Marcar Marketplace"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── MINI CHART ───────────────────────────────────────────────
const BarChart=({data,colors})=>{
  const max=Math.max(...data.map(d=>d.value),1);
  return(
    <div style={{display:"flex",alignItems:"flex-end",gap:8,height:80}}>
      {data.map((d,i)=>(
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <div style={{fontSize:11,color:colors[i]||C.accent,fontWeight:700}}>{d.value}</div>
          <div style={{width:"100%",background:colors[i]||C.accent,borderRadius:"4px 4px 0 0",height:`${(d.value/max)*60}px`,minHeight:4,transition:"height .5s",opacity:0.85}}/>
          <div style={{fontSize:9,color:C.muted,textAlign:"center",lineHeight:1.2}}>{d.label}</div>
        </div>
      ))}
    </div>
  );
};

const DonutChart=({value,total,color,label})=>{
  const pct=total>0?Math.round((value/total)*100):0;
  const r=36,circ=2*Math.PI*r,offset=circ-(pct/100)*circ;
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
      <svg width={88} height={88} style={{transform:"rotate(-90deg)"}}>
        <circle cx={44} cy={44} r={r} fill="none" stroke={C.border} strokeWidth={10}/>
        <circle cx={44} cy={44} r={r} fill="none" stroke={color} strokeWidth={10} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{transition:"stroke-dashoffset .8s"}}/>
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill={color} fontSize={14} fontFamily={FONT} fontWeight="700" style={{transform:"rotate(90deg)",transformOrigin:"center"}}>{pct}%</text>
      </svg>
      <div style={{textAlign:"center"}}>
        <div style={{color,fontSize:12,fontWeight:700}}>{value}/{total}</div>
        <div style={{color:C.muted,fontSize:11}}>{label}</div>
      </div>
    </div>
  );
};

const KanbanView=({projects,onOpenProject,onMovePhase})=>{
  const [dragging,setDragging]=useState(null);
  const cols=PHASES.map((phase,i)=>({phase,i,projects:projects.filter(p=>(p.phase||0)===i)}));
  return(
    <div style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:12,minHeight:400}}>
      {cols.map(col=>(
        <div key={col.i} style={{minWidth:220,width:220,flexShrink:0}}
          onDragOver={e=>{e.preventDefault();}}
          onDrop={e=>{e.preventDefault();if(dragging!==null){onMovePhase(dragging,col.i);setDragging(null);}}}
        >
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,padding:"8px 10px",background:C.subtle,borderRadius:8}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:col.i===0?C.muted:col.i===PHASES.length-1?C.purple:C.accent}}/>
            <span style={{color:C.text,fontSize:12,fontWeight:600,fontFamily:FONT}}>{col.phase}</span>
            <span style={{marginLeft:"auto",background:C.border,color:C.muted,borderRadius:10,fontSize:10,padding:"1px 7px"}}>{col.projects.length}</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {col.projects.map(p=>{
              const op=(p.pendings||[]).filter(x=>x.status==="open").length;
              return(
                <div key={p.id} draggable
                  onDragStart={()=>setDragging(p.id)}
                  onDragEnd={()=>setDragging(null)}
                  onClick={()=>onOpenProject(p)}
                  style={{background:dragging===p.id?C.accentDim:C.card,border:`1px solid ${op>0?C.warn+"50":C.border}`,borderRadius:10,padding:12,cursor:"grab",transition:"all .2s",opacity:dragging===p.id?0.5:1}}
                >
                  <div style={{fontFamily:FONT_D,fontWeight:700,fontSize:13,marginBottom:4}}>{p.name}</div>
                  <div style={{color:C.muted,fontSize:11,marginBottom:8}}>{p.client}</div>
                  <div style={{height:3,background:C.border,borderRadius:2,marginBottom:8}}>
                    <div style={{height:"100%",background:C.accent,borderRadius:2,width:`${p.progress||0}%`,transition:"width .5s"}}/>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:10,color:p.daysLeft<0?C.danger:p.daysLeft<7?C.warn:C.muted}}>
                      {p.daysLeft===null?"—":p.daysLeft<0?`${Math.abs(p.daysLeft)}d atraso`:p.daysLeft===0?"Hoje":`${p.daysLeft}d`}
                    </span>
                    <div style={{display:"flex",gap:4}}>
                      {op>0&&<span style={{background:C.warn+"20",color:C.warn,borderRadius:10,fontSize:10,padding:"1px 6px"}}>⚠{op}</span>}
                      <span style={{color:C.muted,fontSize:10}}>{p.progress||0}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {col.projects.length===0&&(
              <div style={{border:`2px dashed ${C.border}`,borderRadius:10,padding:"20px 10px",textAlign:"center",color:C.muted,fontSize:11}}>Arraste aqui</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// ── DASHBOARD GESTOR ─────────────────────────────────────────
const AdminDashboard=({user,token,onLogout})=>{
  const [projects,setProjects]=useState([]);
  const [loading,setLoading]=useState(true);
  const [view,setView]=useState("dashboard");
  const [viewMode,setViewMode]=useState("list"); // list | kanban
  const [sel,setSel]=useState(null);
  const [tab,setTab]=useState("tasks");
  const [tasks,setTasks]=useState([]);
  const [pendings,setPendings]=useState([]);
  const [messages,setMessages]=useState([]);
  const [products,setProducts]=useState([]);
  const [onboarding,setOnboarding]=useState(null);
  const [editOnboarding,setEditOnboarding]=useState(false);
  const [obForm,setObForm]=useState({});
  const [users,setUsers]=useState([]);
  const [pulse,setPulse]=useState(false);
  const [saving,setSaving]=useState(false);
  const [newMsg,setNewMsg]=useState("");
  const [newTask,setNewTask]=useState("");
  const [assignee,setAssignee]=useState("Ana");
  const [filterSt,setFilterSt]=useState("all");
  const [showNP,setShowNP]=useState(false);
  const [newProj,setNewProj]=useState({name:"",client:"",deadline:"",manager:""});
  const [showPend,setShowPend]=useState(false);
  const [pendForm,setPendForm]=useState({type:"photos",note:"",urgency:"medium",channel:"email",days_blocking:1});
  const [pendStep,setPendStep]=useState(1);
  const [editProj,setEditProj]=useState(false);
  const [projForm,setProjForm]=useState({});

  const PTYPES=[{id:"logo",label:"Logotipo",icon:"🎨"},{id:"content",label:"Conteúdo",icon:"📝"},{id:"photos",label:"Fotos",icon:"📷"},{id:"access",label:"Acessos",icon:"🔑"},{id:"approval",label:"Aprovação",icon:"✅"},{id:"payment",label:"Pagamento",icon:"💳"},{id:"briefing",label:"Briefing",icon:"📋"},{id:"domain",label:"Domínio",icon:"🌐"},{id:"products",label:"Produtos",icon:"🛒"},{id:"feedback",label:"Feedback",icon:"💬"},{id:"other",label:"Outro",icon:"⚠️"}];
  const URGENCY=[{id:"low",label:"Baixa",color:C.accent},{id:"medium",label:"Média",color:C.warn},{id:"high",label:"Alta",color:C.danger}];
  const CHANNELS=[{id:"email",label:"E-mail",icon:"📧"},{id:"whatsapp",label:"WhatsApp",icon:"💬"},{id:"both",label:"Ambos",icon:"📡"}];

  useEffect(()=>{ const t=setInterval(()=>setPulse(p=>!p),2000); return ()=>clearInterval(t); },[]);

  const loadProjects=useCallback(async()=>{
    setLoading(true);
    const projs=await api.get("projects","order=created_at.desc");
    const enriched=await Promise.all((projs||[]).map(async(p)=>{
      const [tks,pnds,msgs]=await Promise.all([api.get("tasks",`project_id=eq.${p.id}`),api.get("pendings",`project_id=eq.${p.id}`),api.get("messages",`project_id=eq.${p.id}`)]);
      const progress=tks.length>0?Math.round((tks.filter(t=>t.done).length/tks.length)*100):0;
      const daysLeft=p.deadline?Math.ceil((new Date(p.deadline)-new Date())/86400000):null;
      return{...p,tasks:tks,pendings:pnds,messages:msgs,progress,daysLeft};
    }));
    setProjects(enriched);
    setLoading(false);
  },[]);

  useEffect(()=>{loadProjects();},[loadProjects]);

  const refreshSel=async(id)=>{
    const [tks,pnds,msgs]=await Promise.all([api.get("tasks",`project_id=eq.${id}&order=created_at.asc`),api.get("pendings",`project_id=eq.${id}&order=sent_at.desc`),api.get("messages",`project_id=eq.${id}&order=created_at.asc`)]);
    const progress=tks.length>0?Math.round((tks.filter(t=>t.done).length/tks.length)*100):0;
    setTasks(tks);setPendings(pnds);setMessages(msgs);
    setSel(prev=>({...prev,tasks:tks,pendings:pnds,messages:msgs,progress}));
    setProjects(prev=>prev.map(p=>p.id===id?{...p,tasks:tks,pendings:pnds,messages:msgs,progress}:p));
  };

  const openProject=async(proj)=>{
    setSel(proj);setTab("tasks");setEditProj(false);setEditOnboarding(false);
    setTasks(proj.tasks||[]);setPendings(proj.pendings||[]);setMessages(proj.messages||[]);
    setProjForm({name:proj.name,client:proj.client,deadline:proj.deadline||"",status:proj.status,manager:proj.manager||""});
    const [ob,prods]=await Promise.all([api.get("onboarding",`project_id=eq.${proj.id}`),api.get("products",`project_id=eq.${proj.id}&order=created_at.desc`)]);
    const obData=ob&&ob.length>0?ob[0]:null;
    setOnboarding(obData);
    setObForm(obData||{});
    setProducts(prods||[]);
  };

  const createProject=async()=>{
    if(!newProj.name||!newProj.client) return; setSaving(true);
    await api.post("projects",{name:newProj.name,client:newProj.client,phase:0,status:"on-track",progress:0,deadline:newProj.deadline||null,manager:newProj.manager||null});
    setShowNP(false);setNewProj({name:"",client:"",deadline:"",manager:""});await loadProjects();setSaving(false);
  };

  const saveProject=async()=>{
    if(!sel) return; setSaving(true);
    await api.patch("projects",{id:sel.id},{name:projForm.name,client:projForm.client,deadline:projForm.deadline||null,status:projForm.status,manager:projForm.manager});
    setSel(prev=>({...prev,...projForm}));
    setProjects(prev=>prev.map(p=>p.id===sel.id?{...p,...projForm}:p));
    setEditProj(false); setSaving(false);
  };

  const saveOnboarding=async()=>{
    if(!sel) return; setSaving(true);
    try{
      if(onboarding){ await api.patch("onboarding",{project_id:sel.id},{...obForm}); }
      else{ await api.post("onboarding",{...obForm,project_id:sel.id,status:"submitted"}); }
      setOnboarding({...obForm,project_id:sel.id});
      setEditOnboarding(false);
    }catch(e){alert("Erro: "+e.message);}
    setSaving(false);
  };

  const deleteProject=async()=>{
    if(!sel||!window.confirm("Tem certeza que deseja excluir este projeto?")) return;
    await api.del("projects",{id:sel.id});
    setSel(null); await loadProjects();
  };

  const addTask=async()=>{ if(!newTask.trim()||!sel) return; setSaving(true); await api.post("tasks",{project_id:sel.id,title:newTask,assignee,done:false,phase:sel.phase||0}); setNewTask(""); await refreshSel(sel.id); setSaving(false); };
  const toggleTask=async(task)=>{ await api.patch("tasks",{id:task.id},{done:!task.done}); await refreshSel(sel.id); };
  const deleteTask=async(id)=>{ await api.del("tasks",{id}); await refreshSel(sel.id); };
  const sendMessage=async()=>{ if(!newMsg.trim()||!sel) return; await api.post("messages",{project_id:sel.id,from_role:"team",text:newMsg}); setNewMsg(""); await refreshSel(sel.id); };
  const savePending=async()=>{ if(!sel) return; setSaving(true); await api.post("pendings",{project_id:sel.id,...pendForm,status:"open",sent_at:new Date().toISOString()}); await refreshSel(sel.id); setPendStep(3); setSaving(false); };
  const resolvePending=async(id)=>{ await api.patch("pendings",{id},{status:"resolved"}); await refreshSel(sel.id); };
  const advancePhase=async()=>{ if(!sel||sel.phase>=PHASES.length-1) return; const phase=sel.phase+1; await api.patch("projects",{id:sel.id},{phase}); setSel(prev=>({...prev,phase})); setProjects(prev=>prev.map(p=>p.id===sel.id?{...p,phase}:p)); };
  const movePhase=async(projId,newPhase)=>{ await api.patch("projects",{id:projId},{phase:newPhase}); setProjects(prev=>prev.map(p=>p.id===projId?{...p,phase:newPhase}:p)); };

  const totalPend=projects.reduce((a,p)=>a+(p.pendings||[]).filter(x=>x.status==="open").length,0);
  const stats={
    total:projects.length,
    onTrack:projects.filter(p=>p.status==="on-track").length,
    atRisk:projects.filter(p=>p.status==="at-risk").length,
    delayed:projects.filter(p=>p.status==="delayed").length,
    done:projects.filter(p=>p.status==="done").length,
    avgProgress:projects.length>0?Math.round(projects.reduce((a,p)=>a+(p.progress||0),0)/projects.length):0,
  };
  const filtered=filterSt==="all"?projects:projects.filter(p=>p.status===filterSt);
  const allOpenPendings=projects.flatMap(p=>(p.pendings||[]).filter(x=>x.status==="open").map(x=>({...x,project:p})));

  const navItems=[
    {id:"dashboard",label:"Dashboard",icon:"◈"},
    {id:"kanban",label:"Kanban",icon:"⊞"},
    {id:"projects",label:"Projetos",icon:"⬡"},
    {id:"pendings",label:"Pendências",icon:"⚠",badge:totalPend,bc:C.warn},
    {id:"alerts",label:"Alertas",icon:"◉",badge:stats.delayed+stats.atRisk,bc:C.danger},
    {id:"users",label:"Usuários",icon:"👥"},
  ];

  const Label=({t})=>(<label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>{t}</label>);

  const PendModal=()=>{
    const pt=PTYPES.find(t=>t.id===pendForm.type);
    const urg=URGENCY.find(u=>u.id===pendForm.urgency);
    const emailPrev=`Assunto: [${sel?.name}] Ação necessária: ${pt?.label}\n\nOlá, equipe ${sel?.client}!\n\nO andamento do projeto depende de uma ação da sua parte.\n\n📌 ${pt?.icon} ${pt?.label}${pendForm.note?`\n📝 ${pendForm.note}`:""}\n🚨 Urgência: ${urg?.label}\n⏳ Bloqueando há: ${pendForm.days_blocking} dia(s)\n\nEquipe Implementa Ecommerce`;
    return(
      <div style={{position:"fixed",inset:0,background:"#000C",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:28,width:520,maxWidth:"100%",maxHeight:"92vh",overflowY:"auto"}}>
          {pendStep===1&&<>
            <div style={{fontFamily:FONT_D,fontSize:18,fontWeight:800,marginBottom:18}}>Registrar Pendência</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:14}}>
              {PTYPES.map(t=>(<button key={t.id} onClick={()=>setPendForm(f=>({...f,type:t.id}))} style={{background:pendForm.type===t.id?C.accentDim:C.surface,border:`1px solid ${pendForm.type===t.id?C.accent:C.border}`,borderRadius:8,color:pendForm.type===t.id?C.accent:C.muted,fontFamily:FONT,fontSize:12,padding:"8px 10px",cursor:"pointer",textAlign:"left"}}>{t.icon} {t.label}</button>))}
            </div>
            <textarea style={{...inp,minHeight:60,resize:"vertical",marginBottom:12}} placeholder="Detalhe..." value={pendForm.note} onChange={e=>setPendForm(f=>({...f,note:e.target.value}))}/>
            <div style={{display:"flex",gap:8,marginBottom:12}}>{URGENCY.map(u=><button key={u.id} onClick={()=>setPendForm(f=>({...f,urgency:u.id}))} style={{flex:1,background:pendForm.urgency===u.id?u.color+"20":C.surface,border:`1px solid ${pendForm.urgency===u.id?u.color:C.border}`,borderRadius:6,color:pendForm.urgency===u.id?u.color:C.muted,fontFamily:FONT,fontSize:11,padding:"7px",cursor:"pointer"}}>{u.label}</button>)}</div>
            <div style={{marginBottom:12}}><Label t="DIAS BLOQUEANDO"/><input type="number" style={inp} min={0} value={pendForm.days_blocking} onChange={e=>setPendForm(f=>({...f,days_blocking:parseInt(e.target.value)||0}))}/></div>
            <div style={{display:"flex",gap:8,marginBottom:20}}>{CHANNELS.map(c=><button key={c.id} onClick={()=>setPendForm(f=>({...f,channel:c.id}))} style={{flex:1,background:pendForm.channel===c.id?C.accentDim:C.surface,border:`1px solid ${pendForm.channel===c.id?C.accent:C.border}`,borderRadius:8,color:pendForm.channel===c.id?C.accent:C.muted,fontFamily:FONT,fontSize:12,padding:"10px",cursor:"pointer"}}>{c.icon} {c.label}</button>)}</div>
            <div style={{display:"flex",gap:10}}><button onClick={()=>setPendStep(2)} style={{...btnP,flex:1}}>Ver Prévia →</button><button onClick={()=>setShowPend(false)} style={btnG}>Cancelar</button></div>
          </>}
          {pendStep===2&&<>
            <div style={{fontFamily:FONT_D,fontSize:18,fontWeight:800,marginBottom:14}}>Prévia da Notificação</div>
            <pre style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",fontSize:12,fontFamily:FONT,color:C.text,whiteSpace:"pre-wrap",marginBottom:14,lineHeight:1.7}}>{emailPrev}</pre>
            <div style={{display:"flex",gap:10}}><button onClick={savePending} disabled={saving} style={{...btnP,flex:1}}>{saving?<Spinner small/>:"✓ Confirmar"}</button><button onClick={()=>setPendStep(1)} style={btnG}>← Editar</button></div>
          </>}
          {pendStep===3&&<div style={{textAlign:"center",padding:"20px 0"}}><div style={{fontSize:48,marginBottom:12}}>✅</div><div style={{fontFamily:FONT_D,fontSize:20,fontWeight:800,color:C.accent,marginBottom:16}}>Pendência Salva!</div><button onClick={()=>{setShowPend(false);setTab("pendings");}} style={{...btnP,padding:"12px 28px"}}>Ver Pendências</button></div>}
        </div>
      </div>
    );
  };

  const StatCard=({label,value,color,icon,sub})=>(
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"18px 20px",display:"flex",alignItems:"center",gap:14,flex:1,minWidth:120}}>
      <span style={{fontSize:24}}>{icon}</span>
      <div>
        <div style={{color:C.muted,fontSize:10,fontFamily:FONT,letterSpacing:"0.1em",textTransform:"uppercase"}}>{label}</div>
        <div style={{color:color||C.text,fontSize:26,fontFamily:FONT_D,fontWeight:800,lineHeight:1.1}}>{value}</div>
        {sub&&<div style={{color:C.muted,fontSize:10,marginTop:2}}>{sub}</div>}
      </div>
    </div>
  );

  // ── USERS VIEW ────────────────────────────────────────────
  const UsersView=()=>{
    const [userList,setUserList]=useState([]);
    const [loadingU,setLoadingU]=useState(true);
    const [editUser,setEditUser]=useState(null);
    const [newRole,setNewRole]=useState("");

    useEffect(()=>{
      api.get("profiles","order=created_at.desc").then(d=>{setUserList(d||[]);setLoadingU(false);});
    },[]);

    const saveRole=async()=>{
      await api.patch("profiles",{id:editUser.id},{role:newRole});
      setUserList(prev=>prev.map(u=>u.id===editUser.id?{...u,role:newRole}:u));
      setEditUser(null);
    };

    const ROLES=[{id:"admin",label:"📊 Gestor",color:C.accent},{id:"tech",label:"🔧 Colaborador Técnico",color:C.blue},{id:"products",label:"📦 Produtos",color:C.purple},{id:"client",label:"👤 Cliente",color:C.warn}];

    return(
      <div>
        <div style={{fontFamily:FONT_D,fontSize:28,fontWeight:800,marginBottom:4}}>Usuários</div>
        <div style={{color:C.muted,fontSize:13,marginBottom:24}}>{userList.length} usuário(s) cadastrado(s)</div>
        {loadingU?<Spinner/>:userList.map(u=>{
          const role=ROLES.find(r=>r.id===u.role)||ROLES[3];
          return(
            <div key={u.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 18px",marginBottom:10,display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
              <div style={{width:40,height:40,borderRadius:"50%",background:C.subtle,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
                {u.name?u.name[0].toUpperCase():"?"}
              </div>
              <div style={{flex:1}}>
                <div style={{fontFamily:FONT_D,fontWeight:700,fontSize:14}}>{u.name||"Sem nome"}</div>
                <div style={{color:C.muted,fontSize:12}}>{u.id}</div>
              </div>
              <span style={{background:role.color+"20",color:role.color,border:`1px solid ${role.color}40`,borderRadius:6,padding:"3px 10px",fontSize:12,fontFamily:FONT}}>{role.label}</span>
              <button onClick={()=>{setEditUser(u);setNewRole(u.role||"client");}} style={{background:C.accentDim,border:`1px solid ${C.accentBorder}`,borderRadius:6,color:C.accent,fontFamily:FONT,fontSize:11,padding:"5px 12px",cursor:"pointer"}}>Editar Perfil</button>
            </div>
          );
        })}
        {editUser&&(
          <div style={{position:"fixed",inset:0,background:"#000A",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:28,width:380,maxWidth:"90vw"}}>
              <div style={{fontFamily:FONT_D,fontSize:18,fontWeight:800,marginBottom:4}}>Editar Perfil</div>
              <div style={{color:C.muted,fontSize:12,marginBottom:20}}>{editUser.name}</div>
              <Label t="PERFIL DE ACESSO"/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
                {ROLES.map(r=>(<button key={r.id} onClick={()=>setNewRole(r.id)} style={{background:newRole===r.id?r.color+"20":C.surface,border:`1px solid ${newRole===r.id?r.color:C.border}`,borderRadius:8,color:newRole===r.id?r.color:C.muted,fontFamily:FONT,fontSize:12,padding:"10px",cursor:"pointer"}}>{r.label}</button>))}
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={saveRole} style={{...btnP,flex:1}}>Salvar</button>
                <button onClick={()=>setEditUser(null)} style={btnG}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return(
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:FONT,color:C.text,display:"flex"}}>
      <style>{GLOBAL_STYLE}</style>
      {showPend&&<PendModal/>}

      {/* MODAL NOVO PROJETO */}
      {showNP&&(
        <div style={{position:"fixed",inset:0,background:"#000A",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:32,width:440,maxWidth:"90vw"}}>
            <div style={{fontFamily:FONT_D,fontSize:20,fontWeight:800,marginBottom:22}}>Novo Projeto</div>
            {[["Nome do projeto","name","Ex: Loja XYZ"],["Cliente","client","Ex: XYZ LTDA"],["Gestor responsável","manager","Ex: Rafael"]].map(([l,k,ph])=>(
              <div key={k} style={{marginBottom:12}}>
                <Label t={l.toUpperCase()}/>
                <input style={inp} placeholder={ph} value={newProj[k]} onChange={e=>setNewProj(p=>({...p,[k]:e.target.value}))}/>
              </div>
            ))}
            <div style={{marginBottom:12}}><Label t="STATUS INICIAL"/><select style={inp} value={newProj.status||"on-track"} onChange={e=>setNewProj(p=>({...p,status:e.target.value}))}>{Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></div>
            <div style={{marginBottom:20}}><Label t="DATA DE ENTREGA"/><input type="date" style={inp} value={newProj.deadline} onChange={e=>setNewProj(p=>({...p,deadline:e.target.value}))}/></div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={createProject} disabled={saving} style={{...btnP,flex:1,opacity:saving?0.6:1}}>{saving?"Criando...":"Criar Projeto"}</button>
              <button onClick={()=>setShowNP(false)} style={btnG}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div style={{width:220,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",padding:"28px 0",minHeight:"100vh",position:"sticky",top:0}}>
        <div style={{padding:"0 24px 28px"}}>
          <div style={{fontFamily:FONT_D,fontWeight:800,fontSize:18,color:C.accent}}>IMPLEMENTA</div>
          <div style={{color:C.muted,fontSize:10,letterSpacing:"0.15em"}}>GESTOR</div>
        </div>
        <nav style={{flex:1,padding:"0 12px",display:"flex",flexDirection:"column",gap:4}}>
          {navItems.map(n=>(<button key={n.id} className="nb" onClick={()=>{setView(n.id);setSel(null);}} style={{background:view===n.id?C.accentDim:"transparent",border:view===n.id?`1px solid ${C.accentBorder}`:"1px solid transparent",borderRadius:8,color:view===n.id?C.accent:C.muted,fontFamily:FONT,fontSize:13,padding:"10px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,textAlign:"left"}}><span style={{fontSize:16}}>{n.icon}</span>{n.label}{n.badge>0&&<span style={{marginLeft:"auto",background:n.bc,color:"#fff",borderRadius:20,fontSize:10,fontWeight:700,padding:"1px 7px"}}>{n.badge}</span>}</button>))}
        </nav>
        <div style={{padding:"20px 16px 0",borderTop:`1px solid ${C.border}`,marginTop:24}}>
          <button onClick={()=>setShowNP(true)} style={{...btnP,width:"100%",fontSize:12,marginBottom:8}}>+ Novo Projeto</button>
          <div style={{color:C.muted,fontSize:10,marginBottom:8}}><span style={{color:pulse?C.accent:C.muted,transition:"color .5s"}}>●</span> {projects.filter(p=>p.status!=="done").length} ativos · <span style={{color:C.accent}}>DB ✓</span></div>
          <div style={{color:C.muted,fontSize:11,marginBottom:6}}>📊 {user?.email?.split("@")[0]}</div>
          <button onClick={onLogout} style={{...btnG,width:"100%",fontSize:11,padding:"7px"}}>Sair</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{flex:1,overflow:"auto",padding:"36px 40px"}}>
        {sel?(
          // ── DETALHE DO PROJETO ──────────────────────────────
          <div>
            <button onClick={()=>setSel(null)} style={{background:"transparent",border:"none",color:C.muted,fontFamily:FONT,fontSize:13,cursor:"pointer",marginBottom:22,display:"flex",alignItems:"center",gap:6}}>← Voltar</button>

            {/* HEADER DO PROJETO */}
            {editProj?(
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20,marginBottom:20}}>
                <div style={{fontFamily:FONT_D,fontSize:16,fontWeight:800,marginBottom:16}}>✏️ Editar Projeto</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                  {[["NOME","name"],["CLIENTE","client"],["GESTOR","manager"]].map(([l,k])=>(
                    <div key={k}><Label t={l}/><input style={inp} value={projForm[k]||""} onChange={e=>setProjForm(f=>({...f,[k]:e.target.value}))}/></div>
                  ))}
                  <div><Label t="STATUS"/><select style={inp} value={projForm.status||"on-track"} onChange={e=>setProjForm(f=>({...f,status:e.target.value}))}>{Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></div>
                  <div><Label t="DATA DE ENTREGA"/><input type="date" style={inp} value={projForm.deadline||""} onChange={e=>setProjForm(f=>({...f,deadline:e.target.value}))}/></div>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={saveProject} disabled={saving} style={{...btnP,fontSize:12,padding:"8px 16px"}}>{saving?"Salvando...":"✓ Salvar"}</button>
                  <button onClick={()=>setEditProj(false)} style={{...btnG,fontSize:12,padding:"8px 16px"}}>Cancelar</button>
                  <button onClick={deleteProject} style={{background:C.danger+"15",border:`1px solid ${C.danger}40`,borderRadius:8,color:C.danger,fontFamily:FONT,fontSize:12,padding:"8px 16px",cursor:"pointer",marginLeft:"auto"}}>🗑 Excluir Projeto</button>
                </div>
              </div>
            ):(
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:12}}>
                <div>
                  <div style={{fontFamily:FONT_D,fontSize:26,fontWeight:800}}>{sel.name}</div>
                  <div style={{color:C.muted,fontSize:13,marginTop:4}}>{sel.client}{sel.manager&&` · Gestor: ${sel.manager}`}{sel.deadline&&` · Entrega: ${new Date(sel.deadline).toLocaleDateString("pt-BR")}`}</div>
                </div>
                <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                  <span style={{background:STATUS[sel.status]?.bg,color:STATUS[sel.status]?.color,border:`1px solid ${STATUS[sel.status]?.color}30`,borderRadius:4,padding:"2px 10px",fontSize:11,fontFamily:FONT,fontWeight:600}}>{STATUS[sel.status]?.label}</span>
                  {pendings.filter(x=>x.status==="open").length>0&&<span style={{background:C.warn+"20",color:C.warn,border:`1px solid ${C.warn}40`,borderRadius:4,padding:"2px 10px",fontSize:11,fontFamily:FONT}}>⚠ {pendings.filter(x=>x.status==="open").length}</span>}
                  <Ring value={sel.progress||0} size={52}/>
                  <button onClick={()=>setEditProj(true)} style={{background:C.subtle,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontFamily:FONT,fontSize:11,padding:"8px 14px",cursor:"pointer"}}>✏️ Editar</button>
                  {(sel.phase||0)<PHASES.length-1&&<button onClick={advancePhase} style={{...btnP,fontSize:11,padding:"8px 14px"}}>Avançar Fase →</button>}
                </div>
              </div>
            )}

            {!editProj&&<>
              <div style={{marginBottom:22}}><div style={{color:C.muted,fontSize:11,marginBottom:8,letterSpacing:"0.08em"}}>FASE: {PHASES[sel.phase||0].toUpperCase()}</div><div style={{display:"flex",gap:3}}>{PHASES.map((_,i)=><div key={i} onClick={async()=>{if(window.confirm(`Mover para fase "${PHASES[i]}"?`)){await api.patch("projects",{id:sel.id},{phase:i});setSel(prev=>({...prev,phase:i}));setProjects(prev=>prev.map(p=>p.id===sel.id?{...p,phase:i}:p));} }} style={{height:6,flex:1,borderRadius:2,background:i<(sel.phase||0)?C.accent:i===(sel.phase||0)?C.warn:C.border,cursor:"pointer",transition:"background .3s"}} title={PHASES[i]}/> )}</div></div>

              {/* TABS */}
              <div style={{display:"flex",marginBottom:22,borderBottom:`1px solid ${C.border}`,overflowX:"auto"}}>
                {[["tasks","Tarefas"],["pendings",`Pendências${pendings.filter(x=>x.status==="open").length>0?` (${pendings.filter(x=>x.status==="open").length})`:""}`],["messages","Comunicação"],["onboarding","Dados do Cliente"],["products",`Produtos (${products.length})`]].map(([id,label])=>(
                  <button key={id} onClick={()=>setTab(id)} style={{background:"transparent",border:"none",borderBottom:tab===id?`2px solid ${id==="pendings"?C.warn:C.accent}`:"2px solid transparent",color:tab===id?(id==="pendings"?C.warn:C.accent):C.muted,fontFamily:FONT,fontSize:12,padding:"10px 14px",cursor:"pointer",marginBottom:-1,whiteSpace:"nowrap"}}>{label}</button>
                ))}
              </div>

              {/* TAREFAS */}
              {tab==="tasks"&&(
                <div>
                  <div style={{display:"flex",gap:10,marginBottom:16}}>
                    <input style={{...inp,flex:1}} placeholder="Nova tarefa..." value={newTask} onChange={e=>setNewTask(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTask()}/>
                    <select style={{...inp,width:120}} value={assignee} onChange={e=>setAssignee(e.target.value)}>{["Ana","Pedro","Lucas","Carla","Rafael","Juliana"].map(n=><option key={n}>{n}</option>)}</select>
                    <button onClick={addTask} disabled={saving} style={btnP}>+ Add</button>
                  </div>
                  {tasks.length===0?<div style={{color:C.muted,textAlign:"center",padding:40}}>Nenhuma tarefa ainda.</div>:tasks.map(t=>(
                    <div key={t.id} style={{background:C.card,border:`1px solid ${t.done?C.accent+"30":C.border}`,borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,marginBottom:8,opacity:t.done?0.65:1}}>
                      <div onClick={()=>toggleTask(t)} style={{width:18,height:18,borderRadius:4,border:`2px solid ${t.done?C.accent:C.border}`,background:t.done?C.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>{t.done&&<span style={{color:"#000",fontSize:11}}>✓</span>}</div>
                      <span style={{flex:1,textDecoration:t.done?"line-through":"none",color:t.done?C.muted:C.text,fontSize:13}}>{t.title}</span>
                      <span style={{background:C.subtle,color:C.muted,borderRadius:4,padding:"2px 8px",fontSize:11}}>{t.assignee}</span>
                      <button onClick={()=>deleteTask(t.id)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:14,padding:"2px 6px"}}>×</button>
                    </div>
                  ))}
                </div>
              )}

              {/* PENDÊNCIAS */}
              {tab==="pendings"&&(
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                    <span style={{color:pendings.filter(x=>x.status==="open").length>0?C.danger:C.accent,fontFamily:FONT,fontSize:13,fontWeight:600}}>{pendings.filter(x=>x.status==="open").length} pendência(s)</span>
                    <button onClick={()=>{setPendStep(1);setShowPend(true);}} style={{...btnP,fontSize:12,padding:"8px 16px"}}>+ Registrar</button>
                  </div>
                  {pendings.filter(x=>x.status==="open").map(p=>{const pt=PTYPES.find(t=>t.id===p.type);const urg=URGENCY.find(u=>u.id===p.urgency);return(<div key={p.id} style={{background:urg?.color+"08",border:`1px solid ${urg?.color}35`,borderRadius:12,padding:"14px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}><span style={{fontSize:20}}>{pt?.icon}</span><div style={{flex:1}}><div style={{fontFamily:FONT_D,fontWeight:700,fontSize:13}}>{pt?.label}</div>{p.note&&<div style={{color:C.muted,fontSize:12}}>{p.note}</div>}<div style={{color:C.muted,fontSize:11,marginTop:4}}>⏳ {p.days_blocking}d bloqueando · {new Date(p.sent_at).toLocaleDateString("pt-BR")}</div></div><button onClick={()=>resolvePending(p.id)} style={{background:C.accentDim,border:`1px solid ${C.accentBorder}`,borderRadius:6,color:C.accent,fontFamily:FONT,fontSize:11,padding:"5px 10px",cursor:"pointer"}}>✓ Resolver</button></div>);})}
                  {pendings.filter(x=>x.status==="resolved").length>0&&<div style={{marginTop:16}}><div style={{color:C.muted,fontSize:11,letterSpacing:"0.1em",marginBottom:10}}>RESOLVIDAS</div>{pendings.filter(x=>x.status==="resolved").map(p=>{const pt=PTYPES.find(t=>t.id===p.type);return(<div key={p.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 14px",marginBottom:6,display:"flex",alignItems:"center",gap:10,opacity:0.5}}><span>{pt?.icon}</span><span style={{flex:1,textDecoration:"line-through",color:C.muted,fontSize:12}}>{pt?.label}</span><span style={{color:C.accent,fontSize:11}}>✓</span></div>);})}</div>}
                </div>
              )}

              {/* MENSAGENS */}
              {tab==="messages"&&(
                <div>
                  <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20,marginBottom:14,maxHeight:360,overflowY:"auto",display:"flex",flexDirection:"column",gap:12}}>
                    {messages.length===0?<div style={{color:C.muted,textAlign:"center",padding:40}}>Nenhuma mensagem.</div>:messages.map((m,i)=>(<div key={i} style={{display:"flex",justifyContent:m.from_role==="team"?"flex-end":"flex-start"}}><div style={{background:m.from_role==="team"?C.accentDim:C.subtle,border:`1px solid ${m.from_role==="team"?C.accentBorder:C.border}`,borderRadius:10,padding:"10px 14px",maxWidth:"72%"}}><div style={{fontSize:10,color:C.muted,marginBottom:4}}>{m.from_role==="team"?"📤 Equipe":"📥 Cliente"} · {new Date(m.created_at).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</div><div style={{fontSize:13}}>{m.text}</div></div></div>))}
                  </div>
                  <div style={{display:"flex",gap:10}}><input style={{...inp,flex:1}} placeholder="Mensagem..." value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMessage()}/><button onClick={sendMessage} style={btnP}>Enviar</button></div>
                </div>
              )}

              {/* DADOS DO CLIENTE / ONBOARDING */}
              {tab==="onboarding"&&(
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                    <div style={{fontFamily:FONT_D,fontSize:16,fontWeight:800}}>Dados do Cliente</div>
                    <button onClick={()=>setEditOnboarding(!editOnboarding)} style={{background:C.accentDim,border:`1px solid ${C.accentBorder}`,borderRadius:8,color:C.accent,fontFamily:FONT,fontSize:12,padding:"7px 14px",cursor:"pointer"}}>{editOnboarding?"Cancelar":"✏️ Editar"}</button>
                  </div>
                  {editOnboarding?(
                    <div>
                      {[["EMPRESA","company_name"],["CNPJ","cnpj"],["E-MAIL","email"],["TELEFONE","phone"],["ENDEREÇO","address"],["PLATAFORMA","platform"],["LOGIN PLATAFORMA","platform_login"],["ERP","erp"],["LOGIN ERP","erp_login"],["GATEWAY ENVIO","gateway_envio"],["GATEWAY PAGAMENTO","gateway_pagamento"],["CORES","cores"],["CATEGORIAS","categorias"],["REDES SOCIAIS","redes_sociais"],["REFERÊNCIAS","referencias_sites"]].map(([l,k])=>(
                        <div key={k} style={{marginBottom:10}}>
                          <Label t={l}/>
                          <input style={inp} value={obForm[k]||""} onChange={e=>setObForm(f=>({...f,[k]:e.target.value}))}/>
                        </div>
                      ))}
                      <div style={{marginBottom:10}}><Label t="QUEM SOMOS"/><textarea style={{...inp,minHeight:80,resize:"vertical"}} value={obForm.quem_somos||""} onChange={e=>setObForm(f=>({...f,quem_somos:e.target.value}))}/></div>
                      <div style={{marginBottom:16}}><Label t="ATENDIMENTO"/><textarea style={{...inp,minHeight:60,resize:"vertical"}} value={obForm.atendimento_info||""} onChange={e=>setObForm(f=>({...f,atendimento_info:e.target.value}))}/></div>
                      <button onClick={saveOnboarding} disabled={saving} style={{...btnP,fontSize:12}}>{saving?"Salvando...":"✓ Salvar Dados"}</button>
                    </div>
                  ):(
                    !onboarding?<div style={{textAlign:"center",padding:48,color:C.muted}}><div style={{fontSize:36,marginBottom:12}}>⏳</div><div>Cliente ainda não preencheu o formulário</div><button onClick={()=>setEditOnboarding(true)} style={{...btnP,marginTop:16,fontSize:12}}>Preencher manualmente</button></div>
                    :<div style={{display:"grid",gap:8}}>{[["Empresa",onboarding.company_name],["CNPJ",onboarding.cnpj],["E-mail",onboarding.email],["Telefone",onboarding.phone],["Endereço",onboarding.address],["Plataforma",onboarding.platform],["ERP",onboarding.erp],["Gateway Envio",onboarding.gateway_envio],["Gateway Pagamento",onboarding.gateway_pagamento],["Cores",onboarding.cores],["Categorias",onboarding.categorias],["Redes Sociais",onboarding.redes_sociais],["Quem Somos",onboarding.quem_somos],["Atendimento",onboarding.atendimento_info]].map(([l,v])=>v&&(<div key={l} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",display:"flex",gap:12,flexWrap:"wrap"}}><span style={{color:C.muted,fontSize:12,minWidth:160,flexShrink:0}}>{l}</span><span style={{color:C.text,fontSize:12,fontWeight:600,wordBreak:"break-all"}}>{v}</span></div>))}</div>
                  )}
                </div>
              )}

              {/* PRODUTOS */}
              {tab==="products"&&(
                <div>
                  {products.length===0?<div style={{textAlign:"center",padding:48,color:C.muted}}><div style={{fontSize:36,marginBottom:12}}>📦</div><div>Nenhum produto cadastrado</div></div>
                  :<div>{products.map(p=>(<div key={p.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:10,display:"flex",gap:12,alignItems:"flex-start"}}>{p.images&&p.images.length>0?<img src={p.images[0]} style={{width:56,height:56,objectFit:"cover",borderRadius:8,flexShrink:0}}/>:<div style={{width:56,height:56,background:C.subtle,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>📦</div>}<div style={{flex:1}}><div style={{fontFamily:FONT_D,fontWeight:700,fontSize:13}}>{p.name}</div><div style={{color:C.muted,fontSize:12}}>{p.category}</div><div style={{display:"flex",gap:10,marginTop:6,flexWrap:"wrap"}}><span style={{color:C.accent,fontSize:12}}>R$ {parseFloat(p.price||0).toFixed(2)}</span><span style={{color:C.muted,fontSize:12}}>Estoque: {p.stock}</span>{p.code&&<span style={{color:C.muted,fontSize:12}}>Cód: {p.code}</span>}{p.ean&&<span style={{color:C.muted,fontSize:12}}>EAN: {p.ean}</span>}{p.weight&&<span style={{color:C.muted,fontSize:12}}>{p.weight}kg</span>}</div></div>{p.images&&p.images.length>1&&<span style={{color:C.muted,fontSize:11}}>📷 {p.images.length}</span>}</div>))}</div>}
                </div>
              )}
            </>}
          </div>
        ):loading?<Spinner/>:(
          <>
            {/* ── DASHBOARD ── */}
            {view==="dashboard"&&(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:24,flexWrap:"wrap",gap:12}}>
                  <div>
                    <div style={{fontFamily:FONT_D,fontSize:30,fontWeight:800,marginBottom:4}}>Dashboard</div>
                    <div style={{color:C.muted,fontSize:13}}>Olá, {user?.email?.split("@")[0]} 👋 — visão geral em tempo real</div>
                  </div>
                  <button onClick={loadProjects} style={{...btnG,fontSize:12,padding:"8px 14px"}}>↻ Atualizar</button>
                </div>

                {/* STAT CARDS */}
                <div style={{display:"flex",gap:12,marginBottom:24,flexWrap:"wrap"}}>
                  <StatCard label="Total" value={stats.total} icon="⬡"/>
                  <StatCard label="No Prazo" value={stats.onTrack} color={C.accent} icon="◎"/>
                  <StatCard label="Em Risco" value={stats.atRisk} color={C.warn} icon="◉"/>
                  <StatCard label="Atrasados" value={stats.delayed} color={C.danger} icon="◈"/>
                  <StatCard label="Concluídos" value={stats.done} color={C.purple} icon="★"/>
                  <StatCard label="Pendências" value={totalPend} color={totalPend>0?C.warn:C.accent} icon="⚠" sub="em aberto"/>
                </div>

                {/* CHARTS ROW */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:28}}>
                  <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
                    <div style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",marginBottom:16}}>STATUS DOS PROJETOS</div>
                    <BarChart
                      data={[{label:"No prazo",value:stats.onTrack},{label:"Em risco",value:stats.atRisk},{label:"Atrasado",value:stats.delayed},{label:"Concluído",value:stats.done}]}
                      colors={[C.accent,C.warn,C.danger,C.purple]}
                    />
                  </div>
                  <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20,display:"flex",justifyContent:"center"}}>
                    <div>
                      <div style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",marginBottom:16,textAlign:"center"}}>PROGRESSO MÉDIO</div>
                      <DonutChart value={stats.avgProgress} total={100} color={C.accent} label="média geral"/>
                    </div>
                  </div>
                  <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
                    <div style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",marginBottom:16}}>PROJETOS POR FASE</div>
                    <BarChart
                      data={PHASES.map((ph,i)=>({label:ph.substring(0,6),value:projects.filter(p=>(p.phase||0)===i).length}))}
                      colors={[C.muted,C.blue,C.accent,C.warn,C.purple,C.danger]}
                    />
                  </div>
                </div>

                {/* ALERTAS RÁPIDOS */}
                {(stats.delayed>0||stats.atRisk>0||totalPend>0)&&(
                  <div style={{background:"#EF444408",border:"1px solid #EF444430",borderRadius:12,padding:"16px 20px",marginBottom:24}}>
                    <div style={{fontFamily:FONT_D,fontWeight:700,fontSize:14,color:C.danger,marginBottom:10}}>⚠ Atenção necessária</div>
                    <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                      {stats.delayed>0&&<span style={{color:C.danger,fontSize:13}}>🔴 {stats.delayed} projeto(s) atrasado(s)</span>}
                      {stats.atRisk>0&&<span style={{color:C.warn,fontSize:13}}>🟡 {stats.atRisk} projeto(s) em risco</span>}
                      {totalPend>0&&<span style={{color:C.warn,fontSize:13}}>⚠ {totalPend} pendência(s) do cliente</span>}
                    </div>
                  </div>
                )}

                {/* LISTA PROJETOS */}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <div style={{fontFamily:FONT_D,fontSize:18,fontWeight:800}}>Todos os Projetos</div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>setView("kanban")} style={{...btnG,fontSize:12,padding:"7px 14px"}}>⊞ Kanban</button>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {projects.map(p=>{
                    const op=(p.pendings||[]).filter(x=>x.status==="open").length;
                    return(
                      <div key={p.id} className="ch" onClick={()=>openProject(p)} style={{background:C.card,border:`1px solid ${op>0?C.warn+"40":C.border}`,borderRadius:12,padding:"16px 22px",display:"flex",alignItems:"center",gap:18,flexWrap:"wrap"}}>
                        <Ring value={p.progress||0} size={46}/>
                        <div style={{flex:1,minWidth:150}}>
                          <div style={{fontFamily:FONT_D,fontWeight:700,fontSize:15}}>{p.name}</div>
                          <div style={{color:C.muted,fontSize:12}}>{p.client}{p.manager&&` · ${p.manager}`}</div>
                          <div style={{marginTop:8}}><div style={{display:"flex",gap:3}}>{PHASES.map((_,i)=><div key={i} style={{height:4,flex:1,borderRadius:2,background:i<(p.phase||0)?C.accent:i===(p.phase||0)?C.warn:C.border}}/>)}</div></div>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
                          <div style={{display:"flex",gap:6}}><span style={{background:STATUS[p.status]?.bg,color:STATUS[p.status]?.color,border:`1px solid ${STATUS[p.status]?.color}30`,borderRadius:4,padding:"2px 10px",fontSize:11,fontFamily:FONT,fontWeight:600}}>{STATUS[p.status]?.label}</span>{op>0&&<span style={{background:C.warn+"20",color:C.warn,border:`1px solid ${C.warn}40`,borderRadius:4,padding:"2px 8px",fontSize:11}}>⚠ {op}</span>}</div>
                          <div style={{color:p.daysLeft<0?C.danger:p.daysLeft<7?C.warn:C.muted,fontSize:12}}>{p.daysLeft===null?"Sem prazo":p.daysLeft<0?`${Math.abs(p.daysLeft)}d atraso`:p.daysLeft===0?"Hoje":`${p.daysLeft}d`}</div>
                          <div style={{color:C.muted,fontSize:11}}>{PHASES[p.phase||0]} · {(p.tasks||[]).filter(t=>t.done).length}/{(p.tasks||[]).length} tarefas</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── KANBAN ── */}
            {view==="kanban"&&(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:24,flexWrap:"wrap",gap:12}}>
                  <div>
                    <div style={{fontFamily:FONT_D,fontSize:30,fontWeight:800,marginBottom:4}}>Kanban</div>
                    <div style={{color:C.muted,fontSize:13}}>{projects.length} projetos · arraste para mover de fase</div>
                  </div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {[["all","Todos"],["on-track","No prazo"],["at-risk","Em risco"],["delayed","Atrasados"]].map(([val,label])=>(
                      <button key={val} onClick={()=>setFilterSt(val)} style={{background:filterSt===val?C.accentDim:"transparent",border:`1px solid ${filterSt===val?C.accentBorder:C.border}`,borderRadius:6,color:filterSt===val?C.accent:C.muted,fontFamily:FONT,fontSize:12,padding:"6px 14px",cursor:"pointer"}}>{label}</button>
                    ))}
                  </div>
                </div>
                <KanbanView projects={filtered} onOpenProject={openProject} onMovePhase={movePhase}/>
              </div>
            )}

            {/* ── PROJETOS ── */}
            {view==="projects"&&(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:26,flexWrap:"wrap",gap:12}}>
                  <div><div style={{fontFamily:FONT_D,fontSize:30,fontWeight:800}}>Projetos</div><div style={{color:C.muted,fontSize:13}}>{filtered.length} projeto(s)</div></div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {[["all","Todos"],["on-track","No prazo"],["at-risk","Em risco"],["delayed","Atrasados"],["done","Concluídos"]].map(([val,label])=>(
                      <button key={val} onClick={()=>setFilterSt(val)} style={{background:filterSt===val?C.accentDim:"transparent",border:`1px solid ${filterSt===val?C.accentBorder:C.border}`,borderRadius:6,color:filterSt===val?C.accent:C.muted,fontFamily:FONT,fontSize:12,padding:"6px 14px",cursor:"pointer"}}>{label}</button>
                    ))}
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
                  {filtered.map(p=>{
                    const op=(p.pendings||[]).filter(x=>x.status==="open").length;
                    return(
                      <div key={p.id} className="ch" onClick={()=>openProject(p)} style={{background:C.card,border:`1px solid ${op>0?C.warn+"40":C.border}`,borderRadius:14,padding:20}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                          <div><div style={{fontFamily:FONT_D,fontWeight:700,fontSize:15}}>{p.name}</div><div style={{color:C.muted,fontSize:12,marginTop:3}}>{p.client}</div></div>
                          <Ring value={p.progress||0} size={48}/>
                        </div>
                        <div style={{display:"flex",gap:3,marginBottom:8}}>{PHASES.map((_,i)=><div key={i} style={{height:4,flex:1,borderRadius:2,background:i<(p.phase||0)?C.accent:i===(p.phase||0)?C.warn:C.border}}/>)}</div>
                        <div style={{fontSize:11,color:C.muted,marginBottom:10}}>{PHASES[p.phase||0]}</div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <span style={{background:STATUS[p.status]?.bg,color:STATUS[p.status]?.color,border:`1px solid ${STATUS[p.status]?.color}30`,borderRadius:4,padding:"2px 10px",fontSize:11,fontFamily:FONT,fontWeight:600}}>{STATUS[p.status]?.label}</span>
                          {op>0&&<span style={{color:C.warn,fontSize:12}}>⚠ {op}</span>}
                        </div>
                        <div style={{marginTop:10,display:"flex",justifyContent:"space-between",fontSize:11,color:C.muted}}>
                          <span>{p.manager||"—"}</span>
                          <span>{p.daysLeft===null?"—":p.daysLeft<0?`${Math.abs(p.daysLeft)}d atraso`:`${p.daysLeft}d`}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── PENDÊNCIAS ── */}
            {view==="pendings"&&(
              <div>
                <div style={{fontFamily:FONT_D,fontSize:30,fontWeight:800,marginBottom:4}}>Central de Pendências</div>
                <div style={{color:C.muted,fontSize:13,marginBottom:28}}>{allOpenPendings.length} pendência(s) bloqueando projetos</div>
                {allOpenPendings.length===0?<div style={{textAlign:"center",padding:80}}><div style={{fontSize:48,marginBottom:16}}>🎉</div><div style={{fontFamily:FONT_D,fontSize:22,color:C.accent}}>Nenhuma pendência!</div></div>
                :["high","medium","low"].map(u=>{
                  const items=allOpenPendings.filter(x=>x.urgency===u);
                  if(!items.length) return null;
                  const urg=URGENCY.find(x=>x.id===u);
                  return(<div key={u} style={{marginBottom:28}}><div style={{color:urg.color,fontFamily:FONT_D,fontWeight:700,fontSize:15,marginBottom:12}}>{u==="high"?"🔴":u==="medium"?"🟡":"🟢"} {urg.label.toUpperCase()} — {items.length}</div>{items.map(item=>{const pt=PTYPES.find(t=>t.id===item.type);return(<div key={item.id} className="ch" onClick={()=>openProject(item.project)} style={{background:urg.color+"08",border:`1px solid ${urg.color}30`,borderRadius:12,padding:"14px 18px",marginBottom:8,display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}><span style={{fontSize:22}}>{pt?.icon}</span><div style={{flex:1}}><div style={{fontFamily:FONT_D,fontWeight:700}}>{item.project.name}</div><div style={{color:C.muted,fontSize:12}}>{item.project.client} · {pt?.label}</div>{item.note&&<div style={{color:C.muted,fontSize:11,marginTop:2}}>{item.note}</div>}</div><span style={{color:C.danger,fontSize:12}}>⏳ {item.days_blocking}d</span></div>);})}</div>);
                })}
              </div>
            )}

            {/* ── ALERTAS ── */}
            {view==="alerts"&&(
              <div>
                <div style={{fontFamily:FONT_D,fontSize:30,fontWeight:800,marginBottom:28}}>Central de Alertas</div>
                {projects.filter(p=>p.status==="delayed").length>0&&(<div style={{marginBottom:24}}><div style={{color:C.danger,fontFamily:FONT_D,fontWeight:700,fontSize:15,marginBottom:12}}>🔴 ATRASADOS</div>{projects.filter(p=>p.status==="delayed").map(p=>(<div key={p.id} className="ch" onClick={()=>openProject(p)} style={{background:"#EF444408",border:"1px solid #EF444430",borderRadius:12,padding:"14px 18px",marginBottom:8,display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}><div style={{flex:1}}><div style={{fontFamily:FONT_D,fontWeight:700}}>{p.name}</div><div style={{color:C.muted,fontSize:12}}>{p.client} · {(p.pendings||[]).filter(x=>x.status==="open").length} pendência(s)</div></div><div style={{color:C.danger,fontSize:12,fontWeight:600}}>{Math.abs(p.daysLeft||0)}d atraso</div></div>))}</div>)}
                {projects.filter(p=>p.status==="at-risk").length>0&&(<div style={{marginBottom:24}}><div style={{color:C.warn,fontFamily:FONT_D,fontWeight:700,fontSize:15,marginBottom:12}}>🟡 EM RISCO</div>{projects.filter(p=>p.status==="at-risk").map(p=>(<div key={p.id} className="ch" onClick={()=>openProject(p)} style={{background:"#F59E0B08",border:"1px solid #F59E0B30",borderRadius:12,padding:"14px 18px",marginBottom:8,display:"flex",alignItems:"center",gap:14}}><div style={{flex:1}}><div style={{fontFamily:FONT_D,fontWeight:700}}>{p.name}</div><div style={{color:C.muted,fontSize:12}}>{p.client}</div></div><div style={{color:C.warn,fontSize:12,fontWeight:600}}>{p.daysLeft}d restantes</div><Ring value={p.progress||0} size={44}/></div>))}</div>)}
                {stats.delayed===0&&stats.atRisk===0&&<div style={{textAlign:"center",padding:80}}><div style={{fontSize:48,marginBottom:16}}>✦</div><div style={{fontFamily:FONT_D,fontSize:20,color:C.accent}}>Tudo sob controle!</div></div>}
              </div>
            )}

            {/* ── USUÁRIOS ── */}
            {view==="users"&&<UsersView/>}
          </>
        )}
      </div>
    </div>
  );
};

// ── MAIN APP ─────────────────────────────────────────────────
export default function App() {
  const [token,setToken]=useState(localStorage.getItem("sb_token"));
  const [user,setUser]=useState(JSON.parse(localStorage.getItem("sb_user")||"null"));
  const [profile,setProfile]=useState(JSON.parse(localStorage.getItem("sb_profile")||"null"));

  useEffect(()=>{
    const hash=window.location.hash;
    if(hash&&hash.includes("access_token")){
      const params=new URLSearchParams(hash.substring(1));
      const t=params.get("access_token");
      if(t){ auth.getUser(t).then(u=>{ localStorage.setItem("sb_token",t);localStorage.setItem("sb_user",JSON.stringify(u));setToken(t);setUser(u);window.history.replaceState(null,"",window.location.pathname); }); }
    }
  },[]);

  useEffect(()=>{
    if(token&&user){
      api.get("profiles",`id=eq.${user.id}`).then(d=>{
        if(d&&d.length>0){
          const p=d[0];
          // Pega o role do metadata se não tiver no profile
          const role=p.role||user.user_metadata?.role||"client";
          const merged={...p,role};
          setProfile(merged);
          localStorage.setItem("sb_profile",JSON.stringify(merged));
        } else {
          // Fallback: usa o role do metadata
          const role=user.user_metadata?.role||"client";
          const p={id:user.id,role,name:user.user_metadata?.name||user.email};
          setProfile(p);
          localStorage.setItem("sb_profile",JSON.stringify(p));
        }
      });
    }
  },[token,user]);

  const handleLogin=(t,u)=>{ setToken(t); setUser(u); };
  const handleLogout=async()=>{
    await auth.signOut(token);
    localStorage.removeItem("sb_token");
    localStorage.removeItem("sb_user");
    localStorage.removeItem("sb_profile");
    setToken(null);setUser(null);setProfile(null);
  };

  if(!token||!user) return <LoginScreen onLogin={handleLogin}/>;
  if(!profile) return <div style={{background:"#0A0D12",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><style>{GLOBAL_STYLE}</style><Spinner/></div>;

  const role=profile.role||"client";

  if(role==="client")    return <ClientDashboard   user={user} token={token} onLogout={handleLogout}/>;
  if(role==="tech")      return <TechDashboard     user={user} token={token} onLogout={handleLogout}/>;
  if(role==="products")  return <ProductsDashboard user={user} token={token} onLogout={handleLogout}/>;
  return                        <AdminDashboard    user={user} token={token} onLogout={handleLogout}/>;
}
