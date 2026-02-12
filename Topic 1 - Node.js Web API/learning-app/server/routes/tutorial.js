const express = require('express');

const router = express.Router();
const tutorialList = [];

router.post('/', (req, res) => {
    const data = req.body;
    tutorialList.push(data);
    res.json(data);
});

router.get('/', (req, res) => {
    res.json(tutorialList);
});

module.exports = router;
