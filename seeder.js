require("./src/config/database");

const mongoose = require("mongoose");
const async = require("async");
const jsonfile = require("jsonfile");
const chalk = require("chalk");

var seeders = [
  { schema: require("./src/schemas/pokemon"), file: "seeds/starters.json", prod: true },
  { schema: require("./src/schemas/pokemon"), file: "seeds/extras.json", prod: true }
]

async.eachSeries(seeders, (seed, callback) => {
  if (process.argv[2] === "-prod" && !seed.prod) return callback();

  if (process.argv[2] === "-dev" && seed.prod) return callback();

  jsonfile.readFile(seed.file, (err, obj) => {
    if (err) {
      console.log(chalk.red(`Error reading file ${seed.file}`));
      return callback();
    }

    console.log(chalk.yellow(`\nInserting documents from file ${seed.file}`));

    obj = obj.map(o => {
      if (typeof o._id === "string" && o._id.length === 24) {
        o._id = mongoose.mongo.ObjectId(o._id);
      }

      let _o = Object.assign({}, o);

      Object.keys(_o).forEach(k => {
        if (k !== "_id" && k[0] === "_") {

          if (Array.isArray(_o[k])) {
            o[k.slice(1)] = _o[k].map(i => mongoose.mongo.ObjectId(i));
          } else {
            o[k.slice(1)] = mongoose.mongo.ObjectId(_o[k]);
          }

          delete o[k];
        }
      });

      return o;
    });

    async.series([

      callback => {
        if (seed.remove) {
          seed.schema.remove({})
            .then(() => callback())
            .catch(() => callback());
        } else callback();
      },

      callback => {
        let insertedDocuments = 0;
        async.eachSeries(obj, (doc, c) => {
          new seed.schema(doc).save()
            .then(d => {
              insertedDocuments++;
              console.log(chalk.green(`Inserted document with _id: ${d._id}`));
              c();
            })
            .catch(e => {
              //console.log(chalk.red(`Error inserting this document: ${ JSON.stringify(doc) }`));
              //console.log(e);
              c();
            });
        }, () => {
          console.log(chalk.cyan(`Inserted: ${ insertedDocuments } documents`));
          callback();
        });
      }

    ], () => callback());
  });
}, () => process.exit(0));
