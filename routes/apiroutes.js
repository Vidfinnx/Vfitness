const db = require("../models");
const router = require("express").Router();


//get workouts data
router.get("/api/workouts", (req, res) => {

    db.Workout.find({}).then(dbWorkout => {
        console.log("+++++++++++++++++++");
        console.log("ALL WORKOUTS FOR LAST WORKOUT DISPLAY ROUTE");
        // console.log(dbWorkout);  
        console.log("+++++++++++++++++++");
         dbWorkout.forEach(workout => {
            //  console.log(workout);
             let total = 0;
             workout.exercises.forEach(e => {
                 total += e.duration;
                //  console.log(total);
            });
             workout.totalDuration = total;

         });

        res.json(dbWorkout);
    }).catch(err => {
        res.json(err);
    });
});

 // add exercise to your workout
 router.put("/api/workouts/:id", (req, res) => {
     console.log("+++++++++++++++++++");
     console.log("EXERCISE ADDED ROUTE");
     console.log(req.params);
     console.log("+++++++++++++++++++");
     console.log(req.body);
     
     db.Workout.findOneAndUpdate(
         { _id: req.params.id },
         {
            $inc: { totalDuration: req.body.duration },
            $push: { exercises: req.body }
         },
         {new: true }).then(dbWorkout => {
             res.json(dbWorkout);
         }).catch(err => {
             res.json(err);
         });

 });

//create new workout
 router.post("/api/workouts", ({ body }, res) => {
     console.log("+++++++++++++++++++");
     console.log("WORKOUT ADDED ROUTE");
     console.log("+++++++++++++++++++");
     db.Workout.create(body).then((dbWorkout => {
         res.json(dbWorkout);
     })).catch(err => {
         res.json(err);
     });
 });

 // get workout history
 router.get("/api/workouts/range", (req, res) => {

     db.Workout.find({},).sort({ day: 1 }).skip(3).limit(7).then(dbWorkout => {
         console.log("+++++++++++++++++++");
        console.log("ALL WORKOUTS DURATION CHART ROUTE");
         console.log(dbWorkout);
         console.log("+++++++++++++++++++");
         dbWorkout.forEach(workout => {
             var total = 0;
             workout.exercises.forEach(e => {
                 total += e.duration;
                //  console.log(workout.exercises);
             });
             workout.totalDuration = total;
         });

         res.json(dbWorkout);
     }).catch(err => {
         res.json(err);
     });

 });


module.exports = router;