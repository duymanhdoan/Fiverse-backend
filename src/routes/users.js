const express = require('express');
const router = express.Router();
const userController = require("../controllers/UserController")

/* GET users listing. */
router.post('/register', (req, res) => {
  userController.register(req, res);
});

router.post('/login', (req, res) => {
  userController.login(req, res);
});

router.get('/verification', (req, res) => {
  userController.verification(req, res);
});

router.post('/logout', (req, res) => {
  userController.logout(req, res);
});

router.post('/forgot', (req, res) => {
  userController.forgotPassword(req, res);
});

router.post('/changePassword', (req, res) => {
  userController.changePassword(req, res);
});

router.get('/forgot/verify', (req, res) => {
  userController.verifyToken(req, res);
});

router.post('/resendEmail', (req, res) => {
  userController.resendEmail(req, res);
});

module.exports = router;