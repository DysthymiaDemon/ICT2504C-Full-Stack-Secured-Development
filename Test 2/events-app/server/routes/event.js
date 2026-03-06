const express = require('express');
const router = express.Router();
const { Event } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");

router.post("/", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        name: yup.string().trim().max(80).required(),
        details: yup.string().trim().max(800),
        eventDate: yup.date().required(),
        location: yup.string().trim().max(200).required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        let result = await Event.create(data);
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
            { name: { [Op.like]: `%${search}%` } },
            { details: { [Op.like]: `%${search}%` } }
        ];
    }
    let minDate = req.query.minDate;
    let maxDate = req.query.maxDate;
    if (minDate && maxDate) {
        condition.eventDate = {
            [Op.between]: [minDate, maxDate]
        };
    }
    else if (minDate) {
        condition.eventDate = {
            [Op.gte]: minDate
        };
    }
    else if (maxDate) {
        condition.eventDate = {
            [Op.lte]: maxDate
        };
    }

    let list = await Event.findAll({
        where: condition,
        order: [['eventDate', 'ASC']]
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let event = await Event.findByPk(id);
    // Check id not found
    if (!event) {
        res.sendStatus(404);
        return;
    }
    res.json(event);
});

router.put("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let event = await Event.findByPk(id);
    if (!event) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        name: yup.string().trim().max(80),
        details: yup.string().trim().max(800),
        eventDate: yup.date(),
        location: yup.string().trim().max(200)
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        let num = await Event.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Event was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update event with id ${id}.`
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
    let event = await Event.findByPk(id);
    if (!event) {
        res.sendStatus(404);
        return;
    }

    let num = await Event.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Event was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete event with id ${id}.`
        });
    }
});

module.exports = router;