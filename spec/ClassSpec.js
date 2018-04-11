/*import * as firebase from "firebase/app";
import { Mock } from "firebase-nightlight";*/
//var firebaseNightlight = require("firebase-nightlight");
var mock = new firebaseNightlight.Mock();
//var Classes = require("../public/Classes.js");
//var testData = require("./testData.js");
var mockApp;

describe("Class", function() {
	it("should be able to get list of students in class",
		function(done) {
            Class.readClassData(mockApp, "1234").then(
                function(result) {
                    expect(result.teacherId).toEqual("mscott2");
                    expect(result.studentList).toEqual(
                        {"E6NwApIZTdMx63GYxU3XTHI6OUU2": "E6NwApIZTdMx63GYxU3XTHI6OUU2",
                        "mscott1": "mscott1"});
                    done();
                }
            );
		}
    );

    it("should not be able to get data from a bad classId",
        function(done) {
            Class.readClassData(mockApp, "asdfasdf").then(
                function(result) {
                    expect(true).toBe(false);
                    done();
                },
                function(err) {
                    expect(err).toBe("classId not found");
                    done();
                }
            );
        });

    it("should be able to remove a student from a class",
        function(done) {
            Class.removeStudentFromClass(mockApp, 
                "E6NwApIZTdMx63GYxU3XTHI6OUU2", "1234").then(
                function(result) {
                    return Class.readClassData(mockApp, "1234").then(
                        function (result) {
                            expect(result.studentList).toEqual({"mscott1": "mscott1"});
                            done();
                        },
                        function (err) { // this should not be executed
                            expect(true).toBe(false);
                            done();
                        }
                    );
                },
                function(err) { // should not execute either
                    expect(true).toBe(false);
                    done();
                }
            );
        });
    
    it("should throw an error if attempting to remove a student not in the class",
        function(done) {
            Class.removeStudentFromClass(mockApp, 
                "asdf", "1234").then(
                function(result) { // should not execute
                    expect(true).toBe(false);
                    done();
                },
                function(err) {
                    expect(err).toBe("student not in class");
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
