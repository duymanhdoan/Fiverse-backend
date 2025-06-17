const CourseService = require("../services/CourseService")
const FileUploadService = require("../services/FileUploadService")

/*
    req: {
        q: "string"
    }
*/
const searchCourse = async (req, res) => {
    const [count, search] = await Promise.all([CourseService.countCourse(), CourseService.searchCourse(req, res)])
    res.send({count: count, courses: search})
}

module.exports.searchCourse = searchCourse

/**
 * Create course
 *
 * @param req
 * @param res
 */
const createCourse = async (req, res) => {
    const result = await CourseService.createCourse(req);
    if (result.success) {
        res.send({success: true})
    } else {
        res.status(500).send({error: true, message: result.error})
    }
}

module.exports.createCourse = createCourse;

const joinCourse = async (req, res) => {
    const courseId = req.params.id;
    // TODO
    const userId = req.user ? req.user.id : 1;
    const result = await CourseService.joinCourse(userId, courseId);
    if (result.success) {
        res.send(result.data);
    } else {
        res.status(result.status).send({
            error: true,
            message: result.error
        })
    }
}

module.exports.joinCourse = joinCourse;

const uploadImage = async (req, res) => {
    try {
        const filePath = await FileUploadService.uploadFileCourse(req);
        res.send({ success: true, filePath: filePath });
    } catch (e) {
        res.status(500).send({
            error: true,
            message: e.message
        })
    }
};

module.exports.uploadImage = uploadImage;

const courseDetail = async (req, res) => {
  try {
    const courseId = req.params.id ? req.params.id : null;
    const course = await CourseService.getCourseDetail(courseId);
    if (!course) {
      res.status(404).send({error: "Course not found"})
    }
    res.send({ courseItem: course });
  } catch (e) {
    res.status(500).send({
      error: true,
      message: e.message
    })
  }
}

module.exports.courseDetail = courseDetail;

const submitAnswerCourse = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 1;
    const courseId = req.body.course_id;
    const answerId = req.body.answer_id;
    if (!courseId || !answerId) {
      res.status(500).send({error: "course_id, answer_id is required"});
    }
    await CourseService.submitAnswerCourse(courseId, answerId, userId);
    res.send({success: true});
  } catch (e) {
    res.status(500).send({error: e})
  }
}

module.exports.submitAnswerCourse = submitAnswerCourse;

const enrolCourse = async (req, res) => {
  try {
    const courseId = req.params.id ? req.params.id : null;
    const enrolCourseData = await CourseService.userEnrolCourse(courseId);
    return res.send({ courseItem: enrolCourseData});
  } catch (e) {
    res.status(500).send({ error: e});
  }
}

module.exports.enrolCourse = enrolCourse;
