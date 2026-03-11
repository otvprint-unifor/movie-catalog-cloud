import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

export default function App() {

  const API = "https://movie-catalog-cloud-production.up.railway.app";
  const TMDB_KEY = "4a66de4a250179475bc5045edb085801";

  const [movies,setMovies] = useState([]);
  const [search,setSearch] = useState("");
  const [results,setResults] = useState([]);
  const [selected,setSelected] = useState(null);

  function loadMovies(){
    axios.get(API + "/movies")
    .then(res=>setMovies(res.data));
  }

  useEffect(()=>{
    loadMovies();
  },[]);

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
    });
  }

  function selectMovie(movie){

    setSelected({
      title: movie.title,
      year: movie.release_date?.split("-")[0],
      genre: "Filme",
      poster: `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    });

    setResults([]);
  }

  function addMovie(){

    axios.post(API + "/movies", selected)
    .then(()=>{
      setSelected(null);
      setSearch("");
      loadMovies();
    });
  }

  return (

    <div className="container">

      <h1>Catálogo de Filmes 🎬</h1>

      <input
        className="search"
        placeholder="Buscar filme..."
        value={search}
        onChange={(e)=>searchMovies(e.target.value)}
      />

      <div className="results">
        {results.map(movie=>(
          <div
            className="poster"
            key={movie.id}
            onClick={()=>selectMovie(movie)}
          >
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
            )}
          </div>
        ))}
      </div>

      {selected && (
        <div className="selected">

          <img src={selected.poster} width="120"/>

          <h3>{selected.title}</h3>
          <p>Ano: {selected.year}</p>
          <p>Gênero: {selected.genre}</p>

          <button onClick={addMovie}>
            Adicionar ao catálogo
          </button>

        </div>
      )}

      <h2>Filmes adicionados</h2>

      <div className="grid">
    {movies.map(movie=>(
    <div className="card" key={movie.id}>

      {movie.poster && (
        <img src={movie.poster} alt={movie.title}/>
      )}

      <h3>{movie.title}</h3>
      <p>{movie.year}</p>
      <p>{movie.genre}</p>

    </div>
  ))}
</div>

    </div>

  );
}