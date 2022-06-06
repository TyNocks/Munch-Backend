const allowedOrigins = [
    "capacitor://localhost",
    "ionic://localhost",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:8100",
  ];

const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        //callback(new Error('Origin not allowed by CORS'));
        callback(null, true);
      }
    },
  };

module.exports = {
    secret: process.env.tokenSalt,
    corsOptions: corsOptions
}