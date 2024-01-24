const path = require("path");
const crypto = require("crypto");
const { GridFsStorage } = require("multer-gridfs-storage");
const multer = require("multer");

const mongoURI = process.env.MONGO_URI;

//Storage Engine GridFsStorage
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

// //FILE FILTER 
// function fileFilter(req, file, cb) {
//   // To accept the file pass `true`, like so:
//   if (
//     file.mimetype == "image/png" ||
//     file.mimetype == "image/jpeg" ||
//     file.mimetype == "image/jpg" ||
//     file.mimetype == "image/webp"
//   ) {
//     cb(null, true);
//   }

//   // You can always pass an error if something goes wrong:
//   else cb(new Error("You are not of mine mime type"), false);
// }

const upload = multer({ storage, });

module.exports = upload;


// if (file.mimetype === "image/jpeg") {
//   return {
//     bucketName: "photos",
//   };
// } else {
//   return null;
// }