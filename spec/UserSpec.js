/*import * as firebase from "firebase/app";
import { Mock } from "firebase-nightlight";*/
const firebaseNightlight = require("firebase-nightlight");
const mock = new firebaseNightlight.Mock();
const Classes = require("../Classes.js"); 
let mockApp;

describe("User", function() {
	it("should be able to create a new user, but not able to create another w/ same user id",
		function(done) {
			Classes.User.createUser(mockApp, "12345", "Michael", "Scarn", "blah@gmail.com", new Date(),
			"teacher", {"classList": [], "teacherDesc": undefined}).then(
				function (result) {
				expect(result).toBe(true);
			}).then(
				function(result) {
				Classes.User.createUser(
					mockApp, "12345", "Michael", "Scott", "mscott6@wisc.edu", new Date(),
					"student", {"classId": undefined, "gradeLevel": 2}).then(
						function(result) {
							expect(result).toBe(false);
							done();
						});
				}
			);
		}
	);

	it("should not be able to add a user w/ same uid as another user to the database", 
		function(done) {
			Classes.User.createUser(
				mockApp, "afisk", "Michael", "Scott", "mscott6@wisc.edu", "student",
					{"classId": undefined, "gradeLevel": 3}).then(
					function(result) {
						expect(result).toBe(false);
						done();
					});
		}
	);

	it("should be able to read an existing user from the database",
		function(done) {
			Classes.User.readUserData(mockApp, "afisk").then(
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
	);

	

	beforeEach(function() {	
		testDB = {
		content: {
			"users" : {
					"E6NwApIZTdMx63GYxU3XTHI6OUU2" : {
					"email" : "mscott6@wisc.edu",
					"firstName" : "Michael",
					"surName" : "Scott",
					"timeStamp" : "Tue, 27 Mar 2018 15:16:00 GMT",
					"type" : "student",
					"student" : {
						"classId" : undefined,
						"gradeLevel" : 3
					}
				},
					"afisk" : {
					"email" : "the_real_fisk@wisc.edu",
					"firstName" : "Austin",
					"surName" : "Fisk",
					"timeStamp" : "Tue, 27 Mar 2018 15:16:00 GMT",
					"type" : "student",
					"student" : {
						"classId" : "12345",
						"gradeLevel" : 4
					}
				},
					"mscott" : {
					"email" : "mscott4@wisc.edu",
					"firstName" : "Michael",
					"surName" : "Scott",
					"timeStamp" : "Tue, 27 Mar 2018 15:16:00 GMT",
					"type" : "student",
					"student" : {
						"classId" : "34412",
						"gradeLevel" : 5
					}
				},
					"mscott1" : {
					"email" : "mscott5@wisc.edu",
					"firstName" : "Michael",
					"surName" : "Scott",
					"timeStamp" : "Tue, 27 Mar 2018 15:16:00 GMT",
					"type" : "student",
					"student" : {
						"classId" : "12312",
						"gradeLevel" : 2
					}
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
