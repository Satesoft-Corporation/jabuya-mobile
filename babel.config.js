module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@components": "./components",
            "@utils": "./utils",
            "@screens": "./screens",
            "@forms": "./forms",
            "@constants": "./constants",
            "@navigation": "./navigation",
            "@controllers": "./controllers",
          },
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        },
      ],
    ],
  };
};
