//const crypto = require("crypto");
const HASH_CHARS_KEPT = 10;

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

    // DO NOT USE AS API, USE "createUser" OR "editUser" INSTEAD 
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
        this.student = {
            classId: _classId,
            gradeLevel: _gradeLevel
        }
    }

    // generates an SHA1 hash derived from a userId and a dateTime, then
    // adds it to the hash table and timstamps it (only valid for X minutes)
    static generateHash(_app, _userId, _dateTime) {
        return User.readUserData(_app, _userId).then(
            function(result) { // got a result back, check whether student
                if (result.type == 'student') {
                    var hash = crypto.createHash('sha1').update(
                        _userId + _dateTime.toUTCString()).digest('base64');
                    //console.log("\n" + hash.toString().substr(0,HASH_CHARS_KEPT) + "\n");
                    var addPromise = _app.database().ref("studentHashes/" + 
                        hash.toString().substr(0,HASH_CHARS_KEPT)).set({
                            studentId: _userId,
                            timeStamp: _dateTime.toUTCString()
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
        this.teacher = {
            classList: _classList,
            teacherDesc: "",

        }
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

class ProblemInstance {
    constructor() {

    }
}

module.exports = {
    User : User,
    Student : Student,
    Teacher : Teacher,
    Class : Class,
    ProblemInstance : ProblemInstance
};