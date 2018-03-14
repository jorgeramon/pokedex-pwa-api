const express = require("express");
const app = express();

require("./config/database");

const cors = require("cors");
app.use(cors());

app.use('/static', express.static(__dirname + '/static'));

const pokemonRouter = require("./routes/pokemon");
app.use("/pokemons", pokemonRouter);

const https = require('https');
const fs = require('fs');

if (process.env.NODE_ENV === "https") {
  var options = {
    key: fs.readFileSync('/etc/letsencrypt/live/api.pwa.dsindigo.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/api.pwa.dsindigo.com/cert.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/api.pwa.dsindigo.com/chain.pem')
  };

  https.createServer(options, app).listen(8080, function () {
    console.log('Running on port 8080 with HTTPs');
  });
} else {
  app.listen(8080, function () {
    console.log('Running on port 8080')
  });
}
