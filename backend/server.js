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

/* ========================= */
/* LISTAR FILMES DO USUÁRIO  */
/* ========================= */

app.get("/movies/:userId", async (req, res) => {
  try {

    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        error: "userId é obrigatório"
      });
    }

    const snapshot = await db
      .collection("movies")
      .where("userId", "==", userId)
      .get();

    const movies = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(movies);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});

/* ========================= */
/* ADICIONAR FILME */
/* ========================= */

app.post("/movies", async (req, res) => {

  try {

    const {
      title,
      year,
      genre,
      poster,
      watched = false,
      favorite = false,
      rating = 0,
      userId
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "userId é obrigatório"
      });
    }

    const newMovie = await db.collection("movies").add({
      title,
      year,
      genre,
      poster,
      watched,
      favorite,
      rating,
      userId
    });

    res.json({
      id: newMovie.id,
      title,
      year,
      genre,
      poster,
      watched,
      favorite,
      rating,
      userId
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

/* ========================= */
/* ATUALIZAR FILME */
/* ========================= */

app.put("/movies/:id", async (req, res) => {

  try {

    const { id } = req.params;

    await db
      .collection("movies")
      .doc(id)
      .update(req.body);

    res.json({
      message: "Filme atualizado"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

/* ========================= */
/* DELETAR FILME */
/* ========================= */

app.delete("/movies/:id", async (req, res) => {

  try {

    const { id } = req.params;

    await db
      .collection("movies")
      .doc(id)
      .delete();

    res.json({
      message: "Filme removido"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});