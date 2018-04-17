//var firebaseNightlight = require("firebase-nightlight");
var mock = new firebaseNightlight.Mock();
//var Classes = require("../public/Classes.js"); 
//var testData = require("./testData.js");
var mockApp;

describe("Student-Class integration--", function() {
	it(`should be able to generate a time-sensitive, unique hash and add a 
		student with it`, 
		function(done) {
			Student.generateHash(mockApp, "afisk", new Date()).then(
			function(result) {
				return Class.addStudentWithHash(mockApp, result, "1234");
			}).then(
			function(result) {
				return Class.readClassData(mockApp, "1234");
			}).then(
			function(result) {
				expect(Object.keys(result.studentList)).toContain("afisk");
				done();
			});
	});

	it(`should not be able to generate a time-sensitive, unique hash and add a 
		student with it if it has been more than 5 minutes`, 
		function(done) {
			Student.generateHash(mockApp, "afisk", new Date(
				new Date().getTime() - 10 * 60 * 1000
			)).then(
			function(result) {
				return Class.addStudentWithHash(mockApp, result, "1234");
			}).then(
			function(result) { // promise success (student added) (shouldn't happen)
				expect(false).toBe(true);
				done();
			},
			function(err) { // promise failure (student not added)
				expect(err).toEqual("hash has expired");
				done();
			});
	});

	it(`should add student to a created class`, 
		function(done) {
			var classId = "";
			//var dateT = new Date();
            Class.createClass(mockApp, "mscott2", "My class is pretty neat", new Date()).then(
                function(result) {
					classId = result;
					expect(true).toBe(true);
                }
			).then(
			function(result){
				Student.generateHash(mockApp, "afisk", new Date()).then(
					function(result){
						Class.addStudentWithHash(mockApp, result, classId).then(
							function(result){
								Class.readClassData(mockApp, classId).then(
									function(result){
										expect(JSON.stringify(result.studentList)).toContain("afisk");
										done();
									}
								)
							}
						)
					}
				)

			})
		}
	);

				/*Student.generateHash(mockApp, "afisk", new Date()).then(
				function(result) {
					return Class.addStudentWithHash(mockApp, result, result);
				}).then(
				function(result) {
					return Class.readClassData(mockApp, result);
				}).then(
				function(result) {
					expect(Object.keys(result.studentList)).toContain("afisk");
					done();
				});*/


	/*it(`should add student to a created class`, 
	function(done) {

		Student.generateHash(mockApp, "afisk", new Date(new Date().getTime())
		).then(
		function(result){
			console.log("hello");
			Class.createClass(mockApp, "mscott2", "My class is pretty neat", new Date())
			.then(
				function(result) {
					classId = result;
					expect(true).toBe(true);
				}
			)
			.then(
			function(result) {
				console.log("hello");
				return Class.addStudentWithHash(mockApp, result, classId);
			})
			.then(
			function(result) { // promise success (student added) (shouldn't happen)
				Class.readClassData(mockApp, classId).then(
					function(result){
						expect(result.studentList).toBe({"afisk": "afisk"});
						done();
					}
				);
				expect(true).toBe(true);
				done();
			},
			)
			}
		);
	});*/

	it(`should have authorization built-in, disallowing teachers from adding
		students to classes that don't belong to them`);

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
