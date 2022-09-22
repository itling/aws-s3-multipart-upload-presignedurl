const { Router } = require("express")
const { UploadController } = require("../controllers/upload")

const router = Router()

router.post("/uploads/createMultipartUpload", UploadController.createMultipartUpload)
router.post("/uploads/getMultipartPreSignedUrls", UploadController.getMultipartPreSignedUrls)
router.post("/uploads/completeMultipartUpload", UploadController.completeMultipartUpload)

module.exports = { router }
