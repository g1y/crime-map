const path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: "./src/entry.js", // string | object | array
    // Here the application starts executing
    // and webpack starts bundling

    output: {
        // options related to how webpack emits results

        path: path.resolve(__dirname, "dist"), // string
        // the target directory for all output files
        // must be an absolute path (use the Node.js path module)

        filename: "bundle.js", // string
        // the filename template for entry chunks

        //publicPath: "/assets/", // string
        // the url to the output directory resolved relative to the HTML page

        //library: "MyLibrary", // string,
        // the name of the exported library

        //libraryTarget: "umd", // universal module definition
        // the type of the exported library
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {'presets': ["@babel/preset-env", "@babel/preset-react"]},
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            }
        ]
    },

    optimization: {
        minimize: false
    },

    plugins: [
        new webpack.DefinePlugin({
            "__API_ROOT__": JSON.stringify(process.env.NODE_ENV == "development" ? "http://localhost:5000" : "https://crime-map.g1y.io")
        }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
    ],
    devtool: 'eval-source-map',
    devServer: {
        contentBase: './dist',
        publicPath: '/'
    },
    watch: false,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    }
}
