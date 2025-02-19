/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/i,
        oneOf: [
          {
            issuer: /\.[jt]sx?$/,
            use: ["@svgr/webpack"],
          },
          {
            type: "asset/resource",
          },
        ],
      });
  
      return config;
    },
  };
  
  export default nextConfig;
  