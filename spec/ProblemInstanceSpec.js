/*import * as firebase from "firebase/app";
import { Mock } from "firebase-nightlight";*/
//var firebaseNightlight = require("firebase-nightlight");
var mock = new firebaseNightlight.Mock();
//var Classes = require("../public/Classes.js");
//var testData = require("./testData.js");
var mockApp;

describe("ProblemInstance", function() {
    it("should be able to get a specific problem instance", 
        function(done) {
            ProblemInstance.readProblemInstance(mockApp, "afisk", "5678").then(
                function(result) {
                    expect(result.problemType).toBe("MathFact");
                    expect(result.correct).toBe(true);
                    expect(result.timeStamp).toBe("Tue, 27 Mar 2018 15:16:00 GMT");
                    expect(result.num1).toBe(2);
                    expect(result.num2).toBe(3);
                    expect(result.operation).toBe("addition");
                    done();
                },
                function(err) { // shouldn't enter here
                    expect(true).toBe(false);
                    done();
                }
            );
        }
    );

    it("should be able to write a specific problem instance and then subsequently read it",
        function(done) {
            ProblemInstance.createProblemInstance(mockApp, "afisk", "MathFact", true, 
                "Tue, 27 Mar 2018 15:16:00 GMT", {"num1" : 2, "num2" : 3, "operation" : "addition"}).then(
                function(result) { // just need this to be executed
                    expect(true).toBe(true);
                    return result;
                },
                function(err) { // this should NOT execute
                    expect(true).toBe(false);
                    return result;
                }
            ).then(
                function(result) {
                    ProblemInstance.readProblemInstance(mockApp, "afisk", result).then(
                        function(result) {
                            expect(result.problemType).toBe("MathFact");
                            expect(result.correct).toBe(true);
                            expect(result.timeStamp).toBe("Tue, 27 Mar 2018 15:16:00 GMT");
                            expect(result.num1).toBe(2);
                            expect(result.num2).toBe(3);
                            expect(result.operation).toBe("addition");
                            done();
                        },
                        function(err) { // should not enter here
                            expect(true).toBe(false);
                            done();
                        }
                    );
                },
                function(err) { // should not enter here
                    expect(true).toBe(false);
                    done();
                }
            );
        }
    );

    it("should fail to read a non-existent pid", 
        function(done) {
            ProblemInstance.readProblemInstance(mockApp, "adsfassdf").then(
                function(result) { // should not reach here
                    expect(true).toBe(false);
                    done();
                },
                function(error) {
                    expect(error).toEqual("problem instance not found");
                    done();
                }
            );
        }
    );

    /*it("should find all problem instances matching timestamp criteria",
        function(done) {
            ProblemInstance.findProblemInstance(mockApp, {"timeStamp" : })
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
