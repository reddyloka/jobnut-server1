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

var upload = multer({ dest: 'uploads/'});
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

// router.get('/hrs', async (req, res, next) => {

//     console.log('data from hr')
//   try{
//       console.log('data from hr',req.query.id)
//     const user = await Hr.findById(req.query.id)
//     if(!user){
//         return res.status(401).json({
//             success:false,
//             errors:{
//                 message:'User Doesn\'t Exist !'
//             }
//         })
//     }
//     console.log(user.profile_photo);

//     return res.json(user);
//   } catch(e){
//       console.log("data from the hr details",e);
//   }

//     // }
// });

// router.put('/users/update', async (req, res, next) => {
//     console.log("upadted AAAAAAAAAAA",req.query.id)
//     const data = await Applicant.findByIdAndUpdate(req.query.id, req.body)
//     if(!data){
//         // eror
//     }
//     return res.json(
//         {
//             data: data
//         }
//     )
//  });


// router.get('/users', async (req, res, next) => {
//     console.log(req.query.id);
//     try {
//         const user = await Applicant.findById(req.query.id);
//         if (!user) {
//             return res.send_failure(401, 'User Doesn\'t Exist!');
//         }
//         return res.json(user);
//     } catch (error) {
//         console.log('Some Other Error occured: ', error);
//     }
// });



// router.post('/login', (req, res, next) => {
//     user_details = JSON.parse(JSON.stringify(req.body));
//     console.log('game over', user_details);
//     if (!req.body.username) {
//         return res.status(422).json({
//             success: false,
//             errors: {
//                 email: 'can\'t be blank'
//             }
//         })
//     }

//     if (!req.body.password) {
//         return res.status(422).json({
//             success: false,
//             errors: {
//                 password: 'can\'t be blank'
//             }
//         })
//     }
//     if (user_details.isHr) {
//         Hr.findOne({
//             email: user_details.username
//         }).then((user) => {
//             if (!user) {
//                 return res.status(401).json({
//                     success: false,
//                     errors: {
//                         message: 'Sign Up First!'
//                     }
//                 });
//             }
//             return res.json({
//                 user: user.toAuthJSON()
//             });
//         }).catch(next);
//     } else {
//         Applicant.findOne({
//             email: user_details.username
//         }).then((user) => {
//             console.log(' ❌', user, user_details.username)
//             if (!user) {
//                 return res.status(401).json({
//                     success: false,
//                     errors: {
//                         message: 'Sign Up First!'
//                     }

//                 });
//             }
//             return res.json({
//                 user: user.toAuthJSON()
//             });
//         }).catch(next);
//     }
// });

// router.get('/user', (req, res, next) => {
//     user_details = JSON.parse(JSON.stringify(req.body));
//     if (user_details.isHr && user_details.status) {
//         Applicant.find().then((user) => {
//             if (!user) {
//                 return res.sendStatus(401);
//             }
//             return res.json({
//                 user: user
//             });
//         }).catch(next);
//     }
// });

// // function no_such_post() {
// //     return make_error("no_such_post",
// //         "The specified post does not exist");
// // }

// // function make_error(err, msg) {
// //     var e = new Error(msg);
// //     e.code = err;
// //     return e;
// // }

// // failure and success

// // function send_success(res, data) {
// //     res.writeHead(200, {
// //         "Content-Type": "application/json"
// //     });
// //     var output = {
// //         error: null,
// //         data: data
// //     };
// //     res.end(JSON.stringify(output) + "\n");
// // }

// // function send_failure(res, server_code, err) {
// //     var code = (err.code) ? err.code : err.name;
// //     res.writeHead(server_code, {
// //         "Content-Type": "application/json"
// //     });
// //     res.end(JSON.stringify({
// //         error: code,
// //         message: err.message
// //     }) + "\n");
// // }
// // failure and success


// router.put('/v1/hr', (req, res) => {
//     var user_details_to_add = JSON.parse(JSON.stringify(req.body));
//     console.log(user_details_to_add);

//     if (user_details_to_add.isApplicant) {
//         applicantModel.findOne({
//             email: user_details_to_add.email
//         }, (err, reply) => {
//             if (!err, reply) {
//                 console.log('user exist!');
//                 return false
//             }
//             // next();
//         })
//         applicantModelObj = new applicantModel(user_details_to_add);
//         addNewUser(applicantModelObj);
//     } else if (user_details_to_add.isHr) {
//         hrModel.findOne({
//             email: user_details_to_add.email
//         }, (err, reply) => {
//             if (!err, reply) {
//                 console.log('user exist!');
//                 return false
//             }
//             // next();
//         })
//         hrModelObj = new hrModel(user_details_to_add);
//         addNewUser(hrModelObj);
//     } else {
//         console.log(new Error('Nothing in: ', user_details_to_add));
//     }
//     // console.log(jobModelObj);

