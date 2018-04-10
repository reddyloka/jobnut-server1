var mongoose = require('mongoose');
var router = require('express').Router();
var Post = mongoose.model('postModel');
const Hr = mongoose.model('hrModel');
var auth = require('../auth');
// const { authenticate } = require('../../_middleware/check-auth');


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

router.get('/:post_id', (req, res, next) => {
    console.log('game over posts ');
    user_details = JSON.parse(JSON.stringify(req.body));
    // if (user_details.isHr && user_details.status) {
        Post.findOne({_id: req.params.post_id}).then((user) => {
            console.log(user);
            
            if (!user) {
                return res.sendStatus(401);
            }
            return res.json( {
                data: user
            } );
        }).catch(next);
    // }
});

router.get('/', (req, res, next) => {
    console.log('game over posts:: ', req.query.id)
    user_details = JSON.parse(JSON.stringify(req.body));
    // if (user_details.isHr && user_details.status) {
        Post.find({hrRef: req.query.id}).populate('hrRef').then((user) => {
            if (!user) {
                return res.sendStatus(401);
            }
            return res.json({
                data: user
            });
        }).catch(next);
    // }
});


router.put('/new-post', auth, (req, res, next) => {
    console.log('new post', req.userData);
    // let post = new Post();
    const post_details = JSON.parse(JSON.stringify(req.body));
    
    Hr.findById(req.query.id).then((user) => {
        console.log('user is ',user);
        const post = new Post(post_details)
        post.hrRef = user;
        console.log("postPPPPPPP",post);
        return post.save().then(() => {
            return res.json({
                data: post.toJSONFor(req.query.id)
            })
        })
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
});




module.exports = router;