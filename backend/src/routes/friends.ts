import { Request, Response, Router } from "express";

const conn = require("../db.ts");

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
            ]
            ,
        }, { _id: 1, name: 1, email: 1, isLive: 1 }).toArray();

        return res.status(200).json({ message: "Successful", friends: friends });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", status: 500 });
    }

});


module.exports = router;