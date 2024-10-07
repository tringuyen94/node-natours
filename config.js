const dev = {
  server: {
    port: process.env.DEV_PORT,
  },
  database: {
    host: process.env.DEV_DB_HOST,
    port: process.env.DEV_DB_PORT,
    name: process.env.DEV_DB_NAME,
  },
};
const prod = {
  server: {
    port: process.env.PROD_PORT,
  },
  database: {
    host: process.env.PROD_DB_HOST,
    port: process.env.PROD_DB_PORT,
    name: process.env.PROD_DB_NAME,
  },
};

const config = { dev, prod };

const env = process.env.NODE_ENV;

module.exports = config[env];
