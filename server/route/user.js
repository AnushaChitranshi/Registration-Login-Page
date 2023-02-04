const router = require('express').Router();
let User = require('../models/user.model.js');

router.route('/register').post((req, res) => {
    console.log(req);
});

module.exports = router;