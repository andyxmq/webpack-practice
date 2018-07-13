var path = require("path");
var htmlWebpackPlugin = require("html-webpack-plugin");
var autoprefixer = require("autoprefixer");

var entry = {
    app1: './src/views/app1.js',
    app2: './src/views/app2.js',
    app3: './src/views/app3.js',
    app4: './src/views/app4.js',
};
var config = {
    output: {
        path: path.resolve(__dirname,"dist/"),
        filename: 'daily/js/[name].js',
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader",include: '/src/' },
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
            },
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
            },
            {
                test: /\.html$/,
                include: path.resolve(__dirname,'src/'),
                loader: 'html-loader'
            },
            // {
            //     test: /\.(png|jpg|gif|svg)/   ,
            //     loader: 'file-loader',
            //     query:{//改变图片路径
            //         name: 'assets/[name]-[hash:5].[ext]'
            //     }
            // },
            {
                test: /\.(png|jpg|gif|svg)/,
                loaders: [
                    'url-loader?limit:1300000&name=assets/[name]-[hash:5].png',
                    'image-webpack-loader'
                ]
            }
        ]
    },
    plugins: []
}
config.entry = entry;
var plugins = [];
for(var key in entry){
    plugins.push(
        new htmlWebpackPlugin({
            template: 'index.html',
            filename: `${key}.html`,
            chunks: `${key}`,
            inject: "body"
        })
    );
}

config.plugins = [].concat(config.plugins,plugins);

module.exports = config;
