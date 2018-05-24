const express = require('express');
const passport = require('passport');
const router = express.Router();

router.post ('/', passport.authenticate('local'), function (req, res) {
	res.json(req.user.apiRepr());
}); //router.post


module.exports = router;