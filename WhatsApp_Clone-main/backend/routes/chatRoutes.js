const express = require("express");
const router = express.Router();
const isAuthorize = require("../middlewares/authenticate.js");
const isGroupAdmin = require('../middlewares/isGroupAdmin.js');
const upload = require("../middlewares/multer");
const {
  accessChat,
  fetchChats,
  createGroup,
  exitGroup,
  addGroupAdmin,
  renameGroup,
  deleteGroup,
  addToGroup,
  removeFromGroup,
  dismissGroupAdmin,
  searchChat,
} = require("../controllers/chatControllers.js");

const {changeGroupDp} = require('../controllers/userControllers.js');

// router.route('/').get(isAuthorized,fetchChats); //we write below routes like this

router.get("/",isAuthorize,fetchChats);
router.get("/search",isAuthorize,searchChat);
router.post("/", isAuthorize, accessChat);  //access if exist otherwise create it
// router.delete("/group/delete/:chatId",isAuthorize,deleteGroup); //------Refer to Pro
router.post(
  "/group/create",
  upload.single("groupIcon"),
  isAuthorize,
  createGroup
);
router.put("/group/exit/:chatId", isAuthorize, exitGroup);
router.put("/group/rename",isAuthorize,renameGroup);
router.post(
  "/group/changeDp/:chatId",
  upload.single("groupIcon"),
  changeGroupDp
);

/* Only group Admins can access below routes */
router.put("/group/add-user/:chatId",isAuthorize,isGroupAdmin,addToGroup);
router.put("/group/remove-user/:chatId",isAuthorize,isGroupAdmin,removeFromGroup);
router.put(
  "/group/make-admin/:chatId",
  isAuthorize,
  isGroupAdmin,
  addGroupAdmin
);
router.put("/group/dismiss-admin/:chatId",isAuthorize,isGroupAdmin,dismissGroupAdmin);

module.exports = router;
