const userModel = require('@/models/userModel');
const { uploadFile } = require('@/utils/upload');
const jwt = require('jsonwebtoken'); // 用于签发、解析 token
const md5 = require('md5'); // md5

class userController {
  // 用户登录
  async login(ctx, next) {
    const body = ctx.request.body;

    const account = body.account,
      password = body.password;

    if (!account || !password) {
      return ctx.sendError(101, '账号和密码不能为空');
    }

    let dbResult = await userModel.userOne(account); // 异常处理
    if ($methods.isEmpty(dbResult)) {
      return ctx.sendError(102, '该账号未注册');
    }

    if (dbResult.password != md5(password)) {
      return ctx.sendError(103, '账号或者密码错误');
    }

    let secret = $config.secret; // jwt 密钥
    let payload = {
      account: dbResult.account,
      id: dbResult.id
    };
    let token = jwt.sign(payload, secret, {
      expiresIn: '5h' // 60：60秒; '5h':5小时
    });

    return ctx.send({ token }, '登录成功');

    // 或 默认返回方式
    // ctx.body = {
    //   status: true,
    //   token
    // };
  }

  // 用户信息
  async userInfo(ctx, next) {
    // do something
    console.log(ctx);
    // 假设这是请求回来的数据
    let data = {
      name: 'jk',
      age: 25
    };
    // ctx.body = {
    //   status: true,
    //   data
    // };
    return ctx.send(data);
  }

  // 获取所有的用户信息 mysql
  async userAllInfo(ctx, next) {
    let data = await userModel.userAllInfo();
    ctx.body = data;
  }

  // 获取所有的用户信息 sqlite3
  async userAllInfo_sqlite(ctx, next) {
    let data = await userModel.userAllInfo_sqlite();
    // ctx.body = data;
    return ctx.send(data);
  }

  //  上传文件/图片
  // https://chenshenhai.github.io/koa2-note/note/upload/simple.html
  async uploadFile(ctx, next) {
    var result = {
      errno: 0,
      errmsg: '操作成功'
    };

    // 上传文件事件
    var uploadResult = await uploadFile(ctx, {
      fileType: 'file'
    });

    if (uploadResult.status) {
      result = uploadResult;
    }

    ctx.body = result;
  }
}

module.exports = new userController();
