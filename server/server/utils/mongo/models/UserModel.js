const mongoose = require('mongoose');

const validateEmail = function(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};


const user = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: mongoose.SchemaTypes.String,
        validate: [validateEmail, 'email is invalid'],
        required: true,
    },
});

module.exports = mongoose.model('User', user);
