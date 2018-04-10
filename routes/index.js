var router = require('express').Router();

// const app = express();

router.use('/api', require('./api'));
// router.use('/authenticate', require('../_middleware/check-auth'));

module.exports = router;
