const { MongoClient } = require('mongodb');

const SECONDARY_DB_URI = process.env.SECONDARY_DB_URI; // Your secondary database URI

let secondaryDb;

// Connect to the secondary database
const connectToSecondaryDb = async () => {
  if (!secondaryDb) {
    const client = new MongoClient(SECONDARY_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    secondaryDb = client.db('maindata'); // Access the database object
  }
  return secondaryDb;
};


const findPersonByFullName = async (firstName, lastName) => {
  try {
    const db = await connectToSecondaryDb();
    const collection = db.collection('peopleData');

    console.log(firstName, lastName);

    // Perform a case-insensitive query against First_Name and Last_Name fields
    const person = await collection.findOne({
      First_Name: { $regex: new RegExp(`^${firstName}$`, 'i') },
      Last_Name: { $regex: new RegExp(`^${lastName}$`, 'i') }
    });

    return person;
  } catch (error) {
    console.error('Error querying secondary database:', error);
    throw error;
  }
};



module.exports = {
    findPersonByFullName
};