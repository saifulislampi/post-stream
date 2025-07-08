const Parse = require("parse/node");

// Back4App configuration
const APPLICATION_ID = "3gMH4Kq9ALoTgvRaYN0STLZPBRBrw6HzlIqytZzf";
const JAVASCRIPT_KEY = "V1OcAlaeBrZwruPBmMjT2d0nIZ1r5rSI7ONSSPKN";
const SERVER_URL = "https://parseapi.back4app.com/";

// Initialize Parse
Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
Parse.serverURL = SERVER_URL;

async function testUserQuery() {
  try {
    console.log("Testing user query...");
    const UserQuery = new Parse.Query(Parse.User);
    const users = await UserQuery.find();
    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`- ${user.get('firstName')} ${user.get('lastName')} (@${user.get('username')})`);
    });
  } catch (error) {
    console.error("Error querying users:", error);
  }
}

testUserQuery();
