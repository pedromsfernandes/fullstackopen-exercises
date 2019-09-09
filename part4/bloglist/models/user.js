const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: { type: String, required: true, minLength: 3, unique: true },
  name: String,
  password: { type: String, required: true },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog"
    }
  ]
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.password;
    delete returnedObject.__v;
  }
});

userSchema.plugin(require("mongoose-unique-validator"));

module.exports = mongoose.model("User", userSchema);
