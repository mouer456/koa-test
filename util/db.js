const Sequelize = require("sequelize");

const { host, port, user, password, dbName } = require("@/config").database;

const sequelize = new Sequelize(dbName, user, password, {
  dialect: "mysql",
  host,
  port,
  logging: false,
  timezone: "+08:00",

  define: {
    // 字段以下划线（_）来分割（默认是驼峰命名风格）
    underscored: true,
    timestamps: true,
    paranoid: true,
    // createdAt: "created_at",
    // updatedAt: "updated_at",
    // deletedAt: "deleted_at",
    scopes: {
      iv: {
        attributes: {
          exclude: ["content", "password", "deletedAt"]
        }
      }
    }
  }
});
// 创建模型
sequelize.sync({ force: false });
module.exports = {
  sequelize
};
