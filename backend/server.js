const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./firebase");

const app = express();

app.use(cors());
app.use(express.json());

/* TESTE */

app.get("/", (req, res) => {
  res.send("API Movie Catalog funcionando");
});

/* LISTAR FILMES */

app.get("/movies", async (req, res) => {
  try {

    const snapshot = await db.collection("movies").get();

    const movies = [];

    snapshot.forEach(doc => {
      movies.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(movies);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ADICIONAR FILME */

app.post("/movies", async (req, res) => {
  try {

    const {
      title,
      year,
      genre,
      poster,
      watched = false,
      favorite = false,
      rating = 0
    } = req.body;

    const newMovie = await db.collection("movies").add({
      title,
      year,
      genre,
      poster,
      watched,
      favorite,
      rating
    });

    res.json({
      id: newMovie.id,
      title,
      year,
      genre,
      poster,
      watched,
      favorite,
      rating
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ATUALIZAR FILME */

app.put("/movies/:id", async (req, res) => {

  try {

    const movieId = req.params.id;

    await db
      .collection("movies")
      .doc(movieId)
      .update(req.body);

    res.json({
      message: "Filme atualizado"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});

/* DELETAR FILME */

app.delete("/movies/:id", async (req, res) => {

  try {

    await db
      .collection("movies")
      .doc(req.params.id)
      .delete();

    res.json({
      message: "Filme removido"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});