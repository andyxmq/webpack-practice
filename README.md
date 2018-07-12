# **webpack-深入实践** version: 3.10.0

## 安装webpack
>npm install webpack@3.10.0 -g 
## 初次使用
>helloworld.js 

    function helloWorld(str){
        alert(str)
    }
>命令行输入打包

    PS G:\webspace\webpack-practice> webpack .\helloword.js helloword.bundle.js
    Hash: b9e829245f7dda432ace
    Version: webpack 3.10.0
    Time: 85ms
                Asset     Size  Chunks             Chunk Names
    helloword.bundle.js  2.52 kB       0  [emitted]  main
    [0] ./helloword.js 44 bytes {0} [built]

    Asset: 打包生成的文件 size：文件大小 Chunks: 分块  Chunk Names: 块名称 [0]分块是0

>创建test.js

    function test(){
        return {   
        }
    }
>在helloworld.js中引用并打包

    require("./test");
    function helloWorld(str){
        alert(str)
    }

    PS G:\webspace\webpack-practice> webpack .\helloword.js helloword.bundle.js
    Hash: 0bc4ad62ac2ed753c7b0
    Version: webpack 3.10.0
    Time: 47ms
                Asset     Size  Chunks             Chunk Names
    helloword.bundle.js  2.67 kB       0  [emitted]  main
    [0] ./helloword.js 64 bytes {0} [built]
    [1] ./test.js 50 bytes {0} [built]
>helloword.bundle.js

    /* 0 */
    /***/ (function(module, exports, __webpack_require__) {

    __webpack_require__(1);
    function helloWorld(str){
        alert(str)
    }

    /***/ }),
    /* 1 */
    /***/ (function(module, exports) {

    function test(){
        return {
            
        }
    }
 
    注意：__webpack_require__(1)去引用自己的依赖

## 打包css文件 , 安装css-loader style-loader
>npm install css-loader style-loader -D

    在helloworld.js中,引入 require("style-loader!css-loader!./style.css");
    
    css-loader: 处理引入的css文件
    style-loader: 把处理css文件插入到head标签里面
    
    打包方式：
        使用webpack命令行:  webpack .\helloword.js helloword.bundle.js --module-bind 'css=style-loader!css-loader'

        直接在require中引入loader: require("style-loader!css-loader!./style.css");

    webpack 命令行参数说明：    
        --watch 监听变化 打包 --progress 百分比读条 --display-modules 打包的模板  --display-reasons 打包原因 --colors 打包的字是有颜色的

## 建立项目的webpack配置文件
>初始化目录 npm init  
>安装webpack npm install webpack@3.10.0 --save-dev

    建立webpack默认配置文件webpack.config.js --config 指定配置文件

    修改package.json script
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "build": "webpack --config webpack.config.js --progress --display-modules --colors --display-reasons"
    },

## webpack.config.js
>参数说明：//todo

    entry: string || Array<string> || Object
        Array: 把数组中文件打包在一起 
        栗子： entry: ['./src/script/main.js','./src/script/a.js']
        bundle.js  
            __webpack_require__(1);
            module.exports = __webpack_require__(2);
        Object: 用于多页面应用程序，{key: value} key表示entryChunkName value：表示入口文件(entry: string|Array<string>)
    
    output: 
        单入口起点： filename可以写成一个固定的名字，多入口则报错：Multiple assets emit to the same 
    filename bundle.js
        多入口起点：  filename: [name].js (name hash(本次打包的hash值) chunkhash（自己的hash相当于文件的版本号）)
        Hash: fe630e2b0c715e94119d（hash与此相同）
        Version: webpack 3.10.0
        Time: 58ms

        chunkhash: 只会在变化的文件生成新的chunkhash

    plugins: 
        自动生成html文件： 安装 npm install html-webpack-plugin --save-dev
        在webpack.config.js引入 html-webpack-plugin插件
        + var htmlWebpackPlugin = require("html-webpack-plugin");
        plugins: [
            new htmlWebpackPlugin({
                template: 'index.html'
            })
        ]
        context: 上下文，默认指向根目录

        template: 指定模板 
        filename: filename|[hash]
        inject: head|body|false
        title: string

        遍历htmlWebpackPlugin key(files,options)
        <%for(var key in htmlWebpackPlugin){%>
            <%=key%>
        <%}%>

        遍历其中的files

        <%for(var key in htmlWebpackPlugin.files){%>
            <%=key%>: <%=JSON.stringify(htmlWebpackPlugin.files[key])%>
        <%}%>

        结果：
        publicPath: ""
        chunks: {"main":{"size":30,"entry":"js/main-9d457671d0ec3e0838e9.js","hash":"9d457671d0ec3e0838e9","css":[]},"a":{"size":35,"entry":"js/a-1c1b4c348da09bb7b8e1.js","hash":"1c1b4c348da09bb7b8e1","css":[]}}
        js: ["js/main-9d457671d0ec3e0838e9.js","js/a-1c1b4c348da09bb7b8e1.js"]
        css: []
        manifest: 

        遍历options
        <%for(var key in htmlWebpackPlugin.options){%>
            <%=key%>: <%=JSON.stringify(htmlWebpackPlugin.options[key])%>
        <%}%>
        结果：

        template: "G:\\webspace\\webpack-practice\\node_modules\\html-webpack-plugin\\lib\\loader.js!G:\\webspace\\webpack-practice\\index.html"
        templateParameters: 
        filename: "index.html"
        hash: false    
        inject: "head"
        compile: true
        favicon: false
        minify: false；//对当前的html文件进行压缩
        cache: true
        showErrors: true
        chunks: "all"
        excludeChunks: []
        chunksSortMode: "auto"
        meta: {}
        title: "this is title"
        xhtml: false
        date: "2018-07-08T12:39:23.560Z"


        minify:{//清除评论
            removeComments: true,
            collapseWhitespace: true    
        }

    处理多页面应用：多个new htmlWebpackPlugin()多个实例

    chunks: 对应页面需要引入的chunks
    excludeChunks: 排除不需要的chunks

    优化：在template.html中代码 即 inline模式  head中加入一下代码
    <script type="text/javascript">
        <%=compilation.assets[htmlWebpackPlugin.files.chunks.main.entry.substr(htmlWebpackPlugin.files.publicPath.length)].source()%>
    </script>

    <body>
        <%for(var k in htmlWebpackPlugin.files.chunks){%>
            <%if(k !== 'main'){%>
                <script type="text/javascript" src="<%=htmlWebpackPlugin.files.chunks[key].entry%>"></script>
            <%}%>    
        <%}%>    
    </body>

    module 
    babel-loader: http://babeljs.io/setup#installation 
    安装babel-loader:  npm install --save-dev babel-loader babel-core

    via config
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }

    via loader
    var Person = require("babel!./Person.js").default;
    new Person();

    安装npm install --save-dev babel-preset-latest

    package中配置：
    "babel":{
        "presets": ["latest"]
    },

    .babelrc
    {
        "presets": ["latest"]
    }

    注意： include exclude 提升打包速度

