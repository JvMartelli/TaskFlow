import { useState, useEffect } from "react";

/* ── CONSTANTS ── */
const CATS = [
  { v:'trabalho', l:'Trabalho', e:'💼', c:'#6366f1' },
  { v:'pessoal',  l:'Pessoal',  e:'🏠', c:'#ec4899' },
  { v:'estudo',   l:'Estudo',   e:'📚', c:'#f59e0b' },
  { v:'saude',    l:'Saúde',    e:'💪', c:'#10b981' },
  { v:'outros',   l:'Outros',   e:'📌', c:'#64748b' },
];
const PRI = {
  critical:{ l:'Crítica', c:'#ef4444', bg:'#fee2e2', b:'#fca5a5', e:'🔴' },
  high:    { l:'Alta',    c:'#f97316', bg:'#ffedd5', b:'#fed7aa', e:'🟠' },
  medium:  { l:'Média',   c:'#d97706', bg:'#fef9c3', b:'#fde68a', e:'🟡' },
  low:     { l:'Baixa',   c:'#16a34a', bg:'#dcfce7', b:'#86efac', e:'🟢' },
};
const STA = {
  'pending':    { l:'Pendente',     c:'#64748b', bg:'#f1f5f9', b:'#cbd5e1', e:'⏳' },
  'in-progress':{ l:'Em Andamento', c:'#6366f1', bg:'#eef2ff', b:'#c7d2fe', e:'⚡' },
  'done':       { l:'Concluída',    c:'#059669', bg:'#d1fae5', b:'#6ee7b7', e:'✅' },
};
const getCat = v => CATS.find(c=>c.v===v)||CATS[4];
const TODAY = new Date(); TODAY.setHours(0,0,0,0);
const todayISO = new Date().toISOString().split('T')[0];
const isOvd = (d,s) => s!=='done' && new Date(d+'T00:00:00') < TODAY;
const fmtD = d => d ? new Date(d+'T00:00:00').toLocaleDateString('pt-BR') : '—';
const dueLbl = (d,s) => {
  if (!d) return '';
  if (s==='done') return fmtD(d);
  const diff = Math.ceil((new Date(d+'T00:00:00') - TODAY) / 864e5);
  if (diff < 0) return `Venceu há ${Math.abs(diff)}d`;
  if (diff === 0) return 'Vence hoje!';
  if (diff === 1) return 'Amanhã';
  return fmtD(d);
};
let _nid=100; const nid=()=>++_nid;

const SEED = [
  { id:1, title:'Revisar relatório mensal',         desc:'Analisar dados financeiros de maio e preparar resumo executivo para a diretoria.',              due:'2026-06-18', pri:'high',     cat:'trabalho', sta:'in-progress', created:'2026-06-10' },
  { id:2, title:'Estudar para prova de Cálculo',    desc:'Revisão dos capítulos 5–8. Foco em integrais e derivadas parciais.',                           due:'2026-06-17', pri:'critical', cat:'estudo',   sta:'pending',     created:'2026-06-12' },
  { id:3, title:'Consulta médica anual',            desc:'Check-up com clínico geral. Levar exames e lista de medicamentos.',                             due:'2026-06-25', pri:'medium',   cat:'saude',    sta:'pending',     created:'2026-06-08' },
  { id:4, title:'Comprar presentes de aniversário', desc:'Presentes para o aniversário da Ana no dia 20.',                                                due:'2026-06-20', pri:'medium',   cat:'pessoal',  sta:'pending',     created:'2026-06-14' },
  { id:5, title:'Configurar ambiente de dev',       desc:'Instalar Node.js, VS Code e extensões para o novo projeto.',                                    due:'2026-06-14', pri:'high',     cat:'trabalho', sta:'done',        created:'2026-06-09' },
  { id:6, title:'Leitura: Clean Code',              desc:'Ler capítulos 3 e 4 de Robert C. Martin.',                                                      due:'2026-06-22', pri:'low',      cat:'estudo',   sta:'in-progress', created:'2026-06-11' },
  { id:7, title:'Planejar viagem de férias',        desc:'Pesquisar destinos, passagens e hotéis para julho.',                                            due:'2026-06-30', pri:'low',      cat:'pessoal',  sta:'pending',     created:'2026-06-13' },
];

