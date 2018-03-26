/*import * as firebase from "firebase/app";
import { Mock } from "firebase-nightlight";*/
const firebaseNightlight = require("firebase-nightlight");
const mock = new firebaseNightlight.Mock();
const User = require("../../Classes.js"); 

describe("A User", function() {
	
	it("should not be able to add a duplicate user to the database", 
		function() {
		
		expect(User.createUser(
			mockApp, "E6NwApIZTdMx63GYxU3XTHI6OUU2",
			"Michael", "Scott", "mscott6@wisc.edu", "student", function(err) {
				console.log(err);
				return undefined;
			})
		).not.toBeDefined();

	});

	beforeEach(function() {	
		testDB = {
		"test-users" : {
				"E6NwApIZTdMx63GYxU3XTHI6OUU2" : {
				"email" : "mscott6@wisc.edu",
				"firstName" : "Michael",
				"surName" : "Scott",
				"type" : "student"
			},
				"afisk" : {
				"email" : "the_real_fisk@wisc.edu",
				"firstName" : "Austin",
				"surName" : "Fisk",
				"type" : "student"
			},
				"mscott" : {
				"email" : "mscott4@wisc.edu",
				"firstName" : "Michael",
				"surName" : "Scott",
				"type" : "student"
			},
				"mscott1" : {
				"email" : "mscott5@wisc.edu",
				"firstName" : "Michael",
				"surName" : "Scott",
				"type" : "student"
			}
		}
		};
		
		const mock = new firebaseNightlight.Mock({
            database: testDB/*,
            identities: [{
                email: "alice@firebase.com",
                password: "wonderland"
            }]*/
		});
		
		mockApp = mock.initializeApp({});
		
	});


});
