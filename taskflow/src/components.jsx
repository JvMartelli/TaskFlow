import { PRI } from "./taskData";
import { dueLbl, getCat, isOvd } from "./taskUtils";
import { Ic } from "./icons.jsx";

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
          <div className="tm-av">
            {(JSON.parse(localStorage.getItem("taskflowUser"))?.name || "U")
              .substring(0,2)
              .toUpperCase()}
            </div>

            <div>
              <div className="tm-un">
                {JSON.parse(localStorage.getItem("taskflowUser"))?.name || "Usuário"}
              </div>

              <div className="tm-ur">
                
              </div>
            </div>
          </div>
      </aside>
    </>
  );
}

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
          <span style={{fontSize:11,color:cat.c,fontWeight:500}}>{cat.l}</span>
          <span style={{display:'inline-flex',alignItems:'center',gap:3,fontSize:11,color:ov?'#ef4444':'var(--tm)',fontWeight:ov?700:400}}>
            <Ic.Cal/>{dueLbl(task.due,task.sta)}{ov&&' '}
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

function Toast({ msg }) {
  return <div className="toast" role="status" aria-live="polite">{msg}</div>;
}

export { BotNav, Ring, Sidebar, TCard, Toast };