/* ── CSS ── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
:root{
  --p:#6366f1;--pd:#4f46e5;--pl:#e0e7ff;--pxl:#eef2ff;
  --s:#10b981;--sl:#d1fae5;--d:#ef4444;--dl:#fee2e2;
  --bg:#f1f5f9;--sf:#fff;--sf2:#f8fafc;--bd:#e2e8f0;
  --t:#0f172a;--t2:#334155;--ts:#64748b;--tm:#94a3b8;
  --sh-sm:0 1px 2px rgba(0,0,0,.05);
  --sh:0 1px 3px rgba(0,0,0,.1),0 1px 2px rgba(0,0,0,.06);
  --sh-md:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -2px rgba(0,0,0,.1);
  --sh-lg:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1);
  --r:12px;--rs:8px;
  --sw:252px;--hh:60px;--bnh:68px;
  --ff:'Plus Jakarta Sans',system-ui,sans-serif;
  --fb:'Inter',system-ui,sans-serif;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body,#root{font-family:var(--fb);background:var(--bg);color:var(--t)}
button{font-family:inherit;cursor:pointer}
input,textarea,select{font-family:inherit}

.tm-app{display:flex;min-height:100vh}

/* SIDEBAR */
.tm-sb{width:var(--sw);background:var(--sf);border-right:1px solid var(--bd);display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:100;transition:transform .25s ease;overflow-y:auto}
.tm-sb-logo{padding:18px 16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--bd)}
.tm-logo-ic{width:34px;height:34px;background:var(--p);border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;flex-shrink:0}
.tm-logo-tx{font-family:var(--ff);font-weight:800;font-size:17px;color:var(--t);letter-spacing:-.5px}
.tm-logo-tx span{color:var(--p)}
.tm-sb-nav{flex:1;padding:12px;display:flex;flex-direction:column;gap:2px}
.tm-nl{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;color:var(--tm);padding:8px 8px 4px;margin-top:6px}
.tm-ni{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--rs);cursor:pointer;color:var(--ts);font-size:14px;font-weight:500;transition:all .15s;border:none;background:none;width:100%;text-align:left}
.tm-ni:hover{background:var(--pxl);color:var(--pd)}
.tm-ni.active{background:var(--pl);color:var(--pd);font-weight:700}
.tm-nb{margin-left:auto;background:var(--p);color:white;font-size:11px;font-weight:700;padding:1px 7px;border-radius:999px;min-width:20px;text-align:center}
.tm-sb-user{padding:14px 16px;border-top:1px solid var(--bd);display:flex;align-items:center;gap:10px}
.tm-av{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--p),#818cf8);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:13px;flex-shrink:0;user-select:none}
.tm-un{font-size:13px;font-weight:600;color:var(--t)}
.tm-ur{font-size:12px;color:var(--tm)}

/* MAIN */
.tm-main{margin-left:var(--sw);flex:1;display:flex;flex-direction:column;min-height:100vh}

/* HEADER */
.tm-hd{height:var(--hh);background:var(--sf);border-bottom:1px solid var(--bd);display:flex;align-items:center;padding:0 20px;gap:12px;position:sticky;top:0;z-index:50}
.tm-hd-btn{display:none;background:none;border:none;color:var(--ts);padding:8px;border-radius:var(--rs);transition:background .15s}
.tm-hd-btn:hover{background:var(--sf2)}
.tm-hd-title{font-family:var(--ff);font-size:17px;font-weight:700;color:var(--t);flex:1}

/* CONTENT */
.tm-ct{flex:1;padding:24px;overflow-y:auto}

