const toLowerCaseMiddleware = (fields) => (req, res, next) => {
  // 处理请求参数中的字符串
  Object.keys(req.body).forEach((key) => {
    if (fields.includes(key) && typeof req.body[key] === "string") {
      req.body[key] = req.body[key].toLowerCase();
    }
  });

  // 处理请求参数中的字符串
  Object.keys(req.params).forEach((key) => {
    if (fields.includes(key) && typeof req.params[key] === "string") {
      req.params[key] = req.params[key].toLowerCase();
    }
  });

  // 处理查询参数中的字符串
  Object.keys(req.query).forEach((key) => {
    if (fields.includes(key) && typeof req.query[key] === "string") {
      req.query[key] = req.query[key].toLowerCase();
    }
  });

  next();
};
module.exports = { toLowerCaseMiddleware };
