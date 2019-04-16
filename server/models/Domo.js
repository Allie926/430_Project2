const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let DomoModel = {};

// mongoose.Types.ObjectID is a function that
// converts string Id to real mongo ID
const convertId = mongoose.Types.ObjectId;

const DomoSchema = new mongoose.Schema({
  // created a new variable to be saved
  money: {
    type: Number,
    required: true,
    trim: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  money: doc.money,
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };
  return DomoModel.find(search).select('name age').exec(callback);
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;
