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
    // Use multiple patterns to catch all variations
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /@mysten/,
      })
    );
    
    // Also use checkResource for more specific control
    config.plugins.push(
      new webpack.IgnorePlugin({
        checkResource(resource) {
          // Ignore any @mysten package
          if (resource && resource.includes('@mysten')) {
            return true;
          }
          return false;
        },
      })
    );
    
    // Add fallbacks for Sui-related modules to prevent build errors
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@mysten/sui': false,
        '@mysten/dapp-kit': false,
        '@mysten/sui/jsonRpc': false,
      };
    }
    
    return config;
  },
  turbopack: {},
};

module.exports = nextConfig;
