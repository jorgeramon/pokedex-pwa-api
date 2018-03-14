const express = require("express");
const app = express();

require("./config/database");

const cors = require("cors");
app.use(cors());

const pokemonRouter = require("./routes/pokemon");
app.use("/pokemons", pokemonRouter);

app.listen(8080, function() {
  console.log("Listening port 8080");
});
