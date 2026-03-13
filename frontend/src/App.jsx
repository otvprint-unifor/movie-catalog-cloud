import logo from "./assets/logo.png";
import axios from "axios";
import {
createUserWithEmailAndPassword,
onAuthStateChanged,
signInWithEmailAndPassword,
signOut
} from "firebase/auth";
import { useEffect, useState } from "react";
import "./App.css";
import { auth } from "./firebaseAuth";
import Login from "./login";

export default function App(){

const API="https://movie-catalog-grupo29-production.up.railway.app";
const TMDB_KEY="4a66de4a250179475bc5045edb085801";

const [user,setUser]=useState(null);

const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const [movies,setMovies]=useState([]);
const [search,setSearch]=useState("");
const [results,setResults]=useState([]);
const [selected,setSelected]=useState(null);

const [reviewMovie,setReviewMovie]=useState(null);
const [reviewText,setReviewText]=useState("");

const [deleteMovieId,setDeleteMovieId]=useState(null);

const [movieDetails,setMovieDetails]=useState(null);
const [tmdbDetails,setTmdbDetails]=useState(null);

const [activeTab,setActiveTab]=useState("todos");
const userName = user?.displayName;

useEffect(()=>{

const unsubscribe=onAuthStateChanged(auth,(currentUser)=>{
setUser(currentUser);
});

return()=>unsubscribe();

},[]);

useEffect(()=>{

if(user?.uid){
loadMovies();
}

},[user]);

function login(){

signInWithEmailAndPassword(auth,email,password)
.catch(()=>{
alert("Email ou senha inválidos");
});

}

function register(){

createUserWithEmailAndPassword(auth,email,password)
.catch(()=>{
alert("Erro ao criar conta");
});

}

function logout(){

signOut(auth).then(()=>{
setUser(null);
setMovies([]);
});

}

function loadMovies(){

if(!user?.uid) return;

axios
.get(`${API}/movies/${user.uid}`)
.then(res=>{
setMovies(res.data);
});

}

function searchMovies(value){

setSearch(value);

if(value.length<2){
setResults([]);
return;
}

axios
.get(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${value}`)
.then(res=>{
setResults(res.data.results.slice(0,8));
});

}

function selectMovie(movie){

setSelected({
title:movie.title,
year:movie.release_date?.split("-")[0],
genre:"Filme",
poster:`https://image.tmdb.org/t/p/w300${movie.poster_path}`,
watched:false,
favorite:false,
rating:0,
review:""
});

setResults([]);

}

function addMovie(){

if(!selected || !user?.uid) return;

axios.post(`${API}/movies`,{
...selected,
userId:user.uid
})
.then(()=>{
setSelected(null);
setSearch("");
loadMovies();
});

}

function deleteMovie(id){
setDeleteMovieId(id);
}

function confirmDelete(){

axios
.delete(`${API}/movies/${deleteMovieId}`)
.then(()=>{
setDeleteMovieId(null);
loadMovies();
});

}

function toggleFavorite(movie){

axios.put(`${API}/movies/${movie.id}`,{
...movie,
favorite:!movie.favorite
}).then(loadMovies);

}

function toggleWatched(movie){

axios.put(`${API}/movies/${movie.id}`,{
...movie,
watched:!movie.watched
}).then(loadMovies);

}

function rateMovie(movie,value){

axios.put(`${API}/movies/${movie.id}`,{
...movie,
rating:value
}).then(loadMovies);

}

function openReview(movie){

setReviewMovie(movie);
setReviewText(movie.review||"");

}

function saveReview(){

axios.put(`${API}/movies/${reviewMovie.id}`,{
...reviewMovie,
review:reviewText
}).then(()=>{
setReviewMovie(null);
loadMovies();
});

}

function scrollLeft(){
document.getElementById("results").scrollBy({
left:-400,
behavior:"smooth"
});
}

function scrollRight(){
document.getElementById("results").scrollBy({
left:400,
behavior:"smooth"
});
}

