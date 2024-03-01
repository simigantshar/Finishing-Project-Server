const indexR = require("./index");
const usersR = require("./users");
const watchesR = require("./watches");
const cufflinksR = require("./cufflinks");
const bandsR = require("./bands");
const uploadsR = require("./uploads");

exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",usersR);
  app.use("/watches",watchesR);
  app.use("/cufflinks",cufflinksR);
  app.use("/bands",bandsR);
  app.use("/uploads", uploadsR);
}