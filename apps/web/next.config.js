const path = require('path');
const { loadEnvConfig } = require('@next/env');

// Load .env.local from monorepo root (not apps/web)
loadEnvConfig(path.join(__dirname, '../..'));

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@interview-gym/db'],
  webpack(config) {
    // Allow importing .md files as raw strings (e.g. challenge descriptions)
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source',
    });
    return config;
  },
};

module.exports = nextConfig;
