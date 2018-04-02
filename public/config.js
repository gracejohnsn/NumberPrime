//COnfiguration for the Oauth client additions


OD<script src="https://www.gstatic.com/firebasejs/4.12.0/firebase.js"></script>
<script>
  // Initialize Firebase
  // TODO: Replace with your project's customized code snippet
  var config = {
	apiKey: "AIzaSyD9YOF7QtGca_WDqjhcZmsz2q2nxp4UXXM",
	authDomain: "numberprime-b359d.firebaseapp.com",
	databaseURL: "https://numberprime-b359d.firebaseio.com",
	projectId: "numberprime-b359d",
	storageBucket: "numberprime-b359d.appspot.com",
	messagingSenderId: "820335136282"
  };
  firebase.initializeApp(config);

  //Create instance of a google authenticator
	var provider = new firebase.auth.GoogleAuthProvider();


</script>

