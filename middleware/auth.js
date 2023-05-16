const jwt = require("jsonwebtoken");
const express = require("express");

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token)
    return res.status(403).send("A Token is require for Authentication.");
  try {
    const decode = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decode;
  } catch (e) {
    return res.status(401).status("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
