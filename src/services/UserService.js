const User = require("../models/User")
const crypto = require("crypto");
const bcrypt = require('bcrypt')
const MailService = require('./MailService')
const jwt = require('jsonwebtoken');
const config = require("../../config/config")

/*
  - tạo token
  - hash password từ request
  - gửi mail bằng email để authen
  - lưu bản ghi vào DB, lock_status là true
*/
const create = async (req, res) => {
  const token = crypto.randomBytes(5).toString('hex');
    await sequelize.sync();
    const password = await bcrypt.hash(req.body.password, 10).catch((err) => {
      if (err) {
          return (err);
      }
    }).then((hash) => {
      return hash
  });
    MailService.transport({email: req.body.email, path: `/verifyEmail?token=${token}`})
    return User.create({...req.body, password: password, token: token, lock_status: true})
  }
module.exports.create = create

/*
  - tìm user bằng token
  - nếu tìm thấy bản ghi, mở lock_status cho user
*/
const verification = async (req, res) => {
    await sequelize.sync();
    User.findOne({where: {
      token: req.query.token
    }}).then(async user => {
      if(user === null) res.status(404).send({error: "Không tìm thấy user"})
      else {
        user.update({login_count: 0, lock_status: false})
        res.send({success: true})
      }
    })
  }
module.exports.verification = verification

/*
  tìm user bằng email
*/
const findOne = async (req) => {
  await sequelize.sync();
  return User.findOne({where: {
    email: req.body.email
  }})
    }
module.exports.findOne = findOne

/*
  - tìm user bằng email
  - nếu tồn tại bản ghi
    + check xem đã được authen chưa
    + check password hash có trùng với password từ request ko
    + nếu sai password tăng login_count + 1
    + nếu login_count > 4 thì báo lỗi đã nhập sai password quá số lần qui định
*/
const login = async (req, res) => {
  await sequelize.sync();
  const pass = req.body.password;
  return findOne(req).then(user => {
    if(user === null) res.status(404).send({error: "Không tìm thấy user"})
    else{

        bcrypt.compare(pass, user.dataValues.password, function (err, result) {
            const isCorrectPass = result
            const isUnlocked = user.dataValues.login_count <= 4
            if(user.dataValues.lock_status & isUnlocked) {
              res.status(404).send({error: "Email chưa được xác thực"})
            }
            else {
              if(isCorrectPass & isUnlocked){
                req.session.user = user;
                  user.update({login_count: 0});
                let payload = { id: user.id };
                  let token = jwt.sign(payload, config.passport.secret);
                  res.send({success: true, user: user, token: token})  }

                  if (isCorrectPass & !isUnlocked){
                  user.update({lock_Status: true})
                  res.status(404).send({error: "Bạn đã đăng nhập sai quá 5 lần"})}


                  if (!isCorrectPass & isUnlocked){
                  user.update({login_count: user.dataValues.login_count + 1})
                  res.status(404).send({error: "Sai mật khẩu"})}


                  if (!isCorrectPass & !isUnlocked){
                  user.update({lock_Status: true})
                  res.status(404).send({error: "Bạn đã đăng nhập sai quá 5 lần"})}
            }
        })

}
    })
  }
module.exports.login = login

/*
  - tạo token mới
  - tìm user bằng email
    + nếu tìm thấy user => cập nhật token mới cho user(updatedAt cũng được cập nhật để so sánh cho chức năng expire link)
    + gửi mail có chứa link direct đến màn hình forgot
*/
const forgotPassword = async (req, res) => {
  const token = crypto.randomBytes(5).toString('hex');
  await sequelize.sync();
  return findOne(req).then(async user => {
    if(user === null) res.status(404).send({error: "Không tìm thấy user"})
    else {
      user.update({token: token}).then(u => {
        MailService.transport({email: req.body.email, token: token, path: `/forgot/recover?token=${token}&email=${req.body.email}`}, res)
        res.send({success: true})
      })
    }
  })
}
module.exports.forgotPassword = forgotPassword

/*
  - tạo token mới để unable token cũ
  - tìm user bằng email + token
    + nếu tìm thấy user, hash passowrd mới và lưu vào DB
*/
const changePassword = async (req, res) => {
  const token = crypto.randomBytes(5).toString('hex');
  await sequelize.sync();
  return User.findOne({where: {email: req.body.email, token: req.body.token}}).then(async user => {
    if(user === null) res.status(404).send({error: "Không tìm thấy user"})
    else {
      const password = await bcrypt.hash(req.body.password, 10).catch((err) => {
        if (err) {
            return (err);
        }
      }).then((hash) => {
        return hash
    });
    return user.update({password: password, token: token})
    }
  })
}
module.exports.changePassword = changePassword

/*
  - tìm user bằng token
    + nếu tìm thấy user, so sánh thời gian hiện tại với updatedAt của bản ghi để kiểm tra expire time(15 phút)
    + nếu chưa hết expire time => trả về success
*/
const verifyToken = async (req, res) => {
  await sequelize.sync();
  const now = Date.now();
  return User.findOne({where: {token: req.query.token}}).then(async user => {
    if(user === null) res.status(404).send({error: "Không tìm thấy user"})
    else if(now - user.dataValues.updatedAt.getTime() > 900000){
      res.status(400).send({error: "Link hết hạn"})
    }
    else {
    res.send({success: true})
    }
  })
}
module.exports.verifyToken = verifyToken

/*
  - tìm user bằng email
    + nếu có user + lock_status=true => gửi lại email có chưa link authen
    + nếu có user + lock_status=false => trả về thông báo user đã authen
*/
const resendEmail = async (req, res) => {
  await sequelize.sync();
  User.findOne({where: {email: req.body.email}}).then(async user => {
    if(user === null) res.status(404).send({error: "Không tìm thấy user"})
    if(user.dataValues.lock_status) {
    MailService.transport({email: req.body.email, path: `/verifyEmail?token=${user.dataValues.token}`})
    res.send({success: true})
    }
    else {
      res.status(400).send({error: "Email đã xác thực vui lòng đăng nhập"})
    }
  })
}
module.exports.resendEmail = resendEmail