/* BOTTOM NAV */
.tm-bn{display:none;position:fixed;bottom:0;left:0;right:0;height:var(--bnh);background:var(--sf);border-top:1px solid var(--bd);z-index:100;align-items:center;padding:0 8px}
.tm-bni{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;background:none;border:none;color:var(--tm);transition:color .15s;min-height:52px;font-size:10px;font-weight:500}
.tm-bni.active{color:var(--p)}
.tm-fab{width:48px;height:48px;border-radius:50%;background:var(--p);color:white;display:flex;align-items:center;justify-content:center;border:none;box-shadow:var(--sh-md);transition:transform .15s,box-shadow .15s}
.tm-fab:hover{transform:scale(1.07);box-shadow:var(--sh-lg)}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:var(--rs);font-size:14px;font-weight:600;cursor:pointer;transition:all .15s;border:none}
.btn-p{background:var(--p);color:white}.btn-p:hover{background:var(--pd)}
.btn-sp{background:var(--pxl);color:var(--pd)}.btn-sp:hover{background:var(--pl)}
.btn-g{background:none;color:var(--ts);border:1.5px solid var(--bd)}.btn-g:hover{background:var(--sf2)}
.btn-d{background:var(--dl);color:var(--d)}.btn-d:hover{background:#fca5a5}
.btn-green{background:#d1fae5;color:#065f46}.btn-green:hover{background:#a7f3d0}
.btn-ic{width:34px;height:34px;padding:0;justify-content:center}
.btn-lg{padding:11px 22px;font-size:15px}

/* CARDS */
.card{background:var(--sf);border-radius:var(--r);border:1px solid var(--bd);box-shadow:var(--sh-sm)}
.card-b{padding:20px}

/* STAT GRID */
.sg{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
.sc{background:var(--sf);border-radius:var(--r);border:1px solid var(--bd);padding:18px;box-shadow:var(--sh-sm)}
.sc-ic{width:42px;height:42px;border-radius:var(--rs);display:flex;align-items:center;justify-content:center;margin-bottom:12px;font-size:20px}
.sc-v{font-family:var(--ff);font-size:30px;font-weight:800;color:var(--t);line-height:1}
.sc-l{font-size:13px;color:var(--ts);font-weight:500;margin-top:4px}

/* PROGRESS SECTION */
.pg-sect{display:grid;grid-template-columns:1fr 1.7fr;gap:16px;margin-bottom:24px}
.pg-card{background:linear-gradient(135deg,var(--pd),#818cf8);border-radius:var(--r);padding:28px 20px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;color:white;position:relative;overflow:hidden}
.pg-card::after{content:'';position:absolute;top:-50px;right:-50px;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,.06)}
.pg-title{font-family:var(--ff);font-size:15px;font-weight:700;opacity:.9}
.pg-sub{font-size:12px;opacity:.7;text-align:center}

/* TASK CARD */
.tc{background:var(--sf);border-radius:var(--r);border:1px solid var(--bd);padding:14px 16px;display:flex;align-items:flex-start;gap:12px;cursor:pointer;transition:all .15s;box-shadow:var(--sh-sm)}
.tc:hover{border-color:var(--pl);box-shadow:var(--sh-md);transform:translateY(-1px)}
.tc.done{opacity:.55}
.tc-cb{width:20px;height:20px;border-radius:50%;border:2px solid var(--bd);cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;margin-top:1px;transition:all .15s;background:none}
.tc-cb.ck{background:var(--s);border-color:var(--s);color:white}
.tc-cb:hover:not(.ck){border-color:var(--p)}
.tc-info{flex:1;min-width:0}
.tc-title{font-size:14px;font-weight:600;color:var(--t);margin-bottom:5px}
.tc-title.done{text-decoration:line-through;color:var(--tm)}
.tc-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.tc-acts{display:flex;gap:4px;opacity:0;transition:opacity .15s;flex-shrink:0}
.tc:hover .tc-acts{opacity:1}

/* SEARCH */
.srch{position:relative}
.srch-ic{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--tm);pointer-events:none}
.srch-fi{padding-left:40px!important}

/* FILTER TABS */
.ft{display:flex;gap:4px;background:var(--sf2);border:1px solid var(--bd);border-radius:var(--rs);padding:4px}
.ft-t{flex:1;padding:7px 10px;border-radius:6px;font-size:12px;font-weight:500;cursor:pointer;color:var(--ts);background:none;border:none;transition:all .15s;white-space:nowrap}
.ft-t.active{background:var(--sf);color:var(--t);font-weight:700;box-shadow:var(--sh-sm)}

/* PAGE HEADER */
.ph{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;gap:12px}
.pt{font-family:var(--ff);font-size:22px;font-weight:800;color:var(--t);line-height:1.2}
.ps{font-size:13px;color:var(--ts);margin-top:4px}

/* EMPTY STATE */
.es{text-align:center;padding:60px 20px;display:flex;flex-direction:column;align-items:center;gap:12px}
.es-ic{font-size:48px;line-height:1}
.es-t{font-family:var(--ff);font-size:18px;font-weight:700;color:var(--t)}
.es-p{font-size:14px;color:var(--ts);max-width:280px}

/* FORM */
.fg{display:flex;flex-direction:column;gap:6px;margin-bottom:18px}
.fl{font-size:13px;font-weight:600;color:var(--t2)}
.fl.req::after{content:' *';color:var(--d)}
.fi{padding:10px 14px;border:1.5px solid var(--bd);border-radius:var(--rs);font-size:14px;color:var(--t);background:var(--sf);transition:all .15s;outline:none;width:100%}
.fi:focus{border-color:var(--p);box-shadow:0 0 0 3px var(--pxl)}
.fi::placeholder{color:var(--tm)}
.fi.err{border-color:var(--d);box-shadow:0 0 0 3px var(--dl)}
textarea.fi{resize:vertical;min-height:88px}
.fh{font-size:12px;color:var(--tm)}
.err-msg{font-size:12px;color:var(--d);margin-top:2px}

/* PRIORITY SELECT */
.pri-g{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.pri-o{padding:10px 8px;border-radius:var(--rs);border:2px solid var(--bd);cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:12px;font-weight:600;transition:all .15s;background:var(--sf);color:var(--ts)}

/* STATUS SELECT */
.sta-g{display:flex;gap:8px}
.sta-o{flex:1;padding:10px;border-radius:var(--rs);border:2px solid var(--bd);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;font-size:13px;font-weight:600;transition:all .15s;background:var(--sf);color:var(--ts)}

/* DETAIL */
.d-hd{display:flex;align-items:flex-start;gap:12px;margin-bottom:20px}
.d-bdgs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}
.d-ig{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.d-ii{padding:12px;background:var(--sf2);border-radius:var(--rs);border:1px solid var(--bd)}
.d-il{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.4px;color:var(--tm);margin-bottom:3px}
.d-iv{font-size:14px;font-weight:600;color:var(--t)}

/* DASHBOARD BOTTOM GRID */
.db{display:grid;grid-template-columns:1.5fr 1fr;gap:16px;margin-top:20px}

/* SECTION TITLE */
.st{font-family:var(--ff);font-size:15px;font-weight:700;color:var(--t);margin-bottom:12px}

/* MISC */
.dv{height:1px;background:var(--bd);margin:18px 0}
.bk{display:inline-flex;align-items:center;gap:5px;font-size:13px;color:var(--ts);background:none;border:none;cursor:pointer;padding:0;font-weight:500;margin-bottom:16px;transition:color .15s}
.bk:hover{color:var(--p)}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:99}

/* TOAST */
.toast{position:fixed;bottom:80px;right:16px;background:#1e293b;color:white;padding:11px 18px;border-radius:var(--rs);font-size:13px;font-weight:500;box-shadow:var(--sh-lg);z-index:200;animation:tin .25s ease;display:flex;align-items:center;gap:8px}
@keyframes tin{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

/* ─── RESPONSIVE ─── */
@media(max-width:1024px){
  :root{--sw:200px}
  .sg{grid-template-columns:repeat(2,1fr)}
  .pg-sect,.db{grid-template-columns:1fr}
}
@media(max-width:768px){
  :root{--sw:256px}
  .tm-sb{transform:translateX(-100%)}
  .tm-sb.open{transform:translateX(0)}
  .tm-main{margin-left:0;padding-bottom:var(--bnh)}
  .tm-bn{display:flex}
  .tm-hd-btn{display:flex}
  .tm-ct{padding:16px}
  .sg{grid-template-columns:repeat(2,1fr);gap:12px}
  .pg-sect,.db{grid-template-columns:1fr}
  .pri-g{grid-template-columns:repeat(2,1fr)}
  .sta-g{flex-direction:column}
  .d-ig{grid-template-columns:1fr}
  .ph{flex-wrap:wrap}.pt{font-size:19px}
  .tc-acts{opacity:1}
  .toast{bottom:calc(var(--bnh) + 10px);left:12px;right:12px;justify-content:center}
}
@media(max-width:380px){.sg{grid-template-columns:1fr}}
`;

/* ── ICONS ── */
const Ic = {
  Home:   ()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  List:   ()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Plus:   ()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Search: ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Edit:   ()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash:  ()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Check:  ()=><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Cal:    ()=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  ChL:    ()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  ChR:    ()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Menu:   ()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Save:   ()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  Layers: ()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
};

/* ── PROGRESS RING ── */
function Ring({ pct, sz=110, st=10 }) {
  const r=(sz-st*2)/2, circ=2*Math.PI*r, off=circ-(pct/100)*circ;
  return (
    <svg width={sz} height={sz} style={{transform:'rotate(-90deg)'}}>
      <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke="rgba(255,255,255,.2)" strokeWidth={st}/>
      <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke="white" strokeWidth={st}
        strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
        style={{transition:'stroke-dashoffset .8s ease'}}/>
    </svg>
  );
}

/* ── SIDEBAR ── */
function Sidebar({ view, nav, tasks, open, close }) {
  const pending = tasks.filter(t=>t.sta!=='done').length;
  const items = [
    { id:'dashboard', l:'Dashboard',      I:Ic.Home, b:null },
    { id:'list',      l:'Minhas Tarefas', I:Ic.List, b:pending||null },
    { id:'new-task',  l:'Nova Tarefa',    I:Ic.Plus, b:null },
  ];
  return (
    <>
      {open && <div className="overlay" onClick={close} aria-hidden="true"/>}
      <aside className={`tm-sb${open?' open':''}`} role="navigation" aria-label="Menu principal">
        <div className="tm-sb-logo">
          <div className="tm-logo-ic"><Ic.Layers/></div>
          <span className="tm-logo-tx">Task<span>Flow</span></span>
        </div>
        <nav className="tm-sb-nav">
          <span className="tm-nl">Menu</span>
          {items.map(({id,l,I,b})=>(
            <button key={id} className={`tm-ni${view===id?' active':''}`}
              onClick={()=>{nav(id);close();}} aria-current={view===id?'page':undefined}>
              <I/><span>{l}</span>
              {b ? <span className="tm-nb">{b}</span> : null}
            </button>
          ))}
        </nav>
        <div className="tm-sb-user">
          <div className="tm-av">JS</div>
          <div>
            <div className="tm-un">João Silva</div>
            <div className="tm-ur">Estudante · SI 7º</div>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ── BOTTOM NAV ── */
function BotNav({ view, nav }) {
  return (
    <nav className="tm-bn" aria-label="Navegação móvel">
      <button className={`tm-bni${view==='dashboard'?' active':''}`} onClick={()=>nav('dashboard')} aria-label="Dashboard">
        <Ic.Home/><span>Início</span>
      </button>
      <button className={`tm-bni${view==='list'?' active':''}`} onClick={()=>nav('list')} aria-label="Tarefas">
        <Ic.List/><span>Tarefas</span>
      </button>
      <div style={{flex:1,display:'flex',justifyContent:'center',alignItems:'center'}}>
        <button className="tm-fab" onClick={()=>nav('new-task')} aria-label="Nova tarefa"><Ic.Plus/></button>
      </div>
      <div style={{flex:1}}/><div style={{flex:1}}/>
    </nav>
  );
}

/* ── TASK CARD ── */
function TCard({ task, onView, onToggle, onDel }) {
  const p=PRI[task.pri], cat=getCat(task.cat), ov=isOvd(task.due,task.sta);
  return (
    <div className={`tc${task.sta==='done'?' done':''}`} onClick={()=>onView(task)} role="article" aria-label={`Tarefa: ${task.title}`}>
      <button className={`tc-cb${task.sta==='done'?' ck':''}`}
        onClick={e=>{e.stopPropagation();onToggle(task.id);}}
        aria-label={task.sta==='done'?'Reabrir tarefa':'Concluir tarefa'}>
        {task.sta==='done' && <Ic.Check/>}
      </button>
      <div className="tc-info">
        <div className={`tc-title${task.sta==='done'?' done':''}`}>{task.title}</div>
        <div className="tc-meta">
          <span style={{display:'inline-flex',alignItems:'center',gap:3,fontSize:10,fontWeight:700,background:p.bg,color:p.c,padding:'2px 7px',borderRadius:999}}>{p.l}</span>
          <span style={{fontSize:11,color:cat.c,fontWeight:500}}>{cat.e} {cat.l}</span>
          <span style={{display:'inline-flex',alignItems:'center',gap:3,fontSize:11,color:ov?'#ef4444':'var(--tm)',fontWeight:ov?700:400}}>
            <Ic.Cal/>{dueLbl(task.due,task.sta)}{ov&&' ⚠️'}
          </span>
        </div>
      </div>
      <div className="tc-acts" onClick={e=>e.stopPropagation()}>
        <button className="btn btn-g btn-ic" onClick={()=>onView(task)} aria-label="Editar" title="Editar"><Ic.Edit/></button>
        <button className="btn btn-ic btn-d" onClick={()=>onDel(task.id)} aria-label="Excluir" title="Excluir"><Ic.Trash/></button>
      </div>
    </div>
  );
}

/* ── DASHBOARD ── */
function Dashboard({ tasks, nav, selTask, onToggle, onDel }) {
  const total=tasks.length, done=tasks.filter(t=>t.sta==='done').length;
  const inProg=tasks.filter(t=>t.sta==='in-progress').length;
  const ovd=tasks.filter(t=>isOvd(t.due,t.sta)).length;
  const pct=total>0?Math.round((done/total)*100):0;
  const recent=[...tasks].sort((a,b)=>b.id-a.id).slice(0,4);
  const urgent=tasks.filter(t=>t.sta!=='done'&&(t.pri==='critical'||t.pri==='high')).slice(0,4);

  const stats=[
    {l:'Total',       v:total,   e:'📋', bg:'#eef2ff'},
    {l:'Concluídas',  v:done,    e:'✅', bg:'#d1fae5'},
    {l:'Em Andamento',v:inProg,  e:'⚡', bg:'#fef9c3'},
    {l:'Atrasadas',   v:ovd,     e:'⚠️', bg:'#fee2e2'},
  ];

  return (
    <div>
      <div className="ph">
        <div>
          <h1 className="pt">Olá, João! 👋</h1>
          <p className="ps">{new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
        </div>
        <button className="btn btn-p" onClick={()=>nav('new-task')} style={{flexShrink:0}}>
          <Ic.Plus/> Nova Tarefa
        </button>
      </div>

      {/* Stats */}
      <div className="sg">
        {stats.map(s=>(
          <div key={s.l} className="sc">
            <div className="sc-ic" style={{background:s.bg}}><span>{s.e}</span></div>
            <div className="sc-v">{s.v}</div>
            <div className="sc-l">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Progress + Urgentes */}
      <div className="pg-sect">
        <div className="pg-card">
          <div className="pg-title">Progresso Geral</div>
          <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Ring pct={pct}/>
            <div style={{position:'absolute',textAlign:'center',color:'white'}}>
              <div style={{fontSize:26,fontWeight:800,lineHeight:1,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{pct}%</div>
              <div style={{fontSize:10,opacity:.75,marginTop:2}}>concluído</div>
            </div>
          </div>
          <div className="pg-sub">{done} de {total} tarefas concluídas</div>
        </div>

        <div className="card">
          <div className="card-b">
            <div className="st">🚨 Urgentes</div>
            {urgent.length===0 ? (
              <div style={{textAlign:'center',padding:'20px 0',color:'var(--tm)',fontSize:14}}>
                <div style={{fontSize:32,marginBottom:8}}>🎉</div>
                Nenhuma tarefa urgente!
              </div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {urgent.map(t=>{
                  const p=PRI[t.pri], ov=isOvd(t.due,t.sta);
                  return (
                    <div key={t.id}
                      style={{display:'flex',alignItems:'center',gap:10,padding:'9px 11px',background:'var(--sf2)',borderRadius:8,cursor:'pointer',border:'1px solid var(--bd)',transition:'box-shadow .15s'}}
                      onClick={()=>{selTask(t);nav('detail');}}>
                      <div style={{width:7,height:7,borderRadius:'50%',background:p.c,flexShrink:0}}/>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:600,color:'var(--t)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.title}</div>
                        <div style={{fontSize:11,color:ov?'#ef4444':'var(--tm)',marginTop:1,fontWeight:ov?700:400}}>{dueLbl(t.due,t.sta)}</div>
                      </div>
                      <span style={{fontSize:10,fontWeight:700,background:p.bg,color:p.c,padding:'2px 7px',borderRadius:999,flexShrink:0}}>{p.l}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="db">
        <div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
            <h3 className="st" style={{marginBottom:0}}>Tarefas Recentes</h3>
            <button className="btn btn-g" style={{fontSize:12,padding:'5px 11px'}} onClick={()=>nav('list')}>
              Ver todas <Ic.ChR/>
            </button>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {recent.map(t=>(
              <TCard key={t.id} task={t}
                onView={t=>{selTask(t);nav('detail');}}
                onToggle={onToggle} onDel={onDel}/>
            ))}
          </div>
        </div>

        <div className="card" style={{alignSelf:'start'}}>
          <div className="card-b">
            <div className="st">Por Categoria</div>
            <div style={{display:'flex',flexDirection:'column',gap:13,marginTop:4}}>
              {CATS.map(cat=>{
                const ct=tasks.filter(t=>t.cat===cat.v).length;
                const cd=tasks.filter(t=>t.cat===cat.v&&t.sta==='done').length;
                const pc=ct>0?Math.round((cd/ct)*100):0;
                return (
                  <div key={cat.v}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                      <span style={{fontSize:13,fontWeight:500,color:'var(--t)',display:'flex',alignItems:'center',gap:5}}>
                        {cat.e} {cat.l}
                      </span>
                      <span style={{fontSize:11,color:'var(--tm)'}}>{cd}/{ct}</span>
                    </div>
                    <div style={{height:5,background:'var(--bd)',borderRadius:999,overflow:'hidden'}}>
                      <div style={{height:'100%',width:`${pc}%`,background:cat.c,borderRadius:999,transition:'width .6s ease'}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── TASK LIST ── */
function TaskList({ tasks, nav, selTask, onToggle, onDel }) {
  const [filt,setFilt]=useState('all');
  const [search,setSearch]=useState('');
  const [pFilt,setPFilt]=useState('all');

  const shown=tasks.filter(t=>{
    const ms=!search||t.title.toLowerCase().includes(search.toLowerCase())||t.desc.toLowerCase().includes(search.toLowerCase());
    const mst=filt==='all'||t.sta===filt;
    const mp=pFilt==='all'||t.pri===pFilt;
    return ms&&mst&&mp;
  });

  const tabs=[
    {id:'all',        l:`Todas (${tasks.length})`},
    {id:'pending',    l:`Pendentes (${tasks.filter(t=>t.sta==='pending').length})`},
    {id:'in-progress',l:`Andamento (${tasks.filter(t=>t.sta==='in-progress').length})`},
    {id:'done',       l:`Concluídas (${tasks.filter(t=>t.sta==='done').length})`},
  ];

  return (
    <div>
      <div className="ph">
        <div>
          <h1 className="pt">Minhas Tarefas</h1>
          <p className="ps">{shown.length} tarefa{shown.length!==1?'s':''} encontrada{shown.length!==1?'s':''}</p>
        </div>
        <button className="btn btn-p" onClick={()=>nav('new-task')} style={{flexShrink:0}}><Ic.Plus/> Nova</button>
      </div>

      <div className="srch" style={{marginBottom:12}}>
        <span className="srch-ic"><Ic.Search/></span>
        <input type="search" className="fi srch-fi" placeholder="Buscar tarefas..."
          value={search} onChange={e=>setSearch(e.target.value)} aria-label="Buscar tarefas"/>
      </div>

      <div style={{overflowX:'auto',paddingBottom:4,marginBottom:12}}>
        <div className="ft" style={{minWidth:'max-content'}}>
          {tabs.map(t=>(
            <button key={t.id} className={`ft-t${filt===t.id?' active':''}`}
              onClick={()=>setFilt(t.id)} aria-pressed={filt===t.id}>{t.l}</button>
          ))}
        </div>
      </div>

      <div style={{display:'flex',gap:6,marginBottom:16,flexWrap:'wrap',alignItems:'center'}}>
        <span style={{fontSize:11,color:'var(--tm)',fontWeight:600}}>Prioridade:</span>
        {[{id:'all',l:'Todas'},...Object.entries(PRI).map(([k,v])=>({id:k,l:v.l}))].map(p=>(
          <button key={p.id} onClick={()=>setPFilt(p.id)}
            style={{padding:'3px 11px',borderRadius:999,fontSize:11,fontWeight:700,cursor:'pointer',
              border:`1.5px solid ${pFilt===p.id?(PRI[p.id]?.c||'var(--p)'):'var(--bd)'}`,
              background:pFilt===p.id?(PRI[p.id]?.bg||'var(--pxl)'):'transparent',
              color:pFilt===p.id?(PRI[p.id]?.c||'var(--pd)'):'var(--ts)',
              transition:'all .15s'}}>
            {p.l}
          </button>
        ))}
      </div>

      {shown.length===0 ? (
        <div className="es">
          <div className="es-ic">🔍</div>
          <h3 className="es-t">Nenhuma tarefa encontrada</h3>
          <p className="es-p">{search?'Tente uma busca diferente.':'Crie sua primeira tarefa!'}</p>
          {!search && <button className="btn btn-p" onClick={()=>nav('new-task')}><Ic.Plus/> Nova Tarefa</button>}
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {shown.map(t=>(
            <TCard key={t.id} task={t}
              onView={t=>{selTask(t);nav('detail');}}
              onToggle={onToggle} onDel={onDel}/>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── TASK FORM ── */
function TaskForm({ editTask, onSave, onCancel }) {
  const isEdit=!!editTask;
  const [form,setForm]=useState({
    title:editTask?.title||'', desc:editTask?.desc||'', due:editTask?.due||todayISO,
    pri:editTask?.pri||'medium', cat:editTask?.cat||'trabalho', sta:editTask?.sta||'pending',
  });
  const [errs,setErrs]=useState({});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));

  const validate=()=>{
    const e={};
    if(!form.title.trim()) e.title='O título é obrigatório.';
    if(form.title.length>100) e.title='Máximo 100 caracteres.';
    if(!form.due) e.due='Informe a data de vencimento.';
    setErrs(e); return Object.keys(e).length===0;
  };

  const submit=()=>{
    if(!validate()) return;
    onSave({...form, id:editTask?.id||nid(), created:editTask?.created||todayISO});
  };

  return (
    <div>
      <button className="bk" onClick={onCancel}><Ic.ChL/> {isEdit?'Cancelar edição':'Voltar'}</button>
      <div className="ph">
        <div>
          <h1 className="pt">{isEdit?'Editar Tarefa':'Nova Tarefa'}</h1>
          <p className="ps">{isEdit?'Atualize os dados abaixo':'Preencha para criar uma nova tarefa'}</p>
        </div>
      </div>
      <div className="card">
        <div className="card-b">

          <div className="fg">
            <label className="fl req">Título</label>
            <input type="text" className={`fi${errs.title?' err':''}`}
              placeholder="Ex: Revisar relatório mensal"
              value={form.title} onChange={e=>set('title',e.target.value)}
              maxLength={100} aria-required="true"/>
            {errs.title && <span className="err-msg" role="alert">{errs.title}</span>}
            <span className="fh">{form.title.length}/100 caracteres</span>
          </div>

          <div className="fg">
            <label className="fl">Descrição</label>
            <textarea className="fi" placeholder="Detalhes, links ou observações..."
              value={form.desc} onChange={e=>set('desc',e.target.value)} rows={3}/>
            <span className="fh">Opcional.</span>
          </div>

          <div className="fg">
            <label className="fl req">Data de Vencimento</label>
            <input type="date" className={`fi${errs.due?' err':''}`}
              value={form.due} onChange={e=>set('due',e.target.value)} aria-required="true"/>
            {errs.due && <span className="err-msg" role="alert">{errs.due}</span>}
          </div>

          <div className="fg">
            <label className="fl req">Prioridade</label>
            <div className="pri-g">
              {Object.entries(PRI).map(([k,v])=>(
                <button key={k} type="button" className="pri-o"
                  onClick={()=>set('pri',k)} aria-pressed={form.pri===k}
                  style={form.pri===k?{background:v.bg,borderColor:v.c,color:v.c}:{}}>
                  <span style={{fontSize:20}}>{v.e}</span>
                  <span>{v.l}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="fg">
            <label className="fl req">Categoria</label>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {CATS.map(cat=>(
                <button key={cat.v} type="button" onClick={()=>set('cat',cat.v)}
                  aria-pressed={form.cat===cat.v}
                  style={{padding:'8px 13px',borderRadius:8,
                    border:`2px solid ${form.cat===cat.v?cat.c:'var(--bd)'}`,
                    background:form.cat===cat.v?`${cat.c}18`:'var(--sf)',
                    color:form.cat===cat.v?cat.c:'var(--ts)',
                    fontSize:13,fontWeight:600,cursor:'pointer',
                    transition:'all .15s',display:'flex',alignItems:'center',gap:5}}>
                  {cat.e} {cat.l}
                </button>
              ))}
            </div>
          </div>

          {isEdit && (
            <div className="fg">
              <label className="fl">Status</label>
              <div className="sta-g">
                {Object.entries(STA).map(([k,v])=>(
                  <button key={k} type="button" className="sta-o"
                    onClick={()=>set('sta',k)} aria-pressed={form.sta===k}
                    style={form.sta===k?{background:v.bg,borderColor:v.b,color:v.c}:{}}>
                    {v.e} {v.l}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="dv"/>
          <div style={{display:'flex',gap:10,justifyContent:'flex-end',flexWrap:'wrap'}}>
            <button className="btn btn-g" onClick={onCancel}>Cancelar</button>
            <button className="btn btn-p btn-lg" onClick={submit}>
              <Ic.Save/> {isEdit?'Salvar alterações':'Criar tarefa'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── TASK DETAIL ── */
function TaskDetail({ task, onEdit, onDel, onBack, onToggle }) {
  const p=PRI[task.pri], s=STA[task.sta], cat=getCat(task.cat), ov=isOvd(task.due,task.sta);
  const badges=[
    {bg:p.bg, c:p.c, b:p.b, l:`${p.e} ${p.l}`},
    {bg:s.bg, c:s.c, b:s.b, l:`${s.e} ${s.l}`},
    {bg:`${cat.c}15`, c:cat.c, b:`${cat.c}40`, l:`${cat.e} ${cat.l}`},
    ...(ov?[{bg:'#fee2e2',c:'#dc2626',b:'#fca5a5',l:'⚠️ Atrasada'}]:[]),
  ];

  return (
    <div>
      <button className="bk" onClick={onBack}><Ic.ChL/> Voltar para tarefas</button>
      <div className="card">
        <div className="card-b">
          <div className="d-hd">
            <button className={`tc-cb${task.sta==='done'?' ck':''}`}
              style={{width:26,height:26,flexShrink:0,marginTop:2}}
              onClick={()=>onToggle(task.id)}
              aria-label={task.sta==='done'?'Reabrir':'Concluir'}>
              {task.sta==='done' && <Ic.Check/>}
            </button>
            <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,lineHeight:1.3,
              color:task.sta==='done'?'var(--tm)':'var(--t)',
              textDecoration:task.sta==='done'?'line-through':'none'}}>
              {task.title}
            </h2>
          </div>

          <div className="d-bdgs">
            {badges.map((b,i)=>(
              <span key={i} style={{display:'inline-flex',alignItems:'center',gap:4,padding:'4px 11px',
                borderRadius:999,fontSize:12,fontWeight:700,
                background:b.bg,color:b.c,border:`1.5px solid ${b.b}`}}>
                {b.l}
              </span>
            ))}
          </div>

          {task.desc && (
            <div style={{marginBottom:20}}>
              <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'.7px',color:'var(--tm)',marginBottom:7}}>Descrição</div>
              <div style={{fontSize:14,color:'var(--t2)',lineHeight:1.6}}>{task.desc}</div>
            </div>
          )}

          <div className="d-ig">
            <div className="d-ii">
              <div className="d-il">📅 Vencimento</div>
              <div className="d-iv" style={{color:ov?'#dc2626':'var(--t)'}}>{fmtD(task.due)}</div>
            </div>
            <div className="d-ii">
              <div className="d-il">📋 Criada em</div>
              <div className="d-iv">{fmtD(task.created)}</div>
            </div>
          </div>

          <div className="dv"/>
          <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
            <button className="btn btn-sp" onClick={onEdit}><Ic.Edit/> Editar</button>
            <button className={`btn ${task.sta==='done'?'':'btn-green'}`}
              style={task.sta==='done'?{background:'#fef9c3',color:'#92400e'}:{}}
              onClick={()=>onToggle(task.id)}>
              {task.sta==='done'?'↩️ Reabrir':'✅ Concluir'}
            </button>
            <button className="btn btn-d" style={{marginLeft:'auto'}} onClick={()=>onDel(task.id)}>
              <Ic.Trash/> Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── TOAST ── */
function Toast({ msg, ic }) {
  return <div className="toast" role="status" aria-live="polite"><span>{ic}</span> {msg}</div>;
}

/* ── MAIN APP ── */
const VTITLES = { dashboard:'Dashboard', list:'Tarefas', 'new-task':'Nova Tarefa', 'edit-task':'Editar Tarefa', detail:'Detalhes' };

export default function App() {
  const [view,setView]=useState('dashboard');
  const [tasks,setTasks]=useState(SEED);
  const [sel,setSel]=useState(null);
  const [sbOpen,setSbOpen]=useState(false);
  const [toast,setToast]=useState(null);

  useEffect(()=>{
    let el=document.getElementById('tf-css');
    if(!el){el=document.createElement('style');el.id='tf-css';document.head.appendChild(el);}
    el.textContent=CSS;
  },[]);

  const showToast=(msg,ic='✅')=>{setToast({msg,ic});setTimeout(()=>setToast(null),2500);};
  const nav=v=>{setView(v);setSbOpen(false);};

  const toggle=id=>{
    const t=tasks.find(t=>t.id===id);
    const nowDone=t?.sta!=='done';
    setTasks(p=>p.map(t=>t.id===id?{...t,sta:t.sta==='done'?'pending':'done'}:t));
    showToast(nowDone?'Tarefa concluída!':'Tarefa reaberta.',nowDone?'✅':'↩️');
  };

  const delTask=id=>{
    setTasks(p=>p.filter(t=>t.id!==id));
    if(sel?.id===id) setSel(null);
    if(view==='detail') nav('list');
    showToast('Tarefa excluída.','🗑️');
  };

  const save=data=>{
    if(tasks.some(t=>t.id===data.id)){
      setTasks(p=>p.map(t=>t.id===data.id?data:t));
      setSel(data); nav('detail'); showToast('Tarefa atualizada!','✏️');
    } else {
      setTasks(p=>[data,...p]); nav('list'); showToast('Tarefa criada!','✅');
    }
  };

  const render=()=>{
    const liveTask=sel?tasks.find(t=>t.id===sel.id)||sel:null;
    switch(view){
      case 'dashboard': return <Dashboard tasks={tasks} nav={nav} selTask={setSel} onToggle={toggle} onDel={delTask}/>;
      case 'list':      return <TaskList  tasks={tasks} nav={nav} selTask={setSel} onToggle={toggle} onDel={delTask}/>;
      case 'new-task':  return <TaskForm  editTask={null} onSave={save} onCancel={()=>nav('list')}/>;
      case 'edit-task': return liveTask&&<TaskForm editTask={liveTask} onSave={save} onCancel={()=>nav('detail')}/>;
      case 'detail':    return liveTask&&<TaskDetail task={liveTask} onEdit={()=>nav('edit-task')} onDel={delTask} onBack={()=>nav('list')} onToggle={toggle}/>;
      default: return null;
    }
  };

  return (
    <div className="tm-app">
      <Sidebar view={view} nav={nav} tasks={tasks} open={sbOpen} close={()=>setSbOpen(false)}/>
      <main className="tm-main" role="main">
        <header className="tm-hd">
          <button className="tm-hd-btn" onClick={()=>setSbOpen(v=>!v)} aria-label="Abrir menu" aria-expanded={sbOpen}>
            <Ic.Menu/>
          </button>
          <h1 className="tm-hd-title">{VTITLES[view]||'TaskFlow'}</h1>
          <div className="tm-av" aria-label="Usuário: João Silva">JS</div>
        </header>
        <div className="tm-ct">{render()}</div>
      </main>
      <BotNav view={view} nav={nav}/>
      {toast && <Toast msg={toast.msg} ic={toast.ic}/>}
    </div>
  );
}
