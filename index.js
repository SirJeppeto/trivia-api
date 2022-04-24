require('dotenv').config({silent: true});

const express = require('express');
const app = express();

const mongoose = require('mongoose');
const Score = require('./models/score');
const Question = require('./models/question');

const PORT = process.env.PORT;

const API_KEY = process.env.API_KEY;

const DB_NAME = process.env.DB_NAME;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

const dbConnect = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@trivia.q7o0m.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

app.use(express.json());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-api-key')
    next()
});

app.get('/', (req, res) => {
    res.send('Hello!');
});

app.get('/score', (req, res) => {
    Score.find().sort({ 'score': -1 })
        .then((result) => {
            res.send(result);
        })
        .catch((err) =>  {
            console.log(err);
        });
});

app.get('/score/:page', (req, res) => {
    Score.find().sort({ 'score': -1 }).skip(req.params.page * 10).limit(11)
        .then((result) => {
            res.send(result);
        })
        .catch((err) =>  {
            console.log(err);
        })
});

app.use((req, res, next) => {
    const apiKey = req.get('x-api-key');

    if (!apiKey || apiKey !== API_KEY) {
      res.status(401).json({ error: 'unauthorised' });
    } else {
      next();
    }
});

app.post('/score', (req, res) => {
    const score = new Score({...req.body});

    score.save()
        .then((result) => {
            res.send(result);
        })
        .catch((err) =>  {
            console.log(err);
        })
});

app.get('/question', (req, res) => {
    Question.find()
        .then((result) => {
            res.send(result);
        })
        .catch((err) =>  {
            console.log(err);
        })
});

app.get('/question/random', (req, res) => {
    Question.aggregate([{ $sample: {size: 10} }])
        .then((result) => {
            res.send(result);
        })
        .catch((err) =>  {
            console.log(err);
        })
});

app.get('/question/random/:size', (req, res) => {
    const size = parseInt(req.params.size);

    if(isNaN(size) || size <= 0) {
        res.status(400).json({ error: 'the last argument has to be a positive integer' });
        return;
    }
    
    Question.aggregate([{ $sample: {size} }])
        .then((result) => {
            res.send(result);
        })
        .catch((err) =>  {
            console.log(err);
        })
});

mongoose.connect(dbConnect, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        })
    })
    .catch((err) => {
        console.log(err);
    });