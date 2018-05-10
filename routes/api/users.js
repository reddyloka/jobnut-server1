
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
// var upload = multer({ dest: 'uploads/' });
var notifyFunctions = require('./notify');

var upload = multer({ dest: 'uploads/'});
router.use(express.static(__dirname + '/../static'));

router.get('/hrs', async (req, res, next) => {
      console.log('data from hr',req.query.id)
    const user = await Hr.findById(req.query.id)
    if(!user){
        return res.status(401).json({
            success:false,
            errors:{
                message:'User Doesn\'t Exist !'
            }
        })
    }
    return res.json(user);
 
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

 router.put('/users/apply', async (req, res) => {
    console.log
    const data =  await Post.findByIdAndUpdate(req.query.id, {
        $push: { applicants: {
            _id: req.query.hrRef
           }}
      })
    // notifyFunctions.jobNotification(req.query.hrRef);
    if(data){
        console.log('success')
    return res.json(data);
    }else{
        console.log('fail')
    }
 });

 router.get('/users/appliedposts', async (req, res) => {
    const data = await Post.find({'applicants._id': req.query.id})
    if(!data){
     console.log('main',data)
    }
    console.log('main',data)
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
    console.log("upadted AAAAAAAAAAA",req.query.id)
    const data = await Applicant.findByIdAndUpdate(req.query.id, req.body)
    if(!data){
        console.log('fail')
    }
    return res.json(
        {
            data: data
        }
    )
 });

router.put('/users/eduUpdate', async (req, res, next) => {
    console.log("upadted AAAAAAAAAAA", req.query.id)
    const data = await Applicant.findById(req.query.id)
   
    if (!data) {
        return res.sendStatus(401);
    }else{
        data.education.push(req.body);
        data.save()
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
    if (!data) {
      
    }else{
        data.experience.push(req.body);
        data.save()
    }
    return res.json(
        {
            data: data
        }
    )
 });


router.get('/users', (req, res, next) => {
   console.log(req.query.id);
    // if (user_details.isHr && user_details.status) {
    Applicant.findById(req.query.id).then((user) => {
        if (!user){
            return res.sendStatus(401);
        }
        return res.json(user);
    }).catch(next);
    
    // }


    
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
    console.log('user login details', user_details);
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
        const user=await Hr.findOne({email: user_details.username});
        if(user){
            user.decryptPassword(user_details.password).then((user1)=>{
                console.log('HR password match status',user1);
            if (!user1) {
                return res.status(401).json({
                    success: false,
                    errors: {
                        message: 'Password Incorrect??'
                    }
                });
            }
            return res.json({
                user: user.toAuthJSON()
            });
        })
    } else{
        return res.status(401).json({
            success: false,
            errors: {
                message: 'Signup first'
            }
        });
    }

    } else {
        const user=await Applicant.findOne({email: user_details.username});
           if(user){
            user.decryptPassword(user_details.password).then((user1)=>{
                    console.log('Applicant password match status',user1);
                if (!user1) {
                    return res.status(401).json({
                        success: false,
                        errors: {
                            message: 'Password Incorrect??'
                        }
                    });
                }
                return res.json({
                    user: user.toAuthJSON()
                });
            })
        }else{
            return res.status(401).json({
                success: false,
                errors: {
                    message: 'Signup first'
                }
            });
        }
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

// failure and success
function send_failure(code, message) {
    return status(code).json({
        success: false,
        errors: {
            message
        }
    })
}

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

router.post('/resetPassword',async (req,res)=>{
    const user_details = JSON.parse(JSON.stringify(req.body));
    console.log('reset userdetails',user_details);
    if(user_details.isHr){
        let data=await Hr.findOne({email:user_details.email});
        let hr = new Hr(data);
        hr.encryptPassword(user_details.password);
        hr.save().then((data) => {
           console.log('hr updated',data);
           return res.json({
               data: data
           });
        });
    }
    else 
    { 
     let data=await Applicant.findOne({email:user_details.email});
     let applicant = new Applicant(data);
     applicant.encryptPassword(user_details.password);
     applicant.save().then((data) => {
        console.log(' applicant updated',data);
        return res.json({
            data: data
        });
     });
    }
})

router.post('/checkMailId',async (req,res)=>{
    const user_details = JSON.parse(JSON.stringify(req.body));
    if(!user_details.isHr){
    let data=await Applicant.findOne({email:user_details.email});
    console.log(' applicant data',data);
      if(data){
        return res.json({
            data: data,
            status:true
        });
    }else{
        return res.json({
            status:false
        });
    }
}
else if(user_details.isHr){
    let data=await Hr.findOne({email:user_details.email});
    console.log(' hr data',data);
      if(data){
        return res.json({
            data: data,
            status:true
        });
    }else{
        return res.json({
            status:false
        });
    }
}
})

router.post('/hr', (req, res) => {
    // res.cookie("SESSIONID", jwtBearerToken, {httpOnly:true, secure:true});
    // console.log('chello', req.body);
    if (req.body.isApplicant) {
        const user_details = JSON.parse(JSON.stringify(req.body))
        let applicant = new Applicant(user_details);
        applicant.encryptPassword(user_details.password);
        applicant.save().then(() => {
            // notifyFunctions.signupApplicantNotification(data.email);
            return res.json({
                applicant: applicant.toProfileJSONFor()
            });
        }).catch(err => {
            console.log(err);
        });
       

    } else if (req.body.isHr) {
        console.log('hr data', req.body);
        const user_details = JSON.parse(JSON.stringify(req.body))
        let hr = new Hr(user_details);
        hr.encryptPassword(user_details.password);
        hr.save().then((data) => {
            console.log('new data ', data);
            // notifyFunctions.signupHrNotification(data.email);
            return res.json({
                hr: hr.toProfileJSONFor()
            });
        }).catch(err => {
            console.log(err);

        });
        
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

router.put('/posts', (req, res) => {
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

// do not try to touch or delete it :angry:

router.post('/user/upload-profile', upload.any(), async (req, res, next) => {
    try {
        console.log('iefenside', req.query);
        let user;
        if ( Boolean(req.query.isHr) === 'true' ) {
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
        // console.log('file is: ', req.files[0]);
        const extention = await path.extname(file.originalname);
        // if(!acceptaableExtention(extention)) {
        //     fs.unlink(file.path);
        //     return;   
        // }

        const final_fn = file.filename + extention;

        console.log(':::', final_fn, '  :: ', file.path)
        if (file.fieldname == 'profile_photo') {
            
            console.log('insde system::');
            if ( user.isHr ) await Hr.findByIdAndUpdate(req.query.id, {
                profile_photo: final_fn
            });
            if ( user.isApplicant ) await Applicant.findByIdAndUpdate(req.query.id, {
                profile_photo: final_fn
            });
        }else {

        }

        
        console.log(fs.renameSync(file.path, 'D:/Users/mitta/Desktop/Jobnut/jobnut-server/static/images/' + final_fn));
        
        console.log('user is :mlmlm ', user.email, user.profile_photo)
        return send_success(res,final_fn,'profile pic uploaded!')
    } catch (error) {

    }
})

// do not try to touch or delete it :angry:

module.exports = router;