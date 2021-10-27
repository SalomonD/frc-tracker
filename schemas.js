const mongoose = require('mongoose');
const MONGO_URI = process.env['MONGO_URI'];

mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const {Schema} = mongoose;

const frcUserSchema = new Schema({
    username: {
        type: String,
        require: true
    },
    exercises: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExerciseFRC'
    }]
});

const frcExerciseSchema = new Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserFRC'
    },
    description: {
        type: String,
        require: true
    },
    duration: {
        type: Number,
        require: true
    },
    date: Date
});

module.exports = {
    frcUserSchema,
    frcExerciseSchema,
    MONGOOSE: mongoose
}