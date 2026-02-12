const express = require('express');

const app = express();

// Simple Route
app.get('/', (req, res) => {
    res.send('Welcome to the learning space.');
});

let port = 3001;
app.listen(port, () => {
    console.log('Server running on http://localhost:' + port);
});
