/**
 * Users service - using Back4App with Parse SDK
 */

import Parse from 'parse';
import { APPLICATION_ID, JAVASCRIPT_KEY, SERVER_URL } from '../environments.js';

// Initialize Parse (if not already initialized)
if (!Parse.applicationId) {
  Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
  Parse.serverURL = SERVER_URL;
}

// Helper function to convert Parse User object to plain object
const parseUserToPlain = (parseUser) => {
  return {
    id: parseUser.id,
    firstName: parseUser.get('firstName'),
    lastName: parseUser.get('lastName'),
    email: parseUser.get('email')
  };
};

export const fetchUsers = async () => {
  try {
    const UserQuery = new Parse.Query('AppUser');
    const users = await UserQuery.find();
    return users.map(parseUserToPlain);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchUserById = async (userId) => {
  try {
    const UserQuery = new Parse.Query('AppUser');
    const user = await UserQuery.get(userId);
    return user ? parseUserToPlain(user) : null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
};

export const fetchUsersByIds = async (userIds) => {
  try {
    const UserQuery = new Parse.Query('AppUser');
    UserQuery.containedIn('objectId', userIds);
    const users = await UserQuery.find();
    return users.map(parseUserToPlain);
  } catch (error) {
    console.error('Error fetching users by IDs:', error);
    throw error;
  }
};
