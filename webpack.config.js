const path = require('path');

module.exports = {
    mode: "development",
    entry: {
        index: "src/js/index.js"
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [{
                test: /\.hbs$/,
                use: 'raw-loader'
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
}