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
  
  multiplier: {
    type: Number,
    required: true,
    trim: true,
  },
  
  multCost: {
    type: Number,
    required: true,
    trim: true,
  },
  
  moneyTime: {
    type: Number,
    required: true,
    trim: true,
  },
  
  timeCost: {
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
  multiplier: doc.multiplier,
  multCost: doc.multCost,
  moneyTime: doc.moneyTime,
  timeCost: doc.timeCost,
});

MoneySchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };
  return MoneyModel.find(search).select('money multiplier multCost moneyTime timeCost').exec(callback);
};

MoneyModel = mongoose.model('Money', MoneySchema);

module.exports.MoneyModel = MoneyModel;
module.exports.MoneySchema = MoneySchema;
