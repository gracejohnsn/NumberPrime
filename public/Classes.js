//const crypto = require("crypto");
const HASH_CHARS_KEPT = 10;

// simple hash implementation found at https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
String.prototype.hashCode = function () {
    var hash = 0;
    if (this.length == 0) {
        return hash;
    }
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    var retHash = hash.toString();
    retHash = retHash.length < 10 ? "0".repeat(HASH_CHARS_KEPT - retHash.length) + retHash : retHash;
    return Math.abs(hash);
}

class User {
    constructor(_userId, _firstName, _surName, _email, _timeStamp, _type) {
        if (new.target === User) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
        this.userId = _userId;
        this.firstName = _firstName;
        this.surName = _surName;
        this.email = _email;
        this.timeStamp = _timeStamp;
        this.type = _type;
    }

    // DO NOT USE AS API FOR "creating", USE "createUser" INSTEAD 
    // (THEY HAVE CHECKS) creates/overwrites existing data with given info
    static writeUserData(_app, _userId, _firstName, _surName,
        _email, _timeStampString, _type, _typeSpecificData) {
        var retPromise;
        //update only name and email
        if (_timeStampString == "justUpdating") {
            var updates = {};
            //console.log("hello updates here");
            updates['/users/' + _userId + '/firstName'] = _firstName;
            updates['/users/' + _userId + '/surName'] = _surName;
            updates['/users/' + _userId + '/email'] = _email;

            //return _app.database().ref().update(updates);

            retPromise = _app.database().ref().update(updates).then(
                function () { // return if no problem adding student
                    return;
                }, function () { // runs with error
                    throw "unable to update user";
                }
            );

        } else {
            if (_type == "student") {
                //console.log("hello not going to update for you");
                retPromise = _app.database().ref("users/" + _userId).set({
                    firstName: _firstName,
                    surName: _surName,
                    email: _email,
                    timeStamp: _timeStampString,
                    type: _type,
                    student: _typeSpecificData
                }).then(function () { // return if no problem adding student
                    return;
                }, function () { // runs with error
                    throw "unable to add student";
                });
            } else {
                retPromise = _app.database().ref("users/" + _userId).set({
                    firstName: _firstName,
                    surName: _surName,
                    email: _email,
                    timeStamp: _timeStampString,
                    type: _type,
                    teacher: _typeSpecificData
                }).then(function () {
                    return;
                }, function () {
                    throw "unable to add teacher";
                });
            }
        }
        return retPromise;
    }

    // given a userId, run the given function with the returned
    // data snapshot (arg of function should be snapshot, reference data 
    // w/ "snap.val()")
    static readUserData(_app, _userId) {
        return _app.database().ref("users/" + _userId).once('value').then(
            function (snapshot) {
                if (snapshot.val()) {
                    var val = snapshot.val();
                    if (val.type == "student") {
                        return new Student(_userId, val.firstName, val.surName,
                            val.email, new Date(val.timeStamp),
                            val.student ? val.student.classId : null,
                            val.student ? val.student.gradeLevel : null);
                    } else {
                        return new Teacher(_userId, val.firstName, val.surName,
                            val.email, new Date(val.timeStamp),
                            val.teacher ? val.teacher.classList : null,
                            val.teacher ? val.teacher.teacherDesc : null);
                    }
                } else {
                    throw "user does not exist";
                }
            });
    }
    // creates a user if no duplicates in database
    static createUser(_app, _userId, _firstName, _surName, _email, _timeStamp, _type,
        _typeSpecificData) {
        return User.readUserData(_app, _userId).then(
            function (result) {
                throw "user already exists";
            },
            function (err) {
                if (err == "user does not exist") {
                    var _timeStampString = _timeStamp.toUTCString();
                    return User.writeUserData(_app, _userId, _firstName, _surName,
                        _email, _timeStampString, _type, _typeSpecificData);
                }
            });
    }
}

class Student extends User {
    constructor(_userId, _firstName, _surName, _email, _timeStamp, _classId, _gradeLevel) {
        super(_userId, _firstName, _surName, _email, _timeStamp, "student");
        this.classId = _classId;
        this.gradeLevel = _gradeLevel;
    }

    // generates a hash derived from a userId and a timeStamp, then
    // adds it to the hash table and timstamps it (only valid for X minutes)
    static generateHash(_app, _userId, _timeStamp) {
        return User.readUserData(_app, _userId).then(
            function (result) { // got a result back, check whether student
                if (result.type == 'student') {
                    var hash = (_userId + _timeStamp.toUTCString()).hashCode();
                    //console.log("\n" + hash.toString().substr(0,HASH_CHARS_KEPT) + "\n");
                    var addPromise = _app.database().ref("studentHashes/" +
                        hash).set({
                            studentId: _userId,
                            timeStamp: _timeStamp.toUTCString()
                        });

                    var getHashPromise = new Promise(function (resolve, reject) {
                        resolve(hash.toString().substr(0, HASH_CHARS_KEPT));
                    });

                    return Promise.all([addPromise, getHashPromise]).then(
                        function (results) {
                            return results[1]; // returns the hash itself
                        },
                        function (err) {
                            throw "hash not created: " + err;
                        }
                    );
                } else {
                    throw "user not a student, cannot make a hash"
                }
            },
            function (result) { // occurs when user doesn't exist
                throw "cannot make a hash for a non-existent student";
            }
        );
    }
}

