const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    correct: {
        type: String,
        required: true
    },
    wrong: {
        type: [String],
        required: true
    }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;