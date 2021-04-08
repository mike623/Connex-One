const server = require("express")();
const app = require("./app");
const application = require("./app");
const srvs = require("./services");
const port = process.env.POST || "8080";

/**
 * entry point with depends inject
 */
async function main() {
  await application(server, srvs);
  server.listen(port);
}

main().then(() => {
  console.log(`server started at ${port}`);
});
