var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var secret = require('../config/index').secret
var uniqueValidator = require('mongoose-unique-validator');
const saltRounds = 10;

const Schema = mongoose.Schema;
// add the schema

const hrSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    hash: String,
    industry: String,
    designation: String,
    address: String,
    country: String,
    state: String,
    city: String,
    phone: String,
    jobProfile: String,
    profile_photo: {
        type: String,
    },
    skillValue: Array,
    jobProfile: String,
    admin: {
        type: Boolean,
        default: false
    },
    isHr: {
        type: Boolean,
        default: false
    },
    isApplicant: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: false
    },
    // chats: [{
    //     applicant: {
    //         isAccepted: Boolean,
    //         ref: Schema.Types.ObjectId(),
    //         message: [{
    //             String,
    //         }, {timestamp: true} ]
    //     }
    // }]
});

hrSchema.plugin(uniqueValidator, {
    message: 'is already taken '
});

hrSchema.methods.encryptPassword = function (key) {
    bcrypt.hash(key, saltRounds).then((hash) => {
        console.log(' ❌', this.jobsPost)
        setTimeout(() => {
            console.log(' ❌', this.jobsPost)
        }, 5000)
        return this.password = hash;
    });
}


hrSchema.methods.decryptPassword = function (key) {
    console.log('key is 🥇', key, this.hash)
    return bcrypt.compare(key, this.hash);
}

hrSchema.methods.generateJWT = function () {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this._id,
        email: this.email,
        exp: parseInt(exp.getTime() / 1000),
    }, secret);
};

hrSchema.methods.toAuthJSON = function () {
    return {
        id: this._id,
        isHr: this.isHr,
        isApplicant: this.isApplicant,
        status: this.status,
        token: this.generateJWT()
    };
};

hrSchema.methods.toProfileJSONFor = function (hr) {
    return {
        _id: this._id,
        isHr: this.isHr,
        isApplicant: this.isApplicant,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName
    }
}


let hrModel = mongoose.model('hrModel', hrSchema);