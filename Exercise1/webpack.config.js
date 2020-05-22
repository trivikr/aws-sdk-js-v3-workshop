/* eslint-disable */
const glob = require("glob");

// Bug https://github.com/webpack/webpack/issues/4453
const entryArray = glob.sync("./src/*.ts");

module.exports = {
  entry: entryArray.reduce((acc, item) => {
    const name = item.replace("./src/", "").replace(".ts", "");
    acc[name] = item;
    return acc;
  }, {}),

  output: {
    filename: "[name]/app.js",
    libraryTarget: "commonjs",
  },

  // Resolve .ts and .js extensions
  resolve: {
    extensions: [".ts", ".js"],
  },

  // Target node
  target: "node",

  // Set the webpack mode
  mode: process.env.NODE_ENV || "production",

  // Add the TypeScript loader
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          failOnError: true,
        },
      },
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },
    ],
  },
};
