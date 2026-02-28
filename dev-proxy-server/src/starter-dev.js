const axios = require("axios");

const VERSION_FEED_URL = "https://start.grails.org/grails-version-feed.json";
const { startVersionServer, toLocalUrl } = require("./commands");

/**
 * Start a version server that serves up
 * Grails Forge API (https://github.com/grails/grails-forge)
 * you are running locally, which by default runs on port 8080
 * when started via `./gradlew :grails-forge-web-netty:run`
 */
async function serve() {
  const { data } = await axios.get(VERSION_FEED_URL);
  const versions = [{ key: "LOCAL_DEV", baseUrl: toLocalUrl(8080), order: 0 }];
  startVersionServer({
    ...data,
    versions,
  });
}

serve();
