import { Request, Response, Router } from "express";

const conn = require("../db.ts");
import crypto from "crypto";

const router = Router();

// get searched friends according to search query in url
router.get('/search-friends', async (req: Request, res: Response) => {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed", status: 405 });
    try {
        //get the user from the session
        const user = req.session.user;
        if (!user) return res.status(401).json({ message: "Unauthorized", status: 401 });

        const client = await conn();
        const db = client.db("solace");
        const collection = await db.collection("users");

        //get the search query from url
        const query = req.query.search as string;

        //search for friends by name or email
        const friends = await collection.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ],
            email: { $ne: user.email }
        }).toArray();
        const userId = await collection.findOne({ email: user.email }, { projection: { _id: 1 } });

        //check if the user is already friends with the searched user
        const friendsList = friends.map((friend: any) => {
            const isFriend = friend.friends.find((f: any) => f._id.toString() === userId._id.toString());
            return {
                _id: friend._id,
                name: friend.name,
                email: friend.email,
                isFriend: isFriend ? true : false
            };
        });


        return res.status(200).json({ message: "Successful", friends: friendsList === null || friendsList === undefined || friendsList.length === 0 ? [] : friendsList });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", status: 500 });
    }

});


router.post('/add-friend', async (req: Request, res: Response) => {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed", status: 405 });
    try {
        //get the user from the session
        const user = req.session.user;
        if (!user) return res.status(401).json({ message: "Unauthorized", status: 401 });

        const client = await conn();
        const db = client.db("solace");
        const collection = await db.collection("users");

        //get the friend email from the request body
        const { friendEmail } = req.body;

        //check if the friend exists
        const friend = await collection.findOne({ email: friendEmail });
        const userId = await collection.findOne({ email: user.email }, { projection: { _id: 1 } });
        // ...

        const generateId = crypto.randomBytes(16).toString("hex");

        await collection.updateOne({ email: user.email }, { $push: { friends: { _id: friend._id, roomId: generateId } } });

        // ...
        await collection.updateOne({ email: friendEmail }, { $push: { friends: { _id: userId._id, roomId: generateId } } });

        return res.status(200).json({ message: "Friend added successfully", status: 200 });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", status: 500 });
    }
});


// remove friend from the user's friend list
router.post('/remove-friend', async (req: Request, res: Response) => {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed", status: 405 });
    try {
        //get the user from the session
        const user = req.session.user;
        if (!user) return res.status(401).json({ message: "Unauthorized", status: 401 });

        const client = await conn();
        const db = client.db("solace");
        const collection = await db.collection("users");

        //get the friend email from the request body
        const { friendEmail } = req.body;

        //check if the friend exists
        const friend = await collection.findOne({ email: friendEmail });
        const userId = await collection.findOne({ email: user.email }, { projection: { _id: 1 } });

        //remove the friend from the user's friend list
        await collection.updateOne({ email: user.email }, { $pull: { friends: { _id: friend._id } } });

        //remove the user from the friend's friend list
        await collection.updateOne({ email: friendEmail }, { $pull: { friends: { _id: userId._id } } });

        return res.status(200).json({ message: "Friend removed successfully", status: 200 });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", status: 500 });
    }
});

module.exports = router;