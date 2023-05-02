var express = require("express");
var router = express.Router();

const fs = require("fs");
const path = require("path");
const fileUpload = require("express-fileupload");

router.use(fileUpload());

/* GET pictures listing. */
router.get("/", function (req, res, next) {
  const pictures = fs.readdirSync(path.join(__dirname, "../public/pictures/"));
  res.render("pictures", { pictures: pictures });
});

router.post("/", function (req, res, next) {
  if (req.files?.file)
    fs.writeFileSync(
      path.join(__dirname, "../public/pictures/", req.files.file.name),
      req.files.file.data
    );
  res.end();
});

module.exports = router;
