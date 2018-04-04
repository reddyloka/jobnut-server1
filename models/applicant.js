var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var secret = require('../config/index').secret
var uniqueValidator = require('mongoose-unique-validator');
const saltRounds = 10;

const Schema = mongoose.Schema;
// add user schema
const applicantSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    hash: String,
    dob: Date,
    phone: String,
    education:[],
    experience:[],
    skillValue: String,

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
    jobApplied: []
});

applicantSchema.plugin(uniqueValidator, { message: 'is already taken '});

applicantSchema.methods.encryptPassword = function(key) {
    return bcrypt.hash(key, saltRounds).then((hash)=> {
        return this.hash = hash;
    })
}

applicantSchema.methods.decryptPassword = function(key) {
    // console.log('key is 🥇', key, hash)
    return bcrypt.compare(key, this.hash);
}

applicantSchema.methods.generateJWT = function() {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate()+60);

    return jwt.sign({
        id: this._id,
        email: this.email,
        exp: parseInt(exp.getTime() / 1000),
    }, secret);
};

applicantSchema.methods.toAuthJSON = function() {
    return {
        email: this.email,
        token: this.generateJWT()
    };
};

applicantSchema.methods.toProfileJSONFor = function(hr){
    return {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        dob: this.dob,
        phone: this.phone,
        education:this.education,
        experience:this.experience,
        skillValue: this.skillValue,
    }
}

mongoose.model('applicantModel', applicantSchema);