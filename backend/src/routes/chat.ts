import { emplace } from "@reduxjs/toolkit/dist/utils";
import { Request, Response, Router } from "express";
const conn = require("../db.ts");

const router = Router();
router.get('/get-friends', async (req: Request, res: Response) => {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed", status: 405 });
    try {
        //get the user from the session
        const user = req.session.user;
        if(!user) return res.status(401).json({ message: "Unauthorized", status: 401 });

        const client = await conn();
        const db = client.db("solace");
        const collection = await db.collection("users");

        const friends = await collection.aggregate([
            { $match: { email: user.email } },

            // Unwind the friends array to perform a lookup for each friend
            { $unwind: "$friends" },

            // Lookup operation to fetch details of each friend
            {
                $lookup: {
                    from: "users", // Name of the collection to perform the lookup
                    localField: "friends._id", // Field from the current collection (users)
                    foreignField: "_id", // Field from the joined collection (users)
                    as: "friendsDetails" // Name of the field to store the joined documents
                }
            },
            {
                $unwind: "$friendsDetails"
            },
            {
                $project: {
                    _id: "$friendsDetails._id",
                    name: "$friendsDetails.name",
                    email: "$friendsDetails.email",
                    roomId : "$friends.roomId",
                    isLive: "$friendsDetails.isLive",
                }
            }
        ]).toArray();

        //now for each friend, get the last message and unread count
        for (let i = 0; i < friends.length; i++) {
            const friend = friends[i];
            const chatCollection = db.collection("chat");
            const lastMessage = await chatCollection.find({ roomId: friend.roomId },{$project : {
                message : 1,
                senderMail : 1,
                time : 1
            }}).sort({ time: -1 }).limit(1).toArray();
            const unreadCount = await chatCollection.countDocuments({ roomId: friend.roomId, receiverMail: user.email, status: { $ne: "11" } });
            friends[i] = { ...friend, lastMessage: lastMessage[0], unreadCount };
        }

        return res.status(200).json({ message: "Successful", friends: friends });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: (err as Error).message, status: 500 });
    }
});


//get previous messages of a chat room
router.post('/get-messages', async (req: Request, res: Response) => {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed", status: 405 });
    try {
        const roomId = req.body.roomId;
        if (!roomId) return res.status(400).json({ message: "Bad request", status: 400 });

        const number = req.body.number || 10;
        const client = await conn();
        const db = client.db("solace");
        const collection = db.collection("chat");

        //get last 10 messages of the chat room
        const messages = await collection.find({ roomId }).sort({ time: -1 }).limit(number).toArray();
        messages.reverse();

        return res.status(200).json({ message: "Successful", messages });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: (err as Error).message, status: 500 });
    }
});

module.exports = router;