export const starterTs = `function getConfig(env: Record<string, string | undefined>) {
  // Validate required env vars and return config object
  
}

export { getConfig };`;

export const starterJs = `function getConfig(env) {
  // Validate required env vars and return config object
  
}

module.exports = { getConfig };`;

export const solutionTs = `function getConfig(env: Record<string, string | undefined>) {
  const required = ['DATABASE_URL', 'API_KEY', 'PORT'];
  for (const key of required) {
    if (!env[key]) {
      throw new Error(\`Missing required env variable: \${key}\`);
    }
  }
  return {
    databaseUrl: env.DATABASE_URL,
    apiKey: env.API_KEY,
    port: Number(env.PORT),
  };
}

export { getConfig };`;

export const solutionJs = `function getConfig(env) {
  const required = ['DATABASE_URL', 'API_KEY', 'PORT'];
  for (const key of required) {
    if (!env[key]) {
      throw new Error(\`Missing required env variable: \${key}\`);
    }
  }
  return {
    databaseUrl: env.DATABASE_URL,
    apiKey: env.API_KEY,
    port: Number(env.PORT),
  };
}

module.exports = { getConfig };`;
