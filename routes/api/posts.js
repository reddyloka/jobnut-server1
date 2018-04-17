var mongoose = require('mongoose');
var router = require('express').Router();
var Post = mongoose.model('postModel');
const Hr = mongoose.model('hrModel');
var auth = require('../auth');



router.put('/shortlist', async (req, res, next) => {
    console.log("upadted AAAAAAAAAAA",req.query.id)
    console.log("upadted AAAAAAAAAAA",req.query.hrRef)
    console.log("upadted AAAAAAAAAAA",req.body)

      const data = await Post.findByIdAndUpdate(req.query.id,{ $set: {applicants: {
          _id: req.query.hrRef,
          isShortlisted: req.body.isShortlisted 
        } }})
       if(data){
        res.json(data)
       }
 });
router.get('/all/post', async (req, res, next) => {

    try {
        const data = await Post.find()
        if (!data) {
            return res.sendStatus(401);
        }
        return res.json({
            data: data
        });
    }
    catch (error) {
        console.log('Error', error);
    }
});

router.put('/update', async (req, res, next) => {

    try {
        console.log("upadted AAAAAAAAAAA",req.query.id)
        console.log("upadted AAAAAAAAAAA",req.body)
        const data = await Post.findByIdAndUpdate(req.query.id, req.body)
        if(!data){

        }
        console.log(data);
        
        return res.json(
            {
                data: data
            }
        )
    }
    catch (error) {
        console.log('Error', error);
    }
});

router.get('/:post_id', async (req, res, next) => {
    console.log('game over posts ');
    try {
        user_details = JSON.parse(JSON.stringify(req.body));
        const user = await Post.findOne({ _id: req.params.post_id })
        .populate('applicants._id')
        if (!user) {
            return res.sendStatus(401);
        }
        return res.json({
            data: user
        });
    }
    catch (error) {
        console.log('Error', error);
    }
});

router.get('/', async (req, res, next) => {
    console.log('game over posts:: ', req.query.hrRef)
    try {
        user_details = JSON.parse(JSON.stringify(req.body));
        const user = await Post.find({ hrRef: req.query.hrRef }).populate('hrRef')
        if (!user) {
            return res.sendStatus(401);
        }
        return res.json({
            data: user
        });
    } catch (error) {
        console.log('Error', error);
    }
});

router.put('/new-post', async (req, res, next) => {
    console.log('new post', req.body, req.query.id);
    try {
        const post_details = JSON.parse(JSON.stringify(req.body));
        const user = await Hr.findById(req.query.id)
        if (!user) {
            return res.sendStatus(401);
        }
        console.log('user is ', user);
        const post = new Post(post_details)
        post.hrRef = user;
        console.log("postPPPPPPP", post);
        const data = await post.save()
        return res.json({
            data: post.toJSONFor(req.query.id)
        })
    } catch (error) {
        console.log('Error', error);
    }
});

module.exports = router;