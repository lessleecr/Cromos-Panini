import { useState, useEffect } from "react";
import { supabase } from "./supabase";

// ─── DATOS DEL ÁLBUM FIFA WORLD CUP 2026 ─────────────────────────────────────
const SECTIONS_RAW = [
  { id:"FWC",  name:"FIFA World Cup",   flag:"🏆", color:"#FFD700", count:20, start:0, special:true },
  { id:"MEX",  name:"México",           flag:"🇲🇽", color:"#006847", count:20 },
  { id:"RSA",  name:"Sudáfrica",        flag:"🇿🇦", color:"#007A4D", count:20 },
  { id:"KOR",  name:"Corea del Sur",    flag:"🇰🇷", color:"#CD2E3A", count:20 },
  { id:"CZE",  name:"Rep. Checa",       flag:"🇨🇿", color:"#D7141A", count:20 },
  { id:"CAN",  name:"Canadá",           flag:"🇨🇦", color:"#FF0000", count:20 },
  { id:"BIH",  name:"Bosnia-Herz.",     flag:"🇧🇦", color:"#002395", count:20 },
  { id:"QAT",  name:"Qatar",            flag:"🇶🇦", color:"#8D153A", count:20 },
  { id:"SUI",  name:"Suiza",            flag:"🇨🇭", color:"#FF0000", count:20 },
  { id:"BRA",  name:"Brasil",           flag:"🇧🇷", color:"#009C3B", count:20 },
  { id:"MAR",  name:"Marruecos",        flag:"🇲🇦", color:"#C1272D", count:20 },
  { id:"HAI",  name:"Haití",            flag:"🇭🇹", color:"#00209F", count:20 },
  { id:"SCO",  name:"Escocia",          flag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", color:"#003DA5", count:20 },
  { id:"USA",  name:"Estados Unidos",   flag:"🇺🇸", color:"#3C3B6E", count:20 },
  { id:"PAR",  name:"Paraguay",         flag:"🇵🇾", color:"#D52B1E", count:20 },
  { id:"AUS",  name:"Australia",        flag:"🇦🇺", color:"#00843D", count:20 },
  { id:"TUR",  name:"Turquía",          flag:"🇹🇷", color:"#E30A17", count:20 },
  { id:"GER",  name:"Alemania",         flag:"🇩🇪", color:"#555555", count:20 },
  { id:"CUW",  name:"Curazao",          flag:"🇨🇼", color:"#003DA5", count:20 },
  { id:"CIV",  name:"Costa de Marfil",  flag:"🇨🇮", color:"#F77F00", count:20 },
  { id:"ECU",  name:"Ecuador",          flag:"🇪🇨", color:"#FFD100", count:20 },
  { id:"NED",  name:"Países Bajos",     flag:"🇳🇱", color:"#FF6600", count:20 },
  { id:"JPN",  name:"Japón",            flag:"🇯🇵", color:"#BC002D", count:20 },
  { id:"SWE",  name:"Suecia",           flag:"🇸🇪", color:"#006AA7", count:20 },
  { id:"TUN",  name:"Túnez",            flag:"🇹🇳", color:"#E70013", count:20 },
  { id:"BEL",  name:"Bélgica",          flag:"🇧🇪", color:"#EF3340", count:20 },
  { id:"EGY",  name:"Egipto",           flag:"🇪🇬", color:"#CE1126", count:20 },
  { id:"IRN",  name:"Irán",             flag:"🇮🇷", color:"#239F40", count:20 },
  { id:"NZL",  name:"Nueva Zelanda",    flag:"🇳🇿", color:"#00247D", count:20 },
  { id:"ESP",  name:"España",           flag:"🇪🇸", color:"#AA151B", count:20 },
  { id:"CPV",  name:"Cabo Verde",       flag:"🇨🇻", color:"#003893", count:20 },
  { id:"KSA",  name:"Arabia Saudí",     flag:"🇸🇦", color:"#006C35", count:20 },
  { id:"URU",  name:"Uruguay",          flag:"🇺🇾", color:"#5EB6E4", count:20 },
  { id:"FRA",  name:"Francia",          flag:"🇫🇷", color:"#002395", count:20 },
  { id:"SEN",  name:"Senegal",          flag:"🇸🇳", color:"#00853F", count:20 },
  { id:"IRQ",  name:"Irak",             flag:"🇮🇶", color:"#007A3D", count:20 },
  { id:"NOR",  name:"Noruega",          flag:"🇳🇴", color:"#EF2B2D", count:20 },
  { id:"ARG",  name:"Argentina",        flag:"🇦🇷", color:"#74ACDF", count:20 },
  { id:"ALG",  name:"Argelia",          flag:"🇩🇿", color:"#006233", count:20 },
  { id:"AUT",  name:"Austria",          flag:"🇦🇹", color:"#ED2939", count:20 },
  { id:"JOR",  name:"Jordania",         flag:"🇯🇴", color:"#007A3D", count:20 },
  { id:"POR",  name:"Portugal",         flag:"🇵🇹", color:"#006600", count:20 },
  { id:"COD",  name:"R.D. Congo",       flag:"🇨🇩", color:"#007FFF", count:20 },
  { id:"UZB",  name:"Uzbekistán",       flag:"🇺🇿", color:"#1EB53A", count:20 },
  { id:"COL",  name:"Colombia",         flag:"🇨🇴", color:"#FCD116", count:20 },
  { id:"ENG",  name:"Inglaterra",       flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", color:"#CF142B", count:20 },
  { id:"CRO",  name:"Croacia",          flag:"🇭🇷", color:"#FF0000", count:20 },
  { id:"GHA",  name:"Ghana",            flag:"🇬🇭", color:"#006B3F", count:20 },
  { id:"PAN",  name:"Panamá",           flag:"🇵🇦", color:"#DA121A", count:20 },
  { id:"CC",   name:"Coca-Cola",        flag:"🥤", color:"#F40009", count:14, special:true },
];

// FIFA World Cup primero, luego países A-Z, luego especiales al final
const SECTIONS = [
  ...SECTIONS_RAW.filter(s=>s.id==="FWC"),
  ...SECTIONS_RAW.filter(s=>!s.special).sort((a,b)=>a.name.localeCompare(b.name,"es")),
  ...SECTIONS_RAW.filter(s=>s.special&&s.id!=="FWC"),
];

function buildAllCromos() {
  const all = [];
  SECTIONS.forEach(s => {
    const start = s.start ?? 1;
    for (let i = start; i < start + s.count; i++) {
      const num = s.start === 0 ? String(i).padStart(2,"0") : i;
      all.push({ id:`${s.id}${num}`, section:s.id, num });
    }
  });
  return all;
}
const ALL_CROMOS = buildAllCromos();
const TOTAL = ALL_CROMOS.length;
const genId   = () => Math.random().toString(36).slice(2,10);
const genCode = () => Math.random().toString(36).slice(2,7).toUpperCase();

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
const G = {
  bg:"#080c14", card:"#0f1623", card2:"#161e2e",
  accent:"#C9A84C", accent2:"#4C9AC8", accent3:"#4CC87A",
  danger:"#C84C4C", text:"#EEF2FF", muted:"#6B7A99", border:"#1E2A3E",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Nunito:wght@400;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:${G.bg};color:${G.text};font-family:'Nunito',sans-serif;min-height:100vh}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:${G.bg}}::-webkit-scrollbar-thumb{background:${G.border};border-radius:3px}
.h1{font-family:'Barlow Condensed',sans-serif;font-weight:900;letter-spacing:2px}
.btn{padding:9px 18px;border:none;border-radius:9px;cursor:pointer;font-family:'Nunito',sans-serif;font-weight:700;font-size:13px;transition:all .18s;display:inline-flex;align-items:center;gap:6px}
.btn-gold{background:linear-gradient(135deg,#C9A84C,#F0CC70);color:#08100a}
.btn-gold:hover{filter:brightness(1.1);transform:translateY(-1px)}
.btn-blue{background:${G.accent2};color:#fff}.btn-blue:hover{filter:brightness(1.12)}
.btn-ghost{background:${G.border};color:${G.text}}.btn-ghost:hover{background:#253045}
.btn-danger{background:${G.danger};color:#fff}
.btn-sm{padding:5px 12px;font-size:12px;border-radius:7px}
.input{background:${G.card2};border:1.5px solid ${G.border};border-radius:9px;color:${G.text};padding:10px 13px;font-family:'Nunito',sans-serif;font-size:14px;width:100%;outline:none;transition:border-color .2s}
.input:focus{border-color:${G.accent}}.input::placeholder{color:${G.muted}}
.card{background:${G.card};border:1px solid ${G.border};border-radius:14px;padding:18px}
.card2{background:${G.card2};border:1px solid ${G.border};border-radius:12px;padding:14px}
.badge{padding:2px 9px;border-radius:20px;font-size:11px;font-weight:700;display:inline-block}
.b-gold{background:rgba(201,168,76,.18);color:${G.accent};border:1px solid rgba(201,168,76,.35)}
.b-green{background:rgba(76,200,122,.15);color:${G.accent3};border:1px solid rgba(76,200,122,.3)}
.b-red{background:rgba(200,76,76,.15);color:#E07070;border:1px solid rgba(200,76,76,.3)}
.b-blue{background:rgba(76,154,200,.15);color:${G.accent2};border:1px solid rgba(76,154,200,.3)}
.nav-item{padding:7px 15px;border-radius:9px;cursor:pointer;font-weight:700;font-size:13px;transition:all .18s;color:${G.muted};border:1.5px solid transparent}
.nav-item:hover{color:${G.text};background:${G.border}}.nav-item.active{color:#08100a;background:linear-gradient(135deg,#C9A84C,#F0CC70)}
.chip{border-radius:7px;border:1.5px solid ${G.border};cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:all .13s;background:${G.card2};padding:4px 2px;min-height:46px;font-size:10px;font-weight:700;text-align:center;gap:1px}
.chip:hover{transform:scale(1.08);z-index:2}
.chip.need{background:rgba(200,76,76,.22);border-color:#C84C4C;color:#E07070}
.chip.have{background:rgba(76,200,122,.18);border-color:#4CC87A;color:${G.accent3}}
.chip.both{background:rgba(201,168,76,.18);border-color:${G.accent};color:${G.accent}}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.78);display:flex;align-items:center;justify-content:center;z-index:999;padding:16px;backdrop-filter:blur(6px)}
.modal{background:${G.card};border:1px solid ${G.border};border-radius:18px;padding:26px;max-width:460px;width:100%;max-height:88vh;overflow-y:auto}
.stat{background:${G.card2};border-radius:11px;padding:12px 10px;text-align:center;border:1px solid ${G.border}}
.stat-n{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:30px;line-height:1}
.stat-l{font-size:10px;color:${G.muted};font-weight:700;margin-top:3px;letter-spacing:.5px}
.match-row{background:linear-gradient(135deg,rgba(76,154,200,.07),rgba(76,200,122,.05));border:1px solid rgba(76,154,200,.25);border-radius:12px;padding:15px}
.prog-bar{height:6px;border-radius:3px;background:${G.border};overflow:hidden}
.prog-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,${G.accent},${G.accent2})}
.alert{padding:9px 13px;border-radius:9px;font-size:13px;font-weight:600}
.alert-err{background:rgba(200,76,76,.15);border:1px solid rgba(200,76,76,.35);color:#E07070}
.alert-ok{background:rgba(76,200,122,.13);border:1px solid rgba(76,200,122,.3);color:${G.accent3}}
.spinner{width:36px;height:36px;border:3px solid ${G.border};border-top-color:${G.accent};border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.ani{animation:up .25s ease}
`;

// ─── AUTH ─────────────────────────────────────────────────────────────────────
const TERMS = `TÉRMINOS Y CONDICIONES DE USO — CROMOS PANINI 2026

Esta plataforma es un servicio gratuito para facilitar el intercambio de cromos entre usuarios. Al registrarte aceptás lo siguiente:

1. RESPONSABILIDAD DE LOS INTERCAMBIOS: Los intercambios de cromos se realizan directamente entre usuarios. Esta plataforma actúa únicamente como intermediario informativo y NO se hace responsable por intercambios no completados, cromos perdidos, dañados o cualquier disputa entre usuarios.

2. DATOS PERSONALES: Tu nombre, ciudad y número de WhatsApp serán visibles para los miembros de los grupos a los que pertenezcas. Al registrarte autorizás esta visibilidad.

3. CONDUCTA: Los usuarios se comprometen a actuar de buena fe en los intercambios. El uso indebido de la plataforma puede resultar en la eliminación de la cuenta.

4. EXENCIÓN DE RESPONSABILIDAD: Los administradores de esta plataforma no son responsables por pérdidas económicas, daños o perjuicios derivados del uso de la misma.

5. MENORES DE EDAD: Si sos menor de 18 años, necesitás autorización de un adulto responsable para registrarte.

Al crear una cuenta confirmás haber leído y aceptado estos términos.`;

function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({ email:"", password:"", name:"", username:"", city:"", whatsapp:"", provincia:"", canton:"" });
  const [err, setErr]       = useState("");
  const [loading, setLoading] = useState(false);
  const [terms, setTerms]   = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const hc = e => setF(p=>({...p,[e.target.name]:e.target.value}));

  const submit = async () => {
    setErr(""); setLoading(true);
    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email:f.email, password:f.password });
        if (error) return setErr("Email o contraseña incorrectos.");
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
        onLogin(profile);
      } else {
        if (!f.name.trim()||!f.username.trim()||!f.email.trim()||!f.password.trim()||!f.city.trim())
          return setErr("Completa todos los campos.");
        if (!terms) return setErr("Debés aceptar los términos y condiciones.");
        if (f.username.trim().length < 3) return setErr("El usuario debe tener al menos 3 caracteres.");
        if (f.password.length < 6) return setErr("La contraseña debe tener mínimo 6 caracteres.");
        const key = f.username.toLowerCase().replace(/\s/g,"");
        const { data: existing } = await supabase.from("profiles").select("id").eq("username", key).single();
        if (existing) return setErr("Ese usuario ya está registrado.");
        const { data, error } = await supabase.auth.signUp({ email:f.email, password:f.password });
        if (error) return setErr("Error auth: " + error.message);
        if (!data?.user?.id) return setErr("No se pudo crear el usuario. Intentá con otro email.");
        const profile = { id:data.user.id, username:key, name:f.name.trim(), city:f.city.trim(), whatsapp:f.whatsapp.trim(), provincia:f.provincia||"", canton:f.canton.trim(), groups:[] };
        const { error: profileError } = await supabase.from("profiles").insert(profile);
        if (profileError) return setErr("Error perfil: " + profileError.message);
        const { error: cromosError } = await supabase.from("user_cromos").insert({ user_id:data.user.id, have:[], doubles:[] });
        if (cromosError) return setErr("Error cromos: " + cromosError.message);
        // Enviar email de bienvenida desde el cliente
        fetch("https://wldpquyktdnfqerzzpda.supabase.co/functions/v1/bienvenida", {
          method:"POST",
          headers:{ "Content-Type":"application/json",
            "Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsZHBxdXlrdGRuZnFlcnp6cGRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5Mzg2MjgsImV4cCI6MjA5NDUxNDYyOH0.6F8Zwxq3zW-wVKRQCPJSwJjvty46A8IPmsti1DKF4mo" },
          body: JSON.stringify({ record:{ email:f.email, raw_user_meta_data:{ name:f.name.trim() } } })
        }).catch(()=>{}); // silencioso si falla
        onLogin(profile);
      }
    } finally { setLoading(false); }
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,
      background:`radial-gradient(ellipse at 30% 40%,rgba(201,168,76,.09) 0%,transparent 55%),
                  radial-gradient(ellipse at 70% 60%,rgba(76,154,200,.07) 0%,transparent 55%),${G.bg}`}}>
      <div className="ani" style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:30}}>
          <div style={{fontSize:52,marginBottom:6}}>⚽</div>
          <div className="h1" style={{fontSize:32,color:G.accent,letterSpacing:4}}>FIFA WORLD CUP 2026</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,color:G.accent2,letterSpacing:6,marginTop:2}}>CROMOS PANINI</div>
          <div style={{color:G.muted,fontSize:12,marginTop:8}}>Intercambiá cromos con tu comunidad</div>
        </div>
        <div className="card">
          <div style={{display:"flex",background:G.bg,borderRadius:9,padding:4,marginBottom:20}}>
            {["login","register"].map(m=>(
              <button key={m} className="btn" onClick={()=>{setMode(m);setErr("");}}
                style={{flex:1,justifyContent:"center",background:mode===m?"linear-gradient(135deg,#C9A84C,#F0CC70)":"transparent",
                  color:mode===m?"#08100a":G.muted,borderRadius:7}}>
                {m==="login"?"Iniciar sesión":"Registrarse"}
              </button>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:11}}>
            {mode==="register" && <>
              <div>
                <div style={{fontSize:11,color:G.muted,fontWeight:700,marginBottom:5}}>NOMBRE COMPLETO</div>
                <input className="input" name="name" placeholder="Tu nombre" value={f.name} onChange={hc}/>
              </div>
              <div>
                <div style={{fontSize:11,color:G.muted,fontWeight:700,marginBottom:5}}>USUARIO</div>
                <input className="input" name="username" placeholder="@usuario (sin espacios)" value={f.username} onChange={hc}/>
              </div>
              <div>
                <div style={{fontSize:11,color:G.muted,fontWeight:700,marginBottom:5}}>CIUDAD / ZONA</div>
                <input className="input" name="city" placeholder="Ej: Barrio, urbanización…" value={f.city} onChange={hc}/>
              </div>
              <ProvinciaCantonSelect
                provincia={f.provincia} canton={f.canton}
                onProvincia={v=>setF(p=>({...p,provincia:v,canton:""}))}
                onCanton={v=>setF(p=>({...p,canton:v}))}/>
              <div>
                <div style={{fontSize:11,color:G.muted,fontWeight:700,marginBottom:5}}>WHATSAPP <span style={{color:G.muted,fontWeight:400}}>(con código de país)</span></div>
                <input className="input" name="whatsapp" placeholder="Ej: 50688887777" value={f.whatsapp} onChange={hc}/>
              </div>
            </>}
            <div>
              <div style={{fontSize:11,color:G.muted,fontWeight:700,marginBottom:5}}>EMAIL</div>
              <input className="input" name="email" type="email" placeholder="tu@email.com" value={f.email} onChange={hc}/>
            </div>
            <div>
              <div style={{fontSize:11,color:G.muted,fontWeight:700,marginBottom:5}}>CONTRASEÑA</div>
              <input className="input" type="password" name="password" placeholder="••••••••" value={f.password} onChange={hc}
                onKeyDown={e=>e.key==="Enter"&&submit()}/>
            </div>
            {err && <div className="alert alert-err">{err}</div>}
            {mode==="register" && (
              <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 12px",
                background:G.bg,borderRadius:9,border:`1px solid ${G.border}`}}>
                <input type="checkbox" id="terms" checked={terms} onChange={e=>setTerms(e.target.checked)}
                  style={{marginTop:2,accentColor:G.accent,width:16,height:16,cursor:"pointer",flexShrink:0}}/>
                <label htmlFor="terms" style={{fontSize:12,color:G.muted,cursor:"pointer",lineHeight:1.5}}>
                  He leído y acepto los{" "}
                  <span onClick={e=>{e.preventDefault();setShowTerms(true);}}
                    style={{color:G.accent,textDecoration:"underline",cursor:"pointer"}}>
                    términos y condiciones
                  </span>
                  {" "}de uso de la plataforma.
                </label>
              </div>
            )}
            <button className="btn btn-gold" onClick={submit} disabled={loading}
              style={{width:"100%",justifyContent:"center",padding:12,fontSize:15,marginTop:4,opacity:loading?.7:1}}>
              {loading ? "Cargando..." : mode==="login" ? "⚽ Entrar" : "🏆 Crear cuenta"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal términos */}
      {showTerms && (
        <div className="modal-bg" onClick={()=>setShowTerms(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:540}}>
            <div className="h1" style={{fontSize:20,letterSpacing:2,marginBottom:16}}>TÉRMINOS Y CONDICIONES</div>
            <div style={{fontSize:13,color:G.muted,lineHeight:1.7,whiteSpace:"pre-line",marginBottom:20}}>
              {TERMS}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn btn-ghost" onClick={()=>setShowTerms(false)} style={{flex:1,justifyContent:"center"}}>Cerrar</button>
              <button className="btn btn-gold" onClick={()=>{setTerms(true);setShowTerms(false);}} style={{flex:1,justifyContent:"center"}}>
                ✅ Acepto los términos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MIS CROMOS ───────────────────────────────────────────────────────────────
function CromosScreen({ user }) {
  const [data, setData]     = useState({ have:[], doubles:[] });
  const [sec,  setSec]      = useState(SECTIONS[0].id);
  const [filterMode, setFilterMode] = useState("all"); // all | missing | have | doubles
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    supabase.from("user_cromos").select("*").eq("user_id",user.id).single()
      .then(({data:d})=>{
        if(d) setData({ have:d.have||[], doubles:d.doubles||d.need||[] });
        // nota: usamos "doubles" como campo nuevo; si no existe cae en "need" por compatibilidad
      });
  },[user.id]);

  // Toque largo para dobles
  const saveData = async (next) => {
    setData(next);
    setSaving(true);
    await supabase.from("user_cromos").upsert({ user_id:user.id, have:next.have, doubles:next.doubles, need:next.doubles });
    setSaving(false);
  };

  const toggleHave = async (id) => {
    const next = { ...data };
    if (data.have.includes(id)) {
      // Desmarco: ya no lo tengo pegado
      next.have    = data.have.filter(x => x !== id);
      next.doubles = data.doubles.filter(x => x !== id);
    } else {
      // Marco como pegado
      next.have = [...data.have, id];
    }
    await saveData(next);
  };

  const toggleDouble = async (id) => {
    if (!data.have.includes(id)) return; // solo si ya lo tengo pegado
    const next = { ...data };
    next.doubles = data.doubles.includes(id)
      ? data.doubles.filter(x => x !== id)
      : [...data.doubles, id];
    await saveData(next);
  };

  const secInfo      = SECTIONS.find(s => s.id === sec);
  const secCromos    = ALL_CROMOS.filter(c => c.section === sec);
  const secHave      = secCromos.filter(c => data.have.includes(c.id)).length;
  const secPct       = Math.round((secHave / secInfo.count) * 100);
  const totalHave    = data.have.length;
  const totalPct     = Math.round((totalHave / TOTAL) * 100);
  const totalMissing = TOTAL - totalHave;

  const descargar = () => {
    const missing = ALL_CROMOS.filter(c => !data.have.includes(c.id));
    const doubles = ALL_CROMOS.filter(c => data.doubles.includes(c.id));

    const missingBySec = SECTIONS.map(s => ({
      sec: s,
      items: missing.filter(c => c.section === s.id),
    })).filter(x => x.items.length > 0);

    const doublesBySec = SECTIONS.map(s => ({
      sec: s,
      items: doubles.filter(c => c.section === s.id),
    })).filter(x => x.items.length > 0);

    const lines = [];
    lines.push(`⚽ *CROMOS PANINI - FIFA WORLD CUP 2026*`);
    lines.push(`👤 ${user.name}${user.provincia ? ` | 📍 ${user.provincia}${user.canton?`, ${user.canton}`:""}` : ""}`);
    lines.push(`📅 ${new Date().toLocaleDateString("es-CR")}`);
    lines.push(`📊 Progreso: ${totalHave}/${TOTAL} pegados (${totalPct}%)`);
    lines.push(``);

    if (missing.length > 0) {
      lines.push(`🔴 *BUSCO ESTOS CROMOS (${missing.length})*`);
      lines.push(`_Si tenés alguno de sobra, ¡escribime!_`);
      lines.push(``);
      missingBySec.forEach(({sec, items}) => {
        lines.push(`${sec.flag} *${sec.name}* — ${items.length} cromos`);
        lines.push(items.map(c => `#${c.id}`).join(" · "));
        lines.push(``);
      });
    }

    if (doubles.length > 0) {
      lines.push(`🟢 *TENGO ESTOS CROMOS DE SOBRA (${doubles.length})*`);
      lines.push(`_Los cambio por los que me faltan_`);
      lines.push(``);
      doublesBySec.forEach(({sec, items}) => {
        lines.push(`${sec.flag} *${sec.name}* — ${items.length} dobles`);
        lines.push(items.map(c => `#${c.id}`).join(" · "));
        lines.push(``);
      });
    }

    lines.push(`🔗 Encontrá más intercambios en:`);
    lines.push(`https://cromos-panini.vercel.app`);

    const blob = new Blob([lines.join("\n")], { type:"text/plain;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `cromos_${user.username}_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ani">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
        <div className="h1" style={{fontSize:24,letterSpacing:2}}>MI ÁLBUM — <span style={{color:G.accent}}>{user.name}</span></div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {saving && <span style={{fontSize:12,color:G.accent2}}>💾 Guardando...</span>}
          <button className="btn btn-ghost btn-sm" onClick={descargar} title="Descargar lista de cromos">
            📥 Descargar lista
          </button>
        </div>
      </div>

      {/* Stats globales */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:12}}>
        <div className="stat"><div className="stat-n" style={{color:G.accent}}>{TOTAL}</div><div className="stat-l">TOTAL ÁLBUM</div></div>
        <div className="stat"><div className="stat-n" style={{color:G.accent3}}>{totalHave}</div><div className="stat-l">TENGO</div></div>
        <div className="stat"><div className="stat-n" style={{color:"#E07070"}}>{totalMissing}</div><div className="stat-l">ME FALTAN</div></div>
        <div className="stat"><div className="stat-n" style={{color:G.accent2}}>{totalPct}%</div><div className="stat-l">COMPLETADO</div></div>
      </div>

      {/* Barra progreso global */}
      <div style={{marginBottom:18}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:G.muted,marginBottom:5}}>
          <span>Progreso total del álbum</span>
          <span style={{color:G.accent,fontWeight:700}}>{totalPct}%</span>
        </div>
        <div className="prog-bar" style={{height:10,borderRadius:5}}>
          <div className="prog-fill" style={{width:`${totalPct}%`,transition:"width .4s"}}/>
        </div>
      </div>

      {/* Instrucción */}
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14,alignItems:"center",
        background:G.card2,borderRadius:10,padding:"10px 14px",border:`1px solid ${G.border}`}}>
        <span style={{fontSize:12,color:G.muted,fontWeight:700}}>¿Cómo funciona?</span>
        <span style={{fontSize:12,color:G.muted}}>
          <span style={{background:"rgba(76,200,122,.2)",border:"1px solid #4CC87A",borderRadius:5,padding:"2px 7px",color:G.accent3,fontWeight:700,marginRight:4}}>1 toque</span>
          Lo tengo
        </span>
        <span style={{fontSize:12,color:G.muted}}>
          <span style={{background:"rgba(201,168,76,.2)",border:"1px solid #C9A84C",borderRadius:5,padding:"2px 7px",color:G.accent,fontWeight:700,marginRight:4}}>2 toques</span>
          Tengo doble
        </span>
        <span style={{fontSize:12,color:G.muted}}>
          <span style={{background:"rgba(200,76,76,.2)",border:"1px solid #C84C4C",borderRadius:5,padding:"2px 7px",color:"#E07070",fontWeight:700,marginRight:4}}>3 toques</span>
          No lo tengo
        </span>
        <div style={{marginLeft:"auto",display:"flex",gap:6}}>
          {[["all","Todos"],["missing","Me faltan"],["have","Tengo"],["doubles","Dobles"]].map(([k,l])=>(
            <button key={k} className="btn btn-sm" onClick={()=>setFilterMode(k)}
              style={{background:filterMode===k?G.accent:G.border,color:filterMode===k?"#08100a":G.muted}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Selector de selección/país */}
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:14}}>
        {SECTIONS.map(s=>{
          const sCromos  = ALL_CROMOS.filter(c=>c.section===s.id);
          const sGot     = sCromos.filter(c=>data.have.includes(c.id)).length;
          const sPct     = Math.round((sGot/s.count)*100);
          const sDoubles = data.doubles.filter(id=>id.startsWith(s.id)).length;
          const active   = sec===s.id;
          const complete = sPct===100;
          return (
            <button key={s.id} onClick={()=>setSec(s.id)}
              style={{padding:"5px 10px",borderRadius:8,
                border:`2px solid ${active?s.color:complete?"rgba(76,200,122,.5)":"transparent"}`,
                background:active?`${s.color}20`:complete?"rgba(76,200,122,.08)":G.border,
                color:active?s.color:complete?G.accent3:G.muted,
                cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"Nunito",transition:"all .15s",
                display:"flex",alignItems:"center",gap:4}}>
              {complete?"✅":s.flag} {s.name}
              <span style={{fontSize:10,opacity:.8}}>{sPct}%</span>
              {sDoubles>0&&<span style={{background:"rgba(201,168,76,.3)",color:G.accent,borderRadius:10,padding:"0 5px",fontSize:10}}>{sDoubles}×2</span>}
            </button>
          );
        })}
      </div>

      {/* Grid de cromos */}
      <div className="card" style={{padding:14}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,flexWrap:"wrap"}}>
          <span style={{fontSize:22}}>{secInfo.flag}</span>
          <div className="h1" style={{fontSize:20,letterSpacing:2}}>{secInfo.name}</div>
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
            <span style={{fontSize:12,color:G.muted}}>
              <span style={{color:G.accent3,fontWeight:700}}>{secHave}</span>/{secInfo.count} pegados
              {data.doubles.filter(id=>id.startsWith(secInfo.id)).length>0&&
                <span style={{color:G.accent,marginLeft:8}}>· {data.doubles.filter(id=>id.startsWith(secInfo.id)).length} dobles</span>}
            </span>
            <button className="btn btn-sm"
              onClick={async ()=>{
                const allSecIds = secCromos.map(c=>c.id);
                const allHave   = secCromos.every(c=>data.have.includes(c.id));
                const next = {...data};
                if(allHave){
                  // Deseleccionar todos: sacar de have y doubles
                  next.have    = data.have.filter(id=>!allSecIds.includes(id));
                  next.doubles = data.doubles.filter(id=>!allSecIds.includes(id));
                } else {
                  // Seleccionar todos: agregar los que faltan a have
                  const missing = allSecIds.filter(id=>!data.have.includes(id));
                  next.have = [...data.have, ...missing];
                }
                await saveData(next);
              }}
              style={{
                background: secCromos.every(c=>data.have.includes(c.id)) ? "rgba(200,76,76,.2)" : "rgba(76,200,122,.15)",
                color:      secCromos.every(c=>data.have.includes(c.id)) ? "#E07070" : G.accent3,
                border:     `1px solid ${secCromos.every(c=>data.have.includes(c.id)) ? "rgba(200,76,76,.4)" : "rgba(76,200,122,.35)"}`,
                fontWeight: 700,
              }}>
              {secCromos.every(c=>data.have.includes(c.id)) ? "✗ Desmarcar todos" : "✓ Marcar todos"}
            </button>
          </div>
        </div>

        {/* Barra progreso sección */}
        <div style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:G.muted,marginBottom:4}}>
            <span>{secInfo.name}</span>
            <span style={{color:secPct===100?G.accent3:G.accent,fontWeight:700}}>{secPct}%{secPct===100?" ✅ ¡Completo!":""}</span>
          </div>
          <div className="prog-bar">
            <div className="prog-fill" style={{width:`${secPct}%`,
              background:secPct===100?"linear-gradient(90deg,#4CC87A,#06D6A0)":"linear-gradient(90deg,#C9A84C,#4C9AC8)",
              transition:"width .3s"}}/>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(54px,1fr))",gap:5}}>
          {secCromos.map(c=>{
            const got      = data.have.includes(c.id);
            const isDouble = data.doubles.includes(c.id);

            if(filterMode==="missing" && got)       return null;
            if(filterMode==="have"    && !got)      return null;
            if(filterMode==="doubles" && !isDouble) return null;

            const cls = isDouble?"both":got?"have":"need";

            // Ciclo: sin marcar → tengo (1 toque) → tengo doble (2 toques) → no tengo (3 toques)
            const handleClick = async () => {
              const next = {...data};
              if (!got && !isDouble) {
                // Sin marcar → tengo
                next.have = [...data.have, c.id];
              } else if (got && !isDouble) {
                // Tengo → tengo doble
                next.doubles = [...data.doubles, c.id];
              } else if (got && isDouble) {
                // Tengo doble → no tengo
                next.have    = data.have.filter(x=>x!==c.id);
                next.doubles = data.doubles.filter(x=>x!==c.id);
              }
              await saveData(next);
            };

            const state = isDouble ? "×2 Doble" : got ? "✓ Tengo" : "✗ Falta";

            return (
              <div key={c.id} className={`chip ${cls}`}
                onClick={handleClick}
                onContextMenu={e=>e.preventDefault()}
                style={{userSelect:"none",WebkitUserSelect:"none",cursor:"pointer"}}
                title={`${c.id} — ${state}\n1 toque: Tengo | 2 toques: Doble | 3 toques: No tengo`}>
                <span style={{fontSize:9,color:"currentColor",opacity:.55}}>{secInfo.id}</span>
                <span style={{fontSize:13}}>{c.num}</span>
                {isDouble&&<span style={{fontSize:8,lineHeight:1}}>×2</span>}
              </div>
            );
          })}
        </div>

        <div style={{marginTop:12,fontSize:11,color:G.muted,display:"flex",gap:14,flexWrap:"wrap"}}>
          <span><span style={{color:"#E07070"}}>■</span> No lo tengo (3 toques)</span>
          <span><span style={{color:G.accent3}}>■</span> Lo tengo (1 toque)</span>
          <span><span style={{color:G.accent}}>■</span> Tengo doble (2 toques)</span>
        </div>
      </div>
    </div>
  );
}

