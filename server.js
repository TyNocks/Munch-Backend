const express = require("express"),
  path = require("path"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  mongoose = require("mongoose"),
  cookieParser = require("cookie-parser"),
  config = require("./DB");


const recipeRoute = require("./routes/recipe.route");
const userdataRoute = require("./routes/userdata.route");
mongoose.Promise = global.Promise;
mongoose
  .connect(config.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(
    () => {
      console.log("Database is connected");
    },
    (err) => {
      console.log("Can not connect to the database" + err);
    }
  );

  const allowedOrigins = [
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
    'http://localhost:8080',
    'http://localhost:8100'
  ];

  // Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
  const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        //callback(new Error('Origin not allowed by CORS'));
      callback(null, true);
      }
    }
  }

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.options('*', cors(corsOptions));
app.use("/recipes", recipeRoute);
app.use("/userdata", userdataRoute);
app.use(cors());

var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

const port = process.env.PORT || 8080;

const server = app.listen(port, function () {
  console.log("Listening on port " + port);
});