const totalMovies=movies.length;
const watchedMovies=movies.filter(m=>m.watched).length;
const favoriteMovies=movies.filter(m=>m.favorite).length;

const todos = movies;
const naoAssistidos=movies.filter(m=>!m.watched);
const assistidos=movies.filter(m=>m.watched);
const favoritos=movies.filter(m=>m.favorite);

const avgRating=
movies.length>0
?(
movies.reduce((a,m)=>a+(m.rating||0),0)
/movies.length
).toFixed(1)
:0;

let moviesToShow=[];

if(activeTab==="todos") moviesToShow=[...todos];
if(activeTab==="naoAssistidos") moviesToShow=[...naoAssistidos];
if(activeTab==="assistidos") moviesToShow=[...assistidos];
if(activeTab==="favoritos") moviesToShow=[...favoritos];

moviesToShow=moviesToShow.sort((a,b)=>{

if(a.favorite && !b.favorite) return -1
if(!a.favorite && b.favorite) return 1

return b.rating-a.rating

})

if(!user){
return <Login/>
}

return(

<div className="container">

<div className="topbar">

<h1>
{userName ? `Olá ${userName}. Seu Catálogo de Filmes 🎬` : "Seu Catálogo de Filmes 🎬"}
</h1>

<button className="logout" onClick={logout}>
Logout
</button>

</div>

<div className="stats">

<div className="stat">
<h3>{totalMovies}</h3>
<p>Filmes</p>
</div>

<div className="stat">
<h3>{watchedMovies}</h3>
<p>Assistidos</p>
</div>

<div className="stat">
<h3>{favoriteMovies}</h3>
<p>Favoritos</p>
</div>

<div className="stat">
<h3>{avgRating}</h3>
<p>Média ⭐</p>
</div>

</div>

<div className="search-box">

<input
className="search"
placeholder="Adicionar filme..."
value={search}
onChange={(e)=>searchMovies(e.target.value)}
/>

{search &&(
<button
className="clear-search"
onClick={()=>{
setSearch("");
setResults([]);
setSelected(null);
}}
>
✕
</button>
)}

</div>

{results.length>0 &&(

<div className="results-wrapper">

<button className="scroll-btn left" onClick={scrollLeft}>
◀
</button>

<div className="results" id="results">

{results.map(movie=>(

<div
className="poster"
key={movie.id}
onClick={()=>selectMovie(movie)}
>

{movie.poster_path &&(

<img
src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
alt={movie.title}
/>

)}

</div>

))}

</div>

<button className="scroll-btn right" onClick={scrollRight}>
▶
</button>

</div>

)}

{selected &&(

<div className="selected">

<img src={selected.poster} width="120"/>

<h3>{selected.title}</h3>

<p>Ano: {selected.year}</p>

<button onClick={addMovie}>
Adicionar ao seu catálogo
</button>

</div>

)}

<div className="tabs">

<button
className={activeTab==="todos"?"tab active":"tab"}
onClick={()=>setActiveTab("todos")}
>
Todos ({todos.length})
</button>

<button
className={activeTab==="naoAssistidos"?"tab active":"tab"}
onClick={()=>setActiveTab("naoAssistidos")}
>
Não assistidos ({naoAssistidos.length})
</button>

<button
className={activeTab==="assistidos"?"tab active":"tab"}
onClick={()=>setActiveTab("assistidos")}
>
Assistidos ({assistidos.length})
</button>

<button
className={activeTab==="favoritos"?"tab active":"tab"}
onClick={()=>setActiveTab("favoritos")}
>
Favoritos ({favoritos.length})
</button>

</div>

{moviesToShow.length===0 ? (

<p className="empty-message">

{activeTab==="todos" && "Você ainda não adicionou filmes."}
{activeTab==="naoAssistidos" && "Nenhum filme não assistido."}
{activeTab==="assistidos" && "Você ainda não marcou filmes como assistidos."}
{activeTab==="favoritos" && "Você ainda não tem filmes favoritos."}

</p>

) : (

<div key={activeTab} className="grid fade-in">

{moviesToShow.map(movie=>(

<MovieCard
key={movie.id}
movie={movie}
toggleWatched={toggleWatched}
toggleFavorite={toggleFavorite}
rateMovie={rateMovie}
openReview={openReview}
deleteMovie={deleteMovie}
setMovieDetails={setMovieDetails}
/>

))}

</div>

)}

{totalMovies > 0 && (

<div className="progress">

<div className="progress-info">
<span>{watchedMovies} de {totalMovies} assistidos</span>
<span>{Math.round((watchedMovies/totalMovies)*100)}%</span>
</div>

<div className="progress-bar">
<div
className="progress-fill"
style={{
width:`${(watchedMovies/totalMovies)*100}%`,
background:
(watchedMovies/totalMovies) < 0.4
? "#e50914"
: (watchedMovies/totalMovies) < 0.7
? "#f5c518"
: "#2ecc71"
}}
></div>
</div>

</div>

)}

{reviewMovie &&(

<div className="modal">

<div className="modal-content">

<h2>Resenha</h2>

<textarea
value={reviewText}
onChange={(e)=>setReviewText(e.target.value)}
placeholder="Escreva sua resenha..."
/>

<button onClick={saveReview}>
Concluir
</button>

<button onClick={()=>setReviewMovie(null)}>
Cancelar
</button>

</div>

</div>

)}

{deleteMovieId &&(

<div className="modal">

<div className="modal-content">

<h2>Remover filme</h2>

<p>Tem certeza que deseja remover este filme?</p>

<button onClick={confirmDelete}>
Sim, remover
</button>

<button onClick={()=>setDeleteMovieId(null)}>
Cancelar
</button>

</div>

</div>

)}

{movieDetails &&(

<div className="modal">

<div className="modal-content movie-modal">

<img
src={movieDetails.poster}
className="modal-poster"
/>

<div className="modal-info">

<h2>{movieDetails.title}</h2>

<p>Ano: {movieDetails.year}</p>

{movieDetails.rating>0 &&(
<p className="modal-rating">
⭐ {movieDetails.rating}/5
</p>
)}

<p className="modal-status">
{movieDetails.watched ? "✓ Assistido" : "Não assistido"}
</p>

{movieDetails.favorite && (
<p className="modal-favorite">
⭐ Favorito
</p>
)}

{movieDetails.review &&(

<div className="modal-review">

<h3>Resenha</h3>

<p>"{movieDetails.review}"</p>

</div>

)}

<button onClick={()=>setMovieDetails(null)}>
Fechar
</button>

</div>

</div>

</div>

)}

</div>

)

}

