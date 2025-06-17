const User = require("../models/User");
const Course = require("../models/Course");
const CourseSection = require("../models/CourseSection");
const SectionContent = require("../models/SectionContent");
const QuizQuestion = require("../models/QuizQuestion");
const QuizAnswer = require("../models/QuizAnswer");
const ContentDocument = require("../models/ContentDocument");
const UserCourse = require("../models/UserCourse");
const UserQuizAnswer = require("../models/UserQuizAnswer");
const UserSectionContent = require("../models/UserSectionContent");
User.belongsToMany(Course, { through: UserCourse, foreignKey: 'user_id' });
Course.belongsToMany(User, { through: UserCourse, foreignKey: 'course_id' });
CourseSection.hasMany(SectionContent, { foreignKey: 'section_id'});

const Constant = require("../constant/Constant");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/*
  - search course theo title, relative search
  - sort theo createdAt + token
*/
const searchCourse = async (req, res) => {
  await sequelize.sync();
  return Course.findAll({where: whereCondition(req)},{
    order: [
      ['createdAt', 'DESC'],
      ['token_receive_per_user', 'DESC']
    ],
    offset: parseInt(req.query.offset),
    limit: parseInt(req.query.limit)
  })
}
module.exports.searchCourse = searchCourse

const countCourse = async () => {
  await sequelize.sync();
  return Course.count()
}
module.exports.countCourse = countCourse

const whereCondition = (req) => {
  if(req.body.q) {
     const data = {...req.body, title: { [Op.substring]: `${req.body.q}` }}
     delete data.q
     return data
    }
    else req.body
}

/**
 *
 * @param req
 * @returns {Promise<{success: boolean, error: *}|{success: boolean}>}
 */
const createCourse = async (req) => {
  await sequelize.sync();
  const transaction = await sequelize.transaction();
  try {
    const data = req.body;
    const userId = req.user ? req.user.id : "";
    console.log(userId);
    let courseData = {
      ...data,
      created_by: userId,
      updated_by: userId
    }
    let courseSections = "sections" in data ? data.sections : [];
    const course = await Course.create(courseData, { transaction: transaction });
    // insert course sections
    await Promise.all(courseSections.map(async (section) => {
      section.course_id = course.id;
      let sectionContents = "contents" in section ? section.contents : [];
      const courseSection = await CourseSection.create(section, { transaction: transaction });
      // insert section content
      await Promise.all(sectionContents.map(async (content) => {
        content.section_id = courseSection.id;
        let quizData = "quiz" in content ? content.quiz : [];
        let documentData = "documents" in content ? content.documents : [];
        const sectionContent = await SectionContent.create(content, { transaction: transaction });
        // insert quiz data
        await Promise.all(quizData.map(async (quiz) => {
          quiz.section_content_id = sectionContent.id;
          let answerData = "answers" in quiz ? quiz.answers : [];
          const quizQuestion = await QuizQuestion.create(quiz, { transaction: transaction });
          // insert answer data
          await Promise.all(answerData.map(async (answer) => {
            answer.question_id = quizQuestion.id;
            await QuizAnswer.create(answer, { transaction: transaction });
          }));
        }));
        // insert document data
        await Promise.all(documentData.map(async (document) => {
          document.section_content_id = sectionContent.id;
          document.order = document.order ? document.order : Constant.DOCUMENT_DEFAULT_ORDER;
          await ContentDocument.create(document, { transaction: transaction })
        }));
      }));
    }));
    await transaction.commit();
    return {
      success: true
    };
  } catch (err) {
    await transaction.rollback();
    return {
      success: false,
      error: err
    };
  }
}
module.exports.createCourse = createCourse

