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
  textarea,select,input{font-family:'DM Mono','Courier New',monospace;color:#E8EDF5}
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
  const [activeSection,setActiveSection]=useState("onboarding");
  const [step,setStep]=useState(0);
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);
  const [projects,setProjects]=useState([]);
  const [selectedProject,setSelectedProject]=useState("");
  const [products,setProducts]=useState([]);
  const [showProdForm,setShowProdForm]=useState(false);
  const [loadingProds,setLoadingProds]=useState(false);
  const [form,setForm]=useState({
    company_name:"",cnpj:"",email:"",phone:"",address:"",
    platform:"",platform_login:"",platform_password:"",
    registrobr_login:"",registrobr_password:"",
    erp:"",erp_login:"",erp_password:"",
    gateway_envio:"",gateway_pagamento:"",certificado_senha:"",
    atendimento_info:"",quem_somos:"",cores:"",
    categorias:"",redes_sociais:"",referencias_sites:""
  });
  const [prodForm,setProdForm]=useState({code:"",ean:"",name:"",description:"",category:"",price:"",stock:"",weight:"",height:"",width:"",length:""});
  const [images,setImages]=useState([]);

  useEffect(()=>{ api.get("projects","order=created_at.desc").then(d=>setProjects(d||[])); },[]);

  useEffect(()=>{
    if(selectedProject&&activeSection==="products"){
      setLoadingProds(true);
      api.get("products",`project_id=eq.${selectedProject}&order=created_at.desc`).then(d=>{setProducts(d||[]);setLoadingProds(false);});
    }
  },[selectedProject,activeSection]);

  const F=(k)=>({...inp,value:form[k],onChange:e=>setForm(f=>({...f,[k]:e.target.value}))});
  const Label=({t})=>(<label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>{t}</label>);
  const Field=({label,k,type="text",placeholder=""})=>(<div style={{marginBottom:14}}><Label t={label}/><input type={type} {...F(k)} placeholder={placeholder} style={inp}/></div>);
  const TextArea=({label,k,placeholder=""})=>(<div style={{marginBottom:14}}><Label t={label}/><textarea {...F(k)} placeholder={placeholder} style={{...inp,minHeight:80,resize:"vertical"}}/></div>);

  const STEPS=[
    {title:"Dados da Empresa",icon:"🏢"},
    {title:"Plataforma & Domínio",icon:"🌐"},
    {title:"Acessos & Integrações",icon:"🔑"},
    {title:"Identidade Visual",icon:"🎨"},
    {title:"Conteúdo & Categorias",icon:"📝"},
    {title:"Redes Sociais & Referências",icon:"📱"},
  ];

  const handleSaveOnboarding=async()=>{
    if(!selectedProject){alert("Selecione um projeto!");return;}
    setSaving(true);
    try{
      const existing=await api.get("onboarding",`project_id=eq.${selectedProject}`);
      if(existing&&existing.length>0){await api.patch("onboarding",{project_id:selectedProject},{...form,status:"submitted"});}
      else{await api.post("onboarding",{...form,project_id:selectedProject,status:"submitted"});}
      setSaved(true);
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

  const handleSaveProd=async()=>{
    if(!selectedProject||!prodForm.name){alert("Selecione um projeto e preencha o nome!");return;}
    setSaving(true);
    try{
      await api.post("products",{...prodForm,project_id:selectedProject,price:parseFloat(prodForm.price)||0,stock:parseInt(prodForm.stock)||0,weight:parseFloat(prodForm.weight)||0,images,status:"pending"});
      setProdForm({code:"",ean:"",name:"",description:"",category:"",price:"",stock:"",weight:"",height:"",width:"",length:""});
      setImages([]);setShowProdForm(false);
      const d=await api.get("products",`project_id=eq.${selectedProject}&order=created_at.desc`);
      setProducts(d||[]);
    }catch(e){alert("Erro: "+e.message);}
    setSaving(false);
  };

  const PF=(k,type="text",placeholder="")=>(<input type={type} style={inp} placeholder={placeholder} value={prodForm[k]} onChange={e=>setProdForm(f=>({...f,[k]:e.target.value}))}/>);

  return(
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:FONT,color:C.text}}>
      <style>{GLOBAL_STYLE}</style>
      {/* HEADER */}
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:10}}>
        <div>
          <div style={{fontFamily:FONT_D,fontWeight:800,fontSize:18,color:C.accent}}>IMPLEMENTA</div>
          <div style={{color:C.muted,fontSize:10,letterSpacing:"0.15em"}}>PORTAL DO CLIENTE</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={onLogout} style={{...btnG,padding:"6px 14px",fontSize:12}}>Sair</button>
        </div>
      </div>

      {/* SECTION TABS */}
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"0 20px",display:"flex",gap:0}}>
        {[["onboarding","📋 Informações do Projeto"],["products","📦 Cadastro de Produtos"]].map(([id,label])=>(
          <button key={id} onClick={()=>setActiveSection(id)} style={{background:"transparent",border:"none",borderBottom:activeSection===id?`2px solid ${C.accent}`:"2px solid transparent",color:activeSection===id?C.accent:C.muted,fontFamily:FONT,fontSize:13,padding:"14px 20px",cursor:"pointer",marginBottom:-1}}>{label}</button>
        ))}
      </div>

      <div style={{maxWidth:680,margin:"0 auto",padding:"24px 16px"}}>
        {/* SELETOR DE PROJETO */}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 20px",marginBottom:20}}>
          <Label t="SELECIONE SEU PROJETO"/>
          <select style={inp} value={selectedProject} onChange={e=>setSelectedProject(e.target.value)}>
            <option value="">-- Selecione seu projeto --</option>
            {projects.map(p=><option key={p.id} value={p.id}>{p.name} — {p.client}</option>)}
          </select>
        </div>

        {/* ONBOARDING */}
        {activeSection==="onboarding"&&(
          saved?(
            <div style={{textAlign:"center",padding:40,background:C.card,border:`1px solid ${C.border}`,borderRadius:16}}>
              <div style={{fontSize:56,marginBottom:16}}>✅</div>
              <div style={{fontFamily:FONT_D,fontSize:22,fontWeight:800,color:C.accent,marginBottom:8}}>Informações Enviadas!</div>
              <div style={{color:C.muted,fontSize:13,marginBottom:24}}>Nossa equipe recebeu seus dados e entrará em contato em breve.</div>
              <div style={{display:"flex",gap:10,justifyContent:"center"}}>
                <button onClick={()=>setSaved(false)} style={btnG}>Editar informações</button>
                <button onClick={()=>setActiveSection("products")} style={btnP}>Cadastrar Produtos →</button>
              </div>
            </div>
          ):(
            <div>
              <div style={{display:"flex",gap:4,marginBottom:20,overflowX:"auto",paddingBottom:4}}>
                {STEPS.map((s,i)=>(<button key={i} onClick={()=>setStep(i)} style={{background:step===i?C.accentDim:i<step?C.subtle:"transparent",border:`1px solid ${step===i?C.accent:i<step?C.accentBorder:C.border}`,borderRadius:8,color:step===i?C.accent:i<step?C.text:C.muted,fontFamily:FONT,fontSize:11,padding:"8px 12px",cursor:"pointer",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:6}}>
                  {i<step?<span style={{color:C.accent}}>✓</span>:<span>{s.icon}</span>}{s.title}
                </button>))}
              </div>

              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:28}} className="fade">
                <div style={{fontFamily:FONT_D,fontSize:18,fontWeight:800,marginBottom:20}}>{STEPS[step].icon} {STEPS[step].title}</div>

                {step===0&&<>
                  <Field label="RAZÃO SOCIAL / NOME DA EMPRESA" k="company_name" placeholder="Ex: Loja XYZ LTDA"/>
                  <Field label="CNPJ" k="cnpj" placeholder="00.000.000/0001-00"/>
                  <Field label="E-MAIL COMERCIAL" k="email" type="email" placeholder="contato@empresa.com.br"/>
                  <Field label="TELEFONE / WHATSAPP" k="phone" placeholder="(11) 99999-9999"/>
                  <TextArea label="ENDEREÇO COMPLETO" k="address" placeholder="Rua, número, bairro, cidade, estado, CEP"/>
                </>}
                {step===1&&<>
                  <div style={{marginBottom:14}}>
                    <Label t="PLATAFORMA DE ECOMMERCE"/>
                    <select style={inp} value={form.platform} onChange={e=>setForm(f=>({...f,platform:e.target.value}))}>
                      <option value="">-- Selecione --</option>
                      {["VTEX","Shopify","Nuvemshop","Loja Integrada","Tray","WooCommerce","Magento","Outro"].map(p=><option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <Field label="LOGIN DA PLATAFORMA" k="platform_login" placeholder="usuário ou e-mail"/>
                  <Field label="SENHA DA PLATAFORMA" k="platform_password" type="password" placeholder="••••••••"/>
                  <Field label="LOGIN REGISTRO.BR (DOMÍNIO)" k="registrobr_login" placeholder="usuário do registro.br"/>
                  <Field label="SENHA REGISTRO.BR" k="registrobr_password" type="password" placeholder="••••••••"/>
                </>}
                {step===2&&<>
                  <Field label="ERP UTILIZADO" k="erp" placeholder="Ex: Bling, Tiny, SAP, TOTVS..."/>
                  <Field label="LOGIN DO ERP" k="erp_login" placeholder="usuário ou e-mail"/>
                  <Field label="SENHA DO ERP" k="erp_password" type="password" placeholder="••••••••"/>
                  <Field label="GATEWAY DE ENVIO" k="gateway_envio" placeholder="Ex: Melhor Envio, Frenet, Correios..."/>
                  <Field label="GATEWAY DE PAGAMENTO" k="gateway_pagamento" placeholder="Ex: PagSeguro, Mercado Pago, Cielo..."/>
                  <Field label="SENHA DO CERTIFICADO DIGITAL" k="certificado_senha" type="password" placeholder="Senha do certificado A1/A3"/>
                  <div style={{background:C.warn+"10",border:`1px solid ${C.warn}30`,borderRadius:8,padding:"10px 14px",fontSize:12,color:C.warn}}>⚠ O certificado digital (.pfx) deve ser enviado por e-mail ou WhatsApp para a equipe técnica</div>
                </>}
                {step===3&&<>
                  <TextArea label="CORES DA MARCA (HEX ou descrição)" k="cores" placeholder="Ex: Primária #FF0000, Secundária #000000"/>
                  <div style={{background:C.accentDim,border:`1px solid ${C.accentBorder}`,borderRadius:8,padding:"10px 14px",fontSize:12,color:C.accent,marginBottom:14}}>📎 Envie logo e manual da marca por e-mail ou WhatsApp para a equipe</div>
                  <TextArea label="INFORMAÇÕES DE ATENDIMENTO" k="atendimento_info" placeholder="Horário, telefone, e-mail de SAC..."/>
                  <TextArea label="QUEM SOMOS" k="quem_somos" placeholder="Breve descrição da empresa..."/>
                </>}
                {step===4&&<>
                  <TextArea label="CATEGORIAS E SUBCATEGORIAS" k="categorias" placeholder="Ex: Camisetas > Masculino, Feminino&#10;Calças > Jeans, Social"/>
                  <TextArea label="SITES DE REFERÊNCIA" k="referencias_sites" placeholder="Links de sites que gosta como referência"/>
                </>}
                {step===5&&<>
                  <TextArea label="REDES SOCIAIS" k="redes_sociais" placeholder="Instagram: @loja&#10;Facebook: /loja&#10;TikTok: @loja"/>
                  <TextArea label="REFERÊNCIAS DE CONCORRENTES" k="referencias_sites" placeholder="Sites de concorrentes ou referências"/>
                </>}

                <div style={{display:"flex",justifyContent:"space-between",marginTop:24,gap:10}}>
                  <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0} style={{...btnG,opacity:step===0?0.4:1}}>← Anterior</button>
                  {step<STEPS.length-1
                    ?<button onClick={()=>setStep(s=>s+1)} style={btnP}>Próximo →</button>
                    :<button onClick={handleSaveOnboarding} disabled={saving} style={{...btnP,opacity:saving?0.6:1}}>{saving?<Spinner small/>:"✅ Enviar Informações"}</button>
                  }
                </div>
              </div>

              <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:16}}>
                {STEPS.map((_,i)=>(<div key={i} style={{width:i===step?20:8,height:8,borderRadius:4,background:i===step?C.accent:i<step?C.accentBorder:C.border,transition:"all .3s"}}/>))}
              </div>
            </div>
          )
        )}

        {/* PRODUTOS */}
        {activeSection==="products"&&(
          <div>
            {!selectedProject?(
              <div style={{textAlign:"center",padding:48,color:C.muted}}>
                <div style={{fontSize:36,marginBottom:12}}>👆</div>
                <div>Selecione seu projeto acima para cadastrar produtos</div>
              </div>
            ):(
              <>
                <button onClick={()=>setShowProdForm(true)} style={{...btnP,width:"100%",marginBottom:20,fontSize:14,padding:"14px"}}>+ Adicionar Produto</button>

                {showProdForm&&(
                  <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:20,marginBottom:20}} className="fade">
                    <div style={{fontFamily:FONT_D,fontSize:16,fontWeight:800,marginBottom:16}}>📦 Novo Produto</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                      <div><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>CÓD. PRODUTO</label>{PF("code","text","Opcional")}</div>
                      <div><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>EAN</label>{PF("ean","text","Opcional")}</div>
                    </div>
                    <div style={{marginBottom:10}}><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>NOME DO PRODUTO *</label>{PF("name","text","Nome completo do produto")}</div>
                    <div style={{marginBottom:10}}><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>DESCRIÇÃO</label><textarea style={{...inp,minHeight:80,resize:"vertical"}} placeholder="Descrição detalhada..." value={prodForm.description} onChange={e=>setProdForm(f=>({...f,description:e.target.value}))}/></div>
                    <div style={{marginBottom:10}}><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>CATEGORIA</label>{PF("category","text","Ex: Camisetas > Masculino")}</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                      <div><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>PREÇO (R$)</label>{PF("price","number","0,00")}</div>
                      <div><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>ESTOQUE</label>{PF("stock","number","0")}</div>
                    </div>
                    <div style={{marginBottom:10}}>
                      <label style={{color:C.muted,fontSize:11,display:"block",marginBottom:8}}>MEDIDAS PARA FRETE</label>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                        <div><label style={{color:C.muted,fontSize:10,display:"block",marginBottom:4}}>PESO (kg)</label>{PF("weight","number","0.5")}</div>
                        <div><label style={{color:C.muted,fontSize:10,display:"block",marginBottom:4}}>ALTURA (cm)</label>{PF("height","number","10")}</div>
                        <div><label style={{color:C.muted,fontSize:10,display:"block",marginBottom:4}}>LARGURA (cm)</label>{PF("width","number","15")}</div>
                        <div><label style={{color:C.muted,fontSize:10,display:"block",marginBottom:4}}>COMPRIMENTO (cm)</label>{PF("length","number","20")}</div>
                      </div>
                    </div>
                    <div style={{marginBottom:16}}>
                      <label style={{color:C.muted,fontSize:11,display:"block",marginBottom:8}}>FOTOS (até 5 imagens) 📱</label>
                      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
                        {images.map((img,i)=>(
                          <div key={i} style={{position:"relative"}}>
                            <img src={img} style={{width:72,height:72,objectFit:"cover",borderRadius:8,border:`1px solid ${C.border}`}}/>
                            <button onClick={()=>setImages(prev=>prev.filter((_,j)=>j!==i))} style={{position:"absolute",top:-6,right:-6,background:C.danger,border:"none",borderRadius:"50%",width:18,height:18,color:"#fff",fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                          </div>
                        ))}
                        {images.length<5&&(
                          <label style={{width:72,height:72,border:`2px dashed ${C.border}`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:C.muted,fontSize:24}}>
                            +<input type="file" accept="image/*" multiple capture="environment" onChange={handleImage} style={{display:"none"}}/>
                          </label>
                        )}
                      </div>
                      <div style={{color:C.muted,fontSize:11}}>📱 Toque no + para tirar foto ou escolher da galeria</div>
                    </div>
                    <div style={{display:"flex",gap:10}}>
                      <button onClick={handleSaveProd} disabled={saving} style={{...btnP,flex:1,opacity:saving?0.6:1}}>{saving?<Spinner small/>:"✅ Salvar Produto"}</button>
                      <button onClick={()=>setShowProdForm(false)} style={btnG}>Cancelar</button>
                    </div>
                  </div>
                )}

                {loadingProds?<Spinner/>:products.length>0&&(
                  <div>
                    <div style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",marginBottom:12}}>{products.length} PRODUTO(S) CADASTRADO(S)</div>
                    {products.map(p=>(
                      <div key={p.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:10,display:"flex",gap:12,alignItems:"flex-start"}}>
                        {p.images&&p.images.length>0
                          ?<img src={p.images[0]} style={{width:64,height:64,objectFit:"cover",borderRadius:8,flexShrink:0}}/>
                          :<div style={{width:64,height:64,background:C.subtle,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>📦</div>
                        }
                        <div style={{flex:1}}>
                          <div style={{fontFamily:FONT_D,fontWeight:700,fontSize:14}}>{p.name}</div>
                          <div style={{color:C.muted,fontSize:12,marginTop:2}}>{p.category}</div>
                          <div style={{display:"flex",gap:10,marginTop:6,flexWrap:"wrap"}}>
                            <span style={{color:C.accent,fontSize:12,fontWeight:600}}>R$ {parseFloat(p.price||0).toFixed(2)}</span>
                            <span style={{color:C.muted,fontSize:12}}>Estoque: {p.stock}</span>
                            {p.code&&<span style={{color:C.muted,fontSize:12}}>Cód: {p.code}</span>}
                            {p.images&&p.images.length>1&&<span style={{color:C.muted,fontSize:12}}>📷 {p.images.length} fotos</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ── DASHBOARD COLABORADOR TÉCNICO ────────────────────────────
const TechDashboard=({user,token,onLogout})=>{
  const [projects,setProjects]=useState([]);
  const [sel,setSel]=useState(null);
  const [onboarding,setOnboarding]=useState(null);
  const [checklist,setChecklist]=useState([]);
  const [tab,setTab]=useState("checklist");
  const [loading,setLoading]=useState(true);
  const [note,setNote]=useState("");
  const [editingNote,setEditingNote]=useState(null);

  useEffect(()=>{
    api.get("projects","order=created_at.desc").then(d=>{ setProjects(d||[]); setLoading(false); });
  },[]);

  const openProject=async(proj)=>{
    setSel(proj); setTab("checklist");
    const [ob,ck]=await Promise.all([
      api.get("onboarding",`project_id=eq.${proj.id}`),
      api.get("tech_checklist",`project_id=eq.${proj.id}&order=created_at.asc`),
    ]);
    setOnboarding(ob&&ob.length>0?ob[0]:null);
    if(ck&&ck.length>0){ setChecklist(ck); }
    else{
      await fetch(`${SUPABASE_URL}/rest/v1/rpc/create_tech_checklist`,{method:"POST",headers:H,body:JSON.stringify({p_project_id:proj.id})});
      const ck2=await api.get("tech_checklist",`project_id=eq.${proj.id}&order=created_at.asc`);
      setChecklist(ck2||[]);
    }
  };

  const toggleCheck=async(item)=>{
    await api.patch("tech_checklist",{id:item.id},{done:!item.done});
    setChecklist(prev=>prev.map(c=>c.id===item.id?{...c,done:!c.done}:c));
  };

  const saveNote=async(item)=>{
    await api.patch("tech_checklist",{id:item.id},{notes:note});
    setChecklist(prev=>prev.map(c=>c.id===item.id?{...c,notes:note}:c));
    setEditingNote(null); setNote("");
  };

  const categories=[...new Set(checklist.map(c=>c.category))];
  const progress=checklist.length>0?Math.round((checklist.filter(c=>c.done).length/checklist.length)*100):0;

  const InfoRow=({label,value,secret=false})=>value?(
    <div style={{display:"flex",gap:12,padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
      <div style={{color:C.muted,fontSize:12,minWidth:200}}>{label}</div>
      <div style={{color:C.text,fontSize:12,fontWeight:600,wordBreak:"break-all"}}>{secret?"••••••••":value}</div>
    </div>
  ):null;

  return(
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:FONT,color:C.text,display:"flex"}}>
      <style>{GLOBAL_STYLE}</style>
      {/* SIDEBAR */}
      <div style={{width:240,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",padding:"24px 0",minHeight:"100vh",position:"sticky",top:0}}>
        <div style={{padding:"0 20px 24px"}}>
          <div style={{fontFamily:FONT_D,fontWeight:800,fontSize:16,color:C.accent}}>IMPLEMENTA</div>
          <div style={{color:C.muted,fontSize:10,letterSpacing:"0.15em",marginBottom:4}}>COLABORADOR TÉCNICO</div>
          <div style={{color:C.warn,fontSize:11}}>🔧 {user?.email?.split("@")[0]}</div>
        </div>
        <div style={{flex:1,padding:"0 12px",overflowY:"auto"}}>
          <div style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",padding:"0 8px",marginBottom:8}}>PROJETOS</div>
          {loading?<Spinner small/>:projects.map(p=>(
            <button key={p.id} className="nb" onClick={()=>openProject(p)} style={{background:sel?.id===p.id?C.accentDim:"transparent",border:sel?.id===p.id?`1px solid ${C.accentBorder}`:"1px solid transparent",borderRadius:8,color:sel?.id===p.id?C.accent:C.muted,fontFamily:FONT,fontSize:12,padding:"10px 12px",cursor:"pointer",display:"flex",flexDirection:"column",gap:4,textAlign:"left",width:"100%",marginBottom:4}}>
              <span style={{fontWeight:600}}>{p.name}</span>
              <span style={{fontSize:10}}>{p.client}</span>
            </button>
          ))}
        </div>
        <div style={{padding:"16px 16px 0",borderTop:`1px solid ${C.border}`}}>
          <button onClick={onLogout} style={{...btnG,width:"100%",fontSize:11,padding:"8px"}}>Sair</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{flex:1,overflow:"auto",padding:"32px 36px"}}>
        {!sel?(
          <div style={{textAlign:"center",padding:80}}>
            <div style={{fontSize:48,marginBottom:16}}>🔧</div>
            <div style={{fontFamily:FONT_D,fontSize:22,color:C.accent}}>Selecione um projeto</div>
            <div style={{color:C.muted,fontSize:13,marginTop:8}}>Escolha um projeto na sidebar para ver as tarefas técnicas</div>
          </div>
        ):(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:12}}>
              <div>
                <div style={{fontFamily:FONT_D,fontSize:24,fontWeight:800}}>{sel.name}</div>
                <div style={{color:C.muted,fontSize:13}}>{sel.client} · {progress}% concluído</div>
              </div>
              <Ring value={progress} size={60}/>
            </div>
            <PhaseBar phase={sel.phase||0}/>
            <div style={{marginTop:8,marginBottom:20,color:C.muted,fontSize:11}}>Fase atual: {PHASES[sel.phase||0]}</div>

            <div style={{display:"flex",gap:0,marginBottom:24,borderBottom:`1px solid ${C.border}`}}>
              {[["checklist","✅ Checklist Técnico"],["info","📋 Dados do Cliente"],["briefing","📝 Briefing Designer"]].map(([id,label])=>(
                <button key={id} onClick={()=>setTab(id)} style={{background:"transparent",border:"none",borderBottom:tab===id?`2px solid ${C.accent}`:"2px solid transparent",color:tab===id?C.accent:C.muted,fontFamily:FONT,fontSize:13,padding:"10px 16px",cursor:"pointer",marginBottom:-1}}>{label}</button>
              ))}
            </div>

            {tab==="checklist"&&(
              <div>
                {categories.map(cat=>(
                  <div key={cat} style={{marginBottom:24}}>
                    <div style={{color:C.accent,fontSize:11,letterSpacing:"0.1em",fontWeight:600,marginBottom:10}}>{cat.toUpperCase()}</div>
                    {checklist.filter(c=>c.category===cat).map(item=>(
                      <div key={item.id} style={{background:C.card,border:`1px solid ${item.done?C.accent+"30":C.border}`,borderRadius:10,padding:"12px 16px",marginBottom:8,opacity:item.done?0.7:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:12}}>
                          <div onClick={()=>toggleCheck(item)} style={{width:20,height:20,borderRadius:4,border:`2px solid ${item.done?C.accent:C.border}`,background:item.done?C.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
                            {item.done&&<span style={{color:"#000",fontSize:12}}>✓</span>}
                          </div>
                          <span style={{flex:1,textDecoration:item.done?"line-through":"none",color:item.done?C.muted:C.text,fontSize:13}}>{item.task}</span>
                          <button onClick={()=>{setEditingNote(item.id);setNote(item.notes||"");}} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:11,fontFamily:FONT}}>📝 {item.notes?"Editar nota":"Nota"}</button>
                        </div>
                        {editingNote===item.id&&(
                          <div style={{marginTop:10}}>
                            <textarea style={{...inp,minHeight:60,resize:"vertical"}} placeholder="Adicione uma observação..." value={note} onChange={e=>setNote(e.target.value)}/>
                            <div style={{display:"flex",gap:8,marginTop:8}}>
                              <button onClick={()=>saveNote(item)} style={{...btnP,fontSize:11,padding:"6px 14px"}}>Salvar</button>
                              <button onClick={()=>setEditingNote(null)} style={{...btnG,fontSize:11,padding:"6px 14px"}}>Cancelar</button>
                            </div>
                          </div>
                        )}
                        {item.notes&&editingNote!==item.id&&<div style={{marginTop:8,color:C.muted,fontSize:12,padding:"6px 10px",background:C.subtle,borderRadius:6}}>💬 {item.notes}</div>}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {tab==="info"&&(
              <div>
                {!onboarding
                  ? <div style={{textAlign:"center",padding:48,color:C.muted}}><div style={{fontSize:36,marginBottom:12}}>⏳</div><div>Cliente ainda não preencheu o formulário</div></div>
                  : <div>
                      <div style={{fontFamily:FONT_D,fontSize:16,fontWeight:800,marginBottom:16,color:C.accent}}>🏢 Dados da Empresa</div>
                      <InfoRow label="Razão Social" value={onboarding.company_name}/>
                      <InfoRow label="CNPJ" value={onboarding.cnpj}/>
                      <InfoRow label="E-mail" value={onboarding.email}/>
                      <InfoRow label="Telefone" value={onboarding.phone}/>
                      <InfoRow label="Endereço" value={onboarding.address}/>
                      <div style={{fontFamily:FONT_D,fontSize:16,fontWeight:800,margin:"24px 0 16px",color:C.accent}}>🌐 Plataforma & Domínio</div>
                      <InfoRow label="Plataforma" value={onboarding.platform}/>
                      <InfoRow label="Login Plataforma" value={onboarding.platform_login}/>
                      <InfoRow label="Senha Plataforma" value={onboarding.platform_password} secret/>
                      <InfoRow label="Login Registro.br" value={onboarding.registrobr_login}/>
                      <InfoRow label="Senha Registro.br" value={onboarding.registrobr_password} secret/>
                      <div style={{fontFamily:FONT_D,fontSize:16,fontWeight:800,margin:"24px 0 16px",color:C.accent}}>🔑 Integrações</div>
                      <InfoRow label="ERP" value={onboarding.erp}/>
                      <InfoRow label="Login ERP" value={onboarding.erp_login}/>
                      <InfoRow label="Senha ERP" value={onboarding.erp_password} secret/>
                      <InfoRow label="Gateway Envio" value={onboarding.gateway_envio}/>
                      <InfoRow label="Gateway Pagamento" value={onboarding.gateway_pagamento}/>
                      <InfoRow label="Senha Certificado" value={onboarding.certificado_senha} secret/>
                      <div style={{fontFamily:FONT_D,fontSize:16,fontWeight:800,margin:"24px 0 16px",color:C.accent}}>🎨 Marca & Conteúdo</div>
                      <InfoRow label="Cores" value={onboarding.cores}/>
                      <InfoRow label="Atendimento" value={onboarding.atendimento_info}/>
                      <InfoRow label="Quem Somos" value={onboarding.quem_somos}/>
                      <InfoRow label="Categorias" value={onboarding.categorias}/>
                      <InfoRow label="Redes Sociais" value={onboarding.redes_sociais}/>
                      <InfoRow label="Referências" value={onboarding.referencias_sites}/>
                    </div>
                }
              </div>
            )}

            {tab==="briefing"&&(
              <div>
                <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:24}}>
                  <div style={{fontFamily:FONT_D,fontSize:16,fontWeight:800,marginBottom:16}}>📝 Briefing para o Designer</div>
                  {onboarding?(
                    <div style={{color:C.text,fontSize:13,lineHeight:1.8}}>
                      <p><strong style={{color:C.accent}}>PROJETO:</strong> {sel.name}</p>
                      <p><strong style={{color:C.accent}}>EMPRESA:</strong> {onboarding.company_name}</p>
                      <p><strong style={{color:C.accent}}>PLATAFORMA:</strong> {onboarding.platform}</p>
                      <p><strong style={{color:C.accent}}>CORES:</strong> {onboarding.cores}</p>
                      <p><strong style={{color:C.accent}}>QUEM SOMOS:</strong> {onboarding.quem_somos}</p>
                      <p><strong style={{color:C.accent}}>CATEGORIAS:</strong> {onboarding.categorias}</p>
                      <p><strong style={{color:C.accent}}>REFERÊNCIAS:</strong> {onboarding.referencias_sites}</p>
                      <p><strong style={{color:C.accent}}>ATENDIMENTO:</strong> {onboarding.atendimento_info}</p>
                      <p><strong style={{color:C.accent}}>REDES SOCIAIS:</strong> {onboarding.redes_sociais}</p>
                    </div>
                  ):<div style={{color:C.muted,fontSize:13}}>Preencha os dados do cliente primeiro para gerar o briefing.</div>}
                  <button onClick={()=>{
                    if(!onboarding) return;
                    const text=`BRIEFING — ${sel.name}\n\nEMPRESA: ${onboarding.company_name}\nPLATAFORMA: ${onboarding.platform}\nCORES: ${onboarding.cores}\nQUEM SOMOS: ${onboarding.quem_somos}\nCATEGORIAS: ${onboarding.categorias}\nREFERÊNCIAS: ${onboarding.referencias_sites}\nATENDIMENTO: ${onboarding.atendimento_info}\nREDES SOCIAIS: ${onboarding.redes_sociais}`;
                    navigator.clipboard.writeText(text);
                    alert("Briefing copiado!");
                  }} style={{...btnP,marginTop:16,fontSize:12}}>📋 Copiar Briefing</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ── DASHBOARD PRODUTOS (MOBILE FIRST) ────────────────────────
const ProductsDashboard=({user,token,onLogout})=>{
  const [projects,setProjects]=useState([]);
  const [selectedProject,setSelectedProject]=useState("");
  const [products,setProducts]=useState([]);
  const [showForm,setShowForm]=useState(false);
  const [saving,setSaving]=useState(false);
  const [form,setForm]=useState({code:"",ean:"",name:"",description:"",category:"",price:"",stock:"",weight:"",height:"",width:"",length:""});
  const [images,setImages]=useState([]);
  const [loading,setLoading]=useState(false);

  useEffect(()=>{ api.get("projects","order=created_at.desc").then(d=>setProjects(d||[])); },[]);

  useEffect(()=>{
    if(selectedProject){ setLoading(true); api.get("products",`project_id=eq.${selectedProject}&order=created_at.desc`).then(d=>{setProducts(d||[]);setLoading(false);}); }
  },[selectedProject]);

  const handleImage=(e)=>{
    const files=Array.from(e.target.files).slice(0,5-images.length);
    files.forEach(file=>{
      const reader=new FileReader();
      reader.onload=ev=>setImages(prev=>[...prev,ev.target.result].slice(0,5));
      reader.readAsDataURL(file);
    });
  };

  const handleSave=async()=>{
    if(!selectedProject||!form.name){ alert("Selecione um projeto e preencha o nome!"); return; }
    setSaving(true);
    try{
      await api.post("products",{...form,project_id:selectedProject,price:parseFloat(form.price)||0,stock:parseInt(form.stock)||0,weight:parseFloat(form.weight)||0,images,status:"pending"});
      setForm({code:"",ean:"",name:"",description:"",category:"",price:"",stock:"",weight:"",height:"",width:"",length:""});
      setImages([]);
      setShowForm(false);
      const d=await api.get("products",`project_id=eq.${selectedProject}&order=created_at.desc`);
      setProducts(d||[]);
    }catch(e){alert("Erro: "+e.message);}
    setSaving(false);
  };

  const F=(k,type="text",placeholder="")=>(<input type={type} style={inp} placeholder={placeholder} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}/>);

  return(
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:FONT,color:C.text}}>
      <style>{GLOBAL_STYLE}</style>
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:10}}>
        <div>
          <div style={{fontFamily:FONT_D,fontWeight:800,fontSize:16,color:C.accent}}>IMPLEMENTA</div>
          <div style={{color:C.muted,fontSize:10,letterSpacing:"0.1em"}}>CADASTRO DE PRODUTOS</div>
        </div>
        <button onClick={onLogout} style={{...btnG,padding:"6px 12px",fontSize:11}}>Sair</button>
      </div>

      <div style={{maxWidth:600,margin:"0 auto",padding:"20px 16px"}}>
        <div style={{marginBottom:20}}>
          <label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>SELECIONE O PROJETO</label>
          <select style={inp} value={selectedProject} onChange={e=>setSelectedProject(e.target.value)}>
            <option value="">-- Selecione --</option>
            {projects.map(p=><option key={p.id} value={p.id}>{p.name} — {p.client}</option>)}
          </select>
        </div>

        {selectedProject&&(
          <button onClick={()=>setShowForm(true)} style={{...btnP,width:"100%",marginBottom:20,fontSize:14,padding:"14px"}}>+ Adicionar Produto</button>
        )}

        {showForm&&(
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:20,marginBottom:20}} className="fade">
            <div style={{fontFamily:FONT_D,fontSize:16,fontWeight:800,marginBottom:16}}>📦 Novo Produto</div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <div><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>CÓD. PRODUTO</label>{F("code","text","Opcional")}</div>
              <div><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>EAN/CÓDIGO DE BARRAS</label>{F("ean","text","Opcional")}</div>
            </div>
            <div style={{marginBottom:10}}><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>NOME DO PRODUTO *</label>{F("name","text","Nome completo do produto")}</div>
            <div style={{marginBottom:10}}><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>DESCRIÇÃO</label><textarea style={{...inp,minHeight:80,resize:"vertical"}} placeholder="Descrição detalhada..." value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/></div>
            <div style={{marginBottom:10}}><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>CATEGORIA</label>{F("category","text","Ex: Camisetas > Masculino")}</div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <div><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>PREÇO (R$)</label>{F("price","number","0,00")}</div>
              <div><label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>ESTOQUE</label>{F("stock","number","0")}</div>
            </div>

            <div style={{marginBottom:10}}>
              <label style={{color:C.muted,fontSize:11,display:"block",marginBottom:8}}>MEDIDAS PARA FRETE</label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><label style={{color:C.muted,fontSize:10,display:"block",marginBottom:4}}>PESO (kg)</label>{F("weight","number","0.5")}</div>
                <div><label style={{color:C.muted,fontSize:10,display:"block",marginBottom:4}}>ALTURA (cm)</label>{F("height","number","10")}</div>
                <div><label style={{color:C.muted,fontSize:10,display:"block",marginBottom:4}}>LARGURA (cm)</label>{F("width","number","15")}</div>
                <div><label style={{color:C.muted,fontSize:10,display:"block",marginBottom:4}}>COMPRIMENTO (cm)</label>{F("length","number","20")}</div>
              </div>
            </div>

            <div style={{marginBottom:16}}>
              <label style={{color:C.muted,fontSize:11,display:"block",marginBottom:8}}>FOTOS (até 5 imagens)</label>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
                {images.map((img,i)=>(
                  <div key={i} style={{position:"relative"}}>
                    <img src={img} style={{width:72,height:72,objectFit:"cover",borderRadius:8,border:`1px solid ${C.border}`}}/>
                    <button onClick={()=>setImages(prev=>prev.filter((_,j)=>j!==i))} style={{position:"absolute",top:-6,right:-6,background:C.danger,border:"none",borderRadius:"50%",width:18,height:18,color:"#fff",fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                  </div>
                ))}
                {images.length<5&&(
                  <label style={{width:72,height:72,border:`2px dashed ${C.border}`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:C.muted,fontSize:24}}>
                    +<input type="file" accept="image/*" multiple onChange={handleImage} style={{display:"none"}}/>
                  </label>
                )}
              </div>
              <div style={{color:C.muted,fontSize:11}}>📱 Tire fotos diretamente pelo celular</div>
            </div>

            <div style={{display:"flex",gap:10}}>
              <button onClick={handleSave} disabled={saving} style={{...btnP,flex:1,opacity:saving?0.6:1}}>{saving?<Spinner small/>:"✅ Salvar Produto"}</button>
              <button onClick={()=>setShowForm(false)} style={btnG}>Cancelar</button>
            </div>
          </div>
        )}

        {loading?<Spinner/>:products.length>0&&(
          <div>
            <div style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",marginBottom:12}}>{products.length} PRODUTO(S) CADASTRADO(S)</div>
            {products.map(p=>(
              <div key={p.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:10,display:"flex",gap:12,alignItems:"flex-start"}}>
                {p.images&&p.images.length>0
                  ? <img src={p.images[0]} style={{width:60,height:60,objectFit:"cover",borderRadius:8,flexShrink:0}}/>
                  : <div style={{width:60,height:60,background:C.subtle,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>📦</div>
                }
                <div style={{flex:1}}>
                  <div style={{fontFamily:FONT_D,fontWeight:700,fontSize:14}}>{p.name}</div>
                  <div style={{color:C.muted,fontSize:12,marginTop:2}}>{p.category}</div>
                  <div style={{display:"flex",gap:10,marginTop:8,flexWrap:"wrap"}}>
                    <span style={{color:C.accent,fontSize:12,fontWeight:600}}>R$ {parseFloat(p.price||0).toFixed(2)}</span>
                    <span style={{color:C.muted,fontSize:12}}>Estoque: {p.stock}</span>
                    {p.code&&<span style={{color:C.muted,fontSize:12}}>Cód: {p.code}</span>}
                  </div>
                </div>
                {p.images&&p.images.length>1&&<div style={{color:C.muted,fontSize:11}}>+{p.images.length-1} foto(s)</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── DASHBOARD GESTOR ─────────────────────────────────────────
const AdminDashboard=({user,token,onLogout})=>{
  const [projects,setProjects]=useState([]);
  const [loading,setLoading]=useState(true);
  const [view,setView]=useState("dashboard");
  const [sel,setSel]=useState(null);
  const [tab,setTab]=useState("tasks");
  const [tasks,setTasks]=useState([]);
  const [pendings,setPendings]=useState([]);
  const [messages,setMessages]=useState([]);
  const [products,setProducts]=useState([]);
  const [onboarding,setOnboarding]=useState(null);
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
    setSel(proj);setTab("tasks");
    setTasks(proj.tasks||[]);setPendings(proj.pendings||[]);setMessages(proj.messages||[]);
    const [ob,prods]=await Promise.all([api.get("onboarding",`project_id=eq.${proj.id}`),api.get("products",`project_id=eq.${proj.id}&order=created_at.desc`)]);
    setOnboarding(ob&&ob.length>0?ob[0]:null);
    setProducts(prods||[]);
  };

  const createProject=async()=>{
    if(!newProj.name||!newProj.client) return; setSaving(true);
    await api.post("projects",{name:newProj.name,client:newProj.client,phase:0,status:"on-track",progress:0,deadline:newProj.deadline||null});
    setShowNP(false);setNewProj({name:"",client:"",deadline:""});await loadProjects();setSaving(false);
  };

  const addTask=async()=>{ if(!newTask.trim()||!sel) return; setSaving(true); await api.post("tasks",{project_id:sel.id,title:newTask,assignee,done:false,phase:sel.phase||0}); setNewTask(""); await refreshSel(sel.id); setSaving(false); };
  const toggleTask=async(task)=>{ await api.patch("tasks",{id:task.id},{done:!task.done}); await refreshSel(sel.id); };
  const sendMessage=async()=>{ if(!newMsg.trim()||!sel) return; await api.post("messages",{project_id:sel.id,from_role:"team",text:newMsg}); setNewMsg(""); await refreshSel(sel.id); };
  const savePending=async()=>{ if(!sel) return; setSaving(true); await api.post("pendings",{project_id:sel.id,...pendForm,status:"open",sent_at:new Date().toISOString()}); await refreshSel(sel.id); setPendStep(3); setSaving(false); };
  const resolvePending=async(id)=>{ await api.patch("pendings",{id},{status:"resolved"}); await refreshSel(sel.id); };
  const advancePhase=async()=>{ if(!sel||sel.phase>=PHASES.length-1) return; const phase=sel.phase+1; await api.patch("projects",{id:sel.id},{phase}); setSel(prev=>({...prev,phase})); setProjects(prev=>prev.map(p=>p.id===sel.id?{...p,phase}:p)); };

  const totalPend=projects.reduce((a,p)=>a+(p.pendings||[]).filter(x=>x.status==="open").length,0);
  const stats={total:projects.length,onTrack:projects.filter(p=>p.status==="on-track").length,atRisk:projects.filter(p=>p.status==="at-risk").length,delayed:projects.filter(p=>p.status==="delayed").length};
  const filtered=filterSt==="all"?projects:projects.filter(p=>p.status===filterSt);
  const navItems=[{id:"dashboard",label:"Dashboard",icon:"◈"},{id:"projects",label:"Projetos",icon:"⬡"},{id:"pendings",label:"Pendências",icon:"⚠",badge:totalPend,bc:C.warn},{id:"alerts",label:"Alertas",icon:"◉",badge:stats.delayed+stats.atRisk,bc:C.danger}];

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
            <div style={{display:"flex",gap:8,marginBottom:20}}>{CHANNELS.map(c=><button key={c.id} onClick={()=>setPendForm(f=>({...f,channel:c.id}))} style={{flex:1,background:pendForm.channel===c.id?C.accentDim:C.surface,border:`1px solid ${pendForm.channel===c.id?C.accent:C.border}`,borderRadius:8,color:pendForm.channel===c.id?C.accent:C.muted,fontFamily:FONT,fontSize:12,padding:"10px",cursor:"pointer"}}>{c.icon} {c.label}</button>)}</div>
            <div style={{display:"flex",gap:10}}><button onClick={()=>setPendStep(2)} style={{...btnP,flex:1}}>Ver Prévia →</button><button onClick={()=>setShowPend(false)} style={btnG}>Cancelar</button></div>
          </>}
          {pendStep===2&&<>
            <div style={{fontFamily:FONT_D,fontSize:18,fontWeight:800,marginBottom:14}}>Prévia</div>
            <pre style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",fontSize:12,fontFamily:FONT,color:C.text,whiteSpace:"pre-wrap",marginBottom:14,lineHeight:1.7}}>{emailPrev}</pre>
            <div style={{display:"flex",gap:10}}><button onClick={savePending} disabled={saving} style={{...btnP,flex:1}}>{saving?<Spinner small/>:"✓ Confirmar"}</button><button onClick={()=>setPendStep(1)} style={btnG}>← Editar</button></div>
          </>}
          {pendStep===3&&<div style={{textAlign:"center",padding:"20px 0"}}><div style={{fontSize:48,marginBottom:12}}>✅</div><div style={{fontFamily:FONT_D,fontSize:20,fontWeight:800,color:C.accent,marginBottom:16}}>Pendência Salva!</div><button onClick={()=>{setShowPend(false);setTab("pendings");}} style={{...btnP,padding:"12px 28px"}}>Ver Pendências</button></div>}
        </div>
      </div>
    );
  };

  const StatCard=({label,value,color,icon})=>(<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"18px 20px",display:"flex",alignItems:"center",gap:14,flex:1,minWidth:120}}><span style={{fontSize:24}}>{icon}</span><div><div style={{color:C.muted,fontSize:10,fontFamily:FONT,letterSpacing:"0.1em",textTransform:"uppercase"}}>{label}</div><div style={{color:color||C.text,fontSize:26,fontFamily:FONT_D,fontWeight:800,lineHeight:1.1}}>{value}</div></div></div>);

  return(
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:FONT,color:C.text,display:"flex"}}>
      <style>{GLOBAL_STYLE}</style>
      {showPend&&<PendModal/>}
      {showNP&&(<div style={{position:"fixed",inset:0,background:"#000A",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:32,width:420,maxWidth:"90vw"}}><div style={{fontFamily:FONT_D,fontSize:20,fontWeight:800,marginBottom:22}}>Novo Projeto</div>{[["Nome do projeto","name","Ex: Loja XYZ"],["Cliente","client","Ex: XYZ LTDA"]].map(([l,k,ph])=>(<div key={k} style={{marginBottom:12}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>{l.toUpperCase()}</label><input style={inp} placeholder={ph} value={newProj[k]} onChange={e=>setNewProj(p=>({...p,[k]:e.target.value}))}/></div>))}<div style={{marginBottom:20}}><label style={{color:C.muted,fontSize:11,letterSpacing:"0.08em",display:"block",marginBottom:6}}>DATA DE ENTREGA</label><input type="date" style={inp} value={newProj.deadline} onChange={e=>setNewProj(p=>({...p,deadline:e.target.value}))}/></div><div style={{display:"flex",gap:10}}><button onClick={createProject} disabled={saving} style={{...btnP,flex:1}}>{saving?"Criando...":"Criar"}</button><button onClick={()=>setShowNP(false)} style={btnG}>Cancelar</button></div></div></div>)}

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
          <div style={{color:C.muted,fontSize:10,marginBottom:8}}><span style={{color:pulse?C.accent:C.muted,transition:"color .5s"}}>●</span> {projects.filter(p=>p.status!=="done").length} ativos</div>
          <div style={{color:C.muted,fontSize:11,marginBottom:6}}>📊 {user?.email?.split("@")[0]}</div>
          <button onClick={onLogout} style={{...btnG,width:"100%",fontSize:11,padding:"7px"}}>Sair</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{flex:1,overflow:"auto",padding:"36px 40px"}}>
        {sel?(
          <div>
            <button onClick={()=>setSel(null)} style={{background:"transparent",border:"none",color:C.muted,fontFamily:FONT,fontSize:13,cursor:"pointer",marginBottom:22,display:"flex",alignItems:"center",gap:6}}>← Voltar</button>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:12}}>
              <div><div style={{fontFamily:FONT_D,fontSize:26,fontWeight:800}}>{sel.name}</div><div style={{color:C.muted,fontSize:13,marginTop:4}}>{sel.client}{sel.deadline&&` · Entrega: ${new Date(sel.deadline).toLocaleDateString("pt-BR")}`}</div></div>
              <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                <Badge status={sel.status}/>
                {pendings.filter(x=>x.status==="open").length>0&&<span style={{background:C.warn+"20",color:C.warn,border:`1px solid ${C.warn}40`,borderRadius:4,padding:"2px 10px",fontSize:11,fontFamily:FONT}}>⚠ {pendings.filter(x=>x.status==="open").length}</span>}
                <Ring value={sel.progress||0} size={52}/>
                {(sel.phase||0)<PHASES.length-1&&<button onClick={advancePhase} style={{...btnP,fontSize:11,padding:"8px 14px"}}>Avançar Fase →</button>}
              </div>
            </div>
            <div style={{marginBottom:22}}><div style={{color:C.muted,fontSize:11,marginBottom:8,letterSpacing:"0.08em"}}>FASE: {PHASES[sel.phase||0].toUpperCase()}</div><PhaseBar phase={sel.phase||0}/></div>

            <div style={{display:"flex",marginBottom:22,borderBottom:`1px solid ${C.border}`,overflowX:"auto"}}>
              {[["tasks","Tarefas"],["pendings",`Pendências${pendings.filter(x=>x.status==="open").length>0?` (${pendings.filter(x=>x.status==="open").length})`:""}`],["messages","Comunicação"],["onboarding","Dados Cliente"],["products",`Produtos (${products.length})`]].map(([id,label])=>(
                <button key={id} onClick={()=>setTab(id)} style={{background:"transparent",border:"none",borderBottom:tab===id?`2px solid ${id==="pendings"?C.warn:C.accent}`:"2px solid transparent",color:tab===id?(id==="pendings"?C.warn:C.accent):C.muted,fontFamily:FONT,fontSize:12,padding:"10px 14px",cursor:"pointer",marginBottom:-1,whiteSpace:"nowrap"}}>{label}</button>
              ))}
            </div>

            {tab==="tasks"&&(<div><div style={{display:"flex",gap:10,marginBottom:16}}><input style={{...inp,flex:1}} placeholder="Nova tarefa..." value={newTask} onChange={e=>setNewTask(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTask()}/><select style={{...inp,width:120}} value={assignee} onChange={e=>setAssignee(e.target.value)}>{["Ana","Pedro","Lucas","Carla","Rafael","Juliana"].map(n=><option key={n}>{n}</option>)}</select><button onClick={addTask} disabled={saving} style={btnP}>+ Add</button></div>{tasks.map(t=>(<div key={t.id} onClick={()=>toggleTask(t)} className="ch" style={{background:C.card,border:`1px solid ${t.done?C.accent+"30":C.border}`,borderRadius:10,padding:"13px 18px",display:"flex",alignItems:"center",gap:14,marginBottom:8,opacity:t.done?0.65:1}}><div style={{width:18,height:18,borderRadius:4,border:`2px solid ${t.done?C.accent:C.border}`,background:t.done?C.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{t.done&&<span style={{color:"#000",fontSize:11}}>✓</span>}</div><span style={{flex:1,textDecoration:t.done?"line-through":"none",color:t.done?C.muted:C.text,fontSize:14}}>{t.title}</span><span style={{background:C.subtle,color:C.muted,borderRadius:4,padding:"2px 10px",fontSize:11}}>{t.assignee}</span></div>))}</div>)}

            {tab==="pendings"&&(<div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><span style={{color:pendings.filter(x=>x.status==="open").length>0?C.danger:C.accent,fontFamily:FONT,fontSize:13,fontWeight:600}}>{pendings.filter(x=>x.status==="open").length} pendência(s)</span><button onClick={()=>{setPendStep(1);setShowPend(true);}} style={{...btnP,fontSize:12,padding:"8px 16px"}}>+ Registrar</button></div>{pendings.filter(x=>x.status==="open").map(p=>{const pt=PTYPES.find(t=>t.id===p.type);const urg=URGENCY.find(u=>u.id===p.urgency);return(<div key={p.id} style={{background:urg?.color+"08",border:`1px solid ${urg?.color}35`,borderRadius:12,padding:"14px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}><span style={{fontSize:20}}>{pt?.icon}</span><div style={{flex:1}}><div style={{fontFamily:FONT_D,fontWeight:700,fontSize:13}}>{pt?.label}</div>{p.note&&<div style={{color:C.muted,fontSize:12}}>{p.note}</div>}</div><button onClick={()=>resolvePending(p.id)} style={{background:C.accentDim,border:`1px solid ${C.accentBorder}`,borderRadius:6,color:C.accent,fontFamily:FONT,fontSize:11,padding:"5px 10px",cursor:"pointer"}}>✓ Resolver</button></div>);})}</div>)}

            {tab==="messages"&&(<div><div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20,marginBottom:14,maxHeight:360,overflowY:"auto",display:"flex",flexDirection:"column",gap:12}}>{messages.length===0?<div style={{color:C.muted,textAlign:"center",padding:40,fontSize:13}}>Nenhuma mensagem.</div>:messages.map((m,i)=>(<div key={i} style={{display:"flex",justifyContent:m.from_role==="team"?"flex-end":"flex-start"}}><div style={{background:m.from_role==="team"?C.accentDim:C.subtle,border:`1px solid ${m.from_role==="team"?C.accentBorder:C.border}`,borderRadius:10,padding:"10px 14px",maxWidth:"72%"}}><div style={{fontSize:10,color:C.muted,marginBottom:4}}>{m.from_role==="team"?"📤 Equipe":"📥 Cliente"} · {new Date(m.created_at).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</div><div style={{fontSize:13}}>{m.text}</div></div></div>))}</div><div style={{display:"flex",gap:10}}><input style={{...inp,flex:1}} placeholder="Mensagem..." value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMessage()}/><button onClick={sendMessage} style={btnP}>Enviar</button></div></div>)}

            {tab==="onboarding"&&(<div>{!onboarding?<div style={{textAlign:"center",padding:48,color:C.muted}}><div style={{fontSize:36,marginBottom:12}}>⏳</div><div>Cliente ainda não preencheu o formulário</div></div>:<div style={{display:"grid",gap:8}}>{[["Empresa",onboarding.company_name],["CNPJ",onboarding.cnpj],["E-mail",onboarding.email],["Telefone",onboarding.phone],["Endereço",onboarding.address],["Plataforma",onboarding.platform],["ERP",onboarding.erp],["Gateway Envio",onboarding.gateway_envio],["Gateway Pagamento",onboarding.gateway_pagamento],["Cores",onboarding.cores],["Categorias",onboarding.categorias],["Redes Sociais",onboarding.redes_sociais]].map(([l,v])=>v&&(<div key={l} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",display:"flex",gap:12}}><span style={{color:C.muted,fontSize:12,minWidth:160}}>{l}</span><span style={{color:C.text,fontSize:12,fontWeight:600}}>{v}</span></div>))}</div>}</div>)}

            {tab==="products"&&(<div>{products.length===0?<div style={{textAlign:"center",padding:48,color:C.muted}}><div style={{fontSize:36,marginBottom:12}}>📦</div><div>Nenhum produto cadastrado ainda</div></div>:<div>{products.map(p=>(<div key={p.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:10,display:"flex",gap:12,alignItems:"flex-start"}}>{p.images&&p.images.length>0?<img src={p.images[0]} style={{width:56,height:56,objectFit:"cover",borderRadius:8,flexShrink:0}}/>:<div style={{width:56,height:56,background:C.subtle,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>📦</div>}<div style={{flex:1}}><div style={{fontFamily:FONT_D,fontWeight:700,fontSize:13}}>{p.name}</div><div style={{color:C.muted,fontSize:12}}>{p.category}</div><div style={{display:"flex",gap:10,marginTop:6}}><span style={{color:C.accent,fontSize:12}}>R$ {parseFloat(p.price||0).toFixed(2)}</span><span style={{color:C.muted,fontSize:12}}>Estoque: {p.stock}</span></div></div></div>))}</div>}</div>)}
          </div>
        ):loading?<Spinner/>:(
          <>
            {view==="dashboard"&&(<div><div style={{fontFamily:FONT_D,fontSize:30,fontWeight:800,marginBottom:4}}>Dashboard</div><div style={{color:C.muted,fontSize:13,marginBottom:26}}>Olá, {user?.email?.split("@")[0]} 👋</div><div style={{display:"flex",gap:12,marginBottom:28,flexWrap:"wrap"}}><StatCard label="Total" value={stats.total} icon="⬡"/><StatCard label="No Prazo" value={stats.onTrack} color={C.accent} icon="◎"/><StatCard label="Em Risco" value={stats.atRisk} color={C.warn} icon="◉"/><StatCard label="Atrasados" value={stats.delayed} color={C.danger} icon="◈"/><StatCard label="Pendências" value={totalPend} color={totalPend>0?C.warn:C.accent} icon="⚠"/></div>{projects.length===0?<div style={{textAlign:"center",padding:60,color:C.muted}}><div style={{fontSize:40,marginBottom:12}}>⬡</div><div style={{fontFamily:FONT_D,fontSize:18,color:C.accent}}>Nenhum projeto ainda</div></div>:<div style={{display:"flex",flexDirection:"column",gap:10}}>{projects.map(p=>{const op=(p.pendings||[]).filter(x=>x.status==="open").length;return(<div key={p.id} className="ch" onClick={()=>openProject(p)} style={{background:C.card,border:`1px solid ${op>0?C.warn+"40":C.border}`,borderRadius:12,padding:"16px 22px",display:"flex",alignItems:"center",gap:18,flexWrap:"wrap"}}><Ring value={p.progress||0} size={46}/><div style={{flex:1,minWidth:150}}><div style={{fontFamily:FONT_D,fontWeight:700,fontSize:15}}>{p.name}</div><div style={{color:C.muted,fontSize:12}}>{p.client}</div><div style={{marginTop:8}}><PhaseBar phase={p.phase||0}/></div></div><div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}><div style={{display:"flex",gap:6}}><Badge status={p.status}/>{op>0&&<span style={{background:C.warn+"20",color:C.warn,border:`1px solid ${C.warn}40`,borderRadius:4,padding:"2px 8px",fontSize:11}}>⚠ {op}</span>}</div><div style={{color:p.daysLeft<0?C.danger:p.daysLeft<7?C.warn:C.muted,fontSize:12}}>{p.daysLeft===null?"Sem prazo":p.daysLeft<0?`${Math.abs(p.daysLeft)}d atraso`:p.daysLeft===0?"Hoje":`${p.daysLeft}d`}</div></div></div>);})}</div>}</div>)}
            {view==="projects"&&(<div><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:26,flexWrap:"wrap",gap:12}}><div><div style={{fontFamily:FONT_D,fontSize:30,fontWeight:800}}>Projetos</div><div style={{color:C.muted,fontSize:13}}>{filtered.length} projeto(s)</div></div><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{[["all","Todos"],["on-track","No prazo"],["at-risk","Em risco"],["delayed","Atrasados"],["done","Concluídos"]].map(([val,label])=>(<button key={val} onClick={()=>setFilterSt(val)} style={{background:filterSt===val?C.accentDim:"transparent",border:`1px solid ${filterSt===val?C.accentBorder:C.border}`,borderRadius:6,color:filterSt===val?C.accent:C.muted,fontFamily:FONT,fontSize:12,padding:"6px 14px",cursor:"pointer"}}>{label}</button>))}</div></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>{filtered.map(p=>{const op=(p.pendings||[]).filter(x=>x.status==="open").length;return(<div key={p.id} className="ch" onClick={()=>openProject(p)} style={{background:C.card,border:`1px solid ${op>0?C.warn+"40":C.border}`,borderRadius:14,padding:20}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}><div><div style={{fontFamily:FONT_D,fontWeight:700,fontSize:15}}>{p.name}</div><div style={{color:C.muted,fontSize:12,marginTop:3}}>{p.client}</div></div><Ring value={p.progress||0} size={48}/></div><PhaseBar phase={p.phase||0}/><div style={{marginTop:10,fontSize:11,color:C.muted}}>{PHASES[p.phase||0]}</div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12}}><Badge status={p.status}/>{op>0&&<span style={{color:C.warn,fontSize:12}}>⚠ {op}</span>}</div></div>);})}</div></div>)}
            {view==="pendings"&&(<div><div style={{fontFamily:FONT_D,fontSize:30,fontWeight:800,marginBottom:28}}>Central de Pendências</div>{projects.flatMap(p=>(p.pendings||[]).filter(x=>x.status==="open").map(x=>({...x,project:p}))).length===0?<div style={{textAlign:"center",padding:80}}><div style={{fontSize:48,marginBottom:16}}>🎉</div><div style={{fontFamily:FONT_D,fontSize:22,color:C.accent}}>Nenhuma pendência!</div></div>:["high","medium","low"].map(u=>{const items=projects.flatMap(p=>(p.pendings||[]).filter(x=>x.status==="open"&&x.urgency===u).map(x=>({...x,project:p})));if(!items.length) return null;const urg=URGENCY.find(x=>x.id===u);return(<div key={u} style={{marginBottom:28}}><div style={{color:urg.color,fontFamily:FONT_D,fontWeight:700,fontSize:15,marginBottom:12}}>{u==="high"?"🔴":u==="medium"?"🟡":"🟢"} {urg.label.toUpperCase()} — {items.length}</div>{items.map(item=>{const pt=PTYPES.find(t=>t.id===item.type);return(<div key={item.id} className="ch" onClick={()=>openProject(item.project)} style={{background:urg.color+"08",border:`1px solid ${urg.color}30`,borderRadius:12,padding:"14px 18px",marginBottom:8,display:"flex",alignItems:"center",gap:14}}><span style={{fontSize:22}}>{pt?.icon}</span><div style={{flex:1}}><div style={{fontFamily:FONT_D,fontWeight:700}}>{item.project.name}</div><div style={{color:C.muted,fontSize:12}}>{item.project.client} · {pt?.label}</div></div><span style={{color:C.danger,fontSize:12}}>⏳ {item.days_blocking}d</span></div>);})}</div>);})}</div>)}
            {view==="alerts"&&(<div><div style={{fontFamily:FONT_D,fontSize:30,fontWeight:800,marginBottom:28}}>Central de Alertas</div>{projects.filter(p=>p.status==="delayed").length>0&&(<div style={{marginBottom:24}}><div style={{color:C.danger,fontFamily:FONT_D,fontWeight:700,fontSize:15,marginBottom:12}}>🔴 ATRASADOS</div>{projects.filter(p=>p.status==="delayed").map(p=>(<div key={p.id} className="ch" onClick={()=>openProject(p)} style={{background:"#EF444408",border:"1px solid #EF444430",borderRadius:12,padding:"14px 18px",marginBottom:8,display:"flex",alignItems:"center",gap:14}}><div style={{flex:1}}><div style={{fontFamily:FONT_D,fontWeight:700}}>{p.name}</div><div style={{color:C.muted,fontSize:12}}>{p.client}</div></div><div style={{color:C.danger,fontSize:12,fontWeight:600}}>{Math.abs(p.daysLeft||0)}d atraso</div></div>))}</div>)}{projects.filter(p=>p.status==="at-risk").length>0&&(<div><div style={{color:C.warn,fontFamily:FONT_D,fontWeight:700,fontSize:15,marginBottom:12}}>🟡 EM RISCO</div>{projects.filter(p=>p.status==="at-risk").map(p=>(<div key={p.id} className="ch" onClick={()=>openProject(p)} style={{background:"#F59E0B08",border:"1px solid #F59E0B30",borderRadius:12,padding:"14px 18px",marginBottom:8,display:"flex",alignItems:"center",gap:14}}><div style={{flex:1}}><div style={{fontFamily:FONT_D,fontWeight:700}}>{p.name}</div><div style={{color:C.muted,fontSize:12}}>{p.client}</div></div><div style={{color:C.warn,fontSize:12,fontWeight:600}}>{p.daysLeft}d restantes</div><Ring value={p.progress||0} size={44}/></div>))}</div>)}{stats.delayed===0&&stats.atRisk===0&&<div style={{textAlign:"center",padding:80}}><div style={{fontSize:48,marginBottom:16}}>✦</div><div style={{fontFamily:FONT_D,fontSize:20,color:C.accent}}>Tudo sob controle!</div></div>}</div>)}
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
