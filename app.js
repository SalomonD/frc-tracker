const {
    UserFRC,
    ExerciseFRC
} = require('./models');

const saveUser = (username, done) => {
    UserFRC.findOne({
        username: username
    }, (findErr, data) => {
        if (findErr) done(findErr);
        else {
            if (data) done(null, data);
            else {
                const user = new UserFRC({username});
                user.save((saveErr, userSaved) => {
                    if (saveErr) done(saveErr);
                    else done(null, userSaved)
                })
            }
        }
    })
};

const getUsers = (done) => {
    let usersToReturn = [];
    UserFRC.find((err, users) => {
        if (err) done(err);
        else {
            for (let u of users) {
                usersToReturn.push({
                    username: u.username,
                    _id: u._id
                });
            }
            done(null, usersToReturn);
        }
    });
};

const saveUserExercise = (exercise, done) => {
    UserFRC.findById(exercise._id, (findUserErr, user) => {
        if (findUserErr) done(findUserErr);
        else {
            let d;
            if (exercise.date) {
                d = (new Date(exercise.date)).toString() !== "Invalid Date" ? new Date(exercise.date) : null;
                if (!d) {
                    return done({message: "Invalid Date"});
                }
            } else {
                d = new Date();
            }

            const e = new ExerciseFRC({
                description: exercise.description,
                duration: exercise.duration,
                date: d,
                user: user
            });

            e.save((saveExErr, ex) => {
                if (saveExErr) done(saveExErr);
                else {
                    user.exercises.push(ex);
                    user.save((saveUserErr, newUser) => {
                        if (saveUserErr) done(saveUserErr);
                        else done(null, {
                            _id: user._id,
                            username: user.username,
                            description: ex.description,
                            duration: ex.duration,
                            date: ex.date.toDateString()
                        });
                    });
                }
            });
        }
    });
};

const getUserExercises = (_id, options, done) => {
    let query = UserFRC.findById(_id);
    let limit;
    if (options.from) {
        let fromDate = (new Date(options.from)).toString() !== "Invalid Date" ? new Date(options.from) : null;
        if (fromDate) {
            query.where({
                date: {"$gte": fromDate}
            })
        } else return done({message: "Invalid from date"})
    }

    if (options.to) {
        let toDate = (new Date(options.to)).toString() !== "Invalid Date" ? new Date(options.to) : null;
        if (toDate) {
            query.where({
                date: {"$lte": toDate}
            });
        } else return done({message: "Invalid to date"});
    }

    if (options.limit) {
        console.log("ici")
        if (Number.isInteger(+options.limit)) {
            limit = +(options.limit);
        } else done({message: "Invalid limit"})
    }



    query.populate("exercises")
        .exec((findUserErr, user) => {
        if (findUserErr) return done(findUserErr);
        else {
            let data = {
                _id: user._id,
                username: user.username,
                count: user.exercises.length
            };

            let log = [];
            for (let ex of user.exercises) {
                log.push({
                    description: ex.description,
                    duration: ex.duration,
                    date: ex.date.toDateString()
                })
            }

            if (limit){
                data.log = log.slice(0, limit   )
                data.count = limit;
            } else {
                data.log = log;
            }
            console.log("les data: ", data)

            done(null, data);
        }
    });
};

module.exports = {
    saveUser,
    getUsers,
    saveUserExercise,
    getUserExercises
}