class User {
	constructor(_userId, _firstName, _surName, _email, _type) {
        if (new.target === User) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
        this.userId = _userId;
        this.firstName = _firstName;
        this.surName = _surName;
        this.email = _email;
        this.type = _type;
    }

    // DO NOT USE AS API, USE "createUser" OR "editUser" INSTEAD 
    // (THEY HAVE CHECKS) creates/overwrites existing data with given info
    static writeUserData(_app, _userId, _firstName, _surName, 
        _email, _type, _typeSpecificData) {
        return _app.database().ref("users/" + _userId).set({
          firstName: _firstName,
          surName: _surName,
          email: _email,
          type: _type
        }).then(function () {
            return true;
        }, function() {
            return false;
        });
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
                            val.email, val.student.classId, val.student.gradeLevel);
                    } else {
                        return new Teacher(_userId, val.firstName, val.surName,
                            val.email, val.teacher.classList, val.teacher.teacherDesc);
                    }
                } else {
                    return undefined;
                }
            });
    }

    // creates a user if no duplicates in database
    static createUser(_app, _userId, _firstName, _surName, _email, _type) {
        return User.readUserData(_app, _userId).then(
            function (result) {
                //console.log(result);
                if (result === undefined) {
                    return User.writeUserData(_app, _userId, _firstName, _surName, _email, _type);
                } else {
                    return false;
                }
            });
    }
}

class Student extends User {
    constructor(_userId, _firstName, _surName, _email, _classId, _gradeLevel) {
        super(_userId, _firstName, _surName, _email, "student");
        this.student = {
            classId: _classId,
            gradeLevel: _gradeLevel
        }
    }
}

class Teacher extends User {
    constructor(_userId, _firstName, _surName, _email, _classList, _teacherDesc) {
        super(_userId, _firstName, _surName, _email, "teacher");
        this.teacher = {
            classList: _classList,
            teacherDesc: "",

        }
    }
}

module.exports = User;