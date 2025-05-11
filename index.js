const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let proverbs = require('./proverbs.json');

//get all proverbs
app.get('/proverbs', (req, res) => {
const { category, search } = req.query;

let filtered = proverbs;

if (category) {
    filtered = filtered.filter(p => p.category === category);
}

if (search) {
    filtered = filtered.filter(p =>
      Object.values(p).some(val =>
        val.toLowerCase().includes(search.toLowerCase())
      )
    );
}
res.json(filtered);
});

//get Proverb by id
app.get('/proverbs/:id', (req, res) => {
  const proverb = proverbs.find(p => p.id == req.params.id);
  if (!proverb) return res.status(404).send('Not found');
  res.json(proverb);
});

//Add new proverb
app.post('/proverbs', (req, res) => {
  const newProverb = { id: Date.now(), ...req.body };
  proverbs.push(newProverb);
  res.status(201).json(newProverb);
});

//update Proverb
app.put('/proverbs/:id', (req, res) => {
  const index = proverbs.findIndex(p => p.id == req.params.id);
  if (index === -1) return res.status(404).send('Not found');
  proverbs[index] = { ...proverbs[index], ...req.body };
  res.json(proverbs[index]);
});

//Delet proverb
app.delete('/proverbs/:id', (req, res) => {
  proverbs = proverbs.filter(p => p.id != req.params.id);
  res.status(204).send();
});

//Random Proverb
app.get('/proverbs/random', (req, res) => {
  const random = proverbs[Math.floor(Math.random() * proverbs.length)];
  res.json(random);
});