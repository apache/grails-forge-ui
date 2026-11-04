const axios = require("axios");
const VERSION_FEED_URL = "https://grails.apache.org/start/grails-version-feed.json";
const { startProxy, startVersionServer } = require("./commands");

/**
 * Optional end of support overrides, keyed by feed channel, so the UI's
 * unsupported-version handling can be tried before the hosted instances
 * report the field. A value of null strips the field from that channel.
 *
 *   FORGE_END_OF_SUPPORT="OLDER=2026-09-30,PREV=2026-10-28,NEXT=null" npm start
 */
function endOfSupportOverrides() {
  const raw = process.env.FORGE_END_OF_SUPPORT;
  if (!raw) return {};
  return Object.fromEntries(
    raw
      .split(",")
      .map((pair) => pair.trim())
      .filter(Boolean)
      .map((pair) => {
        const [key, value = ""] = pair.split("=").map((part) => part.trim());
        return [key, value === "" || value === "null" ? null : value];
      })
  );
}

/**
 * Start a version server and proxy servers for the current
 * Grails Starter versions mirroring production launch site
 * This will fetch the production feed, and create proxies for
 * each of the remote sites at incrementing ports starting at 8080
 */
async function serve() {
  let port = 8080;
  const overrides = endOfSupportOverrides();
  const { data } = await axios.get(VERSION_FEED_URL);
  const versions = [];
  data.versions.forEach((version) => {
    const endOfSupport = overrides[version.key];
    const localhost = startProxy(version.baseUrl, port++, { endOfSupport });
    versions.push({
      ...version,
      baseUrl: localhost,
      __original: version.baseUrl,
      ...(endOfSupport !== undefined && { __endOfSupport: endOfSupport }),
    });
  });

  startVersionServer({
    ...data,
    versions,
  });
}

serve();
