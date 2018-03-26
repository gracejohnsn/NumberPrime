/*import * as firebase from "firebase/app";
import { Mock } from "firebase-nightlight";*/
const firebaseNightlight = require("firebase-nightlight");
const mock = new firebaseNightlight.Mock();
const User = require("../../Classes.js"); 
var mockApp;

describe("User", function() {
	it("should be able to create a new user",
		function(done) {
			User.createUser(
				mockApp, "12345", "Michael", "Scarn", "blah@gmail.com", "teacher").then(
					function (result) {
					expect(result).toBe(true);
					done();
			});
		}
	);
	it("should not be able to add a user w/ same uid as another user to the database", 
		function(done) {
			User.createUser(
				mockApp, "afisk", "Michael", "Scott", "mscott6@wisc.edu", "student").then(
					function(result) {
						expect(result).toBe(false);
						done();
					});
		}
	);

	it("should be able to read an existing user from the database",
		function(done) {
			User.readUserData(mockApp, "afisk").then(
				function(result) {
					expect(result.email).toBe("the_real_fisk@wisc.edu");
					done();
				});
		}
	);

	beforeEach(function() {	
		testDB = {
		content: {
			"users" : {
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
