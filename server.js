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
    dashboardData: {
        dashboardActive: {
            type: Boolean,
            defau: false
        }
    }
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
    dashboardData: {
        dashboardActive: {
            type: Boolean,
            defau: false
        }
    }
});

// Model for jobnut

const hrModel = mongoose.model('hrModel', hrSchema);
const applicantModel = mongoose.model('applicantModel', applicantSchema);

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
                        }
                );
            });
        });
    })
})

app.put('/v1/hr', (req, res) => {
    var user_details_to_add = JSON.parse(JSON.stringify(req.body));
    console.log(user_details_to_add);

    encryptPassword(user_details_to_add['password'])
        .then((hash) => {
            user_details_to_add['password'] = hash;
            return user_details_to_add;
            // send_success(res, _userList)
        })
        .then((jsonData) => {
            let jobModelObj;

            if (jsonData.isApplicant) {
                console.log(true);
                jobModelObj = new applicantModel(jsonData);
            } else if (jsonData.isHr) {
                console.log(true);
                jobModelObj = new hrModel(jsonData);
            } else {
                console.log(true);
                console.log(new Error('Nothing in: ', jsonData));
            }

            return jobModelObj;

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
})

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