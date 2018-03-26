var NOT_TESTING = false;

class userTests {
    constructor() {
        writeUserData("mscott", "Michael", "Scott", "mscott4@wisc.edu", "student",
            NOT_TESTING);
        writeUserData("afisk", "Austin", "Fisk", "the_real_fisk@wisc.edu", 
            "student", NOT_TESTING);
        readUserData("mscott", function(snapshot) {
            var userEmail = (snapshot.val() && snapshot.val().email) || 
                'User not found';
            display(userEmail);
        }, NOT_TESTING);
        createUser("mscott", "Michael", "Scott", "mscott4@wisc.edu", "student", 
            function (err) {
            display(err);
        }, NOT_TESTING);
        createUser("mscott1", "Michael", "Scott", "mscott5@wisc.edu", "student", 
            function(err) {
            display(err);
        }, NOT_TESTING);
        createUser(firebase.auth().currentUser.uid, "Michael", "Scott", 
            "mscott6@wisc.edu", "student", function(err) {
            display(err);
        }, NOT_TESTING);
    }
}

function display(data) {
    $("#output").append("<p>" + data + "</p>");
}

$(document).ready(function () {
    // user tests
    $.getScript('/userModel.js', function() {
        var usertests = new userTests();
    });
})