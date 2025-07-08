import Parse from 'parse';
import { APPLICATION_ID, JAVASCRIPT_KEY, SERVER_URL } from '../../environments.js';

// Initialize Parse for authentication
if (!Parse.applicationId) {
  Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
  Parse.serverURL = SERVER_URL;
}

/**
 * Register a new user with Parse
 * @param {Object} userData - { username, password, firstName, lastName, email }
 * @returns {Promise<Parse.User>} Newly created user
 */
export const register = async (userData) => {
  const user = new Parse.User();
  user.setUsername(userData.username);
  user.setPassword(userData.password);
  user.setEmail(userData.email);
  user.set('firstName', userData.firstName);
  user.set('lastName', userData.lastName);
  user.set('followersCount', 0);
  user.set('followingCount', 0);
  try {
    return await user.signUp();
  } catch (error) {
    throw error;
  }
};

/**
 * Login an existing user
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Parse.User>} Logged-in user
 */
export const login = async (username, password) => {
  try {
    return await Parse.User.logIn(username, password);
  } catch (error) {
    throw error;
  }
};

/**
 * Logout the current user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  await Parse.User.logOut();
};

/**
 * Get the current logged-in user
 * @returns {Parse.User|null}
 */
export const getCurrentUser = () => {
  return Parse.User.current();
};
