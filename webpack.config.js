const path = require("path");
const defaultConfig = require("@wordpress/scripts/config/webpack.config");

module.exports = {
  ...defaultConfig,
  entry: {
    app: "./src/app.jsx",
  },
  output: {
    path: path.resolve(__dirname, "./assets/build/"),
    filename: "[name].js",
    clean: true,
  },
};
