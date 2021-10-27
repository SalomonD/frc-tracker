const {
    frcExerciseSchema,
    frcUserSchema,
    MONGOOSE
} = require('./schemas')

let UserFRC = MONGOOSE.model('UserFRC', frcUserSchema);
let ExerciseFRC = MONGOOSE.model('ExerciseFRC', frcExerciseSchema);

module.exports = {
    UserFRC,
    ExerciseFRC
}