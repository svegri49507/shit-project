var express = require('express');
var router = express.Router();

const { requiresAuth } = require('express-openid-connect');
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

router.use(fileUpload());

/* GET pictures listing. */
router.get('/', requiresAuth(), async function (req, res, next) {
  // const pictures = fs.readdirSync(path.join(__dirname, "../public/pictures/"));

  const params = {
    Bucket: process.env.CYCLIC_BUCKET_NAME,
    Delimiter: '/',
    Prefix: 'public/',
  };
  const allObjects = await s3.listObjectsV2(params).promise(); // ..first 1000
  const keys = allObjects?.Contents.map((x) => x.Key);
  const pictures = await Promise.all(
    keys.map(async (key) => {
      let my_file = await s3
        .getObject({
          Bucket: process.env.CYCLIC_BUCKET_NAME,
          Key: key,
        })
        .promise();

      return {
        src: Buffer.from(my_file.Body).toString('base64'),
        name: key.split('/').pop(),
      };
    })
  );

  res.render('pictures', { pictures: pictures });
});

router.post('/', requiresAuth(), async function (req, res, next) {
  if (req.files?.file) {
    await s3
      .putObject({
        Body: req.files.file.data,
        Bucket: process.env.CYCLIC_BUCKET_NAME,
        Key: 'public/' + req.files.file.name,
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
