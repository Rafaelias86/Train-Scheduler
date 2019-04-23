$(document).ready(function(){
//  Initialize Firebase
var config = {
    apiKey: "AIzaSyDQB5EgfYNUK2rI9UoaCLP449VdJG74dKU",
    authDomain: "trainscheduleapp-1b524.firebaseapp.com",
    databaseURL: "https://trainscheduleapp-1b524.firebaseio.com",
    projectId: "trainscheduleapp-1b524",
    storageBucket: "trainscheduleapp-1b524.appspot.com",
    messagingSenderId: "1057647349298"
};

firebase.initializeApp(config);

var database = firebase.database();

// Button for adding Trains
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var firstTrain = moment($("#start-input").val().trim(), "HH:mm").format("X");
    var trainFrequency = $("#frequency-input").val().trim();
  
    // Creates local "temporary" object for holding employee data
    var newTrain = {
      name: trainName,
      destination: trainDestination,
      start: firstTrain,
      Frequency: trainFrequency
    };

    // Uploads employee data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.role);
  console.log(newTrain.start);
  console.log(newTrain.rate);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#name-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#frequency-input").val("");
});

//hasta aqui llegue 

    // Assumptions
var tFrequency = 3;

 // Time is 3:30 AM
 var firstTime = "03:30";

// First Time (pushed back 1 year to make sure it comes before current time)
var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
console.log(firstTimeConverted);
// Current Time
var currentTime = moment();
console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

// Difference between the times
var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
console.log("DIFFERENCE IN TIME: " + diffTime);

// Time apart (remainder)
var tRemainder = diffTime % tFrequency;
console.log(tRemainder);

// Minute Until Train
var tMinutesTillTrain = tFrequency - tRemainder;
console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

// Next Train
var nextTrain = moment().add(tMinutesTillTrain, "minutes");
console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


})

