const mongoose = require("mongoose");                  // // require a mongoose to validate our schema 
const bcrypt = require("bcrypt");




const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // encrypted password
  },
  { timestamps: true }
);




//here we are using bcrypt password hashing
userSchema.pre("save", async function (next) {
  // here we can not use fatarrow function because here we are using this keyword
  try {
    const salt = await bcrypt.genSalt(10); // idealy minimum 8 rounds required here we use 10 rounds
    // console.log("called before saving a user")
    // console.log(this.email, this.password)
    //below we are generating hashPassword by applying 10 rounds on it
    const hashPassword = await bcrypt.hash(this.password, salt);
    this.password = hashPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.post("save", async function (next) {
  try {
    console.log("called after saving a user");
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("User32", userSchema);
