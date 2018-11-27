module.exports = {
    entry: {
        bundle: __dirname + '/src/sourceFile.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js'

    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
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