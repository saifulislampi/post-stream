/**
 * Users service - simple, with embedded data
 */

const USERS = [
  { id: 1, firstName: "Jane", lastName: "Doe", email: "jane@example.com" },
  { id: 2, firstName: "John", lastName: "Mayer", email: "john@example.com" },
  { id: 3, firstName: "Ada", lastName: "Lovelace", email: "ada@example.com" }
];

export const fetchUsers = async () => USERS;
export const fetchUserById = async (userId) => USERS.find(u => u.id === Number(userId)) || null;
export const fetchUsersByIds = async (userIds) => USERS.filter(u => userIds.includes(u.id));
