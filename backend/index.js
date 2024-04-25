const express = require("express");
const app = express();
const swaggerJsdoc = require("swagger-jsdoc");
const mongoose = require("mongoose");
const Movie = require("./movieSchema");
const swaggerUi = require("swagger-ui-express");
app.use(express.json());
const port = 3000;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "swagger",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./index.js"], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the movie
 *         title:
 *           type: string
 *           description: The title of the movie
 *         genre:
 *           type: string
 *           description: The genre of the movie
 */

/**
 * @swagger
 * /movies:
 *  get:
 *    summary: Get all movies from the database
 *    tags: [Movies]
 *    responses:
 *      200:
 *        description: The List of all the movies
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *               $ref: '#/components/schemas/Movie'
 *      400:
 *        description: Cannot get the list of movies
 */

/**
 * @swagger
 * /movies:
 *  post:
 *    summary: Add a new movie to the database
 *    tags: [Movies]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Movie'
 *    responses:
 *      200:
 *        description: The movie is successfully added
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *               $ref: '#/components/schemas/Movie'
 *      400:
 *        description: Cannot add the movie
 *      500:
 *        description: Internal server error
 */

/**
 * @swagger
 * /movies/{id}:
 *  patch:
 *    summary: Update the movie with the specified id
 *    tags: [Movies]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The movie id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Movie'
 *    responses:
 *      200:
 *        description: The movie is successfully updated
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *               $ref: '#/components/schemas/Movie'
 *      404:
 *        description: The movie is not found
 *      500:
 *        description: Internal server error
 */

/**
 * @swagger
 * /movies/{id}:
 *  delete:
 *    summary: Delete the movie with the specified id
 *    tags: [Movies]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The movie id
 *    responses:
 *      200:
 *        description: The movie is successfully deleted
 *      404:
 *        description: The movie is not found
 *      500:
 *        description: Internal server error
 */

app.post("/movies", async (req, res) => {
  const { title, genre, year } = req.body;
  try {
    const isMovie = new Movie({ title, genre, year });
    await isMovie.save();
    res.status(200).send({ message: "Movie added successfully" });
  } catch (err) {
    console.log(err);
    res.status(404).send({ message: "Something went wrong" });
  }
});

app.get("/movies", async (req, res) => {
  try {
    const movieData = await Movie.find();
    res.status(200).send({ data: movieData });
  } catch (err) {
    console.log(err);
  }
});

app.patch("/movies/:id", async (req, res) => {
  const { title } = req.body;
  const { id } = req.params;
  try {
    const updateMovie = await Movie.findByIdAndUpdate(
      { _id: id },
      { title: title },
      { new: true }
    );
    console.log(updateMovie);
    if (updateMovie) {
      return res.status(200).send({ messege: "Movie updated" });
    } else {
      return res.status(404).send({ messege: "Movie not found" });
    }
  } catch (err) {
    console.log(err);
    return req.status(500).send({ messege: "Something is wrong" });
  }
});

app.delete("/movies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteMovie = await Movie.findByIdAndDelete({ _id: id });
    res.status(200).send({ messege: "Movie deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ messege: "Something is wrong" });
  }
});

app.listen(port, async () => {
  await mongoose.connect(
    "mongodb+srv://sam9910333:sameer123@cluster0.leekpdy.mongodb.net/movies?retryWrites=true&w=majority&appName=Cluster0 "
  );
  console.log(`Server is running on port ${port}`);
});
