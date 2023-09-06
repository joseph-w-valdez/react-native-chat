const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const firebaseAdmin = require('firebase-admin');
const cors = require('cors');

// Initialize Firebase Admin SDK here
var serviceAccount = require("./firebaseServiceAccountKey.json");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
});

const corsOptions = {
  origin: ['http://localhost:8081'],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,XHR",
};

const app = express();

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

const httpServer = http.createServer();
const io = socketIO(httpServer, {
  cors: {
    origin: corsOptions.origin,
    methods: corsOptions.methods,
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (data) => {
    console.log(`${data.userId} (${data.time}): ${data.message}`); // Display the message with timestamp
    io.emit('message', { userId: data.userId, message: data.message, time: data.time }); // Send the message back to all clients
  });
});

httpServer.listen(3000, () => {
  console.log('Server is running on port 3000');
});
