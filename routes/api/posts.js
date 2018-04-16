var mongoose = require('mongoose');
var router = require('express').Router();
var Post = mongoose.model('postModel');
const Hr = mongoose.model('hrModel');
var Applicant = mongoose.model('applicantModel');
var auth = require('../auth');
// const { authenticate } = require('../../_middleware/check-auth');

function send_failure(code, message) {
    return status(code).json({
        success: false,
        errors: {
            message
        }
    })
}

router.get('/all/post', (req, res, next) => {
    // user_details = JSON.parse(JSON.stringify(req.body));
//   console.log('dffgfgfgffgfhhg');
  
        Post.find().then((user) => {
            if (!user) {
                return res.sendStatus(401);
            }
            return res.json( {
                data: user
            } );
        }).catch(next);
    // }
});


// router.get('/applieddetails',  async (req, res, next) => {
//     console.log('game over posts:: ', req.query.id)
//       const data=  await Post.findById(req.query.id).populate(
//           {
//               path:'applicants',
//               match: {
//                   firstName: { $gte: 'Gopi'}
//               }
//             }
//         ).populate('hrRef')
//             if (!data) {
//                 return res.sendStatus(401);
//             }else{
//         //         data.applicants.map((ele)=>{
//         //      Applicant.findById(ele).then((user) => {
//         //     if(user){
//         //         return res.json({
//         //         data: user
//         //     });
//         //     }
//         // })
//         // })
//         return res.json({
//                     data
//                 });
//         }

// });

router.get('/:post_id', (req, res, next) => {
    console.log('game over posts ');
    // user_details = JSON.parse(JSON.stringify(req.body));
    // if (user_details.isHr && user_details.status) {
        Post.findOne({_id: req.params.post_id}).populate('applicants').then((user) => {
            if (!user) {
                return res.sendStatus(401);
            }
            return res.json( {
                data: user
            });
        }).catch(next);
    // }
});

router.get('/', auth ,(req, res, next) => {
    console.log('game over posts:: ', req.userData)
    // user_details = JSON.parse(JSON.stringify(req.body));
    // if (user_details.isHr && user_details.status) {
        Post.find({hrRef: req.userData.id}).then((user) => {
            if (!user) {
                return res.sendStatus(401);
            }
            return res.json({
                data: user
            });
        }).catch(next);
    // }
});

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


router.put('/new-post', auth, async (req, res, next) => {
    console.log('new post', req.userData);
    // let post = new Post();
    const post_details = JSON.parse(JSON.stringify(req.body));
    
    const user = await Hr.findById(req.userData.id);
    console.log('user is ',user);
        const post = new Post(post_details);
        post.hrRef = user;+
        console.log("postPPPPPPP",post);
        const result = await post.save();

        if (!result) {
            res.send_failure(401, 'Try Again!')
        }
        send_success(res, result, 'Successfully Saved!');

        console.log('result::',result);
        // return post.save().then(() => {
        //     return res.json({
        //         data: post.toJSONFor(req.query.id)
        //     })
        // })
    })



    
   
    // post.title = post_details.title;
    // post.companyname = post_details.companyname;
    // post.description = post_details.description;
    // post.startdate = post_details.startdate;
    // post.enddate = post_details.enddate;
    // post.skills = post_details.skills;
    // post.location = post_details.location;
    // post.salary = post_details.salary;
    // post.experinece = post_details.experinece;
    // post.dateOfJoining = post_details.dateOfJoining;
    // post.extraRequirement = post_details.extraRequirement;
    // post.noOfJobOpenings = post_details.noOfJobOpenings;
    // post.CompanyUrl = post_details.CompanyUrl;
    // post.bondDetails = post_details.bondDetails;
    // post.ReportingVenue = post_details.ReportingVenue;
    // post.ResourcePersonContact = post_details.ResourcePersonContact;
    // post.selectionProcedure = post_details.selectionProcedure;

    // post.save().then(() => {
    //     return res.json({
    //         post: post.toJsonFor(req.query.id)
    //     });
    // }).catch();



module.exports = router;