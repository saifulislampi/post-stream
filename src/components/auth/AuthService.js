import Parse from "parse";
import {
  APPLICATION_ID,
  JAVASCRIPT_KEY,
  SERVER_URL,
} from "../../environments.js";

// Initialize Parse
if (!Parse.applicationId) {
  Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
  Parse.serverURL = SERVER_URL;
}

/**
 * Register a new user with Parse and create their profile
 */
export const register = async (userData) => {
  try {
    // Create Parse User for authentication
    const user = new Parse.User();
    user.setUsername(userData.username);
    user.setPassword(userData.password);
    user.setEmail(userData.email);

    // Save the user (creates the auth account)
    const savedUser = await user.signUp();

    // Create corresponding Profile object
    const Profile = Parse.Object.extend("Profile");
    const profile = new Profile();

    profile.set("userId", savedUser.id);
    profile.set("username", userData.username);
    profile.set("firstName", userData.firstName);
    profile.set("lastName", userData.lastName);
    profile.set("bio", userData.bio || "");
    profile.set("email", userData.email);
    profile.set("followersCount", 0);
    profile.set("followingCount", 0);
    profile.set("postsCount", 0);

    // Set ACL: public read, owner write
    // const acl = new Parse.ACL(savedUser);
    // acl.setPublicReadAccess(true);
    // profile.setACL(acl);

    // Save the profile
    const savedProfile = await profile.save();

    return { user: savedUser, profile: savedProfile };
  } catch (error) {
    throw error;
  }
};

/**
 * Login a user and fetch their profile
 */
export const login = async (username, password) => {
  try {
    // Login with Parse
    const user = await Parse.User.logIn(username, password);

    // Fetch the user's profile
    const profile = await getProfileByUserId(user.id);

    return { user, profile };
  } catch (error) {
    throw error;
  }
};

/**
 * Logout the current user
 */
export const logout = async () => {
  await Parse.User.logOut();
};

/**
 * Get the current logged in user
 */
export const getCurrentUser = () => {
  return Parse.User.current();
};

/**
 * Get profile for a user by their userId
 */
export const getProfileByUserId = async (userId) => {
  const Profile = Parse.Object.extend("Profile");
  const query = new Parse.Query(Profile);
  query.equalTo("userId", userId);
  return await query.first();
};

/**
 * Get the current user's profile
 */
export const getCurrentProfile = async () => {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;
  return await getProfileByUserId(currentUser.id);
};

/**
 * Update the current user's profile
 */
export const updateProfile = async (updates) => {
  const profile = await getCurrentProfile();
  if (!profile) throw new Error("Profile not found");

  // Update allowed fields
  const allowedFields = [
    "firstName",
    "lastName",
    "bio",
    "avatar",
    "coverImage",
  ];
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      profile.set(field, updates[field]);
    }
  }

  return await profile.save();
};
