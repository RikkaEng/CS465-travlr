var express = require('express');
var router = express.Router();
const ctrlMain = require('../controllers/main'); // <-- added

/* GET home page. */
router.get('/', ctrlMain.index); // <-- changed

module.exports = router;
