/*import * as firebase from "firebase/app";
import { Mock } from "firebase-nightlight";*/
const firebaseNightlight = require("firebase-nightlight");
const mock = new firebaseNightlight.Mock();
const Classes = require("../Classes.js"); 
const testData = require("./testData.js");
let mockApp;

describe("User", function() {
	it("should be able to create a new user, but not able to create another w/ same user id",
		function(done) {
			Classes.User.createUser(mockApp, "12345", "Michael", "Scarn", "blah@gmail.com", new Date(),
			"teacher", {"classList": [], "teacherDesc": undefined}).then(
				function () { // just need this function to be executed
					expect(true).toBe(true);
			}).then(
				function(result) {
				Classes.User.createUser(
					mockApp, "12345", "Michael", "Scott", "mscott6@wisc.edu", new Date(),
					"student", {"classId": undefined, "gradeLevel": 2}).then(
						function(result) { // this function should not execute
							expect(true).toBe(false);
							done();
						},
						function(err) { // couldn't add existing user
							expect(err).toBe("user already exists");
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

	it("should throw an error if queried for a non-existent userId",
		function(done) {
			Classes.User.readUserData(mockApp, "asdfasdf").then(
				function(result) { // shouldn't run this
					expect(true).toBe(false);
					done();
				},
				function(err) { // should error out
					expect(err).toBe("user does not exist");
					done();
				}
			);
		});

	it("should not be able to writeUserData without proper credentials");

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

describe("Student", function() {
	it("should be able to generate a time-sensitive, unique hash", 
		function(done) {
			Classes.Student.generateHash(mockApp, "afisk", new Date()).then(
				function(result) {
					expect(result).toBeDefined();
					done();
			});
	});

	it("should throw an error if asked to make a hash for a non-existent student", 
		function(done) {
			Classes.Student.generateHash(mockApp, "saddfasdfad", new Date()).then(
				function(result) { // shouldn't reach here
					expect(true).toBe(false);
					done();
				},
				function(err) {
					expect(err).toBe("cannot make a hash for a non-existent student");
					done();
				}
			);
	});

	it("should throw an error if asked to make a hash for a non-student user",
		function(done) {
			Classes.Student.generateHash(mockApp, "mscott2", new Date()).then(
				function(result) { // shouldn't reach here
					expect(true).toBe(false);
					done();
				},
				function(err) {
					expect(err).toBe("user not a student, cannot make a hash");
					done();
				}
			);
		});

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