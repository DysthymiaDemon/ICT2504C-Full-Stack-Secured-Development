const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
const port = Number(process.env.APP_PORT) || 3001;
const allowedOrigins = [clientUrl];

if (clientUrl.includes('localhost')) {
    allowedOrigins.push(clientUrl.replace('localhost', '127.0.0.1'));
} else if (clientUrl.includes('127.0.0.1')) {
    allowedOrigins.push(clientUrl.replace('127.0.0.1', 'localhost'));
}

// Enable CORS
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error('Not allowed by CORS'));
    }
}));

// Routes
const eventRoute = require('./routes/event');
app.use("/event", eventRoute);
app.get('/', (req, res) => {
    res.json({
        message: 'Events API is running.',
        endpoints: ['/event', '/event/:id']
    });
});

// Start server
const db = require('./models');
db.sequelize.sync({ alter: false })
    .then(() => {
        app.listen(port, () => {
            console.log(`⚡ Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
