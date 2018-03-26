class User {
	constructor() {
        
    }

    // DO NOT USE AS API, USE "createUser" OR "editUser" INSTEAD 
    // (THEY HAVE CHECKS) creates/overwrites existing data with given info
    static writeUserData(_app, _userId, _firstName, _surName, 
        _email, _type) {
        /*firebase.database().ref*/
        _app.database().ref("users/" + _userId).set({
          firstName: _firstName,
          surName: _surName,
          email: _email,
          type: _type
        });
    }

    // given a userId, run the given function with the returned
    // data snapshot (arg of function should be snapshot, reference data 
    // w/ "snap.val()")
    static readUserData(_app, _userId, _func) {
        /*firebase.database().ref*/
        _app.database().ref("users/" + _userId).once('value').then(_func);
    }

    // creates a user if no duplicates in database
    static createUser(_app, _userId, _firstName, _surName, _email, _type, 
        _exceptionHandler) {
        User.readUserData(_app, _userId, function(snapshot) {
            try {
                // insure no one with the same userId/email exists in the database
                if (snapshot.val()) {
                    throw "User already exists";
                } else {
                    User.writeUserData(_app, _userId, _firstName, _surName, _email, _type);
                }
            } catch (err) {
                _exceptionHandler(err);
            }
        });
    }
}

class Student extends User {
    constructor() {
        super();
    }
}

class Teacher extends User {
    constructor() {
        super();
    }
}

module.exports = User;