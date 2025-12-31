// app.config.ts

import 'dotenv/config'; // This loads .env file in development

export default ({ config }: any) => {
  return {
    ...config,
    name: 'ChatApp',
    slug: 'chat-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'dark',
    jsEngine: 'hermes',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#0B141A',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.chatapp.mobile',
    },
    android: {
      jsEngine: 'hermes',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#0B141A',
      },
      package: 'com.chatapp.mobile',
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
    },
    plugins: [],
    experiments: {
      tsconfigPaths: true,
    },
    scheme: 'chatapp',
    extra: {
      SERVER_HOST: process.env.SERVER_HOST || 'localhost',
      SERVER_PORT: process.env.SERVER_PORT || '5555',
      SERVER_USE_HTTPS: process.env.SERVER_USE_HTTPS || 'false',
    },
  };
};