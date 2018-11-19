const express = require("express");
const expressGrapgQL = require("express-graphql");
const schema = require("./schema")

const app = express();

app.use("/graphql", expressGrapgQL({ //you can go to this url and check it http://localhost:4000/graphq
  schema,
  graphiql: true
}));

app.listen(4000, ()=>{
  console.log("Server running on port 4000")
});