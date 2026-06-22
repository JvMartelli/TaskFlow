import { useState } from "react";
import "./App.css";
import { SEED } from "./taskData";
import { BotNav, Sidebar, Toast } from "./components.jsx";
import { Dashboard, TaskDetail, TaskForm, TaskList } from "./pages.jsx";
import { Ic } from "./icons.jsx";

const VTITLES = { dashboard:'Dashboard', list:'Tarefas', 'new-task':'Nova Tarefa', 'edit-task':'Editar Tarefa', detail:'Detalhes' };

export default function App() {
  const [view,setView]=useState('dashboard');
  const [tasks,setTasks]=useState(SEED);
  const [sel,setSel]=useState(null);
  const [sbOpen,setSbOpen]=useState(false);
  const [toast,setToast]=useState(null);  const showToast=msg=>{setToast({msg});setTimeout(()=>setToast(null),2500);};
  const nav=v=>{setView(v);setSbOpen(false);};

  const toggle=id=>{
    const t=tasks.find(t=>t.id===id);
    const nowDone=t?.sta!=='done';
    setTasks(p=>p.map(t=>t.id===id?{...t,sta:t.sta==='done'?'pending':'done'}:t));
    showToast(nowDone?'Tarefa concluída!':'Tarefa reaberta.',nowDone?'':'');
  };

  const delTask=id=>{
    setTasks(p=>p.filter(t=>t.id!==id));
    if(sel?.id===id) setSel(null);
    if(view==='detail') nav('list');
    showToast('Tarefa excluída.','');
  };

  const save=data=>{
    if(tasks.some(t=>t.id===data.id)){
      setTasks(p=>p.map(t=>t.id===data.id?data:t));
      setSel(data); nav('detail'); showToast('Tarefa atualizada!');
    } else {
      setTasks(p=>[data,...p]); nav('list'); showToast('Tarefa criada!');
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
      {toast && <Toast msg={toast.msg}/>}
    </div>
  );
}
