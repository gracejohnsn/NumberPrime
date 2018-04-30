/*import * as firebase from "firebase/app";
import { Mock } from "firebase-nightlight";*/
//var firebaseNightlight = require("firebase-nightlight");
var mock = new firebaseNightlight.Mock();
//var Classes = require("../public/Classes.js");
//var testData = require("./testData.js");
var mockApp;

describe("Class", function () {
    it("should be able to get list of students in class",
        function (done) {
            Class.readClassData(mockApp, "1234").then(
                function (result) {
                    expect(result.teacherId).toEqual("mscott2");
                    expect(result.studentList).toEqual(
                        {
                            "E6NwApIZTdMx63GYxU3XTHI6OUU2": "E6NwApIZTdMx63GYxU3XTHI6OUU2",
                            "mscott1": "mscott1"
                        });
                    done();
                }
            );
        }
    );

    it("should be able to get class statistics",
        function (done) {
            Class.GetStatsForClass(mockApp, "1234").then(
                function (result) {
                    console.log(result);
                    done();
                },
                function(err) {
                    console.log(err);
                    done();
                }
            );
        }
    );

    it("should throw and err when trying to remove a non-existant class",
        function (done) {
            Class.removeClass(mockApp, "NOPE").then(
                function (result) {
                    expect(true).toBe(false);
                    done();
                },
                function (err) {
                    expect(err).toBe("no students/class found");
                    done();
                }

            )
        }
    );

    it("should be able to remove a class",
        function (done) {
            Class.readClassData(mockApp, "1234").then(
                function (result) {
                    expect(result.teacherId).toEqual("mscott2");
                    expect(result.studentList).toEqual(
                        {
                            "E6NwApIZTdMx63GYxU3XTHI6OUU2": "E6NwApIZTdMx63GYxU3XTHI6OUU2",
                            "mscott1": "mscott1"
                        });
                }
            ).then(
                function (result) {
                    Class.removeClass(mockApp, "1234").then(
                        function (result) {
                            expect(true).toBe(true);
                        }
                    ).then(
                        function (result) {
                            Class.readClassData(mockApp, "1234").then(
                                function (result) {
                                    expect(true).toBe(false);
                                    done();
                                },
                                function (err) {
                                    expect(err).toBe("classId not found");
                                }
                            )
                        }
                    ).then(
                        function (result) {
                            Student.readUserData(mockApp, "E6NwApIZTdMx63GYxU3XTHI6OUU2").then(
                                function (result) {
                                    expect(result.classId).toBe('');
                                    //done();
                                }
                            )
                        }
                    ).then(
                        function (result) {
                            Notification.readNotifications(mockApp, "E6NwApIZTdMx63GYxU3XTHI6OUU2").then(
                                function (result) {
                                    expect(true).toBe(false);
                                    done();
                                },
                                function (err) {
                                    expect(err).toBe('notifications not found');
                                    done();
                                }
                            )
                        }
                    )
                }
            );
        }
    );




    it("should not be able to get data from a bad classId",
        function (done) {
            Class.readClassData(mockApp, "asdfasdf").then(
                function (result) {
                    expect(true).toBe(false);
                    done();
                },
                function (err) {
                    expect(err).toBe("classId not found");
                    done();
                }
            );
        });

    it("should be able to remove a student from a class",
        function (done) {
            Class.removeStudentFromClass(mockApp,
                "E6NwApIZTdMx63GYxU3XTHI6OUU2", "1234").then(
                    function (result) {
                        return Class.readClassData(mockApp, "1234").then(
                            function (result) {
                                expect(result.studentList).toEqual({ "mscott1": "mscott1" });
                                done();
                            },
                            function (err) { // this should not be executed
                                expect(true).toBe(false);
                                done();
                            }
                        );
                    },
                    function (err) { // should not execute either
                        expect(true).toBe(false);
                        done();
                    }
                );
        });

    it("should throw an error if attempting to remove a student not in the class",
        function (done) {
            Class.removeStudentFromClass(mockApp,
                "asdf", "1234").then(
                    function (result) { // should not execute
                        expect(true).toBe(false);
                        done();
                    },
                    function (err) {
                        expect(err).toBe("student not in class");
                        done();
                    }
                );
        });

    it("should create a new class and add it to the teacher's class list",
        function (done) {
            var classId = "";
            //var dateT = new Date();
            Class.createClass(mockApp, "mscott2", "My class is pretty neat", new Date()).then(
                function (result) {
                    classId = result;
                    expect(true).toBe(true);
                }
            ).then(
                function (result) {
                    Class.readClassData(mockApp, classId).then(
                        function (result) {
                            //console.log(result);
                            expect(result.teacherId).toEqual("mscott2");
                            expect(result.studentList).toEqual("");
                            expect(result.classDesc).toEqual("My class is pretty neat");
                            var classRes = result.classId;
                            //expect(result.timeStamp).toEqual(dateT.toUTCString());
                            //done();
                            Student.generateHash(mockApp, "afisk", new Date()).then(
                                function (result) {
                                    return Class.addStudentWithHash(mockApp, result, classRes);
                                }).then(
                                    function (result) {
                                        return Class.readClassData(mockApp, classRes);
                                    }).then(
                                        function (result) {
                                            expect(Object.keys(result.studentList)).toContain("afisk");
                                            done();
                                        })
                        }
                    )
                }
            );
        }
    );

    it("should create 2 classes for mscott2",
        function (done) {
            var classId = "";
            var classId2 = "";
            //var dateT = new Date();
            Class.createClass(mockApp, "mscott2", "My class is pretty neat", new Date()).then(
                function (result) {
                    classId = result;
                    expect(true).toBe(true);
                }
            ).then(
                function (result) {
                    Class.createClass(mockApp, "mscott2", "My class is pretty neat", new Date()).then(
                        function (result) {
                            classId2 = result;
                        }
                    ).then(
                        function (result) {
                            User.readUserData(mockApp, "mscott2").then(
                                function (result) {
                                    expect(JSON.stringify(result)).toContain(classId.toString());
                                    expect(JSON.stringify(result)).toContain(classId2.toString());
                                    done();
                                }
                            )
                        }
                    );
                }
            );
        }
    );

    beforeEach(function () {
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
