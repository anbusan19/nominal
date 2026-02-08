/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { webpack, isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    // Ignore optional dependencies that aren't needed in the browser
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'pino-pretty': false,
      };
    }
    
    // Ignore pino-pretty module resolution (optional dependency from WalletConnect)
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^pino-pretty$/,
      })
    );
    
    // Ignore Mysten/Sui dependencies that cause issues with LI.FI widget
    // These are optional dependencies that aren't needed for EVM chains
    config.plugins.push(
      new webpack.IgnorePlugin({
        checkResource(resource, context) {
          // Ignore @mysten packages when imported from @lifi/widget
          if (resource.includes('@mysten') && context.includes('@lifi/widget')) {
            return true;
          }
          return false;
        },
      })
    );
    
    return config;
  },
  turbopack: {},
};

module.exports = nextConfig;
