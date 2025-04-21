const mongoose = require('mongoose');
require('dotenv').config();

async function runMigrations() {
  await mongoose.connect(process.env.MONGO_URI);
  // Add indexes
  await mongoose.model('Product').createIndexes();
  await mongoose.model('User').createIndexes();
  console.log('Migrations completed');
  process.exit(0);
}

runMigrations().catch(console.error);