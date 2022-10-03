var express = require('express');
const test1 = require("./tests/test1");
const test2 = require("./tests/test2");
var app = express();

//setting middleware
app.use(express.static( __dirname)); //Serves resources from public folder

var server = app.listen(3000);

(async()=>{
  const t1 = test1();
  const t2 = test2();
  await t1;
  await t2;
})().then(function(){
  server.close();
})

