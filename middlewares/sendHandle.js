/**
 * 返回 json 数据格式封装
 * 参考：https://github.com/lin-xin/blog/blob/master/jwt-demo/server/middlewares/sendHandle.js
 * 示例：
 * return ctx.send({"token":"123456"},"登录成功");
 * return ctx.sendError(101,"登录失败");
 */

const sendHandle = () => {
  // 处理请求成功方法
  const render = ctx => {
    return (data = "", msg = "success", code = 0) => {
      ctx.set("Content-Type", "application/json");
      ctx.body = {
        code,
        msg,
        data
      };
    };
  };

  // 处理请求失败方法
  const render2 = ctx => {
    return (msg = "error", code = 1000) => {
      ctx.set("Content-Type", "application/json");
      ctx.body = {
        code,
        msg
      };
    };
  };

  return async (ctx, next) => {
    ctx.json = render1(ctx); // 请求成功，且带data
    ctx.result = render2(ctx); // 请求成功不带data，或请求失败
    await next();
  };
};

module.exports = sendHandle;
