const UploadService = require("../services/FileUploadService")

/*
  req: multipart/formdata
  payload: "type": "string"
           "file": file
*/
const upload = async (req, res) => {
    if(req.body.fileType === "scorm") {
        UploadService.uploadZip(req, res)
      } else {
        UploadService.uploadFile(req, res)
      }
}

module.exports.upload = upload