import { withAxiom } from "next-axiom"

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs")

/** @type {import("next").NextConfig} */
const config = withAxiom({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
        port: "",
        pathname: "/*/**"
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: ""
      }
    ]
  },
  // Fix for PDF viewer
  webpack: (_config, { isServer }) => {
    if (!isServer) {
      _config.resolve.fallback.fs = false
    }
    _config.externals[("@node-rs/argon2", "@node-rs/bcrypt")]
    return _config
  }
})

export default config
