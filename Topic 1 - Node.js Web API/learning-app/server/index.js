require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: process.env.CLIENT_URL,
    })
);

app.get('/', (req, res) => {
    res.send('Welcome to the learning space.');
});

const tutorialRoute = require('./routes/tutorial');
app.use('/tutorial', tutorialRoute);

let port = process.env.APP_PORT;
app.listen(port, () => {
    console.log('Server running on http://localhost:' + port);
});
