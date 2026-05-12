// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(5000, () => console.log('Backend running on port 5000'));
