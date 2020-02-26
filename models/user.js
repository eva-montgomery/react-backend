const db = require('./connection');
const bcrypt = require('bcryptjs');

// create hash for password
function createHash(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}
// Sign Up new user
async function signUp(email, password, first_name, last_name) {
    const hash = createHash(password);
    const returningId = await db.one("insert into users(email, password, first_name, last_name) values ( $1, $2, $3, $4) returning id", [email, password, first_name, last_name]);
    return returningId;
}


// login

// get by user id

// update user data

module.exports = {
    signUp,
}