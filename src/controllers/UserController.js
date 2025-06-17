const UserService = require("../services/UserService")

/*
    req: {
	"email": "string",
	"password": "string",
    "username": "string"
}
*/
const register = async (req, res) => {
    const newUser = UserService.create(req, res)
    newUser.then(u => res.send({success: true})).catch(err => {
        res.status(400).send({error: "Email đã tồn tại"})
    });
}

module.exports.register = register

/*
    req: {
	"email": "string",
	"password": "string"
}
*/
const login = async (req, res) => {
    UserService.login(req, res)
}

module.exports.login = login

/*
    query param: token => user/verification?token=abc
*/
const verification = async (req, res) => {
    UserService.verification(req, res)
}

module.exports.verification = verification

/*
    xóa session của user
*/
const logout = (req, res, next) => {
    if (req.session && req.session.user) {
        req.session = null;
        res.send({success: true});

    }
    else {
        res.send({success: false});
    }
}
module.exports.logout = logout;

/*
    req: {
        "email": "string"
    }
*/
const forgotPassword = (req, res, next) => {
    UserService.forgotPassword(req, res).catch(err => {
        res.status(400).send({error: "Gửi mail thất bại"})
    });
}
module.exports.forgotPassword = forgotPassword;

/*
    req: {
        "email": "string",
        "token": "string",
        "password": "string"
    }
*/
const changePassword = (req, res, next) => {
    const newUser = UserService.changePassword(req, res)
    newUser.then(u => res.send({success: true})).catch(err => {
        res.status(400).send({error: "Thay đổi password thất bại"})
    });
}
module.exports.changePassword = changePassword;

/*
    query param: token => user/forgot/verify?token=abc
*/
const verifyToken = (req, res, next) => {
    UserService.verifyToken(req, res).catch(err => {
        res.status(400).send({error: "verify thất bại"})
    });
}

module.exports.verifyToken = verifyToken;

/*
    req: {
        "email": "string"
    }
*/
const resendEmail = (req, res, next) => {
    UserService.resendEmail(req, res).catch(err => {
        res.status(400).send({error: "Gửi mail thất bại"})
    });
}

module.exports.resendEmail = resendEmail;

