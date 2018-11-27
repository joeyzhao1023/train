```
npm init      这个指令会引导你创建一个package.json，包括版本作者等信息，有助于你发包。后面安装的包的依赖关系也会在package.json里有体现。
npm install     直接执行这个命令，会按照当前目录下的package.json的配置去安装各个依赖的包。
npm install [module]    在当前目录安装这个模块。会去检测该模块是否存在于node_module文件夹中，存在了就不安装了。 
npm install [module] -g    在全局进行模块安装。全局模式下安装的包，会自动注册到系统变量 path里的。
npm install [module] --save-dev    在当前目录下安装这个模块，但是仅在开发时使用。在package的"devDependencies"下，表示仅在开发的时候使用。
```



> https://webpack.js.org/loaders/babel-loader/