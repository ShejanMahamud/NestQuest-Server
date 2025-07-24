const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.ST_SECRET_KEY);
const port = process.env.PORT || 4549;

// Import routers
const userRoutes = require('./routes/user.routes');
const propertyRoutes = require('./routes/property.routes');
const reviewRoutes = require('./routes/review.routes');
const advertiseRoutes = require('./routes/advertise.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const offeredRoutes = require('./routes/offered.routes');
const reportRoutes = require('./routes/report.routes');

const app = express();

// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://nestquest-web.netlify.app"
    ],
  })
);
app.use(express.json());

// Mount routers
app.use('/users', userRoutes);
app.use('/properties', propertyRoutes);
app.use('/reviews', reviewRoutes);
app.use('/advertises', advertiseRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/offered', offeredRoutes);
app.use('/reports', reportRoutes);

// Root route
app.get("/", (req, res) => {
  res.send({ server_status: "Server Running" });
});

app.listen(port, () => {
  console.log("Server running on", port);
});
