const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

const cards = [
    {"card": "Pikachu", "id": 1, "type": "Electric", "HP": 60, "Rarity": "SIR"},
    {"card": "Charizard", "id": 2, "type": "Fire", "HP": 150, "Rarity": "IR"},
    {"card": "Bulbasaur", "id": 3, "type": "Grass", "HP": 45, "Rarity": "Full Art"},
    {"card": "Squirtle", "id": 4, "type": "Water", "HP": 50, "Rarity": "Holo"},
];

app.get('/cards', (req, res) => {
    res.json(cards)
})

app.get('/cards/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const card = cards.find(card => card.id === id);
    if (card) {
        res.json(card);
    } else {
        res.status(404).send('Card not found');
    }
})

app.post('/cards', (req, res) => {
    if (!req.body.card || !req.body.type || !req.body.HP || !req.body.Rarity) {
        return res.status(400).send('Missing card data')
    }
    const newCard = {
        id: cards.length + 1,
        card: req.body.card,
        type: req.body.type,
        HP: req.body.HP,
        Rarity: req.body.Rarity
    }
    cards.push(newCard);
    res.status(201).json(newCard);
})

app.delete('/cards/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = cards.findIndex(card => card.id === id);
    if (index !== -1) {
        cards.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Card not found');
    }
})

app.put('/cards/:id', (req, res) => {
    if (!req.body.card || !req.body.type || !req.body.HP || !req.body.Rarity) {
        return res.status(400).send('Missing card data')
    } 
    if (typeof req.body.HP !== 'number' || req.body.HP <= 0) {
        return res.status(400).send('HP must be a positive number')
    }
    if (typeof req.body.card !== 'string' || typeof req.body.type !== 'string' || typeof req.body.Rarity !== 'string') {
        return res.status(400).send('Card, type, and Rarity must be strings')
    }
    const id = parseInt(req.params.id);
    const index = cards.findIndex(card => card.id === id);
    if (index !== -1) {
        cards[index] = {
            id: id,
            card: req.body.card,
            type: req.body.type,
            HP: req.body.HP,
            Rarity: req.body.Rarity
        }
        return res.json(cards[index]);
    }
    return res.status(404).send('Card not found');
})

app.patch('/cards/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = cards.findIndex(card => card.id === id);
    if (index !== -1) {
        const card = cards[index];
        const updatedCard = Object.assign(card, req.body);
        cards[index] = updatedCard;
        res.json(cards[index]);
    } else {
        res.status(404).send('Card not found');
    }
})

app.listen(port, () => {
    console.log("Server is now running on port " + port + " :-)")
})
