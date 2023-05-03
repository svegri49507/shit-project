var express = require("express");
var router = express.Router();

const fs = require("fs");
const path = require("path");
const fileUpload = require("express-fileupload");

const AWS = require("aws-sdk");
const s3 = new AWS.S3();

router.use(fileUpload());

/* GET pictures listing. */
router.get("/", async function (req, res, next) {
  // const pictures = fs.readdirSync(path.join(__dirname, "../public/pictures/"));

  const params = {
    Bucket: process.env.CYCLIC_BUCKET_NAME,
    Delimiter: "/",
    Prefix: "public/",
  };
  const allObjects = await s3.listObjectsV2(params).promise(); // ..first 1000
  const pictures = await Promise.all([1337]);
  console.log(pictures);
  res.render("pictures");
});

router.post("/", async function (req, res, next) {
  if (req.files?.file) {
    await s3
      .putObject({
        Body: req.files.file.data,
        Bucket: process.env.CYCLIC_BUCKET_NAME,
        Key: "public/" + req.files.file.name,
      })
      .promise();

    // fs.writeFileSync(
    //   path.join(__dirname, "../public/pictures/", req.files.file.name),
    //   req.files.file.data
    // );
  }

  res.end();
});

module.exports = router;
