class UserAlreadyExistsException {
    constructor(name) {
        UserAlreadyExistsException.prototype.toString = function () {
            return "User " + name + " already exists";
        };
    }
    
}