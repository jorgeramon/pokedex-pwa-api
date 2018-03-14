const express = require("express");
const app = express();

require("./config/database");

const cors = require("cors");
app.use(cors());

const pokemonRouter = require("./routes/pokemon");
app.use("/pokemons", pokemonRouter);
app.use('/static', express.static('./static'));

const https = require('https');
const fs = require('fs');

var options = {
  key: fs.readFileSync('/etc/letsencrypt/live/api.pwa.dsindigo.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/api.pwa.dsindigo.com/cert.pem'),
  ca: fs.readFileSync('/etc/letsencrypt/live/api.pwa.dsindigo.com/chain.pem')
};

https.createServer(options, app).listen(80);
