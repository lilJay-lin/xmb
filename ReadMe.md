
# node.js

1. [实现简单的restful api](https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4)
 
 ````javascript
 
    get /bears
    get /bears/:bear_id
    post /bears
    put /bears/:bear_id
    delete /bears/:bear_id
 ````
 
2. 使用JWT做权限认证
   1. 新增路由user, 实现用户新增，登录，退出
   2. 路由bear做权限认证
      * 全局校验
      * 使用express-jwt校验
      * 自定义中间件校验
   3. token超时处理
      * 用户注销，使用redis保存token，只保存一段时间，置为失效
      * 请求中token失效
        * 让用户重新登录
        * 重新获取token