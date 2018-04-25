/*import * as firebase from "firebase/app";
import { Mock } from "firebase-nightlight";*/
//var firebaseNightlight = require("firebase-nightlight");
var mock = new firebaseNightlight.Mock();
//var Classes = require("../public/Classes.js"); 
//var testData = require("./testData.js");
var mockApp;

describe("User", function() {

	it("should update user",
		function(done){
			User.writeUserData(mockApp, "afisk", "taco", "bell", "tbell@GBell.com", "justUpdating", null, null).then(
				function(result){
					User.readUserData(mockApp, "afisk").then(
						function(result){
							expect(result.firstName).toBe("taco");
							expect(result.surName).toBe("bell");
							expect(result.email).toBe("tbell@GBell.com");
							done();
						}
					)
				}
			)
		}
	)

	it("should be able to create a new user, but not able to create another w/ same user id",
		function(done) {
			User.createUser(mockApp, "12345", "Michael", "Scarn", "blah@gmail.com", new Date(),
			"teacher", {"classList": [], "teacherDesc": undefined}).then(
				function () { // just need this function to be executed
					expect(true).toBe(true);
				}
			).then(
				function(result) {
					User.createUser(
						mockApp, "12345", "Michael", "Scott", "mscott6@wisc.edu", new Date(),
						"student", undefined, 2
					).then(
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
			User.createUser(
				mockApp, "afisk", "Michael", "Scott", "mscott6@wisc.edu", new Date(), "student",
					undefined, 3).then(
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
					expect(result.classId).toBe("12345");
					expect(result.gradeLevel).toBe(4);
					done();
				});
		}
	);

	it("should throw an error if queried for a non-existent userId",
		function(done) {
			User.readUserData(mockApp, "asdfasdf").then(
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
			Student.generateHash(mockApp, "afisk", new Date()).then(
				function(result) {
					expect(result).toBeDefined();
					done();
			});
	});

	it("should throw an error if asked to make a hash for a non-existent student", 
		function(done) {
			Student.generateHash(mockApp, "saddfasdfad", new Date()).then(
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
			Student.generateHash(mockApp, "mscott2", new Date()).then(
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