class Teacher extends User {
    constructor(_userId, _firstName, _surName, _email, _timeStamp, _classList, _teacherDesc) {
        super(_userId, _firstName, _surName, _email, _timeStamp, "teacher");
        this.classList = _classList;
        this.teacherDesc = _teacherDesc;
    }
}

class Class {
    constructor(_classId, _teacherId, _studentList, _classDesc) {
        this.classId = _classId;
        this.teacherId = _teacherId;
        this.studentList = _studentList;
        this.classDesc = _classDesc;
    }

    static createClass(_app, _teacherId, _classDesc, _timeStamp) {
        return _app.database().ref("classes").push({
            "teacherId": _teacherId,
            "studentList": "",
            "timeStamp": _timeStamp.toUTCString(),
            "classDesc": _classDesc,
        }).then(
            function (result) {
                var rKey = result.key;
                var updateProm = _app.database().ref("users/" + _teacherId +
                    "/teacher/classList/" + rKey).set(rKey);
                /*var updateProm = _app.database().ref("users").child(_teacherId).child('teacher').child('classList').push({
                    rKey : rKey,
                });
                console.log(rKey);*/
                return Promise.all([updateProm]).then(
                    function(results){
                        return rKey;
                    }
                );
                //console.log("key: "+ result.key);
            }
        );
    }

    static removeClass(_app, _classId) {
        return _app.database().ref('classes').child(_classId).child('studentList').once('value').then(
            function (snapshot) {
                if (snapshot.val()) {
                    var val = snapshot.val();
                    var updates = {};
                    var notifUpdates = {};

                    for (var stud in val) {
                        updates['users/' + stud + '/student/classId'] = '';
                        notifUpdates['notifications/' + stud] = '';
                        //return _app.database().ref().update(updates);
                    }

                    var removeStudClassProm = _app.database().ref().update(updates).then(
                        function () { // return if no problem adding student
                            return;
                        }, function () { // runs with error
                            throw "unable to update Students";
                        }
                    );

                    var removeStudNotifProm = _app.database().ref().update(notifUpdates).then(
                        function () { // return if no problem adding student
                            return;
                        }, function () { // runs with error
                            throw "unable to update Notifications";
                        }
                    );

                    return Promise.all([removeStudClassProm, removeStudNotifProm]).then(
                        function (results) {
                            return _app.database().ref("classes").child(_classId).remove();
                        },
                        function (err) {
                            throw "couldn't remove class: " + err;
                        }
                    );
                    //return new Class(_classId, val.teacherId, val.studentList,
                      //  val.classDesc);
                } else {
                    throw "no students/class found";
                }
            }
        );
    }

    // given a classId, run the given function with the returned
    // data snapshot (arg of function should be snapshot, reference data 
    // w/ "snap.val()")
    static readClassData(_app, _classId) {
        return _app.database().ref("classes/" + _classId).once('value').then(
            function (snapshot) {
                if (snapshot.val()) {
                    var val = snapshot.val();
                    return new Class(_classId, val.teacherId, val.studentList,
                        val.classDesc);
                } else {
                    throw "classId not found";
                }
            });
    }

    static GetStatsForClass(_app, _classId) {
        return Class.readClassData(_app, _classId).then(
            function(result) {
                //console.log(result);
                if(result.studentList == undefined || result.studentList == null) {
                    return null;
                }
                var numStudents = 0;
                var retVal = {};
                var promises = []
                for(var s in (result.studentList)) {
                    if (!result.studentList.hasOwnProperty(s)) continue;
                    promises.push(ProblemInstance.readProblemInstance(_app, s, 10).then(
                        function(results) {
                            var numSets = {};
                            results.forEach(function(p) {
                                if(!Object.keys(numSets).includes(p.problemType)) {
                                    numSets[p.problemType] = 0;
                                }
                                numSets[p.problemType] += 1;
                            });

                            if(Object.keys(numSets).length > 0) {
                                numStudents += 1;
                            }
                            results.forEach(function(p) {
                                if(!Object.keys(retVal).includes(p.problemType)) {
                                    retVal[p.problemType] = 0;
                                }
                                console.log(p.totalCorrect / p.totalProblems / numSets[p.problemType]);
                                retVal[p.problemType] += p.totalCorrect / p.totalProblems / numSets[p.problemType];
                            });
                        },
                        function(err) {
                            // don't worry if there weren't any found
                        }
                    ));
                }
                return Promise.all(promises).then(
                    function(results) {
                        console.log("results");
                        console.log(retVal, numStudents);

                        for(var k in retVal) {
                            retVal[k] /= numStudents;
                        }

                        return retVal;
                    }
                );
            }
        );
    }

