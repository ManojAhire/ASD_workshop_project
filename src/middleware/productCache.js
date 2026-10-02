const cache = new Map();
const cacheTimeToLive = 60 * 1000;

function cacheGetResponses(req, res, next) {
  const cacheKey = req.originalUrl;
  const cachedResponse = cache.get(cacheKey);

  if (cachedResponse && cachedResponse.expiresAt > Date.now()) {
    res.set("X-Cache", "HIT");
    return res.status(cachedResponse.statusCode).json(cachedResponse.body);
  }

  if (cachedResponse) {
    cache.delete(cacheKey);
  }

  res.set("X-Cache", "MISS");

  const sendJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cache.set(cacheKey, {
        body,
        statusCode: res.statusCode,
        expiresAt: Date.now() + cacheTimeToLive,
      });
    }

    return sendJson(body);
  };

  next();
}

function invalidateProductCache(req, res, next) {
  res.on("finish", () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cache.clear();
    }
  });

  next();
}

module.exports = { cacheGetResponses, invalidateProductCache };