const express = require('express');
const router = express.Router();
const { Movie } = require('../models');
const { Op, fn, col, where } = require("sequelize");
const yup = require("yup");

function parseRating(value) {
    if (value === null || value === undefined || value === "") {
        return null;
    }
    return Number(value);
}

async function isDuplicateTitle(title, idToExclude = null) {
    let condition = {
        [Op.and]: [
            where(fn('lower', col('title')), title.toLowerCase())
        ]
    };

    if (idToExclude !== null) {
        condition.id = { [Op.ne]: idToExclude };
    }

    let existingMovie = await Movie.findOne({ where: condition });
    return !!existingMovie;
}

router.post("/", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        title: yup.string().trim().max(150).required(),
        synopsis: yup.string().trim().max(1500).required(),
        genre: yup.string().trim().max(150).required(),
        director: yup.string().trim().max(150).required(),
        releaseDate: yup.string().trim().required(),
        rating: yup.number().min(1).max(10).nullable()
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        data.rating = parseRating(data.rating);

        let duplicateTitle = await isDuplicateTitle(data.title);
        if (duplicateTitle) {
            res.status(400).json({ message: "A movie with the same title already exists. Please modify your submission." });
            return;
        }

        let result = await Movie.create(data);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;

    if (search) {
        condition[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { synopsis: { [Op.like]: `%${search}%` } }
        ];
    }

    let list = await Movie.findAll({
        where: condition,
        order: [['title', 'ASC']]
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let movie = await Movie.findByPk(id);
    // Check id not found
    if (!movie) {
        res.sendStatus(404);
        return;
    }
    res.json(movie);
});

router.put("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let movie = await Movie.findByPk(id);
    if (!movie) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        title: yup.string().trim().max(150),
        synopsis: yup.string().trim().max(1500),
        genre: yup.string().trim().max(150),
        director: yup.string().trim().max(150),
        releaseDate: yup.string().trim(),
        rating: yup.number().min(1).max(10).nullable()
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });

        if (Object.prototype.hasOwnProperty.call(data, "rating")) {
            data.rating = parseRating(data.rating);
        }

        if (data.title) {
            let duplicateTitle = await isDuplicateTitle(data.title, id);
            if (duplicateTitle) {
                res.status(400).json({ message: "A movie with the same title already exists. Please modify your submission." });
                return;
            }
        }

        let num = await Movie.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Movie was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update movie with id ${id}. Please check your submission.`
            });
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let movie = await Movie.findByPk(id);
    if (!movie) {
        res.sendStatus(404);
        return;
    }

    let num = await Movie.destroy({
        where: { id: id }
    });
    if (num == 1) {
        res.json({
            message: "Movie was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete movie with id ${id}. Please check your submission.`
        });
    }
});

module.exports = router;
