$(function() {
    $('#slider').rbtSlider({
  
        height: '100vh', 
      
        // displays dots pagination
        'dots': false,
      
        // displayes arrows navigation
        'arrows': false,
      
        // autoplay interval
        // 3 = 3 seconds
        'auto': 8
      
      });
})

// Initialize Firebase
var config = {
   apiKey: "AIzaSyBApaFM7giiJHaUClMM7uj31qR1f80RlLc",
   authDomain: "train-scheduler-docvvk.firebaseapp.com",
   databaseURL: "https://train-scheduler-docvvk.firebaseio.com",
   projectId: "train-scheduler-docvvk",
   storageBucket: "train-scheduler-docvvk.appspot.com",
   messagingSenderId: "999298774452"
};

firebase.initializeApp(config);

var trainData = firebase.database();

// on clicking submit button
$("#add-train-btn").on("click", function () { 
    
    // storing input values into variables
    var name = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#first-train").val().trim();
    var frequency = $("#frequency").val().trim();

    // train object to push into firebase database on click
    var train = {
        name: name,
        destination: destination,
        firstTrainTime: firstTrain,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    }
    console.log(train.name);
    console.log(train.destination);
    console.log(train.firstTrainTime);
    console.log(train.frequency);
    console.log(train.dateAdded);

    trainData.ref().push(train);

    // clear input values
    $("#train-name").val('');
    $("#destination").val('');
    $("#first-train").val('');
    $("#frequency").val('');

    return false;
})

// creating rest of thr variables
var difference;
var totalTrains;
var tFirstConverted;
var remainder;
var minsAway;
var nextArrival;

// retrieving train data from firebase database
trainData.ref().on('child_added', function(snapshot) {

    console.log(snapshot.val());

    var tName = snapshot.val().name;
    var tDes = snapshot.val().destination;
    var tFirst = snapshot.val().firstTrainTime;
    var tFre = snapshot.val().frequency;

    // converting the input time into hh:mm format
    tFirstConverted = moment(tFirst,'HH:mm');
    console.log(tFirstConverted);

    // difference between current time and converted time
    difference = moment().diff(moment(tFirstConverted), 'minutes');
    console.log(difference);

    remainder = difference % tFre;
    console.log(remainder);

    // minutes for the next train
    minsAway = tFre - remainder;
    console.log(minsAway);

    // next train is arriving at this time
    nextArrival = moment().add(minsAway, 'minutes').format('HH:mm');
    console.log(nextArrival);

    // creating new row in train table adding user data
    $("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" + tDes + "</td><td>" + tFre + "</td><td>" + nextArrival + "</td><td>" + minsAway + "</td></tr>");
})


    
      
    