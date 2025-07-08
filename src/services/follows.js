/**
 * Follow service - using Back4App with Parse SDK
 */

import Parse from 'parse';
import { APPLICATION_ID, JAVASCRIPT_KEY, SERVER_URL } from '../environments.js';

// Initialize Parse
if (!Parse.applicationId) {
  Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
  Parse.serverURL = SERVER_URL;
}

/**
 * Check if profile is following another profile
 */
export const isFollowing = async (followerProfileId, followingProfileId) => {
  try {
    const Follow = Parse.Object.extend('Follow');
    const query = new Parse.Query(Follow);
    query.equalTo('followerId', followerProfileId);
    query.equalTo('followingId', followingProfileId);
    const follow = await query.first();
    return !!follow;
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false;
  }
};

/**
 * Follow a profile
 */
export const followProfile = async (followerProfile, followingProfile) => {
  try {
    // Check if already following
    const alreadyFollowing = await isFollowing(followerProfile.id, followingProfile.id);
    if (alreadyFollowing) return false;
    
    // Create follow relationship
    const Follow = Parse.Object.extend('Follow');
    const follow = new Follow();
    
    follow.set('followerId', followerProfile.id);
    follow.set('followerUsername', followerProfile.get('username'));
    follow.set('followingId', followingProfile.id);
    follow.set('followingUsername', followingProfile.get('username'));
    
    await follow.save();
    
    // Update counts
    followerProfile.increment('followingCount');
    followingProfile.increment('followersCount');
    
    await Parse.Object.saveAll([followerProfile, followingProfile]);
    
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
    // Find follow relationship
    const Follow = Parse.Object.extend('Follow');
    const query = new Parse.Query(Follow);
    query.equalTo('followerId', followerProfile.id);
    query.equalTo('followingId', followingProfile.id);
    const follow = await query.first();
    
    if (!follow) return false;
    
    // Delete follow relationship
    await follow.destroy();
    
    // Update counts
    followerProfile.increment('followingCount', -1);
    followingProfile.increment('followersCount', -1);
    
    await Parse.Object.saveAll([followerProfile, followingProfile]);
    
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