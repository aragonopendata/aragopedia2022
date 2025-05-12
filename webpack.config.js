module.exports = {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  ident: 'postcss',
                  plugins: [
                    require('postcss-import'),
                    require('tailwindcss/nesting'),
                    require('tailwindcss'),
                    require('autoprefixer'),
                  ],
                },
              }
            },
          ],
        }
      ],
    },
    watchOptions: {
          ignored: /node_modules/,
    },
  };