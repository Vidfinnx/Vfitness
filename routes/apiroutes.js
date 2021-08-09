const db = require("../models/");
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
 router.get("/api/workouts/range", async (req, res) => {
     console.log("++++++++++++++");
     console.log("ALL WORKOUTS FOR CHART");
     console.log("++++++++++++++");
    try {
      const workouts = await db.Workout.aggregate([
        {
          $addFields: {
            totalDuration: { $sum: "$exercises.duration" },
          },
        },
      ])
        .sort({ day: -1 })
        .limit(7)
        .sort({ day: 1 });
      res.json(workouts);
    } catch (error) {
      res.json(error);
    }
  });


module.exports = router;