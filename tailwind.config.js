module.exports = {
  presets: [require('desy-html/config/tailwind.config.js')],  
  content: [
    './node_modules/desy-angular/**/*.{js,mjs,ts}',
    './src/**/*.{html,ts,css,js}'
  ]
};