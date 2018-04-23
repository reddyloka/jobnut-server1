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