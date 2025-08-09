const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(express.json());

app.use(cors());

app.get('/', (req, res) => {
    res.send('Flashcard backend is running!');
});

app.get('/api/cards', (req, res) => {
    const cards = fs.readFileSync('./flashcards.json', 'utf-8');
    res.json(JSON.parse(cards));
})

app.post('/api/cards', (req, res) => {
    const newFlashcards = req.body;
    fs.writeFileSync('./flashcards.json', JSON.stringify(newFlashcards, null, 2));
    res.status(201).send('Cards saved successfully!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});