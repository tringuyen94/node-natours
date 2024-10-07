const mongoose = require('mongoose');
const {
  database: { port, host, name },
} = require('../../config');

const _URI = `mongodb://${host}:${port}/${name}`;
class Database {
  constructor() {
    this.connect();
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  connect() {
    if (process.env.NODE_ENV === 'dev') {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }
    mongoose
      .connect(_URI, { maxPoolSize: 50 })
      .then(() => console.log('DB is connected'));
  }
}

module.exports = Database.getInstance();