// })

// router.get('/v1/posts', (req, res) => {
//     postModel.find((err, result) => {
//         send_success(res, result);
//     })
// })

// router.get('/v1/posts/:post_id', (req, res) => {
//     var post_id = req.params.post_id;
//     // console.log(' ❌ ', req.params.post_id);

//     postModel.findOne({
//         _id: post_id
//     }, (err, result) => {
//         if (err) {
//             send_failure(res, 404, no_such_post());
//         }
//         console.log(' ❌ ', result);
//         send_success(res, result);
//         // return;
//     })
// })

// router.put('/posts', (req, res) => {
//     var post_details_to_add = JSON.parse(JSON.stringify(req.body));
//     postModelObj = new postModel(post_details_to_add);
//     addNewPost(postModelObj);
//     // send_success(res, resu)
// })

// function addNewPost(postObj) {
//     console.log(' 💤 ', postObj);
//     postObj.save()
//         .then(() => {
//             console.log(true);
//             console.log('database saved!');
//         }).catch((err) => {
//             console.log('error detected');
//         })

// }

// module.exports = router;
// const app = express();

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
        return res.json(user);
    } catch (e) {
        console.log("data from the hr details", e);
    }
    // }
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


router.get('/users', async (req, res, next) => {
    console.log(req.query.id);
    try {
        // if (user_details.isHr && user_details.status) {
        const data = await Applicant.find()
        if (!data) {
            return res.sendStatus(401);
        }
        return res.json(data);
    } catch (error) {
        console.log('Error: ', error);
    }
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

router.post('/hr', async (req, res) => {
    // res.cookie("SESSIONID", jwtBearerToken, {httpOnly:true, secure:true});
    console.log('chello', req.body);
    if (req.body.isApplicant) {
        const user_details = JSON.parse(JSON.stringify(req.body))
        let applicant = new Applicant(user_details);
        applicant.encryptPassword(user_details.password);
        // applicant.isApplicant = false;
        const user = await applicant.save()
        if (!user) {
            send_failure(401, 'please try again')
        }
        return res.json({
            data: applicant.toProfileJSONFor()
        });

    } else if (req.body.isHr) {
        const user_details = JSON.parse(JSON.stringify(req.body))
        let hr = new Hr(user_details);
        hr.encryptPassword(user_details.password);
        const user = await hr.save()
        if (!user) {
            send_failure(401, 'please try again')
        }
        return res.json({
            data: hr.toProfileJSONFor()
        });
    }
});



router.post('/user/upload-profile', upload.any(), async (req, res, next) => {
    try {

        console.log('inside', req.query);


        let user;
        if (req.query.isHr) {
            console.log('kjgj');

            user = await Hr.findById(req.query.id)
            console.log(req.query.id)
        } else if (req.query.isApplicant) {
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

        file = req.files[0];
        // console.log('file is: ', req.files[0]);
        const extention = await path.extname(file.originalname);
        // if(!acceptaableExtention(extention)) {
        //     fs.unlink(file.path);
        //     return;   
        // }

        const final_fn = file.filename + extention;

        // console.log(':::', final_fn, '  :: ', file.path)
        if (file.fieldname == 'profile_photo') {
            await Hr.findByIdAndUpdate(req.query.id, {
                profile_photo: final_fn
            });
        }

        
        console.log(fs.renameSync(file.path, 'D:/Users/mitta/Desktop/Jobnut/jobnut-server/static/images/' + final_fn));
        
        console.log('user is :mlmlm ', user.email, user.profile_photo)
        res.status(201).json({
            success: true,
            data: final_fn,
            message: 'profile pic uploaded!'
        })
    } catch (error) {

    }
})

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
    try {
        const data = await postObj.save()
        if (!data) {
            return res.sendStatus(401);
        }
        console.log(true);
        console.log('database saved!');
    } catch (error) {
        console.log('Error', error);
    }
}

router.post('v1/hr/update', async (req, res, next) => {
    const hr_detail1 = JSON.parse(JSON.stringify(req.body))
    let hr = new Hr(user_details);
    await hr.save()
    return res.json({
        hr: hr.toProfileJSONFor()
    });

})

module.exports = router;