/*import * as firebase from "firebase/app";
import { Mock } from "firebase-nightlight";*/
const firebaseNightlight = require("firebase-nightlight");
const mock = new firebaseNightlight.Mock();
const Classes = require("../Classes.js");
const testData = require("./testData.js");
let mockApp;

describe("Class", function() {
	it("should be able to get list of students in class",
		function(done) {
            Classes.Class.readClassData(mockApp, "1234").then(
                function(result) {
                    expect(result.teacherId).toEqual("mscott2");
                    expect(result.studentList).toEqual(
                        {"E6NwApIZTdMx63GYxU3XTHI6OUU2": true});
                    done();
                }
            );
		}
    );

    it("should not be able to get data from a bad classId",
        function(done) {
            Classes.Class.readClassData(mockApp, "asdfasdf").then(
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

    it("should be able to remove a student from a class");
	

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