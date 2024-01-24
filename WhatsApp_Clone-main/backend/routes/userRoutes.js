const express = require("express");
const router = express.Router();
const isAuthorize = require("../middlewares/authenticate");
const upload = require("../middlewares/multer");
const {
  signinController,
  loginController,
  searchUserController,
  allUserController,
  changeDpController,
  showDp,
  updateDetailsController,
} = require("../controllers/userControllers");

router.post("/signup", signinController);
router.post("/login", loginController);
router.post("/changeDp/:userId", upload.single("dp"), changeDpController);
router.get("/show-dp/:fileName", showDp);
router.put('/updateDetails',isAuthorize,updateDetailsController);
router.get("/", isAuthorize, searchUserController);
router.post("/allusers", isAuthorize, allUserController);

module.exports = router;
