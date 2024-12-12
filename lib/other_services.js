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

function modifyLinkedInURL(url) {
  // Remove https:// and replace with http://
  let modifiedUrl = url.replace(/^https:\/\//, 'http://');
  
  // Remove trailing slash if present
  modifiedUrl = modifiedUrl.replace(/\/$/, '');
  
  return modifiedUrl;
}

const findPersonByFullName = async (linkedinUrl) => {
    try {
      const mainLinkedInURL = modifyLinkedInURL(linkedinUrl);
      console.log("Finding for: ",mainLinkedInURL);
      
      const db = await connectToSecondaryDb();
      const collection = db.collection('peopleData'); // Replace 'people' with your actual collection name
      const person = await collection.findOne({ First_Name: "John", Last_Name: "Doe" });
      return person;
    } catch (error) {
      console.error('Error querying secondary database:', error);
      throw error;
    }
};

module.exports = {
    findPersonByFullName
};