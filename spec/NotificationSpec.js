/*import * as firebase from "firebase/app";
import { Mock } from "firebase-nightlight";*/
//var firebaseNightlight = require("firebase-nightlight");
var mock = new firebaseNightlight.Mock();
//var Classes = require("../public/Classes.js"); 
//var testData = require("./testData.js");
var mockApp;

describe("Notification", function() {
	var date1;
	var date2;
	it("Should create a notification for afisk",
		function(done) {
			date1 = new Date();
			Notification.createNotification(mockApp, "afisk", "5698", "student", date1).then(
				function () {
					expect(true).toBe(true);
				}
			).then(
				function(result) {
					date2 = new Date();
					Notification.createNotification(mockApp, "afisk", "5699", "student", date2	).then(
						function(result) {
							expect(true).toBe(true);
						}
					);
				}
			).then(
				function(result) {
					Notification.readNotifications(mockApp, "afisk").then(
						function(result) {
							expect(result[0][0]).toBe("5678");
							expect(result[0][1]).toBe("Tue, 27 Mar 2018 15:16:00 GMT");
							expect(result[1][0]).toBe("5698");
							expect(result[1][1]).toBe(date1.toUTCString());
							expect(result[2][0]).toBe("5699");
							expect(result[2][1]).toBe(date2.toUTCString());
							expect(true).toBe(true);
							done();
						}
					)
				}
		);
		}
	);

	it("Should throw an error (when passing in student/non-existing student in)",
	function(done) {
		Notification.readNotifications(mockApp, "non-existant-MUAHAHAHA").then(
			function(result) { // this function should not execute
				expect(true).toBe(false);
				done();
			},
			function(err) { //No notifications for this user
				expect(err).toBe("notifications not found");
				done();
			});
		}
	);

	it("Should create a notification for all students in class:1234 (E6NwApIZTdMx63GYxU3XTHI6OUU2, mscott1)",
	function(done) {
		date1 = new Date();
		Notification.createNotification(mockApp, "1234", "5698", "class", date1).then(
			function () {
				expect(true).toBe(true);
			}
		).then(
			function(result) {
				Notification.readNotifications(mockApp, "E6NwApIZTdMx63GYxU3XTHI6OUU2").then(
					function(result){
						expect(result[0][0]).toBe("5698");
						expect(result[0][1]).toBe(date1.toUTCString());
					}
				);
				Notification.readNotifications(mockApp, "mscott1").then(
					function(result) {
						expect(result[0][0]).toBe("5698");
						expect(result[0][1]).toBe(date1.toUTCString());
						expect(true).toBe(true);
						done();
					},
					function(err){
						expect(true).toBe(false);
						done();
					}
				)
			}
	);
	}
);

	/*it("should not be able to add a user w/ same uid as another user to the database", 
		function(done) {
			User.createUser(
				mockApp, "afisk", "Michael", "Scott", "mscott6@wisc.edu", "student",
					{"classId": undefined, "gradeLevel": 3}).then(
					function(result) { // this should not execute
						expect(true).toBe(false);
						done();
					},
					function(err) {
						expect(err).toBe("user already exists");
						done();
					});
		}
	);

	it("should be able to read an existing user from the database",
		function(done) {
			User.readUserData(mockApp, "afisk").then(
				function(result) {
					expect(result.email).toBe("the_real_fisk@wisc.edu");
					expect(result.firstName).toBe("Austin");
					expect(result.surName).toBe("Fisk");
					expect(result.type).toBe("student");
					expect(result.student.classId).toBe("12345");
					expect(result.student.gradeLevel).toBe(4);
					done();
				});
		}
	);*/


	beforeEach(function() {	
		testDB = {
		content: testData
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