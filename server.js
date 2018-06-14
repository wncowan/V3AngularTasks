//Import everything
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

//Express setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static( __dirname + '/angularTasksApp/dist/angularTasksApp' ));


//Mongoose setup
mongoose.connect('mongodb://localhost/new_task_api_db');
var Schema = mongoose.Schema;

var TaskSchema = new mongoose.Schema({
    title: {type: String},
    description: {type: String, default: ""},
    completed: {type: Boolean, default: false},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

mongoose.model('Task', TaskSchema);
var Task = mongoose.model('Task');

//Routes
//Index
app.get('/tasks/', function(req, res) {
    console.log("made it here!!!~~~")
    Task.find(function(err,tasks) {
        if(err) {
            res.json({
                message: "error",
                result: err
            });
        } else {
            res.json({tasks});
        }
    });
});
//Update
app.put('/tasks/:task', function(req,res) {
    console.log(req.params.task);
    Task.findByIdAndUpdate(req.params.task, req.body, function(err, task) {
        if (err) {
            res.json({
                message: "error",
                result: err
            });
        } else {
            res.json({
                message: "success",
                change: req.body
            });
        }
    });
});
//Show
app.get('/tasks/:task', function(req,res) {
    Task.findById(req.params.task, function(err, task) {
        if (err) {
            res.json({
                message: "error",
                result: err
            });
        } else {
            res.json(task);
        }
    });
});
//Create (only one instead of two because we have no form)
app.post('/tasks/', function(req,res) {
    var task = new Task(req.body);
    task.save(function(err, task) {
        if(err){
            res.json({
                message: "error",
                result: err
            });
        } else {
            res.json({
                message: 'Success',
                result: task
            });
        }
    })
});
//Delete
app.delete('/tasks/:task', function(req,res) {
    Task.findByIdAndRemove(req.params.task, function(err){
        if(err){
            res.json({
                message: "error",
                result: err
            });
        } else {
            res.json({message: "success"});
        }
    });
});


app.listen(8000, function() {
    console.log("listening on port 8000");
});