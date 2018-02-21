const CopyWebpackPlugin = require('copy-webpack-plugin');
const DepsPlugin = require('./webpack-deps-plugin');
const WebpackShellPlugin = require('./webpack-shell-plugin');

const path = require('path');

module.exports = (config, { isProd, appRoot, output }) => {
  config.entry.push(path.resolve(__dirname, 'entry.js'));

  config.module.rules.push({
    test: /\.(yaml|yml)$/,
    use: [
      {
        loader: 'json-loader'
      },
      {
        loader: 'yaml-loader'
      }
    ]
  });
  if (isProd) {
    config.plugins.push(
      new CopyWebpackPlugin([
        {
          from: path.resolve(appRoot, 'serverless.yml'),
          to: output
        }
      ])
    );
    config.plugins.push(
      new DepsPlugin({
        root: appRoot,
        outDir: output
      })
    );
    config.plugins.push(
      new WebpackShellPlugin({
        onBuildEnd: [`cd ${output} && npm i`],
        safe: true
      })
    );
  }
  return config;
};
