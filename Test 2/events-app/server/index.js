const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
const port = Number(process.env.APP_PORT) || 3001;

// Enable CORS
app.use(cors({
    origin: clientUrl
}));

// Routes
const eventRoute = require('./routes/event');
app.use("/event", eventRoute);

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
