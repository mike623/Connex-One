const promMid = require("express-prometheus-middleware");
const bearerToken = require("express-bearer-token");

/**
 * upgrade to jwt etc...
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const authMiddle = (req, res, next) => {
  if (!req.token || req.token !== "mysecrettoken")
    return res.status(403).send("missing token");
  next();
};

/**
 * controller
 * @param {import('express').Application} app
 * @param {import('./services')} srvs
 */
module.exports = (app, srvs) => {
  app.use(bearerToken());
  app.use(authMiddle);
  app.get("/time", (req, res) => {
    res.json({ epoch: srvs.getTime() });
  });
  app.use(
    promMid({
      metricsPath: "/metrics",
      collectDefaultMetrics: true,
    })
  );
};
