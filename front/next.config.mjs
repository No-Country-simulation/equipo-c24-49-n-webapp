/** @type {import('next').NextConfig} */
const nextConfig = {
  // eslint: {
  //   ignoreDuringBuilds: true, // 🔥 Esto evita errores de ESLint en la build
  // },
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
