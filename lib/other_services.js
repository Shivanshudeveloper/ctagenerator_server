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
    const collection = db.collection('peopleData2');

    console.log(firstName, lastName);

    // Create a promise that rejects after 10 seconds
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Query timeout: Operation took longer than 10 seconds'));
      }, 10000);
    });

    // Create the query promise
    const queryPromise = collection.findOne({
      First_Name: { $regex: new RegExp(`^${firstName}$`, 'i') },
      Last_Name: { $regex: new RegExp(`^${lastName}$`, 'i') }
    });

    // Race between the query and timeout
    const person = await Promise.race([queryPromise, timeoutPromise])
      .catch(error => {
        console.error('Query failed or timed out:', error.message);
        return {};  // Return empty object on timeout or error
      });

    return person || {};  // Return empty object if person is null/undefined

  } catch (error) {
    console.error('Error querying secondary database:', error);
    return {};  // Return empty object on any other error
  }
};



module.exports = {
    findPersonByFullName
};