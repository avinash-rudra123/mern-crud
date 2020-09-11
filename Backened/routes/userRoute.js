const express = require("express");
const router = express.Router();
const bycrypt = require("bcryptjs");
const userModel = require("../models/user");
const verify = require("./verifytoken");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
router.get("/find", verify, (req, res) => {
  userModel
    .find()
    .then((user) => {
      res.status(200).json({
        msg: "user information",
        user,
      });
    })
    .catch((err) =>
      res.status(400).json({
        msg: "No information found in account",
      })
    );
});
router.get("/login/:id", verify, async (req, res) => {
  try {
    res.json(await userModel.findById(req.params.id));
  } catch (err) {
    res.status(400).send({ msg: err.msg });
  }
});
router.post(
  "/create",
  [
    body("userName").not().isEmpty().isLength({ max: 20 }),
    body("email").not().isEmpty().isLength({ max: 20 }).isEmail(),
    body("password").not().isEmpty().isLength({ max: 255 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userNameexist = await userModel.findOne({
      email: req.body.email,
    });
    if (userNameexist)
      return res.status(400).send("email already exit try another one");
    const salt = await bycrypt.genSalt(10);
    const hashpwd = await bycrypt.hash(req.body.password, salt);
    const user = new userModel({
      userName: req.body.userName,
      email: req.body.email,
      password: hashpwd,
    });
    try {
      let saveUser = await user.save();
      res.send(saveUser);
      res.status(201).json({ msg: "User record successfully" });
    } catch (err) {
      return res.status(404).send("cannot create the user");
    }
  }
);
router.post(
  "/login",
  [
    body("email").not().isEmpty().isLength({ max: 20 }),
    body("password").not().isEmpty().isLength({ max: 255 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await userModel.findOne({
      email: req.body.email,
    });
    if (!user) return res.status(400).send("username  wrong");
    const validpass = await bycrypt.compare(req.body.password, user.password);
    if (!validpass) return res.status(400).send("it is not a valid password");
    // res.status(201).send("successfully logged in");
    const token = jwt.sign({ _id: user._id }, "sefhhgjjbhhnjjjkjflnj", {
      expiresIn: "10m",
    });
    res.header("auth-token", token).send(token);
    res.send("logged in .....");
  }
);
router.put("/edit/:id", verify, (req, res) => {
  let _id = req.params.id;
  userModel.findByIdAndUpdate({ _id }, req.body).then((user) => {
    res
      .status(200)
      .json({
        msg: "Edited successfully",
        user,
      })
      .catch((err) =>
        res.status(404).json({
          msg: err.msg,
        })
      );
  });
});
router.patch("/update/:id", verify, (req, res) => {
  if (req.body._id && req.body._id != req.params.id)
    return res
      .status(400)
      .json({ error: "ID in the body is not matching ID in the URL" });
  delete req.body._id;
  userModel
    .updateOne(
      { _id: req.params.id },
      { $set: { userName: req.body.userName } }
    )
    .then((user) => {
      res
        .status(200)
        .json({
          msg: "Updated username successfully",
          user,
        })
        .catch((err) =>
          res.status(404).json({
            msg: err.msg,
          })
        );
    });
});

router.delete("/delete/:id", verify, async (req, res) => {
  try {
    const removerecord = await userModel.remove({ _id: req.params.id });
    res.status(201).json({ msg: "removed User record by id" });
  } catch (err) {
    res.status(500).json({ msg: "internal server error" });
  }
});
module.exports = router;
