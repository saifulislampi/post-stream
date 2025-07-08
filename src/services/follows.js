/**
 * Follow service - using Back4App with Parse SDK
 */

import Parse from 'parse';
import { APPLICATION_ID, JAVASCRIPT_KEY, SERVER_URL } from '../environments.js';
import { getProfileObjectById } from "./profiles.js"; 

// Initialize Parse
if (!Parse.applicationId) {
  Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
  Parse.serverURL = SERVER_URL;
}

/**
 * Find a follow relationship Parse.Object between two profiles
 */
export const findFollowObj = async (followerProfileId, followingProfileId) => {
  const Follow = Parse.Object.extend('Follow');
  const query = new Parse.Query(Follow);
  query.equalTo('followerId', followerProfileId);
  query.equalTo('followingId', followingProfileId);
  return await query.first();
};

/** 
 * * Check if a profile is following another profile
 */
export const isFollowing = async (followerProfileId, followingProfileId) => {
  try {
    const follow = await findFollowObj(followerProfileId, followingProfileId);
    return !!follow; // Returns true if follow exists, false otherwise
  } catch (error) {
    console.error('Error checking follow relationship:', error);
    return false; // In case of error, assume not following
  }
};

/**
 * Follow a profile
 */
export const followProfile = async (followerProfile, followingProfile) => {
  try {
    // Check if already following
    if (await isFollowing(followerProfile.id, followingProfile.id)) {
      return false; // Already following, no action needed
    }

    const followerProfileObject = await getProfileObjectById(followerProfile.id);
    const followingProfileObject = await getProfileObjectById(followingProfile.id);

    // Create follow relationship
    const Follow = Parse.Object.extend('Follow');
    const follow = new Follow();

    follow.set('followerId', followerProfileObject.id);
    follow.set('followerUsername', followerProfileObject.get('username'));
    follow.set('followingId', followingProfileObject.id);
    follow.set('followingUsername', followingProfileObject.get('username'));

    await follow.save();

    // Update counts
    followerProfileObject.increment('followingCount');
    followingProfileObject.increment('followersCount');

    await Parse.Object.saveAll([followerProfileObject, followingProfileObject]);

    return true;
  } catch (error) {
    console.error('Error following profile:', error);
    throw error;
  }
};

/**
 * Unfollow a profile
 */
export const unfollowProfile = async (followerProfile, followingProfile) => {
  try {
    // Find follow relationship using common method
    const follow = await findFollowObj(followerProfile.id, followingProfile.id);
    if (!follow) return false;

    // Delete follow relationship
    await follow.destroy();

    // Update counts
    // Always fetch fresh profile objects for mutation
    const followerProfileObject = await getProfileObjectById(followerProfile.id);
    const followingProfileObject = await getProfileObjectById(followingProfile.id);
    followerProfileObject.increment('followingCount', -1);
    followingProfileObject.increment('followersCount', -1);

    await Parse.Object.saveAll([followerProfileObject, followingProfileObject]);

    return true;
  } catch (error) {
    console.error('Error unfollowing profile:', error);
    throw error;
  }
};

/**
 * Get followers of a profile
 */
export const getFollowers = async (profileId, limit = 20, skip = 0) => {
  try {
    const Follow = Parse.Object.extend('Follow');
    const query = new Parse.Query(Follow);
    query.equalTo('followingId', profileId);
    query.limit(limit);
    query.skip(skip);
    query.descending('createdAt');
    
    const follows = await query.find();
    return follows.map(follow => ({
      id: follow.id,
      followerId: follow.get('followerId'),
      followerUsername: follow.get('followerUsername'),
      createdAt: follow.get('createdAt')
    }));
  } catch (error) {
    console.error('Error getting followers:', error);
    return [];
  }
};

/**
 * Get profiles that a profile is following
 */
export const getFollowing = async (profileId, limit = 20, skip = 0) => {
  try {
    const Follow = Parse.Object.extend('Follow');
    const query = new Parse.Query(Follow);
    query.equalTo('followerId', profileId);
    query.limit(limit);
    query.skip(skip);
    query.descending('createdAt');
    
    const follows = await query.find();
    return follows.map(follow => ({
      id: follow.id,
      followingId: follow.get('followingId'),
      followingUsername: follow.get('followingUsername'),
      createdAt: follow.get('createdAt')
    }));
  } catch (error) {
    console.error('Error getting following:', error);
    return [];
  }
};