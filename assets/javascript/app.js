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
      var currentTimeSec = moment();
      // console.log("Current Time in seconds:" + moment(currentTimeSec).format("ss"));
      if(moment(currentTimeSec).format("ss")==00)
      {
        // When current seconds=00
          location.reload();
      }
    };
  
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
   
    var firstTrainPretty = moment.unix(firstTrain).format("HH:mm");
    console.log(firstTrainPretty)
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
    // console.log(firstTimeConverted);
    //Get the current time
    var currentTime = moment();
     console.log(moment(currentTime).format("HH:mm"));
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // console.log(diffTime);
    // Time apart (remainder)
    var tRemainder = diffTime % trainFrequency;
     console.log(tRemainder);
    // Minute Until Train
    var tMinutesTillTrain = trainFrequency - tRemainder;
    console.log(tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm");
    console.log(moment(nextTrain).format("hh:mm"));
      
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDestination),
      $("<td>").text(trainFrequency),
      $("<td>").text(nextTrain),
      $("<td>").text(tMinutesTillTrain),
      $("<td><button class='btn btn-default btn-primary delete-train'keyD='" + childSnapshot.key + "'  id='delete-train'><i class='fa fa-trash'></i> Remove </button></td>"),
    );
    
    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
    //
    //Delete rows
    $(".delete-train").on("click", function (event) {
      keyref = $(this).attr("keyD");
      database.ref().child(keyref).remove();
      window.location.reload();
    })

    });
});

