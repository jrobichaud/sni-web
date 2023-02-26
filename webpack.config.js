const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

const mode = process.env.NODE_ENV || "development";
const prod = mode === "production";

module.exports = {
  entry: {
    bundle: ["./src/index.js"]
  },
  resolve: {
    alias: {
      svelte: path.resolve("node_modules", "svelte")
    },
    extensions: [".mjs", ".js", ".svelte"],
    mainFields: ["svelte", "browser", "module", "main"],
    conditionNames: ['svelte']
  },
  output: {
    path: __dirname + "/public",
    filename: "[name].js",
    chunkFilename: "[name].[id].js"
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: "svelte-loader",
          options: {
            emitCss: true,
            hotReload: true
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          /**
           * MiniCssExtractPlugin doesn't support HMR.
           * For developing, use 'style-loader' instead.
           * */
          prod ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader"
        ]
      }
    ]
  },
  mode,
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css"
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        "*.LICENSE.txt",
        '!**/*',
      ],
      protectWebpackAssets: false,
      cleanAfterEveryBuildPatterns: ['*.LICENSE.txt'],
    })
  ],
  devServer: {
    proxy: {
      '/sni': {
        target: 'http://retro-controller.local',
        changeOrigin: true,
      },
      '/zt': {
        target: 'http://retro-controller.local',
        changeOrigin: true,
      },
      '/pyz3r': {
        target: 'http://retro-controller.local',
        changeOrigin: true,
      }
    },
  },
  devtool: prod ? false : "source-map"
};
