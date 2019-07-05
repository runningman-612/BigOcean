module.exports = {
  apps: [
    {
      name: "bigo",
      script: "bigo.js",
      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      instances: 1,
      exec_mode: "cluster",
      ignore_watch: ["node_modules"],
      autorestart: true,
      watch: ["forcereboot.js"],
      max_memory_restart: "1G",
      error_file: "NULL",
      out_file: "NULL"
    }
  ]
};
