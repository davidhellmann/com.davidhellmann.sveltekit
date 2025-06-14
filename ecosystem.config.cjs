module.exports = {
  apps: [
    {
      name: "sveltekit-app",
      script: "build/index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOST: "0.0.0.0"
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        HOST: "0.0.0.0",
        ORIGIN: "https://sveltekit.davidhellmann.com"
      }
    }
  ]
};
