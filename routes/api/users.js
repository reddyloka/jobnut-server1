const path = require('path');
const fs = require('fs');
const express = require('express');
var mongoose = require('mongoose');
var router = require('express').Router();
var Hr = mongoose.model('hrModel');
var Applicant = mongoose.model('applicantModel');
var auth = require('../auth'),
    multer = require('multer');
// const authenticate = require('../../_middleware/check-auth');
var Post = mongoose.model('postModel');
var upload = multer({ dest: 'uploads/' });
router.use(express.static(__dirname + '/../static'));

// const app = express();
function send_failure(code, message) {
    return status(code).json({
        success: false,
        errors: {
            message
        }
    })
}

router.get('/hrs', async (req, res, next) => {
    console.log('data from hr')
    try {
        console.log('data from hr', req.query.id)
        const user = await Hr.findById(req.query.id)
        if (!user) {
            return res.status(401).json({
                success: false,
                errors: {
                    message: 'User Doesn\'t Exist !'
                }
            })
        }
        return res.json({
            success: true,
            data: user,
            message: ''
        });
    } catch (e) {
        console.log("data from the hr details", e);
    }
});

router.put('/hrs/update', async (req, res, next) => {
    console.log("in hr upadted fn", req.query.id)
    const data = await Hr.findByIdAndUpdate(req.query.id, req.body)
    if (!data) {
        return res.status(401).json({
            success: false,
            errors: {
                message: 'User Doesn\'t Exist!'
            }
        })
    }
    return res.json(
        {
            data: data
        }
    )
});

router.put('/users/apply', async (req, res, next) => {
    const data = await Post.findById(req.query.id)
    const post = await data.applicants.push(req.query.hrRef)
    post.save();
})

router.get('/users/appliedposts', async (req, res, next) => {
    const data = await Post.find({ applicants: { _id: req.query.id, isShortlisted } })
    if (!data) {
        return res.sendStatus(401);
    }
    return res.json(data);
});

router.put('/hrs/expUpdate', async (req, res, next) => {
    console.log("in upadted experience", req.query.id)
    console.log('data in body',req.body);

    const data = await Hr.findByIdAndUpdate(req.query.id, {'experience': req.body})

    if (!data) {
        return res.sendStatus(401);
    }
    return res.json(
        {
            data: data
        }
    )
});

router.put('/hrs/skillsUpdate', async (req, res, next) => {
    console.log("in upadted skills", req.query.id)
    try {
        const data = await Hr.findByIdAndUpdate(req.query.id, {'skillValue': req.body.skills})
        if (!data) {
            return res.sendStatus(401);
        }
        return res.json(
            {
                data: data
            }
        )
    } catch (error) {
        console.log('Error', error);
    }
});

router.put('/users/update', async (req, res, next) => {
    console.log("upadted AAAAAAAAAAA", req.query.id)
    try {
        const data = await Applicant.findByIdAndUpdate(req.query.id, req.body)
        if (!data) {
            return res.sendStatus(401);
        }
        return res.json({
            data: data
        })
    } catch (error) {
        console.log('Error occured', error);
    }
});

router.put('/users/eduUpdate', async (req, res, next) => {
    console.log("upadted AAAAAAAAAAA", req.query.id)
    const data = await Applicant.findById(req.query.id)
    const user = await user.education.push(req.body);
    user.save()
    if (!data) {
        return res.sendStatus(401);
    }
    return res.json(
        {
            data: data
        }
    )
});

router.put('/users/expUpdate', async (req, res, next) => {
    console.log("upadted AAAAAAAAAAA", req.query.id)
    const data = await Applicant.findById(req.query.id)
    const user = await user.experience.push(req.body);
    user.save()
    if (!data) {

    }
    return res.json(
        {
            data: data
        }
    )
});

router.get('/users', (req, res, next) => {
    console.log('iski ,aaplsn', req.query.id);
    Applicant.findById(req.query.id).then((user) => {
        if (!user) {
            return res.sendStatus(401);
        }
        return res.json(user);
    }).catch(next);

});

