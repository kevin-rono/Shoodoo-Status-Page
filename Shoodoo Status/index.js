require('dotenv').config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/index');
const LOG = console.log;
const PORT = process.env.SERVER_PORT;
const date = require('date-and-time');
const helmet = require('helmet');
const cors = require('cors');
const corsActive = process.env.CORS_ACTIVE;

const app = express();
app.use(require('express-status-monitor')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(router);
app.use(express.static("."));

//express.js security with http headers
LOG('Helmet is on');
app.use(helmet());

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS;
//console.log(allowedOrigins);

//enable pre-flight across-the-board
app.options('*', cors());

if (parseInt(corsActive) == 1) {
  // console.log("CORS Active");
  app.use(cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'CORS blocked.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  }));
} else {
  console.log("CORS NOT Active");
}

const now = new Date();

LOG("################################################");
LOG("#####   SHOODOO STATUS STARTED             #####");
LOG("#####  Server listening to port: " + PORT + "      #####");
LOG("#####  Environment : " + process.env.NODE_ENV + "             #####");
LOG("#####    " + date.format(now, 'YYYY/MM/DD HH:mm:ss') + "               #####");
LOG("################################################");

app.listen(PORT);

module.exports = app;