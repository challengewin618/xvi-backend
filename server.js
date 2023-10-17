require('./config/config.js');

const express = require('express');
const mongoose = require('mongoose');
const index = require('./routes/index');
const price = require('./routes/price');

const bodyParser = require('body-parser');
const cors = require('cors');
const {setupListener} = require("./utils/event");

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(require('./routes/index'));
app.use(require('./routes/price'));
app.use(require('./routes/order'));
// app.use(require('./routes/insert'));

mongoose.connect(
  process.env.CONNECTION,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) throw err;
    console.log('DB Connected');
  },
);

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
  setupListener();
});
