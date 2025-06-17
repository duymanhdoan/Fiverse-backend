const express = require('express');
const router = express.Router();
const courseController = require("../controllers/CourseController")
const passportService = require("../services/passport")

/* GET users listing. */
router.post('/search', (req, res) => {
    courseController.searchCourse(req, res);
});

router.post('/', passportService.authenticateToken, (req, res) => {
   courseController.createCourse(req, res);
});

// TODO
router.get('/:id', (req, res) => {
  courseController.courseDetail(req, res);
});

// TODO add auth
router.get('/:id/join-course', (req, res) => {
  courseController.joinCourse(req, res);
});

// TODO add auth
router.get('/:id/enrol-course', (req, res) => {
  courseController.enrolCourse(req, res);
});

// TODO add auth
router.post('/submit-answer', (req, res) => {
  courseController.submitAnswerCourse(req, res);
});

router.post('/upload-file', passportService.authenticateToken, (req, res) => {
  courseController.uploadImage(req, res);
});

module.exports = router;
