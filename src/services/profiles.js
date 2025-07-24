import Parse from "parse";
import { APPLICATION_ID, JAVASCRIPT_KEY, SERVER_URL } from "../environments.js";

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
    userId: parseProfile.get("userId"),
    username: parseProfile.get("username"),
    firstName: parseProfile.get("firstName"),
    lastName: parseProfile.get("lastName"),
    bio: parseProfile.get("bio"),
    email: parseProfile.get("email"),
    avatar: parseProfile.get("avatar"),
    coverImage: parseProfile.get("coverImage"),
    followersCount: parseProfile.get("followersCount") || 0,
    followingCount: parseProfile.get("followingCount") || 0,
    postsCount: parseProfile.get("postsCount") || 0,
    createdAt: parseProfile.get("createdAt"),
    updatedAt: parseProfile.get("updatedAt"),
  };
};

/**
 * Fetch a profile by ID
 */
export const fetchProfileById = async (profileId) => {
  try {
    const Profile = Parse.Object.extend("Profile");
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
    const Profile = Parse.Object.extend("Profile");
    const query = new Parse.Query(Profile);
    query.equalTo("username", username);
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
    const Profile = Parse.Object.extend("Profile");
    const query = new Parse.Query(Profile);
    query.equalTo("userId", userId);
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
    const Profile = Parse.Object.extend("Profile");

    // Search by username
    const usernameQuery = new Parse.Query(Profile);
    usernameQuery.contains("username", searchTerm.toLowerCase());

    // Search by first name
    const firstNameQuery = new Parse.Query(Profile);
    firstNameQuery.contains("firstName", searchTerm);

    // Search by last name
    const lastNameQuery = new Parse.Query(Profile);
    lastNameQuery.contains("lastName", searchTerm);

    // Combine queries with OR
    const mainQuery = Parse.Query.or(
      usernameQuery,
      firstNameQuery,
      lastNameQuery
    );
    mainQuery.limit(20);

    const profiles = await mainQuery.find();
    return profiles.map(parseProfileToPlain);
  } catch (error) {
    console.error("Error searching profiles:", error);
    return [];
  }
};

/**
 * Fetch multiple profiles by IDs
 */
export const fetchProfilesByIds = async (profileIds) => {
  try {
    const Profile = Parse.Object.extend("Profile");
    const query = new Parse.Query(Profile);
    query.containedIn("objectId", profileIds);
    const profiles = await query.find();
    return profiles.map(parseProfileToPlain);
  } catch (error) {
    console.error("Error fetching profiles by IDs:", error);
    return [];
  }
};

/**
 * Fetch all profiles (with pagination)
 */
export const fetchProfiles = async (limit = 20, skip = 0) => {
  try {
    const Profile = Parse.Object.extend("Profile");
    const query = new Parse.Query(Profile);
    query.limit(limit);
    query.skip(skip);
    query.descending("createdAt");

    const profiles = await query.find();
    return profiles.map(parseProfileToPlain);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return [];
  }
};

export const getProfileObjectById = async (profileId) => {
  const Profile = Parse.Object.extend("Profile");
  return new Parse.Query(Profile).get(profileId);
};

// Helper function to generate UUID-like string
const generateUUID = () => {
  // Use crypto.randomUUID if available (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback UUID v4 generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
};

// Helper function to get file extension from filename
const getFileExtension = (filename) => {
  if (!filename || typeof filename !== 'string') {
    return '';
  }
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
    return '';
  }
  return filename.substring(lastDotIndex).toLowerCase();
};

/**
 * Update profile avatar
 */
export const updateProfileAvatar = async (profileId, imageFile) => {
  try {
    const Profile = Parse.Object.extend("Profile");
    const profile = await new Parse.Query(Profile).get(profileId);

    // Handle image upload
    let avatarFile = null;
    if (imageFile && imageFile instanceof File) {
      // Generate a clean filename using timestamp + UUID
      const timestamp = Date.now();
      const uuid = generateUUID();
      const fileExtension = getFileExtension(imageFile.name);
      const fileName = `avatar_${timestamp}_${uuid}${fileExtension}`;
      
      avatarFile = new Parse.File(fileName, imageFile);
      await avatarFile.save();
      
      // Update profile with new avatar
      profile.set("avatar", avatarFile.url());
      await profile.save();
      
      return parseProfileToPlain(profile);
    }
    
    throw new Error("No valid image file provided");
  } catch (error) {
    console.error("Error updating profile avatar:", error);
    throw error;
  }
};

/**
 * Remove profile avatar
 */
export const removeProfileAvatar = async (profileId) => {
  try {
    const Profile = Parse.Object.extend("Profile");
    const profile = await new Parse.Query(Profile).get(profileId);
    
    // Remove avatar field
    profile.unset("avatar");
    await profile.save();
    
    return parseProfileToPlain(profile);
  } catch (error) {
    console.error("Error removing profile avatar:", error);
    throw error;
  }
};

/**
 * Fetch top profiles (profiles with highest followersCount)
 * @param {number} limit
 */
export const getTopPosters = async (limit = 3) => {
  try {
    const Profile = Parse.Object.extend("Profile");
    const query = new Parse.Query(Profile);
    // Ensure followersCount field exists and sort by most followers
    query.exists("followersCount");
    query.descending("followersCount");
    query.limit(limit);

    const results = await query.find();
    return results.map(parseProfileToPlain);
  } catch (error) {
    console.error("Error fetching top posters:", error);
    return [];
  }
};
