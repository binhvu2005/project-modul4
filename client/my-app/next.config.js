// next.config.js
module.exports = {
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
  webpack: (config) => {
    config.cache = false;
    return config;
  },
  experimental: {
    appDir: true,
  },
};
