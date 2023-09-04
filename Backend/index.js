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

  // Handle incoming socket events
  socket.on('message', (data) => {
    console.log('Received message:', data);
    io.emit('message', data);
  });
});

httpServer.listen(3000, () => {
  console.log('Server is running on port 3000');
});
