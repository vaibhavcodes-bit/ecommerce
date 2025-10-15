require('dotenv').config(); 

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");

//create a database connection -> u can also
//create a separate file for this and then import/use that file here

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 8080;

const allowedOrigins = [
  process.env.FRONTEND_URL, // make sure this starts with "https://"
  'http://localhost:5173',  // dev
  'https://ecommerce-silk-mu.vercel.app',
  'https://ecommerce-5souia0w7-vaibhav-pandeys-projects-0e4245d2.vercel.app',
  // add any other exact frontends you use
].filter(Boolean);

// Regex that matches any vercel subdomain like something.vercel.app or sub.something.vercel.app
const vercelRegex = /^https?:\/\/[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.vercel\.app$/;

app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log('CORS check - incoming Origin:', origin);

  // allow requests with no origin (Postman, server-side requests)
  if (!origin) return next();

  // allow exact whitelisted origins
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control, Expires, Pragma, token, Filter-FCM, college_id');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    return next();
  }

  // allow vercel subdomains (flexible)
  if (vercelRegex.test(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control, Expires, Pragma, token, Filter-FCM, college_id');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    return next();
  }

  console.log('Blocked CORS request from:', origin);
  return res.status(403).send('Not allowed by CORS');
});

// ensure preflight handled
app.options('*', (req, res) => res.sendStatus(204));


app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);

app.use("/api/common/feature", commonFeatureRouter);

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
