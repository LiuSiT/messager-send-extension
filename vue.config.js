const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

// Generate pages object
const pagesObj = {};

const chromeName = ["popup", "options"];

chromeName.forEach(name => {
  pagesObj[name] = {
    entry: `src/${name}/index.js`,
    template: "public/index.html",
    filename: `${name}.html`
  };
});

const plugins =
  process.env.NODE_ENV === "production"
    ? [
        {
          from: path.resolve("src/manifest.production.json"),
          to: `${path.resolve("dist")}/manifest.json`
        },
        {
            from: path.resolve("src/icons"),
            to: `${path.resolve("dist")}/icons`
        },
        {
            from: path.resolve("src/background/background.html"),
            to: `${path.resolve("dist")}/background.html`
        },
        {
          from: path.resolve("src/background"),
          to: `${path.resolve("dist")}/js`,
            ignore: ['*.html']
        },
        {
          from: path.resolve("src/js"),
          to: `${path.resolve("dist")}/js`,
        }
      ]
    : [
        {
          from: path.resolve("src/manifest.development.json"),
          to: `${path.resolve("dist")}/manifest.json`
        },
        {
          from: path.resolve("src/icons"),
          to: `${path.resolve("dist")}/icons`
        },
        {
          from: path.resolve("src/background/background.html"),
          to: `${path.resolve("dist")}/background.html`
        },
        {
          from: path.resolve("src/background"),
          to: `${path.resolve("dist")}/js`,
          ignore: ['*.html']
        },
        {
          from: path.resolve("src/js"),
          to: `${path.resolve("dist")}/js`,
        }
      ];

module.exports = {
  pages: pagesObj,
  configureWebpack: {
    plugins: [CopyWebpackPlugin(plugins)]
  },
    lintOnSave: false,
};
