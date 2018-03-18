$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyD9YOF7QtGca_WDqjhcZmsz2q2nxp4UXXM",
        authDomain: "numberprime-b359d.firebaseapp.com",
        databaseURL: "https://numberprime-b359d.firebaseio.com",
        projectId: "numberprime-b359d",
        storageBucket: "numberprime-b359d.appspot.com",
        messagingSenderId: "820335136282"
    };
    firebase.initializeApp(config);

    // authentication logic
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("user is logged in!");
            console.log(user);
            alert("Hello " + user.displayName + "! How are you doing?")
        } else {
            firebase.auth().signInWithRedirect(provider);
            firebase.auth().getRedirectResult().then(function(result) {
                if (result.credential) {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    var token = result.credential.accessToken;
                    console.log(token);
                    // ...
                }
                // The signed-in user info.
                var user = result.user;
            }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
        });
        }
    });    
})