    // given a hash and classId, add student given by hash to the class
    // if the hash is valid
    static addStudentWithHash(_app, _hash, _classId) {
        var getHash = _app.database().ref("studentHashes/" + _hash).once('value');
        var getClass = Class.readClassData(_app, _classId);
        /*var setStudent = _app.database().ref("users/" + hashObj.studentId + "/student/").set({
            "classId" : _classId,
        });*/

        return Promise.all([getHash, getClass/*, setStudent*/]).then(function (results) {
            var hashObj = results[0].val();
            var classObj = results[1];
            var hashDate = new Date(hashObj.timeStamp);
            var now = new Date();
            if (hashDate.getTime() + 5 * 60 * 1000 < now.getTime()) {
                throw "hash has expired";
            } else {
                return _app.database().ref("classes/" + classObj.classId +

                    "/studentList/" + hashObj.studentId).set(hashObj.studentId).then(
                        function (result) {
                            var updates = {};
                            updates['users/' + hashObj.studentId + '/student/classId'] = _classId;

                            //return _app.database().ref().update(updates);

                            var ret = _app.database().ref().update(updates).then(
                                function () { // return if no problem adding student
                                    return;
                                }, function () { // runs with error
                                    throw "unable to update classId";
                                }
                            );
                        }
                    );
            }
        });
    }

    // given a classId and studentId, remove said student from class
    static removeStudentFromClass(_app, _studentId, _classId) {
        var getClass = Class.readClassData(_app, _classId);
        var dataPromise = new Promise(
            function (resolve, reject) {
                resolve({
                    "studentId": _studentId,
                    "classId": _classId
                });

            }
        );

        return Promise.all([getClass, dataPromise]).then(
            function (results) {
                var classInstance = results[0];
                var studentId = results[1]["studentId"];
                var classId = results[1]["classId"];
                if (!Object.keys(classInstance.studentList).includes(studentId)) {
                    throw "student not in class";
                }
                return _app.database().ref("classes/" + classId +
                    "/studentList/" + studentId).remove();
            },
            function (err) {
                throw "couldn't add student to class: " + err;
            }
        );
    }
}

class Notification {
    constructor(_studentId, _notificationId, _problemURL, _creationDate, _completedDate, _dueDate, _message) {
        this.studentId = _studentId;
        this.notificationId = _notificationId
        this.problemURL = _problemURL;
        this.creationDate = _creationDate;
        this.completedDate = _completedDate;
        this.dueDate = _dueDate;
        this.message = _message;
    }

    static createNotification(_app, _studentOrClassId, _problemURL, _audience, _timeStamp, _dueDate, _message) {
        var timeSt = _timeStamp.toUTCString();
        if (_audience == "student") {
            return _app.database().ref("notifications").child(_studentOrClassId).push({
                "problemURL": _problemURL,
                "creationDate": timeSt,
                "dueDate": _dueDate,
                "completedDate": null,
                "message": _message,
            }).then(
                function (result) {
                    //console.log("key: "+ result.key);
                    return result.key;
                }
            );
        } else {
            var studList = [];
            var getClass = Class.readClassData(_app, _studentOrClassId);
            var getNotification = _app.database().ref("notifications");
            return Promise.all([getClass, getNotification]).then(
                function (result) {
                    var notifPromises = [];
                    for (var k in result[0].studentList) {
                        studList.push(JSON.stringify(result[0].studentList[k]));//JSON.parse(result.studentList[k]))
                        //students added here
                        notifPromises.push(_app.database().ref("notifications").child(JSON.stringify(result[0].studentList[k]).split("\"")[1]).push({
                            "problemURL": _problemURL,
                            "creationDate": timeSt,
                            "dueDate": _dueDate,
                            "completedDate": null,
                            "message": _message,
                        }));
                    }
                    //can't find student here?
                    return Promise.all(notifPromises).then(
                        function (result) {
                            return result.key;
                        }
                    );

                }
            );
        }
    }

