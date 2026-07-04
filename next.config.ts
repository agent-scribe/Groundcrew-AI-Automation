import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Supabase auth needs cookies to pass through */
  serverExternalPackages: [],
};

export default nextConfig;