## 处理CSS
>  安装css-loader style-loader: npm install style-loader css-loader -D
   加入配置 { test: /\.css$/,loader:'style-loader!css-loader'}

    css属性加上前缀： postcss-loader autoprefixer
    {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'style-loader',
            },
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1,
                }
            },
            {
                loader: 'postcss-loader',
                options: {
                    plugins: [autoprefixer({
                        browsers: ['last 2 versions', 'Android >= 4.0', 'iOS 7'],
                        remove: true,
                    })]
                }
            }
        ]
    }

## 处理less sass
>    安装less: npm install --save-dev less-loader less

    {
        test: /\.less$/,
        use: [
            {loader: 'style-loader'},
            {loader: 'css-loader'},
            {
                loader: 'postcss-loader',
                options: {
                    plugins: [autoprefixer({
                        browsers: ['last 2 versions', 'Android >= 4.0', 'iOS 7'],
                        remove: true,
                    })]
                }
            },
            {loader: 'less-loader'}
        ]
    }

## 处理模板文件
    1. 模板文件
    <div class="layer">
        <div>this is layer</div>
    </div>

    安装：npm i -D html-loader

#### 处理文件及其他文件
    图片处理 npm install file-loader -D
    {
        test: /\.(png|jpg|gif|svg)/   ,
        loader: 'file-loader'
    }

    require("../../assets/test.jpg");
    {
        test: /\.(png|jpg|gif|svg)/   ,
        loader: 'file-loader',
        query:{//改变图片路径
            name: 'assets/[name]-[hash:5].png'
        }
    }

    url-loader: npm install  url-loader -D
    {
        test: /\.(png|jpg|gif|svg)/   ,
        loader: 'url-loader',
        query:{//改变图片路径
            limit: 1300000,
            name: 'assets/[name]-[hash:5].[ext]'
        }
    }

    image-webpack-loader: 压缩
    {
        test: /\.(png|jpg|gif|svg)/,
        loaders: [
            'url-loader?limit:1300000&name=assets/[name]-[hash:5].png',
            'image-webpack-loader'
        ]
    }   