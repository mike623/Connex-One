const App = require("./app");
const services = require("./services");
const express = require("express");

const request = require("supertest");

/**
 * utilize the schema provide
 */
const Ajv = require("ajv");
const ajv = new Ajv();
const schema = {
  properties: {
    epoch: {
      description:
        "The current server time, in epoch seconds, at time of processing the request.",
      type: "number",
    },
  },
  required: ["epoch"],
  type: "object",
};

describe("app", () => {
  let app;
  beforeAll(() => {
    app = express();
    App(app, services);
  });
  it("should return 403 if no token provided", async () => {
    await request(app).get("/time").expect(403);
  });
  it("should return 403 if invalid token provided", async () => {
    await request(app)
      .get("/time")
      .set("Authorization", "Bearer imgod")
      .expect(403);
  });
  describe("time", () => {
    it("should return time", async () => {
      await request(app)
        .get("/time")
        .set("Authorization", "Bearer mysecrettoken")
        .expect(200)
        .then((res) => {
          expect(ajv.compile(schema)(res.body)).toEqual(true);
        });
    });
  });
  describe("metric", () => {
    it("should return metric", async () => {
      await request(app)
        .get("/metrics")
        .set("Authorization", "Bearer mysecrettoken")
        .expect(200);
    });
  });
});
