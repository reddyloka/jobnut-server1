var mongoose = require('mongoose');
var router = require('express').Router();
var Hr = mongoose.model('hrModel');
var Applicant = mongoose.model('applicantModel');
var auth = require('../auth');
var Post = mongoose.model('postModel');

// const app = express();

router.get('/hrs', async (req, res, next) => {
    
  try{
      console.log('data from hr', req.query.id)
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
  } catch(e){
      console.log("data from the hr details",e);
  }
 
});

router.put('/hrs/update', async (req, res, next) => {
    console.log("upadted AAAAAAAAAAA", req.query.id)
    const data = await Hr.findByIdAndUpdate(req.query.id, req.body)
    if(!data){
        return res.status(401).json({
            success:false,
            errors:{
                message:'User Doesn\'t Exist!'
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
    // console.log("upadted AAAAAAAAAAA",req.query.id)
    // console.log("upadted AAAAAAAAAAA",req.query.hrRef)
    const data = await Post.findById(req.query.id)
    const post = await post.applicants.push(req.query.hrRef)
        post.save();

        // post.update(
        //     { $addToSet: { applicants: req.query.hrRef  } }
        //  )
    })


 router.get('/users/appliedposts', async (req, res, next) => {
    // console.log("upadted AAAAAAAAAAA",req.query.id)
    // console.log("upadted AAAAAAAAAAA",req.query.hrRef)
    const data = await Post.find({applicants: req.query.id})
    if(!data){
        // eror
    }
    return res.json(data);
 });


 router.put('/hrs/expUpdate', async (req, res, next) => {
    console.log("upadted AAAAAAAAAAA",req.query.id)
    const data = await Hr.findById(req.query.id)
    const user1 = await user.experience.push(req.body);
    user1.save()

    if(!data){
        // eror
    }
    return res.json(
        {
            data: data
        }
    )
 });


router.put('/users/update', async (req, res, next) => {
    console.log("upadted AAAAAAAAAAA",req.query.id)
    const data = await Applicant.findByIdAndUpdate(req.query.id, req.body)
    if(!data){
        // eror
    }
    return res.json(
        {
            data: data
        }
    )
 });

 router.put('/users/eduUpdate', async (req, res, next) => {
    console.log("upadted AAAAAAAAAAA",req.query.id)
    const data = await Applicant.findById(req.query.id)
    const user = await user.education.push(req.body);
        user.save()
    // data.save()
    if(!data){
        // eror
    }
    return res.json(
        {
            data: data
        }
    )
 });

 router.put('/users/expUpdate', async (req, res, next) => {
    console.log("upadted AAAAAAAAAAA",req.query.id)
    const data = await Applicant.findById(req.query.id)
    const user = await user.experience.push(req.body);
        user.save()
    // data.save()
    if(!data){
        // eror
    }
    return res.json(
        {
            data: data
        }
    )
 });


router.get('/users', async(req, res, next) => {
   console.log(req.query.id);
    // if (user_details.isHr && user_details.status) {
   const user = await Applicant.findById(req.query.id)
        if (!user){
            return res.sendStatus(401);
        }
        return res.json(user);
    
    // }
});



router.post('/login', async(req, res, next) => {

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

router.get('/user', async(req, res, next) => {
    user_details = JSON.parse(JSON.stringify(req.body));
    if (user_details.isHr && user_details.status) {
        const user = await Applicant.find()
            if (!user) {
                return res.sendStatus(401);
            }
            return res.json({
                user: user
            });
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

router.post('/hr', async(req, res) => {
    // res.cookie("SESSIONID", jwtBearerToken, {httpOnly:true, secure:true});
    // console.log('chello', req.body);
    if (req.body.isApplicant) {
        const user_details = JSON.parse(JSON.stringify(req.body))
        let applicant = new Applicant(user_details);
        applicant.encryptPassword(user_details.password);
        // applicant.isApplicant = false;
        await applicant.save()
            return res.json({
                applicant: applicant.toProfileJSONFor()
            });
        

    } else if (req.body.isHr) {
        console.log('chello', req.body);
        const user_details = JSON.parse(JSON.stringify(req.body))
        let hr = new Hr(user_details);
        hr.encryptPassword(user_details.password);
        await hr.save()
            return res.json({
                hr: hr.toProfileJSONFor()
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

router.put('/posts', (req, res) => {
    var post_details_to_add = JSON.parse(JSON.stringify(req.body));
    postModelObj = new postModel(post_details_to_add);
    addNewPost(postModelObj);
    // send_success(res, resu)
})

async function addNewPost(postObj) {
    console.log(' 💤 ', postObj);
    await postObj.save()
    console.log(true);
    console.log('database saved!');
       

}

module.exports = router;