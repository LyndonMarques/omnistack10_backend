const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");

const app = express();

mongoose.connect(
  "mongodb+srv://root:patomalk33@cluster0-0hwzz.mongodb.net/week10?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use(express.json());
// Tipos de parametros
// Query params: request.query (FIltros, ordenação, paginação) ...
// Routes params: request.params (ex: /user/:id)
// Body:

app.use(routes);

app.listen(3333);
