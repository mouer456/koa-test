module.exports = {
  // 服务端口
  port: 3000,
  // MySQL 数据库配置
  database: {
    host: "127.0.0.1",
    port: "3306",
    user: "root",
    password: "123456",
    dbName: "boblog"
  },
  // SQLite 数据库路径配置
  SQLite: {
    dbName: "sqlite/mydatabase.db"
  },
  secret: "secret", // jsonwebtoken/token 密钥
  security: {
    secretKey: "secretKey",
    // 过期时间 1小时
    expiresIn: 60 * 60
  }
};
