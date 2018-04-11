//const crypto = require("crypto");
const HASH_CHARS_KEPT = 10;

// simple hash implementation found at https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
String.prototype.hashCode = function() {
    var hash = 0;
    if (this.length == 0) {
        return hash;
    }
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
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
        if (_type == "student") {
            retPromise = _app.database().ref("users/" + _userId).set({
                firstName: _firstName,
                surName: _surName,
                email: _email,
                timeStamp: _timeStampString,
                type: _type,
                student: _typeSpecificData
              }).then(function () { // return if no problem adding student
                  return;
              }, function() { // runs with error
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
              }, function() {
                  throw "unable to add teacher";
              });
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
                    if(val.type == "student") {
                        return new Student(_userId, val.firstName, val.surName,
                            val.email, new Date(val.timeStamp), val.student.classId, val.student.gradeLevel);
                    } else {
                        return new Teacher(_userId, val.firstName, val.surName,
                            val.email, new Date(val.timeStamp), val.teacher.classList, val.teacher.teacherDesc);
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
            function(err) {
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
            function(result) { // got a result back, check whether student
                if (result.type == 'student') {
                    var hash = (_userId + _timeStamp.toUTCString()).hashCode();
                    //console.log("\n" + hash.toString().substr(0,HASH_CHARS_KEPT) + "\n");
                    var addPromise = _app.database().ref("studentHashes/" + 
                        hash).set({
                            studentId: _userId,
                            timeStamp: _timeStamp.toUTCString()
                        });
                    
                    var getHashPromise = new Promise(function(resolve, reject) {
                        resolve(hash.toString().substr(0,HASH_CHARS_KEPT));
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
            function(result) { // occurs when user doesn't exist
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

    // given a hash and classId, add student given by hash to the class
    // if the hash is valid
    static addStudentWithHash(_app, _hash, _classId) {
        var getHash = _app.database().ref("studentHashes/" + _hash).once('value');
        var getClass = Class.readClassData(_app, _classId);

        return Promise.all([getHash, getClass]).then(function (results) {
            var hashObj = results[0].val();
            var classObj = results[1];
            var hashDate = new Date(hashObj.timeStamp);
            var now = new Date();
            if (hashDate.getTime() + 5 * 60 * 1000 < now.getTime()) {
                throw "hash has expired";
            } else {
                return _app.database().ref("classes/" + classObj.classId + 
                    "/studentList/" + hashObj.studentId).set(true);
            }
        });
    }

    // given a classId and studentId, remove said student from class
    static removeStudentFromClass(_app, _studentId, _classId) {
        var getClass = Class.readClassData(_app, _classId);
        var dataPromise = new Promise(
            function(resolve, reject) {
                resolve({"studentId" : _studentId, "classId" : _classId});
            }
        );

        return Promise.all([getClass, dataPromise]).then(
            function(results) {
                var classInstance = results[0];
                var studentId = results[1]["studentId"];
                var classId = results[1]["classId"];
                if(!Object.keys(classInstance.studentList).includes(studentId)) {
                    throw "student not in class";
                }
                return _app.database().ref("classes/" + classId + 
                    "/studentList/" + studentId).remove();
            },
            function(err) {
                throw "couldn't add student to class: " + err;
            }
        );
    }
}

class Notification {
    /*constructor(_studentOrClassId, _pid, _audience, _timeStamp) {
        if (new.target === Notification) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
        this.studentOrClassId = _studentOrClassId;
        this.problemURI = _problemURI;
        this.audience = _audience;
        this.timeStamp = _timeStamp;
    }*/

    static createNotification(_app, _studentOrClassId, _problemURI, _audience, _timeStamp) {
        var timeSt = _timeStamp.toUTCString();
        if(_audience == "student") {
            return _app.database().ref("notifications").child(_studentOrClassId).push({
                "suggestion" : _problemURI,
                "timeStamp" : timeSt,
            }).then(
                function(result) {
                    //console.log("key: "+ result.key);
                    return result.key;
                }
            );
        }else{
            var studList = [];
            var getClass =  Class.readClassData(_app, _studentOrClassId);
            var getNotification = _app.database().ref("notifications");
            return Promise.all([getClass,getNotification]).then(
                function(result){
                    var notifPromises = [];
                    for(var k in result[0].studentList)
                    {
                        studList.push(JSON.stringify(result[0].studentList[k]));//JSON.parse(result.studentList[k]))
                        //students added here
                        notifPromises.push( _app.database().ref("notifications").child (JSON.stringify(result[0].studentList[k]).split("\"")[1] ).push({
                            "suggestion" : _problemURI,
                            "timeStamp" : timeSt,
                        }) );
                    }
                    //can't find student here?
                    return Promise.all(notifPromises).then(
                        function(result){
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
            function(snapshot) {
                if(snapshot.val()) {
                    //console.log("here");
                    var val = snapshot.val();
                    var notifications = [];
                    for(var k in val) {
                        notifications.push([val[k].suggestion, val[k].timeStamp])
                    }
                    //console.log(_studentId);
                    //console.log(notifications);
                    return notifications;
                } else {
                    throw "notifications not found";
                }
            }
        );
    }


}

class ProblemInstance {
    constructor(_pid, _studentId, _problemType, _correct, _timeStamp) {
        this.pid = _pid;
        this.studentId = _studentId;
        this.problemType = _problemType;
        this.correct = _correct;
        this.timeStamp = _timeStamp;
    }

    // given a problemInstance id, will read the specified problem instance and studentId (probably won't be used much)
    static readProblemInstance(_app, _studentId, _pid) {
        return _app.database().ref("problemInstances").child(_studentId).child(_pid).once('value').then(
            function(snapshot) {
                if(snapshot.val()) {
                    var val = snapshot.val();
                    switch (val.problemType) {
                        case "MultiDigit":
                            return new MultiDigitProblemInstance(_pid, val.studentId, val.problemType,
                                val.correct, val.timeStamp, val.MultiDigit.num1,
                                val.MultiDigit.num2, val.MultiDigit.operation);
                            break;
                        case "MathFact":
                            return new MathFactProblemInstance(_pid, val.studentId, val.problemType,
                                val.correct, val.timeStamp, val.MathFact.num1,
                                val.MathFact.num2, val.MathFact.operation);
                            break;
                        case "Measurement":
                            throw "not implemented";
                            //return new MeasurementProblemInstance(); // TODO this needs to be updated to reflect
                            // the various different types in the front-end document
                            break;
                        default:
                            throw "unknown type";
                            break;
                    }
                } else {
                    throw "problem instance not found";
                }
            }
        );
    }

    // creates a problem instance with the given attributes (typeSpecific is a javascript object with 
    // corresponding attributes, see the corresponding class for specifics)
    static createProblemInstance(_app, _studentId, _problemType, _correct, _timeStamp, _typeSpecific) {
        switch(_problemType) {
            case "MathFact":
                return _app.database().ref("problemInstances").child(_studentId).push({
                    "problemType" : _problemType,
                    "correct" : _correct,
                    "timeStamp" : _timeStamp,
                    "MathFact" : _typeSpecific
                }).then(
                    function(result) {
                        return result.key;
                    }
                );
                break;
            case "MultiDigit":
                return _app.database().ref("problemInstances").child(_studentId).push({
                    "problemType" : _problemType,
                    "correct" : _correct,
                    "timeStamp" : _timeStamp,
                    "MultiDigit" : _typeSpecific
                }).then(
                    function(result) {
                        return result.key;
                    }
                );
                break;
            default:
                throw "problem type unknown";
                break;
        }
    }
}

class MultiDigitProblemInstance extends ProblemInstance {
    constructor(_pid, _studentId, _problemType, _correct, 
        _timeStamp, _num1, _num2, _operation) {
        super(_pid, _studentId, _problemType, _correct, _timeStamp);
        this.num1 = _num1;
        this.num2 = _num2;
        this.operation = _operation;
    }
}

class MathFactProblemInstance extends ProblemInstance {
    constructor(_pid, _studentId, _problemType, _correct, 
        _timeStamp, _num1, _num2, _operation) {
        super(_pid, _studentId, _problemType, _correct, _timeStamp);
        this.num1 = _num1;
        this.num2 = _num2;
        this.operation = _operation;
    }
}

class VolumeProblemInstance extends ProblemInstance {
    constructor(_pid, _studentId, _problemType, _correct,
        _timeStamp, _base, _width, _height) {
        super(_pid, _studentId, _problemType, _correct, _timeStamp);
        this.base = _base;
        this.width = _width;
        this.height = _height;
    }
}

class ConversionProblemInstance extends ProblemInstance {
    constructor(_pid, _studentId, _problemType, _correct, 
        _timeStamp, _dimension, _unit) {
        super(_pid, _studentId, _problemType, _correct, _timeStamp);
        this.dimension = _dimension;
        this.unit = _unit;
    }
}