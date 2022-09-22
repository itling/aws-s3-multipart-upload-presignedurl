const AWS = require("aws-sdk")
const { orderBy } = require("lodash")

// TODO: insert the valid endpoint here
//const s3Endpoint = new AWS.Endpoint("<YOUR_ENDPOINT>")

// TODO: insert your credentials here
const s3Credentials = new AWS.Credentials({
  accessKeyId: "<update>",
  secretAccessKey: "<update>",
})

const s3 = new AWS.S3({
  //endpoint: s3Endpoint,
  credentials: s3Credentials,
  region:'us-east-2',
})

// TODO: insert your bucket name here
const BUCKET_NAME = "new-kuggamax"

const UploadController = {
  createMultipartUpload: async (req, res) => {
    const { key } = req.body

    const multipartParams = {
      Bucket: BUCKET_NAME,
      Key: `publication-images/${key}`,
      ACL: "public-read",
    }

    const multipartUpload = await s3.createMultipartUpload(multipartParams).promise()

    res.send({
      uploadId: multipartUpload.UploadId,
      key: multipartUpload.Key,
    })
  },

  getMultipartPreSignedUrls: async (req, res) => {
    const { key, uploadId, parts } = req.body

    const multipartParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      UploadId: uploadId,
    }

    const promises = []

    for (let index = 0; index < parts; index++) {
      promises.push(
        s3.getSignedUrlPromise("uploadPart", {
          ...multipartParams,
          PartNumber: index + 1,
        }),
      )
    }

    const signedUrls = await Promise.all(promises)

    const partSignedUrlList = signedUrls.map((signedUrl, index) => {
      return {
        signedUrl: signedUrl,
        partNumber: index + 1,
      }
    })

    res.send({
      parts: partSignedUrlList,
    })
  },

  completeMultipartUpload: async (req, res) => {
    const { uploadId, key, parts } = req.body

    const multipartParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {
        // ordering the parts to make sure they are in the right order
        Parts: orderBy(parts, ["PartNumber"], ["asc"]),
      },
    }

    await s3.completeMultipartUpload(multipartParams).promise()

    res.send()
  },
}

module.exports = { UploadController }
