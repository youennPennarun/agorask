const mongoose = require('mongoose');

const application = mongoose.Schema({
    version: {
        type: String,
        required: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    boxId: {
        type: String,
        required: true,
    },
    downloadUrl: {
        type: String,
        required: true,
    },
});

module.exports = {
    application,
};
