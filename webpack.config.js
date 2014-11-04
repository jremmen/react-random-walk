module.exports = {
  entry: './random_walk.jsx',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.jsx$/, loader: 'jsx-loader' },
      { test: /\.css$/, loader: 'style-loader!css-loader' }
    ]
  }
};