// ─── GRUPOS ───────────────────────────────────────────────────────────────────
const GTYPES = [
  {id:"vecinos",label:"Vecinos",  icon:"🏘️", color:"#C87A4C"},
  {id:"trabajo",label:"Trabajo",  icon:"💼", color:"#4C7AC8"},
  {id:"amigos", label:"Amigos",   icon:"👥", color:"#4CC87A"},
  {id:"familia",label:"Familia",  icon:"👨‍👩‍👧",color:"#C8AA4C"},
  {id:"escuela",label:"Escuela",  icon:"🎓", color:"#AA4CC8"},
  {id:"deporte",label:"Deporte",  icon:"⚽", color:"#4CC8C8"},
];

function GroupsScreen({ user, onUserUpdate }) {
  const [modal,  setModal]  = useState(null);
  const [form,   setForm]   = useState({name:"",type:"vecinos",code:""});
  const [msg,    setMsg]    = useState({t:"",k:""});
  const [detail, setDetail] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading,setLoading]= useState(true);

  const flash = (t,k="ok")=>{ setMsg({t,k}); setTimeout(()=>setMsg({t:"",k:""}),3000); };

  useEffect(()=>{
    loadGroups();
  },[user.groups]);

  const loadGroups = async () => {
    if(!user.groups||user.groups.length===0){ setGroups([]); setLoading(false); return; }
    const {data} = await supabase.from("groups").select("*").in("id",user.groups);
    setGroups(data||[]);
    setLoading(false);
  };

  const createGroup = async () => {
    if(!form.name.trim()) return flash("Ponle un nombre al grupo.","err");
    const id=genId(), code=genCode();
    const g={id,name:form.name.trim(),type:form.type,code,members:[user.id],admin_id:user.id};
    await supabase.from("groups").insert(g);
    const newGroups=[...(user.groups||[]),id];
    await supabase.from("profiles").update({groups:newGroups}).eq("id",user.id);
    const upd={...user,groups:newGroups};
    onUserUpdate(upd);
    setGroups(prev=>[...prev,g]);
    setModal(null); flash(`Grupo "${form.name}" creado. Código: ${code}`);
  };

  const joinGroup = async () => {
    const code = form.code.toUpperCase().trim();
    const {data:g} = await supabase.from("groups").select("*").eq("code",code).single();
    if(!g) return flash("Código inválido.","err");
    if((user.groups||[]).includes(g.id)) return flash("Ya eres miembro.","err");
    const newMembers=[...g.members,user.id];
    await supabase.from("groups").update({members:newMembers}).eq("id",g.id);
    const newGroups=[...(user.groups||[]),g.id];
    await supabase.from("profiles").update({groups:newGroups}).eq("id",user.id);
    const upd={...user,groups:newGroups};
    onUserUpdate(upd);
    setGroups(prev=>[...prev,{...g,members:newMembers}]);
    setModal(null); flash(`¡Unido a "${g.name}"!`);
  };

  const leaveGroup = async (gid) => {
    const g = groups.find(x=>x.id===gid);
    if(g){ await supabase.from("groups").update({members:g.members.filter(m=>m!==user.id)}).eq("id",gid); }
    const newGroups=(user.groups||[]).filter(x=>x!==gid);
    await supabase.from("profiles").update({groups:newGroups}).eq("id",user.id);
    onUserUpdate({...user,groups:newGroups});
    setGroups(prev=>prev.filter(x=>x.id!==gid));
    if(detail?.id===gid) setDetail(null);
    flash("Saliste del grupo.");
  };

  if(detail) return <GroupDetail group={detail} user={user} onBack={()=>setDetail(null)} onLeave={leaveGroup}/>;

  const gt = id=>GTYPES.find(t=>t.id===id)||GTYPES[0];

  return (
    <div className="ani">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:10}}>
        <div className="h1" style={{fontSize:24,letterSpacing:2}}>MIS GRUPOS</div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn btn-ghost btn-sm" onClick={()=>setModal("join")}>🔑 Unirse</button>
          <button className="btn btn-gold btn-sm"  onClick={()=>setModal("create")}>➕ Crear grupo</button>
        </div>
      </div>

      {msg.t && <div className={`alert alert-${msg.k} ani`} style={{marginBottom:14}}>{msg.t}</div>}

      {loading ? (
        <div style={{display:"flex",justifyContent:"center",padding:40}}><div className="spinner"/></div>
      ) : groups.length===0 ? (
        <div className="card" style={{textAlign:"center",padding:44}}>
          <div style={{fontSize:44,marginBottom:12}}>🏘️</div>
          <div style={{color:G.muted,marginBottom:18}}>Aún no pertenecés a ningún grupo.</div>
          <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
            <button className="btn btn-ghost" onClick={()=>setModal("join")}>🔑 Unirse con código</button>
            <button className="btn btn-gold"  onClick={()=>setModal("create")}>➕ Crear mi grupo</button>
          </div>
        </div>
      ) : (
        <div style={{display:"grid",gap:11,gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))"}}>
          {groups.map(g=>{
            const t=gt(g.type);
            return (
              <div key={g.id} className="card" style={{cursor:"pointer",borderColor:`${t.color}33`}} onClick={()=>setDetail(g)}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div style={{fontSize:24,marginBottom:4}}>{t.icon}</div>
                    <div style={{fontWeight:800,fontSize:16}}>{g.name}</div>
                    <div style={{color:G.muted,fontSize:12,marginTop:2}}>{t.label}</div>
                  </div>
                  <span className="badge b-gold">👥 {g.members.length}</span>
                </div>
                <div style={{marginTop:12,background:G.bg,borderRadius:8,padding:"7px 11px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:12,color:G.muted}}>Código: <strong style={{color:G.text,letterSpacing:2}}>{g.code}</strong></span>
                  {g.admin_id===user.id && <span className="badge b-gold" style={{fontSize:10}}>ADMIN</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal==="create" && (
        <div className="modal-bg" onClick={()=>setModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="h1" style={{fontSize:22,marginBottom:20,letterSpacing:2}}>CREAR GRUPO</div>
            <div style={{display:"flex",flexDirection:"column",gap:13}}>
              <div>
                <div style={{fontSize:11,color:G.muted,fontWeight:700,marginBottom:5}}>NOMBRE DEL GRUPO</div>
                <input className="input" placeholder="Ej: Vecinos Los Pinos" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>
              </div>
              <div>
                <div style={{fontSize:11,color:G.muted,fontWeight:700,marginBottom:8}}>TIPO</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7}}>
                  {GTYPES.map(t=>(
                    <button key={t.id} onClick={()=>setForm(p=>({...p,type:t.id}))}
                      style={{padding:"9px 8px",borderRadius:9,border:`2px solid ${form.type===t.id?t.color:G.border}`,
                        background:form.type===t.id?`${t.color}18`:G.bg,color:form.type===t.id?t.color:G.muted,
                        cursor:"pointer",fontFamily:"Nunito",fontWeight:700,fontSize:12,display:"flex",
                        flexDirection:"column",alignItems:"center",gap:3,transition:"all .15s"}}>
                      <span style={{fontSize:18}}>{t.icon}</span>{t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{display:"flex",gap:8,marginTop:4}}>
                <button className="btn btn-ghost" onClick={()=>setModal(null)} style={{flex:1,justifyContent:"center"}}>Cancelar</button>
                <button className="btn btn-gold"  onClick={createGroup}        style={{flex:1,justifyContent:"center"}}>✨ Crear</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modal==="join" && (
        <div className="modal-bg" onClick={()=>setModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="h1" style={{fontSize:22,marginBottom:14,letterSpacing:2}}>UNIRSE A UN GRUPO</div>
            <p style={{color:G.muted,fontSize:13,marginBottom:16}}>Pedí el código al admin del grupo e ingrésalo aquí.</p>
            <input className="input" placeholder="Código (ej: AB3F7)" value={form.code}
              onChange={e=>setForm(p=>({...p,code:e.target.value}))}
              style={{textAlign:"center",fontSize:22,letterSpacing:6,fontWeight:800,marginBottom:14}}/>
            <div style={{display:"flex",gap:8}}>
              <button className="btn btn-ghost" onClick={()=>setModal(null)} style={{flex:1,justifyContent:"center"}}>Cancelar</button>
              <button className="btn btn-blue"  onClick={joinGroup}          style={{flex:1,justifyContent:"center"}}>🔑 Unirse</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DETALLE GRUPO ────────────────────────────────────────────────────────────
function GroupDetail({ group, user, onBack, onLeave }) {
  const [tab, setTab]       = useState("matches");
  const [members, setMembers] = useState([]);
  const [cromos,  setCromos]  = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const load = async () => {
      const {data:profs} = await supabase.from("profiles").select("*").in("id", group.members);
      setMembers(profs||[]);
      const {data:crms} = await supabase.from("user_cromos").select("*").in("user_id", group.members);
      const map = {};
      (crms||[]).forEach(c=>{
        map[c.user_id] = {
          have:    c.have    || [],
          doubles: c.doubles || c.need || [], // compatibilidad con datos viejos
        };
      });
      setCromos(map);
      setLoading(false);
    };
    load();
  },[group.id]);

  const myData    = cromos[user.id] || {have:[], doubles:[]};
  const myMissing = ALL_CROMOS.filter(c => !myData.have.includes(c.id)).map(c => c.id);

  const matches = members.filter(m => m.id !== user.id).map(m => {
    const md       = cromos[m.id] || {have:[], doubles:[]};
    const mMissing = ALL_CROMOS.filter(c => !md.have.includes(c.id)).map(c => c.id);
    // Yo le doy: mis dobles que él necesita
    const iGive    = myData.doubles.filter(id => mMissing.includes(id));
    // Él me da: sus dobles que yo necesito
    const theyGive = md.doubles.filter(id => myMissing.includes(id));
    return { member:m, iGive, theyGive, score:iGive.length + theyGive.length };
  }).filter(x => x.score > 0).sort((a,b) => b.score - a.score);

  const t = GTYPES.find(x => x.id === group.type) || GTYPES[0];
  const secOf = id => { const c = ALL_CROMOS.find(x => x.id === id); return c ? SECTIONS.find(s => s.id === c.section) : null; };

  return (
    <div className="ani">
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{marginBottom:16}}>← Volver</button>
      <div className="card" style={{marginBottom:18,borderColor:`${t.color}30`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
          <div>
            <div style={{fontSize:26,marginBottom:2}}>{t.icon}</div>
            <div className="h1" style={{fontSize:24,letterSpacing:2}}>{group.name}</div>
            <div style={{color:G.muted,fontSize:13}}>{t.label} · {group.members.length} miembro{group.members.length!==1?"s":""}</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{background:G.bg,borderRadius:10,padding:"8px 14px",textAlign:"center"}}>
              <div style={{fontSize:10,color:G.muted,fontWeight:700,letterSpacing:1}}>CÓDIGO</div>
              <div className="h1" style={{fontSize:20,letterSpacing:6,color:G.accent}}>{group.code}</div>
            </div>
            {group.admin_id!==user.id && <button className="btn btn-danger btn-sm" onClick={()=>onLeave(group.id)}>Salir</button>}
          </div>
        </div>
      </div>

      <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>
        {["matches","members"].map(tb=>(
          <div key={tb} className={`nav-item ${tab===tb?"active":""}`} onClick={()=>setTab(tb)}>
            {tb==="matches"?"🔄 Intercambios posibles":"👥 Miembros"}
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{display:"flex",justifyContent:"center",padding:40}}><div className="spinner"/></div>
      ) : tab==="matches" ? (
        matches.length===0 ? (
          <div className="card" style={{textAlign:"center",padding:40}}>
            <div style={{fontSize:40,marginBottom:10}}>🔍</div>
            <div style={{color:G.muted,fontSize:14,lineHeight:1.7}}>
              No hay intercambios posibles aún.<br/>
              Para que aparezcan intercambios, los miembros deben:<br/>
              <span style={{color:G.accent3}}>✓ Marcar los cromos que ya pegaron</span><br/>
              <span style={{color:G.accent}}>× 2 toques para marcar los que tienen dobles</span>
            </div>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {matches.map(({member,iGive,theyGive})=>(
              <div key={member.id} className="match-row">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    {member.avatar_url
                      ? <img src={member.avatar_url} style={{width:38,height:38,borderRadius:"50%",objectFit:"cover",border:`2px solid ${G.accent}`}}/>
                      : <div style={{width:38,height:38,borderRadius:"50%",background:G.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>👤</div>}
                    <div>
                      <div style={{fontWeight:800,fontSize:15}}>{member.name}
                        {group.admin_id===member.id && <span className="badge b-gold" style={{marginLeft:6,fontSize:10}}>ADMIN</span>}
                      </div>
                      <div style={{fontSize:12,color:G.muted}}>
                        @{member.username}
                        {member.provincia && <span className="badge b-blue" style={{marginLeft:6,fontSize:10}}>📍 {member.provincia}{member.canton?`, ${member.canton}`:""}</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span className="badge b-gold">🔄 {iGive.length+theyGive.length}</span>
                    {member.whatsapp && (
                      <a href={`https://wa.me/${member.whatsapp.replace(/\D/g,"")}?text=${encodeURIComponent(
                        `¡Hola ${member.name}! Vi en Cromos Panini 2026 que podemos intercambiar:\n\n`+
                        (iGive.length>0?`✅ Yo te doy: ${iGive.slice(0,5).join(", ")}${iGive.length>5?` y ${iGive.length-5} más`:""}\n`:"")+
                        (theyGive.length>0?`🔄 Yo necesito: ${theyGive.slice(0,5).join(", ")}${theyGive.length>5?` y ${theyGive.length-5} más`:""}`:"")+
                        `\n\n¿Hacemos un intercambio?`
                      )}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{background:"#25D366",color:"#fff",padding:"5px 12px",borderRadius:8,
                          fontSize:12,fontWeight:700,textDecoration:"none",display:"flex",alignItems:"center",gap:5}}>
                        💬 WhatsApp
                      </a>
                    )}
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div className="card2" style={{borderColor:"rgba(76,200,122,.2)"}}>
                    <div style={{fontSize:11,color:G.accent3,fontWeight:700,marginBottom:7}}>YO LE DOY ({iGive.length})</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                      {iGive.slice(0,12).map(id=>{ const s=secOf(id); return <span key={id} className="badge b-green" style={{fontSize:10}}>{s?.flag} {id}</span>; })}
                      {iGive.length>12&&<span style={{fontSize:11,color:G.muted}}>+{iGive.length-12}</span>}
                    </div>
                  </div>
                  <div className="card2" style={{borderColor:"rgba(200,76,76,.2)"}}>
                    <div style={{fontSize:11,color:"#E07070",fontWeight:700,marginBottom:7}}>ÉL/ELLA ME DA ({theyGive.length})</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                      {theyGive.slice(0,12).map(id=>{ const s=secOf(id); return <span key={id} className="badge b-red" style={{fontSize:10}}>{s?.flag} {id}</span>; })}
                      {theyGive.length>12&&<span style={{fontSize:11,color:G.muted}}>+{theyGive.length-12}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {members.map(m=>{
            const md = cromos[m.id]||{have:[],doubles:[]};
            const mHave    = (md.have||[]).length;
            const mDoubles = (md.doubles||[]).length;
            const mMissing = ALL_CROMOS.length - mHave;
            const mPct     = Math.round((mHave/ALL_CROMOS.length)*100);
            return (
              <div key={m.id} className="card" style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  {m.avatar_url
                    ? <img src={m.avatar_url} style={{width:38,height:38,borderRadius:"50%",objectFit:"cover",border:`2px solid ${G.border}`}}/>
                    : <div style={{width:38,height:38,borderRadius:"50%",background:G.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>👤</div>}
                  <div>
                    <div style={{fontWeight:800}}>
                      {m.name}
                      {group.admin_id===m.id && <span className="badge b-gold" style={{marginLeft:6,fontSize:10}}>ADMIN</span>}
                      {m.id===user.id && <span className="badge" style={{marginLeft:6,fontSize:10,background:"rgba(76,154,200,.2)",color:G.accent2,border:`1px solid ${G.accent2}44`}}>YO</span>}
                    </div>
                    <div style={{color:G.muted,fontSize:12}}>
                      @{m.username}
                      {m.provincia && ` · 📍 ${m.provincia}${m.canton?`, ${m.canton}`:""}`}
                    </div>
                  </div>
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                  <span className="badge b-green">{mHave} pegados ({mPct}%)</span>
                  <span className="badge b-red">{mMissing} faltan</span>
                  {mDoubles>0 && <span className="badge b-gold">{mDoubles} dobles</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── PERFIL ───────────────────────────────────────────────────────────────────
function ProfileScreen({ user, onUserUpdate, onLogout }) {
  const [city,     setCity]   = useState(user.city||"");
  const [whatsapp, setWa]     = useState(user.whatsapp||"");
  const [provincia,setProv]   = useState(user.provincia||"");
  const [canton,   setCanton] = useState(user.canton||"");
  const [saved,    setSaved]  = useState(false);
  const [avatar,   setAvatar] = useState(user.avatar_url||null);
  const [uploading,setUploading] = useState(false);
  const [cromos,   setCromos] = useState({have:[],doubles:[]});

  useEffect(()=>{
    supabase.from("user_cromos").select("*").eq("user_id",user.id).single()
      .then(({data:d})=>{ if(d) setCromos({have:d.have||[],doubles:d.doubles||[]}); });
  },[user.id]);

  const save = async () => {
    await supabase.from("profiles").update({city:city.trim(),whatsapp:whatsapp.trim(),provincia,canton:canton.trim()}).eq("id",user.id);
    onUserUpdate({...user,city:city.trim(),whatsapp:whatsapp.trim(),provincia,canton:canton.trim()});
    setSaved(true); setTimeout(()=>setSaved(false),2000);
  };

  const uploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2*1024*1024) return alert("La foto debe pesar menos de 2MB.");
    setUploading(true);
    const ext  = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert:true });
    if (!error) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const url = data.publicUrl + "?t=" + Date.now();
      await supabase.from("profiles").update({avatar_url:url}).eq("id",user.id);
      setAvatar(url);
      onUserUpdate({...user,avatar_url:url});
    }
    setUploading(false);
  };

  const totalHave    = cromos.have.length;
  const totalPct     = Math.round((totalHave/TOTAL)*100);

  return (
    <div className="ani">
      <div className="h1" style={{fontSize:24,letterSpacing:2,marginBottom:18}}>MI PERFIL</div>
      <div style={{display:"grid",gap:14,gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))"}}>
        <div className="card">
          <div style={{fontSize:11,color:G.muted,fontWeight:700,marginBottom:14,letterSpacing:1}}>DATOS PERSONALES</div>

          {/* Foto de perfil */}
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:18}}>
            <div style={{position:"relative"}}>
              <div style={{width:72,height:72,borderRadius:"50%",background:G.border,
                border:`3px solid ${G.accent}`,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
                {avatar
                  ? <img src={avatar} alt="foto" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  : <span style={{fontSize:28}}>👤</span>}
              </div>
              {uploading && <div style={{position:"absolute",inset:0,borderRadius:"50%",
                background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div className="spinner" style={{width:24,height:24,borderWidth:2}}/>
              </div>}
            </div>
            <div>
              <div style={{fontWeight:800,fontSize:15,marginBottom:4}}>{user.name}</div>
              <div style={{color:G.accent2,fontSize:13,marginBottom:8}}>@{user.username}</div>
              <label style={{cursor:"pointer"}}>
                <input type="file" accept="image/*" onChange={uploadPhoto} style={{display:"none"}}/>
                <span className="btn btn-ghost btn-sm" style={{cursor:"pointer"}}>📷 Cambiar foto</span>
              </label>
            </div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div>
              <div style={{fontSize:11,color:G.muted,fontWeight:700,marginBottom:5}}>CIUDAD / ZONA</div>
              <input className="input" value={city} onChange={e=>setCity(e.target.value)} placeholder="Barrio, urbanización…"/>
            </div>
            <ProvinciaCantonSelect
              provincia={provincia} canton={canton}
              onProvincia={v=>{ setProv(v); setCanton(""); }}
              onCanton={v=>setCanton(v)}/>
            <div>
              <div style={{fontSize:11,color:G.muted,fontWeight:700,marginBottom:5}}>WHATSAPP <span style={{color:G.muted,fontWeight:400}}>(con código de país)</span></div>
              <input className="input" value={whatsapp} onChange={e=>setWa(e.target.value)} placeholder="Ej: 50688887777"/>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn btn-gold btn-sm" onClick={save}>{saved?"✅ Guardado":"💾 Guardar"}</button>
              <button className="btn btn-danger btn-sm" onClick={onLogout}>Cerrar sesión</button>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{fontSize:11,color:G.muted,fontWeight:700,marginBottom:14,letterSpacing:1}}>RESUMEN DE CROMOS</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            <div className="stat"><div className="stat-n" style={{color:G.accent3}}>{totalHave}</div><div className="stat-l">TENGO</div></div>
            <div className="stat"><div className="stat-n" style={{color:G.accent2}}>{totalPct}%</div><div className="stat-l">COMPLETADO</div></div>
          </div>
          <div style={{marginBottom:14}}>
            <div className="prog-bar"><div className="prog-fill" style={{width:`${totalPct}%`}}/></div>
          </div>
          <div style={{fontSize:11,color:G.muted,fontWeight:700,marginBottom:8}}>POR SELECCIÓN</div>
          <div style={{maxHeight:220,overflowY:"auto"}}>
            {SECTIONS.map(s=>{
              const sH=cromos.have.filter(id=>id.startsWith(s.id)).length;
              const sD=cromos.doubles.filter(id=>id.startsWith(s.id)).length;
              const sPct=Math.round((sH/s.count)*100);
              if(!sH) return null;
              return (
                <div key={s.id} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:`1px solid ${G.border}`,fontSize:12,alignItems:"center"}}>
                  <span>{s.flag} {s.name}</span>
                  <span>
                    <span style={{color:G.accent3}}>{sH}/{s.count}</span>
                    {sD>0&&<span style={{color:G.accent,marginLeft:6}}>{sD}×2</span>}
                    <span style={{color:G.muted,marginLeft:6}}>{sPct}%</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MERCADO PÚBLICO ──────────────────────────────────────────────────────────
const PROVINCIAS = ["San José","Alajuela","Cartago","Heredia","Guanacaste","Puntarenas","Limón"];

const CANTONES = {
  "San José":    ["San José","Escazú","Desamparados","Puriscal","Tarrazú","Aserrí","Mora","Goicoechea","Santa Ana","Alajuelita","Vásquez de Coronado","Acosta","Tibás","Moravia","Montes de Oca","Turrubares","Dota","Curridabat","Pérez Zeledón","León Cortés"],
  "Alajuela":    ["Alajuela","San Ramón","Grecia","San Mateo","Atenas","Naranjo","Palmares","Poás","Orotina","San Carlos","Zarcero","Sarchí","Upala","Los Chiles","Guatuso","Río Cuarto"],
  "Cartago":     ["Cartago","Paraíso","La Unión","Jiménez","Turrialba","Alvarado","Oreamuno","El Guarco"],
  "Heredia":     ["Heredia","Barva","Santo Domingo","Santa Bárbara","San Rafael","San Isidro","Belén","Flores","San Pablo","Sarapiquí"],
  "Guanacaste":  ["Liberia","Nicoya","Santa Cruz","Bagaces","Carrillo","Cañas","Abangares","Tilarán","Nandayure","La Cruz","Hojancha"],
  "Puntarenas":  ["Puntarenas","Esparza","Buenos Aires","Montes de Oro","Osa","Quepos","Golfito","Coto Brus","Parrita","Corredores","Garabito","Monteverde"],
  "Limón":       ["Limón","Pococí","Siquirres","Talamanca","Matina","Guácimo"],
};

function ProvinciaCantonSelect({ provincia, canton, onProvincia, onCanton, includeTodas=false }) {
  const cantones = provincia && CANTONES[provincia] ? CANTONES[provincia] : [];
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
      <div>
        <div style={{fontSize:11,color:G.muted,fontWeight:700,marginBottom:5}}>PROVINCIA</div>
        <select className="input" value={provincia} onChange={e=>{ onProvincia(e.target.value); onCanton(""); }} style={{cursor:"pointer"}}>
          <option value="">{includeTodas?"Todas las provincias":"Seleccioná..."}</option>
          {PROVINCIAS.map(p=><option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div>
        <div style={{fontSize:11,color:G.muted,fontWeight:700,marginBottom:5}}>CANTÓN</div>
        <select className="input" value={canton} onChange={e=>onCanton(e.target.value)}
          disabled={!provincia||cantones.length===0} style={{cursor:provincia?"pointer":"not-allowed",opacity:provincia?1:.5}}>
          <option value="">{provincia?"Todos los cantones":"Primero elegí provincia"}</option>
          {cantones.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
      </div>
    </div>
  );
}

function MercadoScreen({ user, onChat }) {
  const [users,    setUsers]    = useState([]);
  const [cromos,   setCromos]   = useState({});
  const [loading,  setLoading]  = useState(true);
  const [filtProv, setFiltProv] = useState("");
  const [filtCant, setFiltCant] = useState("");
  const [filtSec,  setFiltSec]  = useState("all");
  const [search,   setSearch]   = useState("");
  const [mode,     setMode]     = useState("necesitan"); // necesitan | tienen

  useEffect(()=>{
    const load = async () => {
      const {data:profs} = await supabase.from("profiles").select("*").neq("id", user.id);
      const {data:crms}  = await supabase.from("user_cromos").select("*");
      const map = {};
      (crms||[]).forEach(c=>{ map[c.user_id]={have:c.have||[],doubles:c.doubles||[]}; });
      setUsers(profs||[]);
      setCromos(map);
      setLoading(false);
    };
    load();
  },[]);

  const myData    = cromos[user.id]||{have:[],doubles:[]};
  const myMissing = ALL_CROMOS.filter(c=>!myData.have.includes(c.id)).map(c=>c.id);

  const filtered = users.filter(u=>{
    if(filtProv && u.provincia!==filtProv) return false;
    if(filtCant && u.canton!==filtCant) return false;
    if(search.trim() && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.username.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const secCromos = filtSec==="all" ? ALL_CROMOS : ALL_CROMOS.filter(c=>c.section===filtSec);
  const secInfo   = SECTIONS.find(s=>s.id===filtSec);

  return (
    <div className="ani">
      <div className="h1" style={{fontSize:24,letterSpacing:2,marginBottom:6}}>MERCADO DE INTERCAMBIOS</div>
      <div style={{color:G.muted,fontSize:13,marginBottom:18}}>Encontrá usuarios para intercambiar sin necesidad de estar en el mismo grupo.</div>

      {/* Filtros */}
      <div className="card" style={{marginBottom:16,padding:14}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10,marginBottom:12}}>
          <ProvinciaCantonSelect
            provincia={filtProv} canton={filtCant}
            onProvincia={v=>{ setFiltProv(v); setFiltCant(""); }}
            onCanton={v=>setFiltCant(v)}
            includeTodas={true}/>
          <div>
            <div style={{fontSize:11,color:G.muted,fontWeight:700,marginBottom:5}}>BUSCAR USUARIO</div>
            <input className="input" placeholder="Nombre o @usuario" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <div>
            <div style={{fontSize:11,color:G.muted,fontWeight:700,marginBottom:5}}>SELECCIÓN / PAÍS</div>
            <select className="input" value={filtSec} onChange={e=>setFiltSec(e.target.value)} style={{cursor:"pointer"}}>
              <option value="all">Todas las selecciones</option>
              {SECTIONS.map(s=><option key={s.id} value={s.id}>{s.flag} {s.name}</option>)}
            </select>
          </div>
        </div>

        {/* Modo */}
        <div style={{display:"flex",gap:8}}>
          <div style={{fontSize:12,color:G.muted,fontWeight:700,alignSelf:"center"}}>Ver quién:</div>
          {[["necesitan","🔴 Necesita lo que yo tengo doble"],["tienen","🟢 Tiene lo que a mí me falta"]].map(([k,l])=>(
            <button key={k} className="btn btn-sm" onClick={()=>setMode(k)}
              style={{background:mode===k?G.accent:G.border,color:mode===k?"#08100a":G.muted}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{display:"flex",justifyContent:"center",padding:40}}><div className="spinner"/></div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {filtered.length===0 ? (
            <div className="card" style={{textAlign:"center",padding:40}}>
              <div style={{fontSize:40,marginBottom:10}}>🔍</div>
              <div style={{color:G.muted}}>No hay usuarios con esos filtros.</div>
            </div>
          ) : filtered.map(u=>{
            const ud = cromos[u.id]||{have:[],doubles:[]};
            const uMissing = ALL_CROMOS.filter(c=>!ud.have.includes(c.id)).map(c=>c.id);

            // Lo que yo le puedo dar (tengo doble y él necesita)
            const iCanGive  = myData.doubles.filter(id=>uMissing.includes(id) && secCromos.find(c=>c.id===id));
            // Lo que él me puede dar (tiene doble y yo necesito)
            const theyGive  = ud.doubles.filter(id=>myMissing.includes(id) && secCromos.find(c=>c.id===id));

            const relevant  = mode==="necesitan" ? iCanGive : theyGive;
            if(relevant.length===0) return null;

            return (
              <div key={u.id} className="match-row">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,marginBottom:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    {u.avatar_url
                      ? <img src={u.avatar_url} style={{width:40,height:40,borderRadius:"50%",objectFit:"cover",border:`2px solid ${G.accent}`}}/>
                      : <div style={{width:40,height:40,borderRadius:"50%",background:G.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>👤</div>}
                    <div>
                      <div style={{fontWeight:800,fontSize:15}}>{u.name}</div>
                      <div style={{fontSize:12,color:G.muted}}>
                        @{u.username}
                        {u.provincia && <span className="badge b-blue" style={{marginLeft:6,fontSize:10}}>📍 {u.provincia}{u.canton?`, ${u.canton}`:""}</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span className="badge b-gold">{relevant.length} cromos</span>
                    <button className="btn btn-blue btn-sm" onClick={()=>onChat(u.id)}>
                      💬 Chat
                    </button>
                    {u.whatsapp && (
                      <a href={`https://wa.me/${u.whatsapp.replace(/\D/g,"")}?text=${encodeURIComponent(
                        `¡Hola ${u.name}! Te encontré en Cromos Panini 2026.\n\n`+
                        (iCanGive.length>0?`✅ Yo te puedo dar: ${iCanGive.slice(0,5).join(", ")}${iCanGive.length>5?` y ${iCanGive.length-5} más`:""}\n`:"")+
                        (theyGive.length>0?`🔄 Yo necesito: ${theyGive.slice(0,5).join(", ")}${theyGive.length>5?` y ${theyGive.length-5} más`:""}`:"")+
                        `\n\n¿Hacemos un intercambio?`
                      )}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{background:"#25D366",color:"#fff",padding:"5px 12px",borderRadius:8,
                          fontSize:12,fontWeight:700,textDecoration:"none",display:"flex",alignItems:"center",gap:5}}>
                        💬 WhatsApp
                      </a>
                    )}
                  </div>
                </div>

                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {relevant.slice(0,15).map(id=>{
                    const s = SECTIONS.find(sec=>id.startsWith(sec.id));
                    return <span key={id} className={`badge ${mode==="necesitan"?"b-green":"b-red"}`} style={{fontSize:10}}>{s?.flag} {id}</span>;
                  })}
                  {relevant.length>15&&<span style={{fontSize:11,color:G.muted}}>+{relevant.length-15} más</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── CHAT ────────────────────────────────────────────────────────────────────
function ChatScreen({ user }) {
  const [convs,    setConvs]   = useState([]);
  const [active,   setActive]  = useState(null); // conversación activa
  const [messages, setMessages]= useState([]);
  const [text,     setText]    = useState("");
  const [loading,  setLoading] = useState(true);
  const [sending,  setSending] = useState(false);
  const [otherUser,setOther]   = useState(null);
  const msgEnd = { current: null };

  // Cargar conversaciones
  const loadConvs = async () => {
    const { data } = await supabase.from("conversations")
      .select("*")
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .order("last_at", { ascending:false });
    if (!data) return setLoading(false);
    // Obtener perfiles del otro usuario
    const otherIds = data.map(c => c.user1_id === user.id ? c.user2_id : c.user1_id);
    const { data:profs } = await supabase.from("profiles").select("*").in("id", otherIds);
    const profMap = {};
    (profs||[]).forEach(p => { profMap[p.id] = p; });
    const enriched = data.map(c => ({
      ...c,
      other: profMap[c.user1_id === user.id ? c.user2_id : c.user1_id]
    }));
    setConvs(enriched);
    setLoading(false);
  };

  useEffect(() => { loadConvs(); }, []);

  // Cargar mensajes de conversación activa
  useEffect(() => {
    if (!active) return;
    const load = async () => {
      const { data } = await supabase.from("messages")
        .select("*").eq("conversation_id", active.id)
        .order("created_at", { ascending:true });
      setMessages(data||[]);
      setOther(active.other);
      setTimeout(() => {
        const el = document.getElementById("msg-end");
        if (el) el.scrollIntoView({ behavior:"smooth" });
      }, 100);
    };
    load();
    // Suscripción en tiempo real
    const sub = supabase.channel(`conv-${active.id}`)
      .on("postgres_changes", { event:"INSERT", schema:"public", table:"messages",
        filter:`conversation_id=eq.${active.id}` },
        payload => {
          setMessages(prev => [...prev, payload.new]);
          setTimeout(() => {
            const el = document.getElementById("msg-end");
            if (el) el.scrollIntoView({ behavior:"smooth" });
          }, 50);
        })
      .subscribe();
    return () => supabase.removeChannel(sub);
  }, [active?.id]);

  const sendMessage = async () => {
    if (!text.trim() || !active || sending) return;
    setSending(true);
    const msg = { id:genId(), conversation_id:active.id, sender_id:user.id, text:text.trim(), created_at:new Date().toISOString() };
    setText("");
    await supabase.from("messages").insert(msg);
    await supabase.from("conversations").update({ last_message:msg.text, last_at:msg.created_at }).eq("id", active.id);
    setSending(false);
  };

  const startConv = async (otherId) => {
    // Buscar conversación existente
    const { data:existing } = await supabase.from("conversations")
      .select("*")
      .or(`and(user1_id.eq.${user.id},user2_id.eq.${otherId}),and(user1_id.eq.${otherId},user2_id.eq.${user.id})`)
      .single();
    if (existing) {
      const { data:prof } = await supabase.from("profiles").select("*").eq("id", otherId).single();
      setActive({ ...existing, other:prof });
      return;
    }
    const newConv = { id:genId(), user1_id:user.id, user2_id:otherId, last_message:"", last_at:new Date().toISOString() };
    await supabase.from("conversations").insert(newConv);
    const { data:prof } = await supabase.from("profiles").select("*").eq("id", otherId).single();
    setActive({ ...newConv, other:prof });
    loadConvs();
  };

  const Avatar = ({u, size=38}) => u?.avatar_url
    ? <img src={u.avatar_url} style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",border:`2px solid ${G.border}`,flexShrink:0}}/>
    : <div style={{width:size,height:size,borderRadius:"50%",background:G.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.4,flexShrink:0}}>👤</div>;

  // Vista de conversación activa
  if (active) return (
    <div className="ani" style={{display:"flex",flexDirection:"column",height:"calc(100vh - 140px)"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,paddingBottom:14,borderBottom:`1px solid ${G.border}`}}>
        <button className="btn btn-ghost btn-sm" onClick={()=>setActive(null)}>← Volver</button>
        <Avatar u={active.other} size={40}/>
        <div>
          <div style={{fontWeight:800,fontSize:16}}>{active.other?.name}</div>
          <div style={{fontSize:12,color:G.muted}}>@{active.other?.username}
            {active.other?.provincia && ` · 📍 ${active.other.provincia}${active.other.canton?`, ${active.other.canton}`:""}`}
          </div>
        </div>
        {active.other?.whatsapp && (
          <a href={`https://wa.me/${active.other.whatsapp.replace(/\D/g,"")}`}
            target="_blank" rel="noopener noreferrer" className="btn btn-sm"
            style={{marginLeft:"auto",background:"#25D366",color:"#fff",textDecoration:"none"}}>
            💬 WhatsApp
          </a>
        )}
      </div>

      {/* Mensajes */}
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:8,paddingBottom:8}}>
        {messages.length===0 && (
          <div style={{textAlign:"center",color:G.muted,fontSize:13,padding:40}}>
            Aún no hay mensajes. ¡Empezá la conversación! 👋
          </div>
        )}
        {messages.map(m => {
          const mine = m.sender_id === user.id;
          const time = new Date(m.created_at).toLocaleTimeString("es-CR",{hour:"2-digit",minute:"2-digit"});
          return (
            <div key={m.id} style={{display:"flex",justifyContent:mine?"flex-end":"flex-start",gap:8,alignItems:"flex-end"}}>
              {!mine && <Avatar u={active.other} size={28}/>}
              <div style={{maxWidth:"70%"}}>
                <div style={{
                  background: mine ? G.accent : G.card2,
                  color: mine ? "#08100a" : G.text,
                  padding:"10px 14px",borderRadius:mine?"14px 14px 4px 14px":"14px 14px 14px 4px",
                  fontSize:14,lineHeight:1.5,wordBreak:"break-word",
                  border:`1px solid ${mine?"transparent":G.border}`
                }}>
                  {m.text}
                </div>
                <div style={{fontSize:10,color:G.muted,marginTop:3,textAlign:mine?"right":"left"}}>{time}</div>
              </div>
              {mine && <Avatar u={user} size={28}/>}
            </div>
          );
        })}
        <div id="msg-end"/>
      </div>

      {/* Input */}
      <div style={{display:"flex",gap:8,paddingTop:12,borderTop:`1px solid ${G.border}`}}>
        <input className="input" placeholder="Escribí un mensaje..." value={text}
          onChange={e=>setText(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendMessage()}
          style={{flex:1}}/>
        <button className="btn btn-gold" onClick={sendMessage} disabled={!text.trim()||sending}
          style={{padding:"10px 16px",opacity:!text.trim()||sending?.6:1}}>
          {sending?"...":"Enviar ➤"}
        </button>
      </div>
    </div>
  );

  // Lista de conversaciones
  return (
    <div className="ani">
      <div className="h1" style={{fontSize:24,letterSpacing:2,marginBottom:18}}>💬 MENSAJES</div>

      {loading ? (
        <div style={{display:"flex",justifyContent:"center",padding:40}}><div className="spinner"/></div>
      ) : convs.length===0 ? (
        <div className="card" style={{textAlign:"center",padding:44}}>
          <div style={{fontSize:44,marginBottom:12}}>💬</div>
          <div style={{color:G.muted,fontSize:14,marginBottom:16}}>
            Aún no tenés conversaciones.<br/>
            Iniciá un chat desde el <strong style={{color:G.accent2}}>Mercado</strong> o los <strong style={{color:G.accent}}>Grupos</strong>.
          </div>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {convs.map(c=>(
            <div key={c.id} className="card" style={{cursor:"pointer",display:"flex",alignItems:"center",gap:12}}
              onClick={()=>setActive(c)}>
              <Avatar u={c.other} size={46}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:800,fontSize:15}}>{c.other?.name}</div>
                <div style={{fontSize:12,color:G.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {c.last_message || "Sin mensajes aún"}
                </div>
              </div>
              <div style={{fontSize:11,color:G.muted,flexShrink:0}}>
                {c.last_at ? new Date(c.last_at).toLocaleDateString("es-CR",{day:"2-digit",month:"2-digit"}) : ""}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function App() {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState("cromos");

  useEffect(()=>{
    supabase.auth.getSession().then(async ({data:{session}})=>{
      if(session){
        const {data:profile} = await supabase.from("profiles").select("*").eq("id",session.user.id).single();
        setUser(profile);
      }
      setLoading(false);
    });
  },[]);

  const logout = async () => { await supabase.auth.signOut(); setUser(null); };
  const updateUser = u => setUser(u);

  if(loading) return (
    <>
      <style>{CSS}</style>
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:G.bg}}>
        <div style={{textAlign:"center"}}>
          <div className="spinner" style={{margin:"0 auto 16px"}}/>
          <div style={{color:G.muted,fontSize:13}}>Cargando...</div>
        </div>
      </div>
    </>
  );

  if(!user) return (
    <>
      <style>{CSS}</style>
      <AuthScreen onLogin={setUser}/>
    </>
  );

  const TABS = [
    {id:"cromos", label:"⚽ Mi Álbum"},
    {id:"mercado",label:"🔄 Mercado"},
    {id:"chat",   label:"💬 Mensajes"},
    {id:"grupos", label:"🏘️ Grupos"},
    {id:"perfil", label:"👤 Perfil"},
  ];

  return (
    <>
      <style>{CSS}</style>
      <div style={{minHeight:"100vh",
        background:`radial-gradient(ellipse at 0% 0%,rgba(201,168,76,.06) 0%,transparent 50%),
                    radial-gradient(ellipse at 100% 100%,rgba(76,154,200,.05) 0%,transparent 50%),${G.bg}`}}>
        <div style={{borderBottom:`1px solid ${G.border}`,background:`${G.card}dd`,backdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:50}}>
          <div style={{maxWidth:960,margin:"0 auto",padding:"10px 16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:20}}>⚽</span>
                <div>
                  <div className="h1" style={{fontSize:15,color:G.accent,letterSpacing:3,lineHeight:1}}>FIFA WORLD CUP 2026</div>
                  <div style={{fontSize:10,color:G.muted,letterSpacing:2,fontWeight:700}}>CROMOS PANINI</div>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:13,fontWeight:700}}>{user.name}</div>
                {user.city&&<div style={{fontSize:11,color:G.muted}}>📍 {user.city}</div>}
              </div>
            </div>
            <div style={{display:"flex",gap:5}}>
              {TABS.map(t=>(
                <div key={t.id} className={`nav-item ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>{t.label}</div>
              ))}
            </div>
          </div>
        </div>
        <div style={{maxWidth:960,margin:"0 auto",padding:"22px 16px"}}>
          {tab==="cromos"  && <CromosScreen user={user}/>}
          {tab==="mercado" && <MercadoScreen user={user} onChat={uid=>{ setTab("chat"); }}/>}
          {tab==="chat"    && <ChatScreen user={user}/>}
          {tab==="grupos"  && <GroupsScreen user={user} onUserUpdate={updateUser}/>}
          {tab==="perfil"  && <ProfileScreen user={user} onUserUpdate={updateUser} onLogout={logout}/>}
        </div>
      </div>
    </>
  );
}
