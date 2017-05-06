const mongoose = require('mongoose');

const validateEmail = function(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

const shortUser = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
}, { _id: false });

const userImage = mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
}, { _id: false });

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
    image: {
        type: userImage,
    },
    deviceToken: {
        type: String,
    },
    isAdmin: mongoose.SchemaTypes.Boolean,
    externals: {
        box: {
            accessToken: String,
            refreshToken: String,
            expireThe: Date,
        },
    },
});

module.exports = {
    user,
    shortUser,
};
