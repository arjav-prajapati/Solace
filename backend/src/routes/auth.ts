import { Router } from "express";
import { z } from "zod";
const conn = require("../db.ts");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import { Request, Response } from "express";

declare module 'express-session' {
        interface SessionData {
                user: { email: string, name: string};
                token: string;
        }
}

const router = Router();

router.post("/login", async (req: Request, res: Response<any>) => {
        try {
                const client = await conn();

                if (!req.body) {
                        return res.status(400).json({ success: false, message: "Invalid request!", status: 400 });
                }

                if (req.method !== "POST") {
                        return res.status(405).json({ success: false, message: "Method not allowed!", status: 405 });
                }

                const { email, password } = req.body;

                // now validate the email and password with zod
                const zodSchema = z.object({
                        email: z.string({ required_error: "Email is required!" }).email({ message: "Invalid email" }),
                        password: z.string({ required_error: "Password is required!" }).min(8, { message: "Password must be atleast 8 characters long" })
                });

                const validation = zodSchema.safeParse({ email, password });

                if (!validation.success) {
                        return res.status(400).json({ success: false, message: validation.error.issues[0].message, field: validation.error.issues[0].path[0], status: 400 });
                }

                // check if the user exists
                const userCollection = await client.db("solace").collection("users");
                const user = await userCollection.findOne({ email });

                if (!user) {
                        return res.status(400).json({ success: false, message: "User does not exist!", status: 400 });
                }

                // compare the password
                const isPasswordCorrect = await bcrypt.compare(password, user.password);

                if (!isPasswordCorrect) {
                        return res.status(400).json({ success: false, message: "Invalid password!", status: 400 });
                }

                await userCollection.updateOne({ email }, { $set: { isLive: true } });

                // generate jwt token
                const token = jwt.sign({
                        email: user.email,
                        name: user.name
                }, process.env.NODE_ENV_JWT_SECRET, { expiresIn: "7d" });

                req.session.user = { email: user.email, name: user.name };
                req.session.token = token;
                console.log("sessionid" ,req.session.id);
                req.session.save(()=>{console.log('session stored')});
                console.log(req.session.id);

                return res.status(200).json({ success: true, message: "User logged in successfully!", status: 200, user: { email: user.email, name: user.name }});

        } catch (err) {
                console.log(err);
                res.status(500).json({ success: false, message: "Internal server error!", status: 500 });
        }
});


router.post("/register", async (req, res) => {
        if (!req.body) {
                return res.status(400).json({ success: false, message: "Invalid request!", status: 400 });
        }

        if (req.method !== "POST") {
                return res.status(405).json({ success: false, message: "Method not allowed!", status: 405 });
        }

        try {

                const { email, password, name } = req.body;
                const client = await conn();

                // now validate the email and password and name with zod
                const zodSchema = z.object({
                        email: z.string({ required_error: "Email is required!" }).email({ message: "Invalid email" }),
                        password: z.string({ required_error: "Password is required!" }).min(8, { message: "Password must be atleast 8 characters long" }),
                        name: z.string({ required_error: "Name is required!" }).min(3, { message: "Name must be atleast 3 characters long" })
                });

                const validation = zodSchema.safeParse({ email, password, name });

                if (!validation.success) {
                        return res.status(400).json({ success: false, message: validation.error.issues[0].message, field: validation.error.issues[0].path[0], status: 400 });
                }


                // check if the user already exists
                const userCollection = await client.db("solace").collection("users");
                const user = await userCollection.findOne({ email });

                if (user) {
                        return res.status(400).json({ success: false, message: "User already exists!", status: 400 });
                }

                // hash the password with crypto
                const salt = process.env.NODE_ENV_HASH_SALT;

                const hashedPassword = await bcrypt.hash(password, salt);

                // insert the user into the database
                const result = await userCollection.insertOne({
                        email,
                        password: hashedPassword,
                        name,
                        friends: [],
                        createdAt: new Date(),
                        updatedAt: new Date()
                });
                // check if the user is inserted
                if (result.acknowledged){
                        console.log(result);
                        //generate jwt token
                        const token = jwt.sign({
                                email: email,
                                name: name
                        }, process.env.NODE_ENV_JWT_SECRET, { expiresIn: "7d" });
        
                        req.session.user = { email, name };
                        req.session.token = token;
                        req.session.save(()=>{
                                console.log('session stored')
                        })
        
                        return res.status(200).json({ success: true, message: "User logged in successfully!", status: 200, user :{email , name} });
                }
                else
                        return res.status(500).json({ success: false, message: "Internal server error!", status: 500 });

        }
        catch (err) {
                console.log(err);
                res.status(500).json({ success: false, message: "Internal server error!", status: 500 });
        }
});


// get the user
router.get("/user", async (req, res) => {
        console.log(req.sessionID);
        if (!req.session.user) {
                return res.status(401).json({ success: false, message: "Unauthorized!", status: 401 });
        }

        return res.status(200).json({ success: true, message: "User found!", status: 200, user: req.session.user });
});

module.exports = router;