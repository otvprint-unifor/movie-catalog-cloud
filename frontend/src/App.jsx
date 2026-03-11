import axios from "axios";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { useEffect, useState } from "react";
import "./App.css";
import { auth } from "./firebaseAuth";

export default function App() {

  const API = "https://movie-catalog-cloud-production.up.railway.app";
  const TMDB_KEY = "4a66de4a250179475bc5045edb085801";

  const [user, setUser] = useState(null);

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const [movies,setMovies] = useState([]);
  const [search,setSearch] = useState("");
  const [results,setResults] = useState([]);
  const [selected,setSelected] = useState(null);

  /* ---------- FIREBASE AUTH LISTENER ---------- */

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();

  }, []);

  /* ---------- LOAD MOVIES ---------- */

  useEffect(()=>{

    if(user?.uid){
      loadMovies();
    }

  },[user]);

  /* ---------- LOGIN ---------- */

  function login(){

    signInWithEmailAndPassword(auth,email,password)
      .catch(()=>{
        alert("Email ou senha inválidos");
      });

  }

  /* ---------- REGISTER ---------- */

  function register(){

    createUserWithEmailAndPassword(auth,email,password)
      .catch(()=>{
        alert("Erro ao criar conta");
      });

  }

  /* ---------- LOGOUT ---------- */

  function logout(){

    signOut(auth).then(()=>{
      setUser(null);
      setMovies([]);
    });

  }

  /* ---------- LOAD MOVIES ---------- */

  function loadMovies(){

    if(!user?.uid) return;

    axios
      .get(`${API}/movies/${user.uid}`)
      .then(res=>{
        setMovies(res.data);
      })
      .catch(err=>{
        console.log("Erro ao carregar filmes",err);
      });

  }

  /* ---------- SEARCH MOVIES ---------- */

  function searchMovies(value){

    setSearch(value);

    if(value.length < 2){
      setResults([]);
      return;
    }

    axios
      .get(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${value}`)
      .then(res=>{
        setResults(res.data.results.slice(0,8));
      })
      .catch(err=>{
        console.log(err);
      });

  }

  /* ---------- SELECT MOVIE ---------- */

  function selectMovie(movie){

    setSelected({
      title: movie.title,
      year: movie.release_date?.split("-")[0],
      genre:"Filme",
      poster:`https://image.tmdb.org/t/p/w300${movie.poster_path}`,
      watched:false,
      favorite:false,
      rating:0
    });

    setResults([]);

  }

  /* ---------- ADD MOVIE ---------- */

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
    })
    .catch(err=>{
      console.log("Erro ao adicionar filme",err);
    });

  }

  /* ---------- DELETE ---------- */

  function deleteMovie(id){

    axios
      .delete(`${API}/movies/${id}`)
      .then(()=>loadMovies())
      .catch(err=>console.log(err));

  }

  /* ---------- FAVORITE ---------- */

  function toggleFavorite(movie){

    axios.put(`${API}/movies/${movie.id}`,{
      ...movie,
      favorite:!movie.favorite
    }).then(loadMovies);

  }

  /* ---------- WATCHED ---------- */

  function toggleWatched(movie){

    axios.put(`${API}/movies/${movie.id}`,{
      ...movie,
      watched:!movie.watched
    }).then(loadMovies);

  }

  /* ---------- RATING ---------- */

  function rateMovie(movie,value){

    axios.put(`${API}/movies/${movie.id}`,{
      ...movie,
      rating:value
    }).then(loadMovies);

  }

  /* ---------- STATS ---------- */

  const totalMovies = movies.length;

  const watchedMovies = movies.filter(m=>m.watched).length;

  const favoriteMovies = movies.filter(m=>m.favorite).length;

  const avgRating =
    movies.length > 0
      ? (
          movies.reduce((a,m)=>a+(m.rating||0),0)
          / movies.length
        ).toFixed(1)
      : 0;

  /* ---------- LOGIN SCREEN ---------- */

  if(!user){

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

  /* ---------- APP ---------- */

  return(

    <div className="container">

      <div className="topbar">

        <h1>Catálogo de Filmes 🎬</h1>

        <button className="logout" onClick={logout}>
          Logout
        </button>

      </div>

      {/* DASHBOARD */}

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

      {/* SEARCH */}

      <input
        className="search"
        placeholder="Buscar filme..."
        value={search}
        onChange={(e)=>searchMovies(e.target.value)}
      />

      {/* SEARCH RESULTS */}

      <div className="results">

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

      {/* SELECTED MOVIE */}

      {selected &&(

        <div className="selected">

          <img src={selected.poster} width="120"/>

          <h3>{selected.title}</h3>

          <p>Ano: {selected.year}</p>

          <button onClick={addMovie}>
            Adicionar ao catálogo
          </button>

        </div>

      )}

      {/* GRID */}

      <h2>Filmes adicionados</h2>

      <div className="grid">

        {movies.map(movie=>(

          <div className="card" key={movie.id}>

            <div className="poster-container">

              {movie.poster &&(
                <img src={movie.poster} alt={movie.title}/>
              )}

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

              <div className="stars">

                {[1,2,3,4,5].map(star=>(

                  <span
                    key={star}
                    onClick={()=>rateMovie(movie,star)}
                    style={{
                      cursor:"pointer",
                      color: movie.rating>=star ? "gold":"gray"
                    }}
                  >
                    ★
                  </span>

                ))}

              </div>

              <div className="actions">

                <button onClick={()=>toggleWatched(movie)}>
                  {movie.watched ? "Assistido ✓":"Marcar assistido"}
                </button>

                <button onClick={()=>toggleFavorite(movie)}>
                  {movie.favorite ? "⭐ Favorito":"Favoritar"}
                </button>

                <button onClick={()=>deleteMovie(movie.id)}>
                  Remover
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}