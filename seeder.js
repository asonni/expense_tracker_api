const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Enable colors
colors.enable();

// Load models
const User = require('./models/User');
const Transaction = require('./models/Transaction');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// Read JSON files
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);
const transactions = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/transactions.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    await User.create(users);
    await Transaction.create(transactions);
    // eslint-disable-next-line no-console
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Transaction.deleteMany();
    // eslint-disable-next-line no-console
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
