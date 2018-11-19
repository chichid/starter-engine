const merge = require("webpack-merge");
const commonConfig = require("./webpack.common");
const NodemonPlugin = require("nodemon-webpack-plugin");

module.exports = merge(commonConfig, {
  mode: "development",
  devtool: "inline-source-map",
  plugins: [new NodemonPlugin()]
});
