import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicId: {
    type: String,
  },
  profileBio: {
    type: String,
  },
});

// This prevents Mongoose from recompiling the model.
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
