var router = require('express').Router();


router.use('/', require('./users'));
router.use('/posts', require('./posts'));
// router.use('/hr', require('./users'));
// router.use('/v1/user', require('./users'));
router.use('/notifications',require('./notifymail'));


router.use(function(err, req, res, next){
<<<<<<< HEAD

=======
>>>>>>> 11dc39775f6aadab042d800b3c95f14f7a41c46c
  if(err.name === 'ValidationError'){
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors, key){
        errors[key] = err.errors[key].message;

        return errors;
      }, {})
    });
  }
  
  return next(err);
});

module.exports = router;