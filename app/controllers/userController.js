const { User }= require('../models/user');

let forceSyncUserWithDb = function () {
    User.sync({force:true});
}

let createDummyUser = function () {
    let user = User.build({
        firstName : "dummy",
        lastName : "user"
    });

    user.save().then(() => {
        console.log("dummy user saved");
    }).catch(err => {
        console.error("dummy user was not created");
    })
}

module.exports = {
    createDummyUser
}