var mongoose = require('mongoose');
var router = require('express').Router();
var Hr = mongoose.model('hrModel');
var Applicant = mongoose.model('applicantModel');
var auth = require('../auth');

// const app = express();

router.get('/hrs', (req, res, next) => {
    // console.log('game over',req);    
    user_details = JSON.parse(JSON.stringify(req.body));
    // if (user_details.isHr && user_details.status) {
    Hr.find().then((user) => {
        // if (!user) {
        //     return res.sendStatus(401);
        // }
        return res.json(user.toProfileJSONFor());
    }).catch(next);
    // }
});

router.get('/users', (req, res, next) => {
    user_details = JSON.parse(JSON.stringify(req.body));
    // if (user_details.isHr && user_details.status) {
    Applicant.find().then((user) => {
        if (!user) {
            return res.sendStatus(401);
        }
        return res.json(user.toProfileJSONFor());
    }).catch(next);
    // }
});
router.post('/login', (req, res, next) => {

    user_details = JSON.parse(JSON.stringify(req.body));
    console.log('game over', user_details);
    if (!req.body.username) {
        return res.status(422).json({
            success: false,
            errors: {
                email: 'can\'t be blank'
            }
        })
    }

    if (!req.body.password) {
        return res.status(422).json({
            success: false,
            errors: {
                password: 'can\'t be blank'
            }
        })
    }
    if (user_details.isHr) {
        Hr.findOne({
            email: user_details.username
        }).then((user) => {
            if (!user) {
                return res.status(401).json({
                    success: false,
                    errors: {
                        message: 'Sign Up First!'
                    }
                });
            }
            return res.json({
                user: user.toAuthJSON()
            });
        }).catch(next);
    } else {
        Applicant.findOne({
            email: user_details.username
        }).then((user) => {
            console.log(' ❌', user, user_details.username)
            if (!user) {
                return res.status(401).json({
                    success: false,
                    errors: {
                        message: 'Sign Up First!'
                    }

                });
            }
            return res.json({
                user: user.toAuthJSON()
            });
        }).catch(next);
    }
});

router.get('/user', (req, res, next) => {
    user_details = JSON.parse(JSON.stringify(req.body));
    if (user_details.isHr && user_details.status) {
        Applicant.find().then((user) => {
            if (!user) {
                return res.sendStatus(401);
            }
            return res.json({
                user: user
            });
        }).catch(next);
    }
});

// function no_such_post() {
//     return make_error("no_such_post",
//         "The specified post does not exist");
// }

// function make_error(err, msg) {
//     var e = new Error(msg);
//     e.code = err;
//     return e;
// }

// failure and success

// function send_success(res, data) {
//     res.writeHead(200, {
//         "Content-Type": "application/json"
//     });
//     var output = {
//         error: null,
//         data: data
//     };
//     res.end(JSON.stringify(output) + "\n");
// }

// function send_failure(res, server_code, err) {
//     var code = (err.code) ? err.code : err.name;
//     res.writeHead(server_code, {
//         "Content-Type": "application/json"
//     });
//     res.end(JSON.stringify({
//         error: code,
//         message: err.message
//     }) + "\n");
// }
// failure and success

router.post('/hr', (req, res) => {
    // res.cookie("SESSIONID", jwtBearerToken, {httpOnly:true, secure:true});
    console.log('chello', req.body);
    if (req.body.isApplicant) {
        let applicant = new Applicant();
        const user_details = JSON.parse(JSON.stringify(req.body))
        applicant.fname = user_details.fname;
        applicant.lname = user_details.lname;
        applicant.isApplicant = user_details.isApplicant;
        applicant.status = user_details.status;
        applicant.isHr = user_details.isHr;
        applicant.email = user_details.email,
            applicant.encryptPassword(user_details.password);

        applicant.save().then(() => {
            return res.json({
                applicant: applicant.toProfileJSONFor()
            });
        }).catch();

    } else if (req.body.isHr) {
        let hr = new Hr();
        const user_details = JSON.parse(JSON.stringify(req.body))
        hr.fname = user_details.fname;
        hr.lname = user_details.lname;
        hr.isHr = user_details.isHr;
        hr.status = user_details.status;
        hr.isApplicant = user_details.isApplicant;
        hr.email = user_details.email,
            hr.encryptPassword(user_details.password);

        hr.save().then(() => {
            return res.json({
                hr: hr.toProfileJSONFor()
            });
        }).catch();
    }
});

router.put('/v1/hr', (req, res) => {
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

router.get('/v1/posts', (req, res) => {
    postModel.find((err, result) => {
        send_success(res, result);
    })
})

router.get('/v1/posts/:post_id', (req, res) => {
    var post_id = req.params.post_id;
    // console.log(' ❌ ', req.params.post_id);

    postModel.findOne({
        _id: post_id
    }, (err, result) => {
        if (err) {
            send_failure(res, 404, no_such_post());
        }
        console.log(' ❌ ', result);
        send_success(res, result);
        // return;
    })
})

router.put('/v1/posts', (req, res) => {
    var post_details_to_add = JSON.parse(JSON.stringify(req.body));
    postModelObj = new postModel(post_details_to_add);
    addNewPost(postModelObj);
    // send_success(res, resu)
})

function addNewPost(postObj) {
    console.log(' 💤 ', postObj);
    postObj.save()
        .then(() => {
            console.log(true);
            console.log('database saved!');
        }).catch((err) => {
            console.log('error detected');
        })

}

module.exports = router;