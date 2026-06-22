import { useState } from "react";
import { CATS, PRI, STA } from "./taskData";
import { dueLbl, fmtD, getCat, isOvd, nid, todayISO } from "./taskUtils";
import { Ic } from "./icons.jsx";
import { Ring, TCard } from "./components.jsx";

function Dashboard({ tasks, nav, selTask, onToggle, onDel }) {
  const total=tasks.length, done=tasks.filter(t=>t.sta==='done').length;
  const inProg=tasks.filter(t=>t.sta==='in-progress').length;
  const ovd=tasks.filter(t=>isOvd(t.due,t.sta)).length;
  const pct=total>0?Math.round((done/total)*100):0;
  const recent=[...tasks].sort((a,b)=>b.id-a.id).slice(0,4);
  const urgent=tasks.filter(t=>t.sta!=='done'&&(t.pri==='critical'||t.pri==='high')).slice(0,4);

  const stats=[
    {l:'Total',       v:total,   e:'', bg:'#eef2ff'},
    {l:'Concluídas',  v:done,    e:'', bg:'#d1fae5'},
    {l:'Em Andamento',v:inProg,  e:'', bg:'#fef9c3'},
    {l:'Atrasadas',   v:ovd,     e:'', bg:'#fee2e2'},
  ];

  return (
    <div>
      <div className="ph">
        <div>
          <h1 className="pt">Olá, João! </h1>
          <p className="ps">{new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
        </div>
        <button className="btn btn-p" onClick={()=>nav('new-task')} style={{flexShrink:0}}>
          <Ic.Plus/> Nova Tarefa
        </button>
      </div>
      <div className="sg">
        {stats.map(s=>(
          <div key={s.l} className="sc">
            <div className="sc-ic" style={{background:s.bg}}><span>{s.a}</span></div>
            <div className="sc-v">{s.v}</div>
            <div className="sc-l">{s.l}</div>
          </div>
        ))}
      </div>
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
            <div className="st"> Urgentes</div>
            {urgent.length===0 ? (
              <div style={{textAlign:'center',padding:'20px 0',color:'var(--tm)',fontSize:14}}>
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
                        {cat.l}
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
          <div className="es-ic"><Ic.Search/></div>
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

function TaskDetail({ task, onEdit, onDel, onBack, onToggle }) {
  const p=PRI[task.pri], s=STA[task.sta], cat=getCat(task.cat), ov=isOvd(task.due,task.sta);
  const badges=[
    {bg:p.bg, c:p.c, b:p.b, l:p.l},
    {bg:s.bg, c:s.c, b:s.b, l:s.l},
    {bg:`${cat.c}15`, c:cat.c, b:`${cat.c}40`, l:cat.l},
    ...(ov?[{bg:'#fee2e2',c:'#dc2626',b:'#fca5a5',l:'Atrasada'}]:[]),
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
              <div className="d-il"> Vencimento</div>
              <div className="d-iv" style={{color:ov?'#dc2626':'var(--t)'}}>{fmtD(task.due)}</div>
            </div>
            <div className="d-ii">
              <div className="d-il"> Criada em</div>
              <div className="d-iv">{fmtD(task.created)}</div>
            </div>
          </div>

          <div className="dv"/>
          <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
            <button className="btn btn-sp" onClick={onEdit}><Ic.Edit/> Editar</button>
            <button className={`btn ${task.sta==='done'?'':'btn-green'}`}
              style={task.sta==='done'?{background:'#fef9c3',color:'#92400e'}:{}}
              onClick={()=>onToggle(task.id)}>
              {task.sta==='done'?'Reabrir':'Concluir'}
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

function LoginScreen({ onLogin, goRegister }) {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");

  const submit = () => {
    const user = JSON.parse(localStorage.getItem("taskflowUser"));

    if (!user) {
      setError("Nenhum usuário cadastrado.");
      return;
    }

    if (
      user.email === email &&
      user.password === password
    ) {
      localStorage.setItem("taskflowLogged","true");
      onLogin(user);
      return;
    }

    setError("Email ou senha inválidos.");
  };

  return (
    <div className="card" style={{maxWidth:450,margin:"40px auto"}}>
      <div className="card-b">
        <h1 className="pt">Login</h1>

        <div className="fg">
          <label className="fl">Email</label>
          <input
            className="fi"
            type="email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
          />
        </div>

        <div className="fg">
          <label className="fl">Senha</label>
          <input
            className="fi"
            type="password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
          />
        </div>

        {error && (
          <div className="err-msg">{error}</div>
        )}

        <button
          className="btn btn-p btn-lg"
          onClick={submit}
          style={{width:"100%"}}
        >
          Entrar
        </button>

        <div style={{marginTop:16,textAlign:"center"}}>
          <button
            className="bk"
            onClick={goRegister}
          >
            Criar conta
          </button>
        </div>
      </div>
    </div>
  );
}

function RegisterScreen({ goLogin }) {
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirm,setConfirm] = useState("");
  const [error,setError] = useState("");

  const submit = () => {
    if(password !== confirm){
      setError("As senhas não coincidem.");
      return;
    }

    localStorage.setItem(
      "taskflowUser",
      JSON.stringify({
        name,
        email,
        password
      })
    );

    goLogin();
  };

  return (
    <div className="card" style={{maxWidth:450,margin:"40px auto"}}>
      <div className="card-b">
        <h1 className="pt">Cadastro</h1>

        <div className="fg">
          <label className="fl">Nome</label>
          <input
            className="fi"
            value={name}
            onChange={e=>setName(e.target.value)}
          />
        </div>

        <div className="fg">
          <label className="fl">Email</label>
          <input
            className="fi"
            type="email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
          />
        </div>

        <div className="fg">
          <label className="fl">Senha</label>
          <input
            className="fi"
            type="password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
          />
        </div>

        <div className="fg">
          <label className="fl">Confirmar Senha</label>
          <input
            className="fi"
            type="password"
            value={confirm}
            onChange={e=>setConfirm(e.target.value)}
          />
        </div>

        {error && (
          <div className="err-msg">{error}</div>
        )}

        <button
          className="btn btn-p btn-lg"
          onClick={submit}
          style={{width:"100%"}}
        >
          Cadastrar
        </button>

        <div style={{marginTop:16,textAlign:"center"}}>
          <button
            className="bk"
            onClick={goLogin}
          >
            Já tenho conta
          </button>
        </div>
      </div>
    </div>
  );
}

export {
  Dashboard,
  TaskDetail,
  TaskForm,
  TaskList,
  LoginScreen,
  RegisterScreen
};
