const router = require("koa-router")();
const articleController = require("@/controllers/articleController");

router.prefix("/article");

router.post("/", articleController.add); // 新增
router.delete("/:id", articleController.delete); // 删除
router.put("/:id", articleController.update); // 更新/修改
router.get("/:id", articleController.detail); // 查询详情
router.get("/", articleController.list); // 查询列表

module.exports = router;
