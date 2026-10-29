const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");

function toLocalUrl(port) {
  return `http://localhost:${port}`;
}

function startVersionServer(feed, port = 8088) {
  const localhost = toLocalUrl(port);
  const app = express();
  app.use(cors());
  app.get("/{*splat}", (req, res) => res.json(feed));
  app.listen(port, () => {
    console.log(`Started version server on: ${localhost}`);
    console.table(feed.versions);
  });
  return localhost;
}

/**
 * Rewrite the endOfSupport field of a proxied /versions response so the UI can
 * be exercised against instances that do not report one yet. A string sets the
 * date, null removes the field, undefined leaves the response alone.
 */
function decorateEndOfSupport(endOfSupport) {
  return (proxyRes, proxyResData, userReq) => {
    if (userReq.path !== "/versions") return proxyResData;
    try {
      const body = JSON.parse(proxyResData.toString("utf8"));
      if (endOfSupport === null) {
        delete body.endOfSupport;
      } else {
        body.endOfSupport = endOfSupport;
      }
      return JSON.stringify(body);
    } catch (_error) {
      return proxyResData;
    }
  };
}

function startProxy(url, port, { endOfSupport } = {}) {
  const localhost = toLocalUrl(port);
  const app = express();
  app.use(cors());
  const options = {};
  if (endOfSupport !== undefined) {
    options.userResDecorator = decorateEndOfSupport(endOfSupport);
  }
  app.use("/", proxy(url, options));
  app.listen(port);
  return localhost;
}

module.exports = {
  toLocalUrl,
  startProxy,
  startVersionServer,
};
