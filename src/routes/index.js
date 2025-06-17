var express = require('express');
var router = express.Router();
const UploadController = require("../controllers/UploadController")

/* GET home page. */
router.post('/upload', function(req, res, next) {  
  UploadController.upload(req, res)
});

module.exports = router;
