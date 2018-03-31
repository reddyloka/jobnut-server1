const express = require('express');
const jwt = require('jsonwebtoken')
// const mongodb = require('mongodb')
const mongoose = require('mongoose');
const morgan = require('morgan'),
    async = require('async'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    path = require('path'),
    multer = require('multer');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

// vars
const url = 'mongodb://localhost:27017/jobnut-server'
mongoose.connect(url);
const app = express();

// user schema

const Schema = mongoose.Schema;
const hrSchema = new Schema({
    fname: String,
    lname: String,
    email: String,
    password: String,
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
    jobsPost: []
});
const applicantSchema = new Schema({
    fname: String,
    lname: String,
    email: String,
    password: String,
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
// all jobs
const postSchema = new Schema({
    _jobID: Schema.Types.ObjectId,
    title: String,
    companyname: String,
    description: String,
    startdate: Date,
    enddate: Date,
    skills: String,
    location: String,
    salary: Number,
    experinece: String,
    dateOfJoining: Date,
    extraRequirement: String,
    noOfJobOpenings: Number,
    CompanyUrl: String,
    bondDetails: String,
    ReportingVenue: String,
    ResourcePersonContact: String,
    selectionProcedure: String,
    hrRef : {
        hrId: Schema.Types.ObjectId,
        ref: ['hrModelObj']
    },
    applicants: [
        {
            applicantId: Schema.Types.ObjectId,
            ref: ['applicantModelObj']
        }
    ]
});

let applicantModelObj;
let hrModelObj;

// Model for jobnut

const hrModel = mongoose.model('hrModel', hrSchema);
const applicantModel = mongoose.model('applicantModel', applicantSchema);
const postModel = mongoose.model('postModel', postSchema);

// trial model data
// const jobModelObj = new jobModel({
//     fname: 'Abhishek',
//     lname: 'Mittal',
//     email: 'email@gmail.com',
//     password: 'something123',
//     admin: true,
//     isHr: false,
//     isApplicant: false,
//     status: false,
//     dashboardData: []
// })

// making skema

// express interaction with client

// var _writingUsers;
// var _userList = JSON.parse(fs.readFileSync('./jobnut.json'));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(morgan('dev'));
app.use(cookieParser('catsonkeyboard'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/../static"));

// app.route('/')
const cert = fs.readFileSync('../jobnut/private/jobnut_private_key.key'); // get private key
// const token = jwt.sign({}, cert, { algorithm: 'RS256'});


app.get('/v1/hr', (req, res) => {
    hrModel.find((err, result) => {
        res.send(result)
    })
    // send_success(res, _userList)
});

function no_such_post() {
    return make_error("no_such_post",
        "The specified post does not exist");
}

function make_error(err, msg) {
    var e = new Error(msg);
    e.code = err;
    return e;
}

// failure and success

function send_success(res, data) {
    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    var output = {
        error: null,
        data: data
    };
    res.end(JSON.stringify(output) + "\n");
}

function send_failure(res, server_code, err) {
    var code = (err.code) ? err.code : err.name;
    res.writeHead(server_code, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: code, message: err.message }) + "\n");
}
// failure and success

app.post('/v1/hr', (req, res) => {
    // res.cookie("SESSIONID", jwtBearerToken, {httpOnly:true, secure:true});
    console.log('chello', req.body);
    var user_credentials = JSON.parse(JSON.stringify(req.body));
    hrModel.findOne({
        email: user_credentials.username
    }, ['password', 'email', 'isHr', 'isApplicant'], (err, result) => {
        if (err) {
            console.log('Error');
        }
        console.log(' 💯 ', result)
        const myPlaintextPassword = user_credentials.password;
        decryptPassword(myPlaintextPassword, result.password).then((response) => {
            if (!response) {
                res.send(new Promise((resolve, reject) => {
                    reject({
                        message: 'no-account',
                        isError: true,
                        status: false
                    })
                }))
                // console.log('error on line 165');
            }

            const jsonBearerToken = jwt.sign({
                fname: result.fname,
                email: result.email
            }, cert, {
                algorithm: 'RS256',
                expiresIn: '1h'
            }, function (err, token) {
                res.send({
                    token: token,
                    message: 'user authenticated',
                    status: true,
                    email: result.email,
                    isHr: result.isHr,
                    isApplicant: result.isApplicant
                });
            });
        });
    })
})

app.put('/v1/hr', (req, res) => {
    var user_details_to_add = JSON.parse(JSON.stringify(req.body));
    console.log(user_details_to_add);
    
    if (user_details_to_add.isApplicant) {
        applicantModel.findOne({
            email: user_details_to_add.email
        }, (err, reply) => {
            if (!err, reply) {
                console.log('user exist!');
                return false
            }
            // next();
        })
        applicantModelObj = new applicantModel(user_details_to_add);
        addNewUser(applicantModelObj);
    } else if (user_details_to_add.isHr) {
        hrModel.findOne({
            email: user_details_to_add.email
        }, (err, reply) => {
            if (!err, reply) {
                console.log('user exist!');
                return false
            }
            // next();
        })
        hrModelObj = new hrModel(user_details_to_add);
        addNewUser(hrModelObj);
    } else {
        console.log(new Error('Nothing in: ', user_details_to_add));
    }
    // console.log(jobModelObj);

})

app.get('/v1/posts', (req,res)=> {
    postModel.find((err, result) => {
        send_success(res, result);
    })
})

app.get('/v1/posts/:post_id', (req,res)=> {
    var post_id = req.params.post_id;
    // console.log(' ❌ ', req.params.post_id);
    
    postModel.findOne({_id: post_id},(err, result) => {
        if ( err ) {
            send_failure(res, 404, no_such_post());
        }
        console.log(' ❌ ', result);
        send_success(res, result);
        // return;
    })
})

app.put('/v1/posts', (req, res) => {
    var post_details_to_add = JSON.parse(JSON.stringify(req.body));
    postModelObj = new postModel(post_details_to_add);
    addNewPost(postModelObj);
    // send_success(res, resu)
})

function addNewPost (postObj) {
    console.log(' 💤 ', postObj);
    postObj.save()
    .then(() => {
        console.log(true);
        console.log('database saved!');
    }).catch((err) => {
        console.log('error detected');
    })
    
}



function addNewUser(userDetails) {

    // check if user already exists

    encryptPassword(userDetails['password'])
        .then((hash) => {
            userDetails['password'] = hash;
            return userDetails;
            // send_success(res, _userList)
        })
        .then((jobObj) => {
            console.log(true);
            console.log('model is : ', jobObj);
            jobObj.save()
                .then(() => {
                    console.log(true);
                    console.log('database saved!');
                }).catch((err) => {
                    console.log('error detected');
                })
        })
        .catch(err => {
            console.log('password: error', err);
        })

}

function encryptPassword(key) {
    return bcrypt.hash(key, saltRounds);
}

function decryptPassword(key, hash) {
    console.log('key is 🥇', key, hash)
    return bcrypt.compare(key, hash);
}

// mongo client url

// adding a new user to db

// retrieve all user


// baad ka kaaam

// app.get('/', function (req, res) {
//     // res.send('hi there')
//     res.json({
//         message: 'Welcome to the Api'
//     });
// });

// app.post('/api/posts', verifyToken, (req, res) => {
//     jwt.verify(req.token, 'secretKey', (err, authData) => {
//         if ( err ) res.sendStatus(403);
//         res.json({
//             message:'post created',
//             authData
//         })
//     });
//     res.json({
//         message: 'Post created..' 
//     })
// });
// app.post('/api/login', (req, res) => {
//     // mock user
//     const user = {
//         _id: 1,
//         username: 'abhishek',
//         password: 'something123'
//     }

//     jwt.sign({user}, 'secretkey', { expiresIn: '30s' }, (err,token) => {
//         res.json({
//             token
//         });
//     });
// });

// // verify token
// // Authorization: Bearer <access_token>

// function verifyToken(req, res, next) {
//     // get auth header value
//     const bearerHeader = req.headers['authorization']
//     // check if bearer is undefined
//     if (typeof bearerHeader !== undefined) {
//         // split at the space
//         const bearer = bearerHeader.split(' ');
//         // get token from Array
//         const bearerToken = bearer[1];
//         // set the token
//         req.token = bearerToken;
//         // next middleware
//         next(); 

//     } else {
//         // Forbidden
//         res.sendStatus(403)
//     }
// }

app.listen(3000,
    // process.env.PORT, process.env.IP,
    function () {
        console.log('server started', process.env.PORT, process.env.IP);

    });