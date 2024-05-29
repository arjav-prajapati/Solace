import { Redis } from "ioredis";
import { Server } from "socket.io";
const conn = require('../db');
const crypto = require('crypto');

declare module 'http' {
    interface IncomingMessage {
        session: any,
        sessionID: string,
        sessionStore: any
    }
}

//importing the environment variables
require("dotenv").config();
const iv = Buffer.from(process.env.NODE_ENV_CRYPTO_IV as string, 'hex')
console.log("IV: ", iv);

const pub = new Redis({
    host: process.env.NODE_ENV_REDIS_HOST,
    port: parseInt(process.env.NODE_ENV_REDIS_PORT as string),
    username: process.env.NODE_ENV_REDIS_USERNAME,
    password: process.env.NODE_ENV_REDIS_PASSWORD,
});
const sub = new Redis({
    host: process.env.NODE_ENV_REDIS_HOST,
    port: parseInt(process.env.NODE_ENV_REDIS_PORT as string),
    username: process.env.NODE_ENV_REDIS_USERNAME,
    password: process.env.NODE_ENV_REDIS_PASSWORD,
});

class SocketService {
    private _io: Server;

    constructor() {
        this._io = new Server({
            cors: {
                origin: ["http://localhost:3000", "http://localhost:5173"], // Allow all origins for development
                allowedHeaders: ["*"],
                methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
                credentials: true,
                optionsSuccessStatus: 200,
            },
        });
        sub.subscribe("chat", "connection");

        // always remember to attach the server to the socket
        // and to initialize the listener
        // this.io.listen(5400);
    }


    //setting listener for the socket
    public initListener() {
        console.log("Initializing socket listeners");

        this.io.on("connect", async (socket) => {
            console.log("User connected");

            //on message
            socket.on("message", async ({ message, receiverMail, roomId, time}: { message: string, receiverMail: string, roomId: string,time:Date }) => {
                //access the session
                const senderMail = socket.request.session.user.email;
                
                const client = await conn();
                const db = client.db('solace');
                const chatCollection = await db.collection('chat');

                //check if the receiver is live
                const userCollection = await db.collection('users');
                const receiver = await userCollection.findOne({ email: receiverMail });

                //check if the receiver is currently live
                
                //generate message id
                const chat = {
                    senderMail,
                    receiverMail,
                    message,
                    time,
                    status: receiver?.isLive ? "10" : "01",
                    roomId
                }
                
                const insertedChat = await chatCollection.insertOne(chat);
                await pub.publish("chat", JSON.stringify({messageId: insertedChat.insertedId.toString(), roomId, message, receiverMail, senderMail, time, status: receiver?.isLive ? "10" : "01" }));
            });

            //on isLive
            socket.on("isLive", async ({ email, isLive }: { email: string, isLive: boolean }) => {
                if(!email || isLive === undefined) return;
                console.log("User is live: ", email, isLive);
                await pub.publish("connection", JSON.stringify({ message: "User is live", connectionType:true, time: new Date(), email, isLive }));
                const client = await conn();
                const db = await client.db('solace');
                const userCollection = await db.collection('users');
                await userCollection.updateOne({ email }, { $set: { isLive } });

                //set the status of chat messages to delivered
                if(isLive){
                    const chatCollection = await db.collection('chat');
                    await chatCollection.updateMany({ receiverMail: email, status: "01" }, { $set: { status: "10" } });
                }
            });

            //on room join
            socket.on("join", async(room) => {
                console.log("User joined room: ", room, socket.request.session.id);
                //set room messages status to read
                const client = await conn();
                const db = await client.db('solace');
                const chatCollection = await db.collection('chat');
                await chatCollection.updateMany({ roomId: room, receiverMail: socket.request.session.user.email, status: {$ne: "11"} }, { $set: { status: "11" } })

                await pub.publish("connection", JSON.stringify({ message: "User joined room", connectionType:false, time: new Date(), email: socket.request.session.user.email, isLive: true, roomId: room}));

                socket.join(room || socket.request.session.id);
            });

            //on disconnect
            socket.on("disconnect", async () => {
                console.log("User disconnected");
                if (!socket.request.session.user) return;
                await pub.publish("connection", JSON.stringify({ message: "User disconnected",connectionType:true, time: new Date(), email: socket.request.session.user.email, isLive: false }));
                const client = await conn();
                const db = await client.db('solace');
                const userCollection = await db.collection('users');
                await userCollection.updateOne({ email: socket.request.session.user.email }, { $set: { isLive: false } });
            });
        });

        //on message received
        sub.on("message", (channel, message) => {
            console.log("Message received from channel: ", message);
            const messageParsed = JSON.parse(message);

            if (channel === "chat") {
                //get the receiver socket and joined room
                console.log("Emitting message to room: ", messageParsed.roomId);
                this.io.to(messageParsed.roomId).emit("message", messageParsed);
            }
            else if (channel === "connection") {
                if(messageParsed.connectionType === true){
                    this.io.emit("isLive", JSON.parse(message));
                }else{
                    this.io.to(messageParsed.roomId).emit("joinedRoom", JSON.parse(message));
                }
            }
        });
    }

    get io() {
        if (!this._io) {
            throw new Error("Socket.io not initialized");
        }
        return this._io;
    }
}

export default SocketService;