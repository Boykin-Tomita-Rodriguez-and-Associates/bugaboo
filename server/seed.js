const {db} = require('./db');
const seed = require('./seedFn');

seed()
  .then(() => {
    console.log('Bugaboo!!!');
  })
  .catch(err => {
    console.error(err);
  })
  .finally(() => {
    db.close();
  });