    //Delete old notifications after a read (maybe 2 weeks or something)
    static readNotifications(_app, _studentId) {
        return _app.database().ref("notifications").child(_studentId).once('value').then(
            function (snapshot) {
                if (snapshot.val()) {
                    //console.log("here");
                    var val = snapshot.val();
                    var notifications = [];
                    snapshot.forEach(
                        function (childSnapshot) {
                            //for(var k in val) {
                            val = childSnapshot.val();
                            //console.log(val.problemURL);
                            //_studentId, _notificationId, _problemURL, _creationDate, _dueDate, _message)
                            var notif = new Notification(_studentId, childSnapshot.key, val.problemURL, val.creationDate, val.completedDate, val.dueDate, val.message);
                            // console.log("ugh");
                            notifications.push(notif);
                            //}
                        }
                    );
                    //console.log(_studentId);
                    //console.log(notifications);
                    return notifications;
                } else {
                    throw "notifications not found";
                }
            }
        );
    }

    /*static updateDueDate(){

    }*/

    static setCompleteProblem(_app, _notificationId, _studentId, _timeStamp) {
        var updates = {};
        updates['/notifications/' + _studentId + '/' + _notificationId + '/completedDate'] = _timeStamp.toUTCString();

        //return _app.database().ref().update(updates);

        var ret = _app.database().ref().update(updates).then(
            function () { // return if no problem adding student
                return;

            }, function () { // runs with error
                throw "unable to update completion time";
            }
        );

        /*var ret =  _app.database().ref("notifications").child(_studentId).child(_notificationId).child("completionDate").set( _timeStamp.toUTCString).then(
            function () { // return if no problem adding student
                console.log("hellooo");
                  return;
              }, function() { // runs with error
                  throw "unable to update completion time";
              }
        );*/
        return ret;

    }


}
class ProblemInstance {
    constructor(_pid, _studentId, _problemType, _totalCorrect, _totalProblems, _problemNums,
                    _userAnswers, _solutions, _timeStamp, _problemURL) {
        this.pid = _pid;
        this.studentId = _studentId;
        this.problemType = _problemType;
        this.totalCorrect = _totalCorrect;
        this.totalProblems = _totalProblems;
        this.problemNums = _problemNums,
        this.userAnswers = _userAnswers,
        this.solutions = _solutions,
        this.timeStamp = _timeStamp;
        this.problemURL = _problemURL;
    }

    // given a problemInstance id, will read the specified problem instance and studentId (probably won't be used much)

    static readProblemInstance(_app, _studentId, _amountProbs) {
        return _app.database().ref("problemInstances").child(_studentId).once('value').then(//.orderByChild("timeStamp").limitToLast(1).then(
            function (snapshot) {
                //snapshot.orderBy('desc').limit(parseInt(_amountProbs));
                if (snapshot.val()) {
                    var val = snapshot.val();
                    var problems = [];
                    if (0>_amountProbs) {
                        //snapshot.reverse;
                        var revProb = [];

                        snapshot.forEach(
                            function (childSnapshot) {
                                //TODO - Speed up, make it EXIT the for each loop when totalDone > amtProblems
                                val = childSnapshot.val();
                                var probIn = new ProblemInstance(childSnapshot.key, _studentId, val.problemType, val.totalCorrect,
                                         val.totalProblems, val.problemNums, val.userAnswers, val.solutions, val.timeStamp, val.problemURL);
                                revProb.push(probIn);
                            }
                        );
                        while (revProb.length > 0) {
                            problems.push(revProb.pop());
                        }
                    } else {
                        var totalDone = 0;
                        var revProb = [];

                        snapshot.forEach(
                            function (childSnapshot) {
                                //TODO - Speed up, make it EXIT the for each loop when totalDone > amtProblems
                                val = childSnapshot.val();
                                var probIn = new ProblemInstance(childSnapshot.key, _studentId, val.problemType, val.totalCorrect,
                                    val.totalProblems, val.problemNums, val.userAnswers, val.solutions, val.timeStamp, val.problemURL);
                                revProb.push(probIn);
                            }
                        );
                        while (totalDone < parseInt(_amountProbs) && revProb.length > 0) {
                            problems.push(revProb.pop());
                            totalDone += 1;
                        }
                    }
                    return problems;

                } else {
                    throw "No problem instances found";
                }
            }
        );
    }

    // creates a problem instance with the given attributes (typeSpecific is a javascript object with
    // corresponding attributes, see the corresponding class for specifics)

    static createProblemInstance(_app, _studentId, _problemType, _totalCorrect, _totalProblems, _problemNums,
                                     _userAnswers, _solutions, _timeStamp, _problemURL) {
        return _app.database().ref("problemInstances").child(_studentId).push({
            "problemType": _problemType,
            "totalCorrect": _totalCorrect,
            "totalProblems": _totalProblems,
            "problemNums": _problemNums,
            "userAnswers": _userAnswers,
            "solutions": _solutions,
            "timeStamp": _timeStamp.toUTCString(),
            "problemURL": _problemURL,
            //"MultiDigit" : _typeSpecific
        }).then(
            function (result) {
                return result.key;
            }
        );
        //break;
        //else
        //  throw "problem type unknown";
        //break;
    }
}