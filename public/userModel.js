// DO NOT USE AS API, USE "createUser" OR "editUser" INSTEAD (THEY HAVE CHECKS)
// creates/overwrites existing data with given info
function writeUserData(_userId, _firstName, _surName, _email, _type, _notTest) {
    node = _notTest ? "users/" : "test-users/";
    firebase.database().ref(node + _userId).set({
      firstName: _firstName,
      surName: _surName,
      email: _email,
      type: _type
    });
  }

// given a userId, run the given function with the returned
// data snapshot (arg of function should be snapshot, reference data w/ "snap.val()")
function readUserData(_userId, _func, _notTest) {
    node = _notTest ? "users/" : "test-users/";
    firebase.database().ref(node + _userId).once('value').then(_func);
}

function createUser(_userId, _firstName, _surName, _email, _type, _exceptionHandler, _notTest) {
    node = _notTest ? "users/" : "test-users/";
    readUserData(_userId, function(snapshot) {
        try {
            // insure no one with the same userId exists in the database
            if (snapshot.val()) {
                throw "User already exists";
            } else {
                writeUserData(_userId, _firstName, _surName, _email, _type, _notTest);
            }
        } catch (err) {
            _exceptionHandler(err);
        }
    }, _notTest);
}

$(document).ready(function () {
    // Get a reference to the database service
    //writeUserData("mscott", "Michael", "Scott", "mscott5@wisc.edu", "student")
});