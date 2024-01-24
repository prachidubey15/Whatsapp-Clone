const express = require('express');
const router  = express.Router();
const isAuthorized = require('../middlewares/authenticate');
const {readAllMsg,createNewMsg} = require('../controllers/msgControllers');

router.post('/',isAuthorized,createNewMsg);
router.get('/:chatId',isAuthorized,readAllMsg);

module.exports = router