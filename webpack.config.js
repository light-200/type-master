const path = require("path");
const Dotenv = require("dotenv-webpack");
module.exports = {
  mode: "production",
  entry: "./src/script.js",
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "bundle.js",
  },
  devServer: {
    static: "./docs",
  },
  plugins: [new Dotenv()],
  watch: true,
};
