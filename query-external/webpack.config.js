const path = require('path');
const SpinSdkPlugin = require("@fermyon/spin-sdk/plugins/webpack")

module.exports = {
    entry: './src/index.js',
    experiments: {
        outputModule: true,
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.js',
        module: true,
        library: {
            type: "module",
        }
    },
    plugins: [
        new SpinSdkPlugin()
    ],
    optimization: {
        minimize: false
    },
    performance: {
        hints: false,
    },
    resolve: {
        fallback: {
          https: require.resolve("https-browserify"),
        },
    },
    resolve: {
        fallback: {
          https: require.resolve("https-browserify"),
          http: require.resolve("stream-http"),
          url: require.resolve("url/"),
        },
    }
};
