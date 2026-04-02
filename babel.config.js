module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            "@": "./src",
          },
        },
      ],
      "react-native-reanimated/plugin",
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          safe: false,
          allowlist: ['APP_ENV_API_BASE_URL', 'APP_ENV_GEOFENCE_RADIUS', 'GOOGLE_WEB_CLIENT_ID'],
          allowUndefined: true,
          verbose: false,
        },
      ],
    ],
  };
};
