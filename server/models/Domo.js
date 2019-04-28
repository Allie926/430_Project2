const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let MoneyModel = {};

// mongoose.Types.ObjectID is a function that
// converts string Id to real mongo ID
const convertId = mongoose.Types.ObjectId;

const MoneySchema = new mongoose.Schema({
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

MoneySchema.statics.toAPI = (doc) => ({
  money: doc.money,
});

MoneySchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };
  return MoneyModel.find(search).select('money').exec(callback);
};

MoneyModel = mongoose.model('Money', MoneySchema);

module.exports.MoneyModel = MoneyModel;
module.exports.MoneySchema = MoneySchema;
