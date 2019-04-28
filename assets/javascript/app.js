$(document).ready(function(){
  
  //Function to dsiplay the clock 
  
  function updateClock() {

    var clock = moment().format("HH:mm:ss");
    var c = $("<h4>");
    var c2 = c.append(clock);
    $("#clock").html(c2);
      
      //reload the whole page every 60 seconds
      //setTimeout(function () { location.reload(1); }, 60000);
      //or
      // Get current time in seconds
    //   var currentTimeSec = moment();
    //   // console.log("Current Time in seconds:" + moment(currentTimeSec).format("ss"));
    //   if(moment(currentTimeSec).format("ss")==00)
    //   {
    //     // When current seconds=00
    //       location.reload();
    //   }
    // };
  }
    setInterval(updateClock, 1000);
  
  
  
  
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
      frequency: trainFrequency
    };

    // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.start);
  console.log(newTrain.frequency);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#name-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#frequency-input").val("");
});

// Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var firstTrain= childSnapshot.val().start;
    var trainFrequency= childSnapshot.val().frequency;

    console.log(trainName);
    console.log(trainDestination);
    console.log(firstTrain);
    console.log(trainFrequency);

    function initialDatabasePull(){
      database.ref().on("value", function(snapshot){
            var trains = snapshot.val();

            //console.log(trains);

            $("#train-schedule-body").empty();

            for (var index in trains){
              trainName = trains[index].trainName
              trainDestination  = trains[index].trainDestination
              trainFrequency = trains[index].trainFrequency
              nextTrain = trains[index].nextTrain
              tMinutesTillTrain =trains[index].tMinutesTillTrain
              // console.log(trainName,traindestination, trainFrquency....)
              nextArrival();
              minutesLeft();
              updateTrainScheduleTable();
            }
      })    
    }

//Calculate minutes until next train

  // Assumptions
//var trainFrequency = 3;

 // Time is 3:30 AM
 //var firstTime = "03:30";

var firstTrainPretty = moment.unix(firstTrain).format("HH:mm");


  // Next Train
function  nextArrival(){
  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
  // console.log(firstTimeConverted);
  //Get the current time
  var currentTime = moment();
  // console.log(moment(currentTime).format("HH:mm"));
  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  // console.log(diffTime);
  // Time apart (remainder)
  var tRemainder = diffTime % trainFrequency;
  // console.log(tRemainder);
  // Minute Until Train
  
  // console.log(tMinutesTillTrain);
  //Next Train
  nextTrain = moment().add(tMinutesTillTrain, 'minutes');
  nextTrain = moment(nextTrain).format('h:mm A');
}

function  minutesLeft(){
  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
  // console.log(firstTimeConverted);
  //Get the current time
  var currentTime = moment();
  // console.log(moment(currentTime).format("HH:mm"));
  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  // console.log(diffTime);
  // Time apart (remainder)
  var tRemainder = diffTime % trainFrequency;
  // console.log(tRemainder);
  //minutes until train
  minutesAway = trainFrequency - tRemainder;
  minutesAway = moment().startOf('day').add(minutesAway, 'minutes').format('HH:mm');
  return moment(minutesAway).format('HH:mm');
}

var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
var tRemainder = diffTime % trainFrequency;
var tMinutesTillTrain = trainFrequency - tRemainder;
var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("HH:mm");
  // console.log(moment(nextTrain).format("HH:mm"));



function convertFrequency() {
  trainFrequency = moment().startOf('day').add(trainFrequency, 'minutes').format('HH:mm');
}
// console.log(convertFrequency);

function updateTrainScheduleTable() {
  convertFrequency();
  $('#train-schedule-body').append(
    '<tr>'+
      
      '<td>' + trainName+ '</td>' +
      '<td>' + trainDestination + '</td>' +
      '<td>' + trainFrequency + '</td>' +
      '<td>' + nextTrain + '</td>' +
      '<td>' + minutesAway + '</td>' +
  '</tr>'
  );

  }
  initialDatabasePull();
  setInterval(initialDatabasePull, 60000);



var newRow = $("<tr>").append(
  $("<td>").text(trainName),
  $("<td>").text(trainDestination),
  $("<td>").text(firstTrainPretty),
  $("<td>").text(nextTrain),
  $("<td>").text(tMinutesTillTrain),
);

// Append the new row to the table
$("#train-table > tbody").append(newRow);

})

});