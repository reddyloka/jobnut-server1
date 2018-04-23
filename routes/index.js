var express = require('express'); 
var router = express.Router();

// const app = express();

router.use(express.static(__dirname + "/../static/"));
router.use('/api', require('./api'));
// router.use('/authenticate', require('../_middleware/check-auth'));

module.exports = router;
