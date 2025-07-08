import Parse from 'parse';
import { APPLICATION_ID, JAVASCRIPT_KEY, SERVER_URL } from '../environments.js';

// Initialize Parse
if (!Parse.applicationId) {
  Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
  Parse.serverURL = SERVER_URL;
}

// Helper function to convert Parse object to plain object
const parseProfileToPlain = (parseProfile) => {
  if (!parseProfile) return null;
  
  return {
    id: parseProfile.id,
    userId: parseProfile.get('userId'),
    username: parseProfile.get('username'),
    firstName: parseProfile.get('firstName'),
    lastName: parseProfile.get('lastName'),
    bio: parseProfile.get('bio'),
    email: parseProfile.get('email'),
    avatar: parseProfile.get('avatar'),
    coverImage: parseProfile.get('coverImage'),
    followersCount: parseProfile.get('followersCount') || 0,
    followingCount: parseProfile.get('followingCount') || 0,
    postsCount: parseProfile.get('postsCount') || 0,
    createdAt: parseProfile.get('createdAt'),
    updatedAt: parseProfile.get('updatedAt')
  };
};

/**
 * Fetch a profile by ID
 */
export const fetchProfileById = async (profileId) => {
  try {
    const Profile = Parse.Object.extend('Profile');
    const query = new Parse.Query(Profile);
    const profile = await query.get(profileId);
    return parseProfileToPlain(profile);
  } catch (error) {
    console.error(`Error fetching profile ${profileId}:`, error);
    throw error;
  }
};

/**
 * Fetch a profile by username
 */
export const fetchProfileByUsername = async (username) => {
  try {
    const Profile = Parse.Object.extend('Profile');
    const query = new Parse.Query(Profile);
    query.equalTo('username', username);
    const profile = await query.first();
    return parseProfileToPlain(profile);
  } catch (error) {
    console.error(`Error fetching profile for username ${username}:`, error);
    return null;
  }
};

/**
 * Fetch a profile by Parse User ID
 */
export const fetchProfileByUserId = async (userId) => {
  try {
    const Profile = Parse.Object.extend('Profile');
    const query = new Parse.Query(Profile);
    query.equalTo('userId', userId);
    const profile = await query.first();
    
    if (!profile) {
      throw new Error(`No profile found for user ID: ${userId}`);
    }
    
    return parseProfileToPlain(profile);
  } catch (error) {
    console.error(`Error fetching profile for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Search for profiles by name or username
 */
export const searchProfiles = async (searchTerm) => {
  try {
    const Profile = Parse.Object.extend('Profile');
    
    // Search by username
    const usernameQuery = new Parse.Query(Profile);
    usernameQuery.contains('username', searchTerm.toLowerCase());
    
    // Search by first name
    const firstNameQuery = new Parse.Query(Profile);
    firstNameQuery.contains('firstName', searchTerm);
    
    // Search by last name
    const lastNameQuery = new Parse.Query(Profile);
    lastNameQuery.contains('lastName', searchTerm);
    
    // Combine queries with OR
    const mainQuery = Parse.Query.or(usernameQuery, firstNameQuery, lastNameQuery);
    mainQuery.limit(20);
    
    const profiles = await mainQuery.find();
    return profiles.map(parseProfileToPlain);
  } catch (error) {
    console.error('Error searching profiles:', error);
    return [];
  }
};

/**
 * Fetch multiple profiles by IDs
 */
export const fetchProfilesByIds = async (profileIds) => {
  try {
    const Profile = Parse.Object.extend('Profile');
    const query = new Parse.Query(Profile);
    query.containedIn('objectId', profileIds);
    const profiles = await query.find();
    return profiles.map(parseProfileToPlain);
  } catch (error) {
    console.error('Error fetching profiles by IDs:', error);
    return [];
  }
};

/**
 * Fetch all profiles (with pagination)
 */
export const fetchProfiles = async (limit = 20, skip = 0) => {
  try {
    const Profile = Parse.Object.extend('Profile');
    const query = new Parse.Query(Profile);
    query.limit(limit);
    query.skip(skip);
    query.descending('createdAt');
    
    const profiles = await query.find();
    return profiles.map(parseProfileToPlain);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }
};