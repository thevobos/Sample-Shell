const HtmlWebpackPlugin        = require('html-webpack-plugin');
const ModuleFederationPlugin   = require('webpack/lib/container/ModuleFederationPlugin');
const deps                     = require('./package.json').dependencies;

module.exports = {
  mode: 'development',
  devServer: {
    port: 3000,
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react',
          ],
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
          test: /\.svg$/i,
          use: [
              {
                  loader: 'svg-url-loader',
                  options: {
                      limit: 10000,
                  },
              }
          ]
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin(
      {
        name: 'SHELL',
        filename: 'remoteEntry.js',
        remotes: {},
        exposes: {},
        shared: [
          {
            ...deps,
            react: { requiredVersion: deps.react, singleton: true },
            'react-dom': {
              requiredVersion: deps['react-dom'],
              singleton: true,
            },
          },
        ],
      }
    ),
    new HtmlWebpackPlugin({
      template:
        './public/index.html',
    }),
  ],
};
