/**
 * Posts service - simple, with embedded data
 */

const POSTS = [
  { id: 100, userId: 1, body: "Excited to launch Postive – a tiny micro-blog built in six weeks!", tag: "general", imageName: null },
  { id: 101, userId: 2, body: "Coffee ☕ + code = perfect combo.", tag: "life", imageName: null },
  { id: 102, userId: 3, body: "Fun fact: a day on Venus is longer than its year.", tag: "fun", imageName: null }
];

const USERS = [
  { id: 1, firstName: "Jane", lastName: "Doe", email: "jane@example.com" },
  { id: 2, firstName: "John", lastName: "Mayer", email: "john@example.com" },
  { id: 3, firstName: "Ada", lastName: "Lovelace", email: "ada@example.com" }
];

export const fetchPostsWithAuthor = async () =>
  POSTS.map(post => ({ ...post, user: USERS.find(u => u.id === post.userId) }));

export const createPost = async (postData) => {
  const newPost = {
    id: Date.now(),
    ...postData,
    user: postData.user || USERS[0]
  };
  return newPost;
};
