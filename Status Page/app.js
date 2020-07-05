const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/index.js');

const app = express();
app.use(require('express-status-monitor')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('html', require('ejs').renderFile);
//app.set('view engine', 'ejs');
app.use(router);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});

