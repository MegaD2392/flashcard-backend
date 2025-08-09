const express = require('express');
const fs = require('fs');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const PORT = 3000;

app.use(express.json());

app.use(cors());

const uri = "mongodb+srv://Tenny:Fub3llVwP6geIXSn@cluster0.as3tn4s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

let db;
let flashcardsCollection;

async function connectToDb() {
    try {
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        await client.connect();
        db = client.db("flashcard_app_db");
        flashcardsCollection = db.collection("flashcards");
        console.log("Successfully connected to MongoDB!");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
}

app.get('/', (req, res) => {
    res.send('Flashcard backend is running!');
});

app.get('/api/cards', async (req, res) => {
    try {
        const cards = await flashcardsCollection.find({}).toArray();
        res.json(cards);
    } catch (error) {
        console.error("Error fetching cards:", error);
        res.status(500).send("Failed to fetch cards.");
    }
});

app.post('/api/cards', async (req, res) => {
    try {
        const newFlashcards = req.body;
        await flashcardsCollection.deleteMany({});
        if (newFlashcards.length > 0) {
            await flashcardsCollection.insertMany(newFlashcards);
        }
        
        res.status(201).send('Cards saved successfully to MongoDB!');
    } catch (error) {
        console.error("Error saving cards:", error);
        res.status(500).send("Failed to save cards.");
    }
});

app.listen(PORT, async () => {
    await connectToDb();
    console.log(`Server is running on http://localhost:${PORT}`);
});