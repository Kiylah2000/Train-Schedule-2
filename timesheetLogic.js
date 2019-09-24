
// 1. Initialize Firebase

var firebaseConfig = {
    apiKey: "AIzaSyBfqPJdTdHGtfy75jy_X3dnXKk7Ex16R9g",
    authDomain: "train-schedule-80296.firebaseapp.com",
    databaseURL: "https://train-schedule-80296.firebaseio.com",
    projectId: "train-schedule-80296",
    storageBucket: "",
    messagingSenderId: "188633435278",
    appId: "1:188633435278:web:2e09a5345f74002fb08ddf",
    measurementId: "G-LVX8HJ8PC1"
  };

firebase.initializeApp(firebaseConfig);

var database = firebase.database();


// 2. Button for adding trains
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Storing new data/Grabbing the user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
    var firstTrain = moment($("#first-train-input").val().trim(), "HH:mm").subtract(1, "years").format("X");

    // Creates local "temporary" object for holding train data
    var schedule = {

        trainName: trainName,
        destination: destination,
        frequency: frequency,
        firstTrain: firstTrain,

    };

    // Pushes data to database
    database.ref().push(schedule);

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#frequency-input").val("");
    $("#first-train-input").val("");

    alert("Train successfully added");

});

// 3. Create Firebase event for adding Trains to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var frequency = childSnapshot.val().frequency;
    var firstTrain = childSnapshot.val().firstTrain;


    // Logs everything to console
    console.log(trainName);
    console.log(destination);
    console.log(frequency);
    console.log(firstTrain);



    // Calculate the minutes until arrival using hardcore math
    var trainTime = moment.unix(firstTrain).format("hh:mm");
    var diffTime = moment().diff(moment(trainTime), "minutes");


    //time apart(remainder)
    var tRemainder = diffTime % frequency;
    var minutesAway = frequency - tRemainder;

   //next arrival time
		var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm A");


    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(minutesAway),
        $("<td>").text(nextArrival),

    );


    // Append the new row to the table
    $("#train-table > tbody").append(newRow);

});
