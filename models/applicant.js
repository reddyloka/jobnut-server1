var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var secret = require('../config/index').secret
var uniqueValidator = require('mongoose-unique-validator');
const saltRounds = 10;

const Schema = mongoose.Schema;
// add user schema
const applicantSchema = new Schema({
    fname: String,
    lname: String,
    email: String,
    hash: String,
    dob: Date,
    phone: String,
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
    jobApplied: [{
        type: Schema.Types.ObjectId,
        ref: 'postModel'
    }]
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
        id: this._id,
        isHr: this.isHr,
        isApplicant: this.isApplicant,
        status: this.status,
        token: this.generateJWT()
    };
};

applicantSchema.methods.toProfileJSONFor = function(hr){
    return {
        email: this.email,
        fname: this.fname,
        lname: this.lname
    }
}

let applicantModel = mongoose.model('applicantModel', applicantSchema);