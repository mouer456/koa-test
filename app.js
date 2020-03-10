const Koa = require("koa");
const router = require("koa-router");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const cors = require("koa2-cors"); // 跨域
const requireDirectory = require("require-directory"); // 路由的自动加载
const moduleAlias = require("module-alias"); // 路径别名
const jwtKoa = require("koa-jwt"); // 用于路由权限控制
const dayjs = require("dayjs"); // 时间/日期

// 自定义中间件
const sendHandle = require("./middlewares/sendHandle.js"); // 统一返回 json 格式，中间件

const app = new Koa();

// 路径别名
moduleAlias.addAliases({
  "@": __dirname // 项目根目录
});

// 全局变量
global.dayjs = dayjs; // 时间/日期 依赖
global.res = require("@/util/resolve"); // 定义返回格式

// error handler
onerror(app);

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"]
  })
);
app.use(json());
app.use(logger());
app.use(cors()); // 跨域
app.use(require("koa-static")(__dirname + "/public")); // 静态资源 public ：存放资源文件
app.use(require("koa-static")(__dirname + "/web")); // 静态资源 web ：存在前端页面代码

app.use(sendHandle()); // 统一定义返回 json 格式

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(
    `${ctx.method} ${ctx.url} - ${ms}ms - ${dayjs().format(
      "YYYY-MM-DD HH:mm:ss.SSS"
    )}`
  );
});

// routes
/*
 * v1 版 api
 */
const router_api_v1 = router(); // api 根路由
router_api_v1.prefix("/api/v1"); // 配置路由前缀
// 在根路由中自动加载注册子路由
requireDirectory(module, "./routes/v1", {
  visit: whenLoadModule
});
function whenLoadModule(obj) {
  if (obj instanceof router) {
    router_api_v1.use(obj.routes(), obj.allowedMethods());
  }
}
// 在app中注册根路由
app.use(router_api_v1.routes(), router_api_v1.allowedMethods());

/*
 * v2 版 api
 */
const router_api_v2 = router(); // api 根路由
router_api_v2.prefix("/api/v2"); // 配置路由前缀

router_api_v2.get("/", function(ctx, next) {
  ctx.body = "this is /api/v2.";
});
app.use(router_api_v2.routes(), router_api_v2.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
