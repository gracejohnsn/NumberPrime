/*import * as firebase from "firebase/app";
import { Mock } from "firebase-nightlight";*/
//var firebaseNightlight = require("firebase-nightlight");
var mock = new firebaseNightlight.Mock();
//var Classes = require("../public/Classes.js");
//var testData = require("./testData.js");
var mockApp;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

describe("ProblemInstance", function() {
    it("should get an error when reading non existant user", 
        function(done) {
            ProblemInstance.readProblemInstance(mockApp, "Nopedy Nope", -1).then(
                function(result) {
                    expect(true).toBe(false);
                    done();
                },
                function(err) { // shouldn't enter here
                    expect(err).toBe("No problem instances found");
                    done();
                }
            );
        }
    );

    it("Get both prob instances for mscott in the order we thinks its supposed to be", 
        function(done) {
            var date1 = new Date();
            var problemNums = [[3,3],[3,1],[2,1]];
            ProblemInstance.createProblemInstance(mockApp, "mscott", "MathFun", 2, 3, problemNums, [5,4,3], [6,4,3], date1, "URL goes here").then(
                function(result) {
                    expect(true).toBe(true);
                },
                function(err) { // shouldn't enter here
                    expect(true).toBe(false);
                }
            ).then(
            function(result){
                ProblemInstance.readProblemInstance(mockApp, "mscott", -1).then(
                    function(result) {
                        //expect(result[1].pid).toBe("5678");
                        expect(result[0].studentId).toBe("mscott");
                        expect(result[0].problemType).toBe("MathFun");
                        expect(result[0].totalCorrect).toBe(2);
                        expect(result[0].totalProblems).toBe(3);
                        expect(JSON.stringify(result[0].problemNums)).toBe(JSON.stringify(problemNums));
                        expect(JSON.stringify(result[0].userAnswers)).toBe(JSON.stringify([5,4,3]));
                        expect(JSON.stringify(result[0].solutions)).toBe(JSON.stringify([6,4,3]));
                        expect(result[0].timeStamp).toBe(date1.toUTCString());
                        expect(result[0].problemURL).toBe("URL goes here");
                        done();
                    },
                    function(err) { // shouldn't enter here
                        expect(true).toBe(false);
                        done();
                    }
                )
            });
        }
    );

    it("Get both prob instances for mscott in the order we thinks its supposed to be", 
        function(done) {
            var date1 = new Date();
            ProblemInstance.createProblemInstance(mockApp, "mscott", "MathFun", 2, 5, [[3,3],[3,1],[2,1]], [5,4,3], [6,4,3], date1, "URL goes here").then(
                function(result) {
                    expect(true).toBe(true);
                },
                function(err) { // shouldn't enter here
                    expect(true).toBe(false);
                }
            ).then(
                async function(result){
                    await sleep(1000);
                    date1 = new Date();
                    ProblemInstance.createProblemInstance(mockApp, "mscott", "MathFunTime", 3, 9, [[6,6],[5,1],[2,5]], [5,6,7], [3,2,1], date1, "URL num 2").then(
                        function(result) {
                            expect(true).toBe(true);
                        },
                        function(err) { // shouldn't enter here
                            expect(true).toBe(false);
                        }
                    )
                }
            ).then(
            function(result){
                ProblemInstance.readProblemInstance(mockApp, "mscott", 100).then(
                    function(result) {
                        //expect(result[1].pid).toBe("5678");
                        expect(result[0].studentId).toBe("mscott");
                        expect(result[0].problemType).toBe("MathFunTime");
                        expect(result[0].totalCorrect).toBe(3);
                        expect(result[0].totalProblems).toBe(9);
                        expect(JSON.stringify(result[0].problemNums)).toBe(JSON.stringify([[6,6],[5,1],[2,5]]));
                        expect(JSON.stringify(result[0].userAnswers)).toBe(JSON.stringify([5,6,7]));
                        expect(JSON.stringify(result[0].solutions)).toBe(JSON.stringify([3,2,1]));
                        expect(result[0].timeStamp).toBe(date1.toUTCString());
                        expect(result[0].problemURL).toBe("URL num 2");
                        done();
                    },
                    function(err) { // shouldn't enter here
                        expect(true).toBe(false);
                        done();
                    }
                )
            });
        }
    );

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
