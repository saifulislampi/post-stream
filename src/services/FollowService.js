/**
 * Follow service - using Back4App with Parse SDK
 */

import Parse from 'parse';
import { APPLICATION_ID, JAVASCRIPT_KEY, SERVER_URL } from '../environments.js';

// Initialize Parse (if not already initialized)
if (!Parse.applicationId) {
  Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
  Parse.serverURL = SERVER_URL;
}

/**
 * Check if user is following another user
 * @param {string} followerId - ID of user doing the following
 * @param {string} followingId - ID of user being followed
 * @returns {Promise<boolean>} - Whether followerId is following followingId
 */
export const isFollowing = async (followerId, followingId) => {
  try {
    const FollowQuery = new Parse.Query('Follow');
    FollowQuery.equalTo('followerId', followerId);
    FollowQuery.equalTo('followingId', followingId);
    const follow = await FollowQuery.first();
    return !!follow;
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false;
  }
};

/**
 * Follow a user
 * @param {string} followerId - ID of user doing the following
 * @param {string} followingId - ID of user to follow
 * @returns {Promise<boolean>} - Success status
 */
export const followUser = async (followerId, followingId) => {
  try {
    // Check if already following
    const alreadyFollowing = await isFollowing(followerId, followingId);
    if (alreadyFollowing) return false;

    // Create follow relationship
    const Follow = Parse.Object.extend('Follow');
    const follow = new Follow();
    follow.set('followerId', followerId);
    follow.set('followingId', followingId);
    await follow.save();

    // Update counts
    const followerQuery = new Parse.Query('AppUser');
    const followingQuery = new Parse.Query('AppUser');
    
    const [follower, following] = await Promise.all([
      followerQuery.get(followerId),
      followingQuery.get(followingId)
    ]);

    follower.increment('followingCount');
    following.increment('followersCount');
    
    await Promise.all([follower.save(), following.save()]);
    
    return true;
  } catch (error) {
    console.error('Error following user:', error);
    return false;
  }
};

/**
 * Unfollow a user
 * @param {string} followerId - ID of user doing the unfollowing
 * @param {string} followingId - ID of user to unfollow
 * @returns {Promise<boolean>} - Success status
 */
export const unfollowUser = async (followerId, followingId) => {
  try {
    const FollowQuery = new Parse.Query('Follow');
    FollowQuery.equalTo('followerId', followerId);
    FollowQuery.equalTo('followingId', followingId);
    const follow = await FollowQuery.first();
    
    if (!follow) return false;

    await follow.destroy();

    // Update counts
    const followerQuery = new Parse.Query('AppUser');
    const followingQuery = new Parse.Query('AppUser');
    
    const [follower, following] = await Promise.all([
      followerQuery.get(followerId),
      followingQuery.get(followingId)
    ]);

    follower.increment('followingCount', -1);
    following.increment('followersCount', -1);
    
    await Promise.all([follower.save(), following.save()]);
    
    return true;
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return false;
  }
};