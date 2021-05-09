const path = require('path');

const Paths = {
    SRC: path.join(__dirname, 'src'),
    DIST: path.join(__dirname, 'public'),
};

module.exports = {
    // target: "browserslist",
    target: "web",
    entry: {
        app: Paths.SRC,
    },
    output: {
        filename: 'bundle.js',
        path: Paths.DIST
    },
    devServer: {
        contentBase: Paths.DIST,
        open: false,
        port: 1337,
        compress: true,
        historyApiFallback: true
    },

    module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
            },
          },
          {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader']
          },
          {
            test: /\.(png|jpe?g|gif)$/i,
            use: ['file-loader'],
          }
        ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    devtool: "source-map",
};
