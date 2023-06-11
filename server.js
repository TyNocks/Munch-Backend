const express = require("express"),
  path = require("path"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  cookieParser = require("cookie-parser"),
  config = require("./DB"),
  {MongoClient} = require('mongodb');

const port = process.env.PORT || 8080;


const recipeRoute = require("./routes/recipe.route");
const userdataRoute = require("./routes/userdata.route");
const ingredientRoute = require('./routes/ingredient.route');
const mealRoutes = require('./routes/meal.route');


  const allowedOrigins = [
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
    'http://localhost:8080',
    'http://localhost:8100',
    '*'
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
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());
app.options('*', cors(corsOptions));
app.use("/recipes", recipeRoute);
app.use("/auth", userdataRoute);
app.use("/ingredient", ingredientRoute);
app.use('/meals', mealRoutes);
app.use(cors());

MongoClient.connect(config.DB, (err, db) => {
  if (err) {
    console.warn(`Failed to connect to the database. ${err.stack}`);
  }
  app.locals.db = db;
  app.listen(port, function () {
    console.log("Listening on port " + port);
  });
});


