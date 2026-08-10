// const USERS_STORAGE_KEY = "users";

// const DEFAULT_ADMIN = {
//   id: "admin",
//   fullName: "Administrator",
//   email: "admin@example.com",
//   username: "admin",
//   phone: "0000000000",
//   password: "admin123",
//   role: "admin",
//   status: "Active",
//   active: true,
//   lastLogin: null,
// };

// function getUsersFromStorage() {
//   if (typeof window === "undefined") return [];
//   return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];
// }

// function saveUsers(users) {
//   if (typeof window === "undefined") return;
//   localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
// }

// function seedDefaultAdmin(users) {
//   const hasAdmin = users.some(
//     (u) => u.username === DEFAULT_ADMIN.username || u.email === DEFAULT_ADMIN.email
//   );
//   if (!hasAdmin) {
//     return [...users, DEFAULT_ADMIN];
//   }
//   return users;
// }

// function getUsers() {
//   const users = getUsersFromStorage();
//   const seededUsers = seedDefaultAdmin(users);
//   if (seededUsers.length !== users.length) {
//     saveUsers(seededUsers);
//   }
//   return seededUsers;
// }

// export function getUsersList() {
//   return getUsers();
// }

// export async function loginUser({ query, password }) {
//   const users = getUsers();
//   const userIndex = users.findIndex(
//     (u) =>
//       (u.email === query || u.fullName === query || u.username === query) &&
//       u.password === password
//   );

//   if (userIndex === -1) {
//     throw new Error("Invalid username/email or password.");
//   }

//   const user = users[userIndex];
//   const isActive = user.active !== false;

//   if (!isActive || user.status !== "Active") {
//     throw new Error("This account is not active.");
//   }

//   const updatedUser = {
//     ...user,
//     lastLogin: new Date().toISOString(),
//   };

//   users[userIndex] = updatedUser;
//   saveUsers(users);

//   return {
//     ...updatedUser,
//     password: undefined,
//   };
// }

// export async function registerUser(userData) {
//   const users = getUsers();
//   const existingUser = users.find(
//     (u) => u.email === userData.email || u.phone === userData.phone
//   );

//   if (existingUser) {
//     throw new Error("An account with this email or phone already exists.");
//   }

//   const newUser = {
//     ...userData,
//     id: Date.now().toString(),
//     username: userData.email.split("@")[0],
//     active: true,
//     status: "Active",
//     lastLogin: null,
//   };

//   saveUsers([...users, newUser]);

//   return {
//     ...newUser,
//     password: undefined,
//   };
// }

// export async function deleteUser(userId) {
//   const users = getUsers();
//   if (userId === DEFAULT_ADMIN.id) {
//     throw new Error("Cannot delete the default admin user.");
//   }

//   const remaining = users.filter((u) => u.id !== userId);
//   if (remaining.length === users.length) {
//     throw new Error("User not found.");
//   }

//   saveUsers(remaining);
//   return remaining;
// }

// // ------------------ Inquiries (Contact form) ------------------
// const INQUIRIES_STORAGE_KEY = "inquiries";

// function getInquiriesFromStorage() {
//   if (typeof window === "undefined") return [];
//   return JSON.parse(localStorage.getItem(INQUIRIES_STORAGE_KEY)) || [];
// }

// function saveInquiries(inquiries) {
//   if (typeof window === "undefined") return;
//   localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(inquiries));
// }

// export function getInquiries() {
//   return getInquiriesFromStorage();
// }

// export async function saveInquiry(inquiry) {
//   const inquiries = getInquiriesFromStorage();
//   const newInquiry = {
//     id: Date.now().toString(),
//     ...inquiry,
//     createdAt: new Date().toISOString(),
//   };
//   const updated = [newInquiry, ...inquiries];
//   saveInquiries(updated);
//   return newInquiry;
// }

// export async function deleteInquiry(inquiryId) {
//   const inquiries = getInquiriesFromStorage();
//   const remaining = inquiries.filter((i) => i.id !== inquiryId);
//   if (remaining.length === inquiries.length) {
//     throw new Error("Inquiry not found.");
//   }
//   saveInquiries(remaining);
//   return remaining;
// }
import { getCurrentUser } from "./auth";

const API_URL = "http://localhost:5000/api";

// Attaches the logged-in user's id so the backend knows who's asking.
// (No JWT - see auth.js / backend/middleware/auth.js for why.)
function authHeaders() {
  const user = getCurrentUser();
  return user && user.id ? { "x-user-id": user.id } : {};
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }
  return data;
}

// ------------------ Auth ------------------

export async function loginUser({ query, password }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, password }),
  });
  return handleResponse(res);
}

export async function registerUser(userData) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return handleResponse(res);
}

// ------------------ Users (admin) ------------------

export async function getUsersList() {
  const res = await fetch(`${API_URL}/users`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function deleteUser(userId) {
  const res = await fetch(`${API_URL}/users/${userId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function updateUserProfile(profileData) {
  const res = await fetch(`${API_URL}/users/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(profileData),
  });
  return handleResponse(res);
}

export async function fetchUserProfile() {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// ------------------ Inquiries (Contact form) ------------------

export async function saveInquiry(inquiry) {
  const res = await fetch(`${API_URL}/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(inquiry),
  });
  return handleResponse(res);
}

export async function getInquiries() {
  const res = await fetch(`${API_URL}/inquiries`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function deleteInquiry(inquiryId) {
  const res = await fetch(`${API_URL}/inquiries/${inquiryId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

