# webpack-react-starter 

A webpack-react-starter build with React and Webpack and Gulp

## 安装

```
git clone https://github.com/MingXingTeam/webpack-react-starter.git
cd webpack-react-starter
npm install
```

## 运行方法

+ `gulp dev` 						  ->开发模式
+ `npm start`或者`node-dev server.js` ->启动服务器 访问localhost:8080/build/some.html（页面直接看src里面的view里面有哪些页面 不要到build里面找页面
build是虚拟目录）
+ `gulp release` 					  ->生产模式
（测试生产模式是否正常运行：http-server [assets目录]）


## 测试Webpack特性

### webpack监听模块的修改&自动重新编译

+ `npm start`
+ 打开浏览器访问：`localhost:8080/build/entryC.html`
+ 打开Hello.jsx（src/scripts/components/hello.jsx）。 修改Hello World为Hello Webpack 并保存（观察浏览器 可以看到自动刷新；观察
控制台 可以看到模块自动编译）

### 查看图片、css、静态文件变化、JS文件版本变化

+ 打开webpack.config.js 取消注释CommonsChunkPlugin相关代码并修改为生产模式
//process.env.NODE_ENV = 'development';
process.env.NODE_ENV = 'production';
+ 运行`gulp release`
+ 对比assets目录下和src目录下文件相关变化

## problems!~ 

+ 调试方法：source-map使用
+ angular
+ react
+ html自动刷新
+ webpack-assets.json 格式不对
+ stats.json 格式不对
+ console warn: a promise was created in a handler but none were returned from it
+ GET http://127.0.0.1:8080/scripts/entryB.js


## contributions

please feel free to pull request!!

please open an issue if you have any problems!! 







