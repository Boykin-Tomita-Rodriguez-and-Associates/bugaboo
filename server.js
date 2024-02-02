const app = require('./server/app');
const { db } = require('./server/db')
const port = 3000

app.listen(PORT, () => {
  db.sync({ force: false });
  console.log(`App is listening at http://localhost:${PORT}`);
});
