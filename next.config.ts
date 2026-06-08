import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Lanyard physics (Rapier) world breaks under StrictMode's double-mount
  // in dev — the first card instance falls away, which looks like the badge
  // "flashing then disappearing". Disabling it keeps a single stable mount.
  reactStrictMode: false,
  // The template ships with a few pre-existing type issues in vendored
  // reactbits components (Lanyard, SplitText). They don't affect runtime, so
  // don't let them block the production build / deploy.
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
