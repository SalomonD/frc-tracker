const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser");
require('dotenv').config()

const {
    saveUser,
    getUsers,
    saveUserExercise,
    getUserExercises
} = require('./app');

app.use(cors());
app.use(bodyParser.urlencoded({extended: "false"}));
app.use(bodyParser.json());
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req, res, next) => {
    const {username} = req.body;
    saveUser(username, (err, data) => {
        if (err) return next(err);
        else {
            res.json({username: data.username, _id: data._id});
        }
    })
});

app.get('/api/users', (req, res, next) => {
    getUsers((err, data) => {
        if (err) return next(err);
        else {
            res.json(data);
        }
    })
});

app.post('/api/users/:_id/exercises', (req, res, next) => {
    const {_id} = req.params;
    const {description, duration, date}  = req.body
    saveUserExercise({
        _id, description, duration, date
    }, (err, data) => {
        if (err) return next(err);
        else {
            res.json(data);
        }
    });
});

app.get('/api/users/:_id/logs', (req, res, next) => {
    const {_id} = req.params;
    const  {from, to, limit} = req.query

    getUserExercises(_id, {from, to, limit}, (err, data) => {
        console.log("error: ", err)
        if (err) return next(err);
        else {
            console.log("data: ", data)
            res.json(data);
        }
    });
});


const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})
