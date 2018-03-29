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
              }).then(function () {
                  return true;
              }, function() {
                  return false;
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
                  return true;
              }, function() {
                  return false;
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
                    return undefined;
                }
            });
    }

    // creates a user if no duplicates in database
    static createUser(_app, _userId, _firstName, _surName, _email, _timeStamp, _type,
        _typeSpecificData) {
        return User.readUserData(_app, _userId).then(
            function (result) {
                //console.log(result);
                if (result === undefined) {
                    var _timeStampString = _timeStamp.toUTCString();
                    return User.writeUserData(_app, _userId, _firstName, _surName, 
                        _email, _timeStampString, _type, _typeSpecificData);
                } else {
                    return false;
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
    constructor() {
        
    }
}

module.exports = {
    User : User,
    Student : Student,
    Teacher : Teacher
};