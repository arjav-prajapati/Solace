
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.NODE_ENV_DB_HOST || "mongodb+srv://arjavprajapati12:2bEMUXKHs8qNo5N6@cluster0.tkx24ud.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const mongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function conn() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const receivedClient = await mongoClient.connect();
    // Send a ping to confirm a successful connection
    await mongoClient.db("solace").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    return mongoClient;
  } catch(err) {
    // Ensures that the client will close when you finish/error
    await mongoClient.close();
    return err;
  }
}

module.exports = conn;
