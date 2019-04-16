const models = require('../models');

const Money = models.Money;

/* const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};*/
const makeMoney = (req, res) => {
  const moneyData = {
    money: req.body.money,
  };

  const newMoney = new Money.MoneyModel(moneyData);

  const moneyPromise = newMoney.save();

  moneyPromise.then(() => res.json({ redirect: '/maker' }));

  moneyPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return moneyPromise;
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Money.MoneyModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ domos: docs });
  });
};

// module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.make = makeMoney;
