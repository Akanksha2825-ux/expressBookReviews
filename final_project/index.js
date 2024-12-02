const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Use express-session for session management
app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// Authentication middleware for routes under "/customer/auth/*"
app.use("/customer/auth/*", function auth(req, res, next) {
  // Check if the user is authenticated through session
  if (req.session && req.session.userId) {
    // User is authenticated, allow the request to continue
    next();
  } else {
    // User is not authenticated, send a 403 Forbidden response
    return res.status(403).json({ message: "Access denied. Please login." });
  }
});

const PORT = 5000;

// Use the customer and general routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start the server
app.listen(PORT, () => console.log("Server is running"));
