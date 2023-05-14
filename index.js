// Pour que process.env soit compris par mon code
require("dotenv").config();
const express = require("express");
// Pour que mon backend soit interrogeable depuis n'importe où
const cors = require("cors");
// Pour faire des requêtes
const axios = require("axios");

// Je crée mon serveur
const app = express();
// Je lui dit d'utiliser cors
app.use(cors());

// Ma route characters
app.get("/characters", async (req, res) => {
  try {
    // let name = "";
    // if (req.query.name) {
    //   name = req.query.name;
    // }

    // Je crée une variable name qui vaut :
    // - req.query.name si il existe
    // - "" sinon
    // (revient au même que faire ce qu'il y a au dessus)
    const name = req.query.name || "";
    const skip = req.query.skip || "0";
    const limit = req.query.limit || "100";

    // J'interroge le backend du reacteur en envoyant la clef API et les différents query
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.API_KEY}&name=${name}&skip=${skip}&limit=${limit}`
    );
    // Je renvoie le data au front
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/comics", async (req, res) => {
  try {
    const characterId = req.query.id;

    let response;
    if (characterId) {
      response = await axios.get(
        `https://lereacteur-marvel-api.herokuapp.com/comics/${characterId}?apiKey=${process.env.API_KEY}`
      );
    } else {
      response = await axios.get(
        `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.API_KEY}`
      );
    }
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "This route does not exist" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
