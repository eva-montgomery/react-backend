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
async function login (email, password) {
    const user = await getByEmail(email);
    return bcrypt.compareSync(password, user.hash);
}

// profile
async function getUser(id) {
    try {
        const user = await db.one(`
        select * from users where id=$1
        `, [id]);
        return user;
    } catch (err) {
        return null;
    };
}


// get by user id
async function getById(id) {
    const user = await db.one(`
    select * from users where id=$1
    `[id]);
    return user;
}

// get user by username  --> ????
async function getByEmail(email) {
    const userEmail = await db.one(`
    select * from users where email=$1
    `, [email]);
    return userEmail;
}

// update user data
async function updateUserData(id, email, first_name, last_name) {
    const result = await db.result(`
    udate users set
    email=$2,
    first_name=$3,
    last_name=$4
   where id=$1; 
   `, [id, email, first_name, last_name]);
   if (result.rowCount === 1) {
       return id; 
   } else {
       return null;
   }
}

module.exports = {
    signUp,
    login,
    getUser,
    getById,
    getByEmail,
    updateUserData,
}