class Resolve {
  // 请求成功，不需要返回 data 或 请求失败
  success(msg = "success", code = 0) {
    return {
      code,
      msg
    };
  }
  // 请求成功，需要返回 data
  json(data, msg = "success", code = 0) {
    return {
      code,
      msg,
      data
    };
  }
}

module.exports = new Resolve();
