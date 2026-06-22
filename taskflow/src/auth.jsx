import { useState } from "react";

export function LoginScreen({ onLogin, goRegister }) {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");

  const submit = () => {
    const user = JSON.parse(
      localStorage.getItem("taskflowUser")
    );

    if (!user) {
      setError("Nenhum usuário cadastrado.");
      return;
    }

    if (
      user.email === email &&
      user.password === password
    ) {
      localStorage.setItem(
        "taskflowLogged",
        "true"
      );

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

export function RegisterScreen({ goLogin }) {
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