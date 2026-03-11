const express = require("express");
const cors = require("cors");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const db = require("./firebase");

const app = express();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Movie Catalog API",
      version: "1.0.0"
    },
    servers: [
      {
        url: "https://movie-catalog-cloud-production.up.railway.app"
      }
    ]
  },
  apis: ["./server.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("API Movie Catalog funcionando");
});

/**
 * @swagger
 * /movies/{userId}:
 *   get:
 *     summary: Lista filmes do usuário
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de filmes
 */

app.get("/movies/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "userId é obrigatório" });
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
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Adiciona um filme
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               year:
 *                 type: string
 *               genre:
 *                 type: string
 *               poster:
 *                 type: string
 *               watched:
 *                 type: boolean
 *               favorite:
 *                 type: boolean
 *               rating:
 *                 type: number
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Filme criado
 */

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

    if (!title || !userId) {
      return res.status(400).json({
        error: "title e userId são obrigatórios"
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
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Atualiza um filme
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Filme atualizado
 */

app.put("/movies/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db
      .collection("movies")
      .doc(id)
      .update(req.body);

    res.json({ message: "Filme atualizado" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Remove um filme
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Filme removido
 */

app.delete("/movies/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db
      .collection("movies")
      .doc(id)
      .delete();

    res.json({ message: "Filme removido" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro interno do servidor" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});