const withTM = require("next-transpile-modules")([]);

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
  turbopack: {
    rules: {
      "*.sql": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.sql$/,
      use: "raw-loader", // Use raw-loader for loading sql-files as string
    });

    return config;
  },
});

module.exports = nextConfig;
