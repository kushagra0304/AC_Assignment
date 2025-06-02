const mongoose = require('mongoose');

// id is created by mongoose when we save a document
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    post: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: [] }],
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// The first argument to the function below dictates the collection to put new documents in.
// This is fragile
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;