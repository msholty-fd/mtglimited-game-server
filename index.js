"use strict";
var path = require("path");
var express = require("express");
var serveIndex = require("serve-index");
var http_1 = require("http");
var colyseus_1 = require("colyseus");
var DraftRoom_1 = require("./app/DraftRoom");
var port = process.env.PORT || 2657;
var app = express();
var httpServer = http_1.createServer(app);
var gameServer = new colyseus_1.Server({ server: httpServer });
gameServer.register("draft", DraftRoom_1.DraftRoom, {
    maxClients: 10
});
app.use(express.static(path.join(__dirname, "static")));
app.use('/', serveIndex(path.join(__dirname, "static"), { icons: true }));
httpServer.listen(port);
console.log("Listening on http://localhost:" + port);
