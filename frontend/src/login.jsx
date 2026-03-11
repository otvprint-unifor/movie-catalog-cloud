import { useState } from "react";
import { auth } from "./firebaseAuth";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login({ onLogin }) {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  function login(){

    signInWithEmailAndPassword(auth,email,password)
      .then(()=>{
        onLogin();
      })
      .catch(()=>{
        alert("Login inválido");
      });

  }

  return(

    <div className="login">

      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={e=>setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={e=>setPassword(e.target.value)}
      />

      <button onClick={login}>
        Entrar
      </button>

      <button onClick={register}>
        Criar conta
    </button>

    </div>

  )

}