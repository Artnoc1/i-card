const path = require('path');

module.exports = {
    mode: "development",
    entry: {
        main: "./public/src/scripts/main.js"
    },
    output: {
        path: path.resolve(__dirname, 'public/build/js/'),
        filename: '[name].js'
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
};