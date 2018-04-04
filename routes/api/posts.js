var mongoose = require('mongoose');
var router = require('express').Router();
var Post = mongoose.model('postModel');
var auth = require('../auth');

router.get('/:post_id', (req, res, next) => {
    console.log('game over posts ');
    user_details = JSON.parse(JSON.stringify(req.body));
    // if (user_details.isHr && user_details.status) {
        Post.findOne({_id: req.params.post_id}).then((user) => {
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
        Post.find({hrRef: req.query.id}).then((user) => {
            if (!user) {
                return res.sendStatus(401);
            }
            return res.json( {
                data: user
            } );
        }).catch(next);
    // }
});

module.exports = router;