const express = require("express");
const Router = express.Router();
const PokemonSchema = require("../schemas/pokemon");

Router.get("/", async function (request, response) {
  try {
    const pokemons = await PokemonSchema.find().exec();
    response.json({ data: pokemons });
  } catch(e) {
    response.status(400).json({ error: e });
  }
});

Router.get("/:_id", async function (request, response) {
  try {
    const pokemon = await PokemonSchema.findById(request.params._id).exec();
    response.json({ data: pokemon });
  } catch(e) {
    response.status(400).json({ error: e });
  }
});

Router.get("/search", async function (request, response) {
});

module.exports = Router;
