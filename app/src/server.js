const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const socketio = require('socket.io')
const Data = require("../../data-messenger.json");

const fs = require("fs")
// set up đường dẫn static file
const publicPathDirectory = path.join(__dirname, "../public");
app.use(express.static(publicPathDirectory));

const server = http.createServer(app);
const io = socketio(server);


// Listen event from client => Connection
io.on("connection", (socket) => {
    console.log("=======================")
    console.log("| New client connect! |")
    console.log("=======================")

    socket.emit("Send messenger old Client to Server", {
        Data,
    })
    // socket.emit("Send count server to client", count);
    // socket.emit("message", message);
    //
    socket.on("Send messenger Client to Server", (messenger) => {
        let test;
        if(Data){
            let lastProperty = Object.keys(Data).pop().split("messenger")[1];
            console.log(parseInt(lastProperty)+ 1)
            test = "messenger" + (parseInt(lastProperty)+ 1);
        }else{
            test = "messenger1"
        }

        Data[test] = messenger;

        console.log(messenger)
        io.emit("Send messenger Server to Client", {
            name: messenger.name,
            messenger: messenger.messengerText,
        })
    })

    //Share my location
    socket.on("Share location from client to server", ({latitude, longitude}) => {
        const linkLocation = `https://www.google.com/maps?q=${latitude},${longitude}`;
        io.emit("Share location from server to client", linkLocation)
    })

    // Disconnect
    socket.on("disconnect", () => {
        console.log("=======================")
        console.log("| Client left server! |")
        console.log("=======================")
    });

});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

server.listen(4567, () =>
    console.log('App run on port 4567!'),
);