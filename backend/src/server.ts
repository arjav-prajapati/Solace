import SocketService from "./services/socket";
const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const expressSocketIoSession = require("express-socket.io-session");
const cookieParser = require("cookie-parser"); // Import the cookie-parser package

app.use(express.json());
app.use(cookieParser());

//importing the dotenv package to use the environment variables
require("dotenv").config();
const port = process.env.NODE_ENV_PORT || 3000;

//importing the database connection
const conn = require("./db.ts");
const client = conn();


//defining cors options
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:5400"],
  methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
  //allow all headers
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));

app.set('trust proxy', 1)

// setting up the session
const sessionMiddleware = session({
  name: "solace-session-id",
  secret: process.env.NODE_ENV_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    client: client,
    dbName: "solace",
    ttl: 7 * 24 * 60 * 60 * 1000,
    collectionName: "sessions"
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: false, //false
    secure: app.get("env") === "production",
    httpOnly: true,
  },
})


// just for checking if the server is running
app.get("/", (req: any, res: { send: (arg0: string) => void; }) => {
  console.log("session id", req.sessionID);
  console.log("session", req.session)
  res.send("Hello World!");
});


//defining the routes for the app
app.use(sessionMiddleware);
app.use("/api/auth", cors(corsOptions), require("./routes/auth"));
app.use("/api/chat", cors(corsOptions), require("./routes/chat"));
app.use("/api/friends", cors(corsOptions), require("./routes/friends"));

const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

//socket service
const socketService = new SocketService();


socketService.io.attach(server);

socketService.io.engine.use(sessionMiddleware);

socketService.initListener();
