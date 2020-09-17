const express = require("express");
const router = express.Router();
const bycrypt = require("bcryptjs");
const crypto = require("crypto");
const userModel = require("../models/user");
const verify = require("./verifytoken");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
//const sendgridTransport = require("nodemailer-sendgrid-transport")

router.get("/find", (req, res) => {
  userModel
    .find()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) =>
      res.status(400).json({
        msg: "No information found in account",
      })
    );
});
router.get("/login/:id", async (req, res) => {
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
    body("email").not().isEmpty().isLength({ max: 50 }).isEmail(),
    body("password").not().isEmpty().isLength({ max: 255 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { userName, email, password, confirm_password } = req.body;
    if (password !== confirm_password) {
      return res.status(400).json({
        msg: "password doesnt match Plz type correct password",
      });
    }
    if (!email || !password || !userName) {
      return res.status(422).json({ error: "please add all the fields" });
    }
    userModel
      .findOne({ email: email })
      .then((savedUser) => {
        if (savedUser) {
          return res
            .status(422)
            .json({ error: "user already exists with that email" });
        }
        bycrypt.hash(password, 12).then((hashedpassword) => {
          const user = new userModel({
            email,
            password: hashedpassword,
            userName,
          });
          user
            .save()
            .then((user) => {
              return res.status(201).json({ msg: "User record successfully" });
            })
            .catch((err) => {
              return res.status(404).send("cannot create the user");
            });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
);
router.post(
  "/login",

  [
    body("email").not().isEmpty().isLength({ max: 30 }),
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
    //res.status(201).send("successfully logged in");
    const token = jwt.sign({ _id: user._id }, "sefhhgjjbhhnjjjkjflnj");
    res.header("auth-token", token).send(token);
    res.send("logged in .....");
  }
);
router.put("/edit/:id", (req, res) => {
  let _id = req.params.id;
  userModel.findByIdAndUpdate({ _id }, req.body).then((user) => {
    res
      .status(200)
      .json(user)
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

router.delete("/delete/:id", async (req, res) => {
  try {
    const user = await userModel.remove({ _id: req.params.id });
    return res.status(201).send(user);
  } catch (err) {
    res.status(500).json({ msg: "internal server error" });
  }
});
//logut functionality
router.get("/logout", verify, (req, res) => {
  userModel.findByIdAndRemove(req.user._id, function (err) {
    if (err) res.send(err);
    res.json({ message: "User Deleted!" });
  });
});

// reset password
// router.post("/reset-password", (req, res) => {
//   crypto.randomBytes(32, (err, buffer) => {
//     if (err) {
//       console.log(err);
//     }
//     const token = buffer.toString("hex");
//     userModel.findOne({ email: req.body.email }).then((user) => {
//       if (!user) {
//         return res
//           .status(422)
//           .json({ error: "User dont exists with that email" });
//       } Data is n = "http://localhost:3000";
//       const link = `<a href=${siteurl}/reset?token=${token}>link</a>`;
//       user.save().then((result) => {
//         transporter.sendMail({
//           to: user.email,
//           from: "no-replay@yahoo.com",
//           subject: "password reset",
//           html: `
//                   <p>You requested for password reset</p>
//                   <h5>click in this  to reset password</h5>
//                   `,
//         });
//         res.json({ message: link });
//       });
//     });
//   });
// });
//new -password
// router.post("/new-password", (req, res) => {
//   const newPassword = req.body.password;
//   const sentToken = req.body.token;
//   const confirm_password = req.body.confirm_password;
//   userModel
//     .findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
//     .then((user) => {
//       if (!user) {
//         return res.status(422).json({ error: "Try again session expired" });
//       }
//       if (newPassword == confirm_password) {
//         bcrypt.hash(newPassword, 12).then((hashedpassword) => {
//           user.password = hashedpassword;
//           user.resetToken = undefined;
//           user.expireToken = undefined;
//           user.save().then((saveduser) => {
//             res.json({ message: "password updated success" });
//           });
//         });
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });
router.post(
  "/reset",
  body("email").not().isEmpty().isLength({ max: 50 }).isEmail(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log(err);
      }
      const token = buffer.toString("hex");
      userModel.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
          return res
            .status(422)
            .json({ error: "User dont exists with that email" });
        }
        var transporter = nodemailer.createTransport({
          service: "gmail",
          port: 2525,
          auth: {
            user: "gupta95031p@gmail.com",
            pass: "",
          },
        });
        let currentTime = new Date();
        const siteurl = "http://localhost:3000";
        var mailOptions = {
          from: "gupta95031p@gmail.com",
          to: req.body.email,
          subject: "Password Reset",
          html: `<h1>Welcome To Password Reset </h1>
          <P> You are required for password Reset</p>
           <h5> click on this link <a href="${siteurl}/reset?token=${token}">to reset password</a>
          `,
        };
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Email sent: " + info.response);
            userModel.updateOne(
              { email: user.email },
              {
                token: currentTime,
              },
              { multi: true },
              (err, resp) => {
                return res.status(200).json({
                  success: false,
                  msg: info.response,
                  userlist: resp,
                });
              }
            );
          }
        });
      });
    });
  }
);
router.post("/updatePassword", function (req, res) {
  userModel.findOne({ email: req.body.email }, function (error, user) {
    if (req.body.password == req.body.confirm_password) {
      bycrypt.genSalt(10, (err, salt) => {
        bycrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) throw err;
          let newPassword = hash;
          //let userId = { _id: user._id };
          let dataForUpdate = {
            password: newPassword,
            updatedDate: new Date(),
          };
          userModel.findOneAndUpdate(
            //userId,
            dataForUpdate,
            { new: true },
            (error, updatedUser) => {
              if (error) {
                if (err.name === "MongoError" && error.code === 11000) {
                  return res
                    .status(500)
                    .json({ msg: "Mongo Db Error", error: error.message });
                } else {
                  return res.status(500).json({
                    msg: "Unknown Server Error",
                    error: "Unknow server error when updating User",
                  });
                }
              } else {
                if (!updatedUser) {
                  return res.status(404).json({
                    msg: "User Not Found.",
                    success: false,
                  });
                } else {
                  return res.status(200).json({
                    success: true,
                    msg: "Your password are Successfully Updated",
                    updatedData: updatedUser,
                  });
                }
              }
            }
          );
        });
      });
    }
    if (error) {
      return res.status(401).json({
        msg: "Something Went Wrong",
        success: false,
      });
    }
  });
});
module.exports = router;