function MovieCard({movie,toggleWatched,toggleFavorite,rateMovie,openReview,deleteMovie,setMovieDetails}){

return(

<div className="card" onClick={()=>setMovieDetails(movie)}>

<div className="poster-container">

<img
src={movie.poster}
alt={movie.title}
/>

<div className="card-overlay" onClick={(e)=>e.stopPropagation()}>

<div className="stars">

{[1,2,3,4,5].map(star=>(

<span
key={star}
onClick={()=>rateMovie(movie,star)}
style={{
cursor:"pointer",
color:movie.rating>=star?"gold":"gray"
}}
>
★
</span>

))}

</div>

<div className="actions">

<button onClick={()=>toggleWatched(movie)}>
{movie.watched?"✓ Assistido":"Marcar assistido"}
</button>

<button onClick={()=>toggleFavorite(movie)}>
{movie.favorite?"⭐ Favorito":"Favoritar"}
</button>

<button onClick={()=>openReview(movie)}>
Resenha
</button>

<button onClick={()=>deleteMovie(movie.id)}>
Remover
</button>

</div>

</div>

{movie.favorite &&(
<div className="badge favorite">⭐</div>
)}

{movie.watched &&(
<div className="badge watched">Assistido</div>
)}

{movie.rating>0 &&(
<div className="badge rating">
⭐ {movie.rating}/5
</div>
)}

</div>

<div className="info">

<h3>{movie.title}</h3>

<p>{movie.year}</p>

</div>

</div>

)

}