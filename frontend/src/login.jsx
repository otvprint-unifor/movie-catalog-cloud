import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
updateProfile
} from "firebase/auth";
import { useState } from "react";
import { auth } from "./firebaseAuth";
import logo from "./assets/logo.png";

export default function Login({ onLogin }) {

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [confirmPassword,setConfirmPassword] = useState("");

const [mode,setMode] = useState("login");
const [loading,setLoading] = useState(false);
const [error,setError] = useState("");

const [showPassword,setShowPassword] = useState(false);
const [showConfirm,setShowConfirm] = useState(false);

function login(){

setError("");
setLoading(true);

signInWithEmailAndPassword(auth,email,password)
.catch(()=>{
setError("Email ou senha incorretos");
setLoading(false);
});

}

function register(){

setError("");

if(password !== confirmPassword){
setError("As senhas não coincidem");
return;
}

if(password.length < 6){
setError("A senha precisa ter pelo menos 6 caracteres");
return;
}

setLoading(true);

createUserWithEmailAndPassword(auth,email,password)
.then((userCredential)=>{
updateProfile(userCredential.user,{
displayName:name
});
})
.catch(()=>{
setError("Erro ao criar conta");
setLoading(false);
});

}

if(loading){

return(

<div className="loading-screen">

<div className="loader"></div>

<p>Entrando...</p>

</div>

)

}

return(

<div className="auth-container">

<img src={logo} className="login-logo"/>

<div className="auth-tabs">

<button
className={mode==="login"?"auth-tab active":"auth-tab"}
onClick={()=>setMode("login")}
>
Login
</button>

<button
className={mode==="register"?"auth-tab active":"auth-tab"}
onClick={()=>setMode("register")}
>
Criar conta
</button>

</div>

{mode==="register" && (

<input
placeholder="Nome"
value={name}
onChange={e=>setName(e.target.value)}
/>

)}

<input
placeholder="Email"
value={email}
onChange={e=>setEmail(e.target.value)}
/>

<div className="password-field">

<input
type={showPassword ? "text" : "password"}
placeholder="Senha"
value={password}
onChange={e=>setPassword(e.target.value)}
/>

<span
className="toggle-password"
onClick={()=>setShowPassword(!showPassword)}
>
{showPassword ? "🙈" : "👁"}
</span>

</div>

{mode==="register" && (

<div className="password-field">

<input
type={showConfirm ? "text" : "password"}
placeholder="Confirmar senha"
value={confirmPassword}
onChange={e=>setConfirmPassword(e.target.value)}
/>

<span
className="toggle-password"
onClick={()=>setShowConfirm(!showConfirm)}
>
{showConfirm ? "🙈" : "👁"}
</span>

</div>

)}

{error && (
<p className="auth-error">{error}</p>
)}

{mode==="login" ? (

<button className="auth-btn" onClick={login}>
Entrar
</button>

) : (

<button className="auth-btn" onClick={register}>
Criar conta
</button>

)}

<p className="login-footer">
Grupo 29 • UNIFOR • 2026
</p>

</div>



)

}