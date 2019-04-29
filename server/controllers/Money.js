const models = require('../models');

const Money = models.Money;

const makerPage = (req, res) => {
  Money.MoneyModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      //console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), moneys: docs });
  });
};
//saves moneyData
const makeMoney = (req, res) => {
  const moneyData = {
    money: req.body.money,
	multiplier: req.body.multiplier,
	multCost: req.body.multCost,
	moneyTime: req.body.moneyTime,
	timeCost: req.body.timeCost,
	wordCount: req.body.wordCount,
	wordCost: req.body.wordCost,
    owner: req.session.account._id,
  };

  const newMoney = new Money.MoneyModel(moneyData);

  const moneyPromise = newMoney.save();

  moneyPromise.then(() => res.json({ redirect: '/maker' }));

  moneyPromise.catch((err) => {
    //console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Money already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return moneyPromise;
};

const getMoneys = (request, response) => {
  const req = request;
  const res = response;

  return Money.MoneyModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      //console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ moneys: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getMoneys = getMoneys;
module.exports.make = makeMoney;
