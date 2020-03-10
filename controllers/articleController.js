const xss = require("xss"); // xss/csrf防御
const { Op } = require("sequelize");
const { Article } = require("@/models/articleModel");

class articleController {
  async add(ctx, next) {}

  async delete(ctx, next) {
    const id = ctx.params.id;

    // 检测是否存在文章
    const article = await Article.findOne({
      where: {
        id,
        deleted_at: null
      }
    });
    // 不存在抛出错误
    if (!article) {
      return ctx.result("没有找到相关文章", 1001);
    }
    // 软删除文章
    article.destroy();

    return ctx.result("删除成功", 0);
  }

  async update(ctx, next) {}

  async detail(ctx, next) {}

  // 获取文章列表
  async list(ctx, next) {
    const { keyword, category_id, page = 1, pageSize = 10 } = ctx.query;

    // 筛选方式
    let filter = {
      deleted_at: null
    };

    // 筛选方式：存在分类ID
    if (category_id) {
      filter.category_id = category_id;
    }

    // 筛选方式：存在搜索关键字
    if (keyword) {
      filter.title = {
        [Op.like]: `%${xss(keyword)}%`
      };
    }

    const articleList = await Article.scope("iv").findAndCountAll({
      limit: pageSize, //每页10条
      offset: (page - 1) * pageSize,
      where: filter,
      order: [["updatedAt", "DESC"]],
      // 查询每篇文章下关联的分类
      include: []
    });

    const data = {
      page: parseInt(page),
      pageSize: pageSize,
      count: articleList.count,
      totalPages: Math.ceil(articleList.count / pageSize),
      rows: articleList.rows
    };

    // ctx.response.status = 200;
    ctx.body = res.json(data);
  }
}

module.exports = new articleController();