const joinCourse = async (userId, courseId) => {
  try {
    // await sequelize.sync();
    const qResults = await sequelize.query(`
    select c.id AS course_id,
c.type AS course_type,
c.level,
c.token_receive_per_user,
c.total_token_allocation,
c.total_time,
c.price,
c.expired_time,
c.title AS course_title,
c.description as course_description,
c.provider_name,
c.provider_description,
c.thumbnail_path AS course_thumbnail_path,
cs.id AS section_id,
cs.title AS section_title,
cs.type AS section_type,
sc.id AS content_id,
sc.type AS content_type,
sc.order AS content_order,
sc.title AS content_title,
sc.thumbnail_path AS content_thumbnail_path,
sc.text_content,
sc.video_path,
cd.id AS document_id,
cd.path AS document_path,
cd.order AS document_path_order,
qq.question,
qq.type AS question_type,
qq.id AS question_id,
qa.id AS answer_id,
qa.order AS answer_order,
qa.content AS answer_content,
uqa.user_id AS user_id
from courses c
inner join course_sections cs ON c.id = cs.course_id
inner join section_contents sc ON cs.id = sc.section_id
left join quiz_question qq ON sc.id = qq.section_content_id
left join quiz_answers qa ON qq.id = qa.question_id
left join content_documents cd ON sc.id = cd.section_content_id
left join user_quiz_answer uqa ON uqa.answer_id = qa.id and uqa.user_id = ${userId}
where c.id = ${courseId}
order by cs.id, sc.order`);
    if (!qResults) {
      return {
        success: false,
        status: 404,
        error: "Course not found!"
      }
    }
    // console.log(results)
    let rs = [];
    let results = qResults[0];
    for (let i = 0; i < results.length; i ++) {

      let courseId = results[i]['course_id'];
      let index = rs.findIndex(course => {
        return parseInt(course.courseId) === parseInt(courseId);
      })
      if (index < 0) {
        index = rs.length;
        rs.push({
          'courseId': courseId,
          'course_type' : results[i]['course_type'],
          'course_level' : results[i]['course_level'],
          'token_receive_per_user' : results[i]['token_receive_per_user'],
          'total_time' : results[i]['total_time'],
          'price' : results[i]['price'],
          'expired_time' : results[i]['expired_time'],
          'course_title' : results[i]['course_title'],
          'course_description' : results[i]['course_description'],
          'provider_name' : results[i]['provider_name'],
          'provider_description' : results[i]['provider_description'],
          'course_thumbnail_path' : results[i]['course_thumbnail_path'],
          'studySections' : []
        });
      }

      let sectionId =  results[i]['section_id'];
      let indexSection = rs[index]['studySections'].findIndex(section => {
        return parseInt(section.sectionId) === parseInt(sectionId)
      })
      if (indexSection < 0) {
        indexSection = rs[index]['studySections'].length;
        rs[index]['studySections'].push({
          sectionId: sectionId,
          title: results[i]['section_title'],
          completed: false,
          children: []
        });
      }

      let contentId = results[i]['content_id'];
      let contentIndex = rs[index]['studySections'][indexSection]['children'].findIndex(content => {
        return parseInt(content.contentId) === parseInt(contentId);
      });
      if (contentIndex < 0) {
        contentIndex = rs[index]['studySections'][indexSection]['children'].length;
        rs[index]['studySections'][indexSection]['children'].push({
          'contentId': contentId,
          'type' : results[i]['content_type'],
          'content_order' : results[i]['content_order'],
          'title' : results[i]['content_title'],
          'completed': false,
        });
        rs[index]['studySections'][indexSection]['completed'] = false;
        if (parseInt(results[i]['content_type']) === Constant.CONTENT_TYPE_VIDEO) {
          rs[index]['studySections'][indexSection]['children'][contentIndex]['contentUrl'] = results[i]['video_path']
        } else {
          rs[index]['studySections'][indexSection]['children'][contentIndex]['contentUrl'] = results[i]['document_path']
        }
      }

      if (results[i]['user_id'] && rs[index]) {
        rs[index]['studySections'][indexSection]['children'][contentIndex]['completed'] = true;
      }
      let checkSectionCompleted = rs[index]['studySections'][indexSection]['children'].filter(content => {
        return !!content.completed;
      });
      if (checkSectionCompleted.length === rs[index]['studySections'][indexSection]['children'].length) {
        rs[index]['studySections'][indexSection]['completed'] = true;
      }
    }
    // const course = await Course.findOne({
    //   where: {id: courseId},
    //   include: User
    // });

    return {
      success: true,
      data: {
        course: rs[0]
      }
    }
  } catch (err) {
    console.log('err', err)
    return {
      success: false,
      status: Constant.STATUS_CODE_500,
      error: err
    }
  }
}

module.exports.joinCourse = joinCourse

const getCourseDetail = async (courseId) => {
  await sequelize.sync();
  return await Course.findByPk(courseId);
}

module.exports.getCourseDetail = getCourseDetail;

const submitAnswerCourse = async (courseId, answerId, userId) => {
  const qQuestion = await sequelize.query(`
    SELECT qq.id, qq.section_content_id from quiz_answers as qa
        join quiz_question as qq on qq.id = qa.question_id
        where qa.id = ${answerId}
  `);
  let question = qQuestion[0];
  let questionId = question[0].id;
  let contentId = question[0].section_content_id;
  const qResult = await UserQuizAnswer.findOne({
    where: {
      user_id: userId,
      answer_id: {
        [Sequelize.Op.in]: sequelize.literal(`
          (SELECT id from quiz_answers where question_id = ${questionId})
        `)
      }
    }
  });
  if (qResult) {
    const userQuizAnswerId = qResult.id;
    await sequelize.query(`
      UPDATE user_quiz_answer SET answer_id = ${answerId} where id = ${userQuizAnswerId}
    `)
  } else {
    await UserQuizAnswer.create({
      user_id: userId,
      answer_id: answerId
    })
  }
  // check content is completed
  const userSectionContent = await UserSectionContent.findOne({
    where: {
      user_id: userId,
      section_content_id: contentId
    }
  });
  if (!userSectionContent) {
    await UserSectionContent.create({
      user_id: userId,
      section_content_id: contentId,
    })
  }
}

module.exports.submitAnswerCourse = submitAnswerCourse;

const userEnrolCourse = async (courseId) => {
  return await CourseSection.findAll({
    where: {
      course_id: courseId
    },
    include: SectionContent
  });
}

module.exports.userEnrolCourse = userEnrolCourse;
