const mongoose = require("mongoose");

const PokemonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  pokedexNumber: { type: Number, required: true },
  picture: { type: String, required: true },
  description: { type: String, required: true }
}, { collections: "pokemons" });

module.exports = mongoose.model("Pokemon", PokemonSchema);