router.post('/login', async (req, res, next) => {

    user_details = JSON.parse(JSON.stringify(req.body));
    console.log('game over', user_details);
    if (!req.body.username) {
        return res.send_failure(422, 'can\'t be blank')
    }

    if (!req.body.password) {
        return res.send_failure(422, 'can\'t be blank')
    }
    if (user_details.isHr) {
        const user = await Hr.findOne({
            email: user_details.username
        })
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

    } else {
        const user = await Applicant.findOne({
            email: user_details.username
        })
        console.log(' ❌', user, user_details.username)
        if (!user) {
            return res.sendStatus(401);
        }
        return res.json({
            user: user.toAuthJSON()
        });

    }
});

router.get('/user', async (req, res, next) => {
    try {
        user_details = JSON.parse(JSON.stringify(req.body));
        if (user_details.isHr && user_details.status) {
            const data = await Applicant.find()
            if (!data) {
                return res.sendStatus(401);
            }
            return res.json({
                data: data
            });
        }
    } catch (error) {
        console.log('Error', error);
    }
});

// failure and success
function send_success(res, data, message) {
    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    var output = {
        success: true,
        error: null,
        data: data,
        message: message
    };
    res.end(JSON.stringify(output) + "\n");
}

// failure and success
router.post('/hr', async (req, res) => {

    if (req.body.isApplicant) {
        const user_details = JSON.parse(JSON.stringify(req.body))
        let applicant = new Applicant(user_details);
        applicant.encryptPassword(user_details.password);
        applicant.save().then(() => {
            return send_success(res, applicant.toProfileJSONFor(), 'Applicant Created!')
        }).catch(err => {
            console.log(err);
        });
        notifyFunctions.signupNotification(user_details.email);

    } else if (req.body.isHr) {
        console.log('chello', req.body);
        const user_details = JSON.parse(JSON.stringify(req.body))
        let hr = new Hr(user_details);
        hr.encryptPassword(user_details.password);
        hr.save().then(() => {
            return send_success(res, hr.toProfileJSONFor(), 'Applicant Created!');
        }).catch(err => {
            console.log(err);

        });
        notifyFunctions.signupNotification(user_details.email);
    }
});

router.post('/user/upload-profile', upload.any(), async (req, res, next) => {
    try {
        console.log('iefenside', req.query);
        let user;
        if (Boolean(req.query.isHr) === 'true') {
            console.log('user is hr', req.query.isHr);
            user = await Hr.findById(req.query.id)
            console.log(req.query.id)
        } else if (req.query.isApplicant === 'true') {
            console.log('user is applicant');
            user = await Applicant.findById(req.query.id)
        } else {
            throw new Error('Unauthorized Attempt.');
        }

        if (!user) {
            send_failure(404, 'no such user!');
        }
        console.log('user is : ', user.email, user.profile_photo)
        user.profile_photo = null;

        if (!req.files) {
            console.log('no files');

            return;
        }
        console.log('files are : ', req.files);

        file = req.files[0];
        const extention = await path.extname(file.originalname);
        const final_fn = file.filename + extention;

        console.log(':::', final_fn, '  :: ', file.path)
        if (file.fieldname == 'profile_photo') {

            console.log('insde system::');
            if (user.isHr) await Hr.findByIdAndUpdate(req.query.id, {
                profile_photo: final_fn
            });
            if (user.isApplicant) await Applicant.findByIdAndUpdate(req.query.id, {
                profile_photo: final_fn
            });
        } else {

        }

        console.log(fs.renameSync(file.path, 'D:/Users/mitta/Desktop/Jobnut/jobnut-server/static/images/' + final_fn));

        console.log('user is :mlmlm ', user.email, user.profile_photo)
        return send_success(res, final_fn, 'profile pic uploaded!')
    } catch (error) {

    }
})

module.exports = router;