const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const session = require("express-session");
const body = require("body-parser")
const path = require("path");


module.exports = function(){
    require("./../app/routes/index.route")(express, app, path, session, body, io);

    return http;
}
