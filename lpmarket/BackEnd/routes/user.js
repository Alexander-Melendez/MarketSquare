const router = require("express").Router();
const { createUser, signin } = require("../controllers/user");
const { validateUser, validate } = require("../middlewares/validator");

router.post("/create", validateUser, validate, createUser);
router.post("/signin", signin);

module.exports = router;