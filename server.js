const app = require("./server/app");
const { db } = require("./server/db");
const port = 3000;

app.listen(port, () => {
  db.sync();
  console.log(`App is listening at http://localhost:${port}`);
});
