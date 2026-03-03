const express = require('express');
const yup = require('yup');
const { Tutorial } = require('../models');

const router = express.Router();

const tutorialSchema = yup.object({
  title: yup.string().trim().max(100).required(),
  description: yup.string().trim().required()
});

router.get('/', async (req, res) => {
  const tutorials = await Tutorial.findAll({ order: [['id', 'DESC']] });
  res.json(tutorials);
});

router.get('/:id', async (req, res) => {
  const tutorial = await Tutorial.findByPk(req.params.id);
  if (!tutorial) {
    return res.status(404).json({ message: 'Tutorial not found' });
  }
  return res.json(tutorial);
});

router.post('/', async (req, res) => {
  try {
    const data = await tutorialSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    const tutorial = await Tutorial.create(data);
    return res.status(201).json(tutorial);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ errors: err.errors });
    }
    return res.status(500).json({ message: 'Failed to create tutorial' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = await tutorialSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    const tutorial = await Tutorial.findByPk(req.params.id);
    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }
    await tutorial.update(data);
    return res.json(tutorial);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ errors: err.errors });
    }
    return res.status(500).json({ message: 'Failed to update tutorial' });
  }
});

router.delete('/:id', async (req, res) => {
  const tutorial = await Tutorial.findByPk(req.params.id);
  if (!tutorial) {
    return res.status(404).json({ message: 'Tutorial not found' });
  }
  await tutorial.destroy();
  return res.status(204).send();
});

module.exports = router;
