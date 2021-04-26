/* eslint-disable import/no-dynamic-require */
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');

const variables = require(`./config/${process.env.DOCKER_ENV}`);
module.exports = {
  configureWebpack: {
    plugins: [new webpack.NormalModuleReplacementPlugin(/^mqtt$/, 'mqtt/dist/mqtt.js'), new webpack.EnvironmentPlugin(variables)],
  },
};
