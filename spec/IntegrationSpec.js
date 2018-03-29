const firebaseNightlight = require("firebase-nightlight");
const mock = new firebaseNightlight.Mock();
const Classes = require("../Classes.js"); 
const testData = require("./testData.js");
let mockApp;

describe("Student-Class integration--", function() {
	it(`should be able to generate a time-sensitive, unique hash and add a 
		student with it`, 
		function(done) {
			Classes.Student.generateHash(mockApp, "afisk", new Date()).then(
			function(result) {
				return Classes.Class.addStudentWithHash(mockApp, result, "1234");
			}).then(
			function(result) {
				return Classes.Class.readClassData(mockApp, "1234");
			}).then(
			function(result) {
				expect(Object.keys(result.studentList)).toContain("afisk");
				done();
			});
	});

	it(`should not be able to generate a time-sensitive, unique hash and add a 
		student with it if it has been more than 5 minutes`, 
		function(done) {
			Classes.Student.generateHash(mockApp, "afisk", new Date(
				new Date().getTime() - 10 * 60 * 1000
			)).then(
			function(result) {
				return Classes.Class.addStudentWithHash(mockApp, result, "1234");
			}).then(
			function(result) {
				expect(result).not.toBeDefined();
				done();
			});
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