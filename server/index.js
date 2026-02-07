import express from 'express';
import pool from './db.js';
const app = express();
const port = 3000;
app.use(express.json());

app.get('/cards', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cards ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('DB error');
    }
})

app.get('/cards/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await pool.query('SELECT * FROM cards WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Card not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('DB error');
    }
})

app.post('/cards', async (req, res) => {
    
    if (!req.body.card || !req.body.type || !req.body.HP || !req.body.Rarity) {
        return res.status(400).send('Missing card data')
    }

    if (typeof req.body.card !== 'string' || typeof req.body.type !== 'string' || typeof req.body.Rarity !== 'string') {
        return res.status(400).send('Card, type, and Rarity must be strings')
    }

    if (typeof req.body.HP !== 'number' || req.body.HP <= 0) {
        return res.status(400).send('HP must be a positive number')
    }

    try {
        const result = await pool.query('INSERT INTO cards (card, type, HP, Rarity) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.body.card, req.body.type, req.body.HP, req.body.Rarity]
        );

        res.status(201).json(result.rows[0]);
        
    } catch (err) {
        console.error(err);
        return res.status(500).send('DB error');
    }
    
})

app.delete('/cards/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await pool.query('DELETE FROM cards WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
        return res.status(404).send('Card not found');
    }
    return res.status(204).send();
})

app.put('/cards/:id', async (req, res) => {
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
    const result = await pool.query('UPDATE cards SET card = $1, type = $2, HP = $3, Rarity = $4 WHERE id = $5 RETURNING *',
        [req.body.card, req.body.type, req.body.HP, req.body.Rarity, id]
    );

    if (result.rows.length > 0) {
        return res.json(result.rows[0]);
    }

    return res.status(404).send('Card not found');
})

app.patch('/cards/:id', async (req, res) => {   
    const id = parseInt(req.params.id);
    const updates = [];
    const values = [];
    let index = 1;

    if (Object.hasOwn(req.body, 'card')) {
        if (typeof req.body.card !== 'string' || req.body.card.trim() === '') {
            return res.status(400).send('Card must be a string and cannot be empty')
        }

        updates.push(`card = $${index++}`);
        values.push(req.body.card);
    }

    if (Object.hasOwn(req.body, 'type')) {
        if (typeof req.body.type !== 'string' || req.body.type.trim() === '') {
            return res.status(400).send('Type must be a string')
        }

        updates.push(`type = $${index++}`);
        values.push(req.body.type);
    }

    if (Object.hasOwn(req.body, 'HP')) {
        if (typeof req.body.HP !== 'number' || req.body.HP <= 0) {
            return res.status(400).send('HP must be a positive number')
        }

        updates.push(`HP = $${index++}`);
        values.push(req.body.HP);
    }

    if (Object.hasOwn(req.body, 'Rarity')) {
        if (typeof req.body.Rarity !== 'string' || req.body.Rarity.trim() === '') {
            return res.status(400).send('Rarity must be a string')
        }

        updates.push(`Rarity = $${index++}`);
        values.push(req.body.Rarity);
    }

    if (updates.length === 0) {
        return res.status(400).send('No valid fields to update');
    }

    values.push(id);

    try {
        const result = await pool.query(
            `UPDATE cards SET ${updates.join(', ')} WHERE id = $${index} RETURNING *`,
            values
        );

        if (result.rows.length > 0) {
            return res.json(result.rows[0]);
        }

        return res.status(404).send('Card not found');

    } catch (err) {
        console.error(err);
        res.status(500).send('DB error');
    }
})

app.listen(port, () => {
    console.log("Server is now running on port " + port + " :-)")
})
