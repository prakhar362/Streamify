import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};
export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

export async function getUserFriends() {
  const response = await axiosInstance.get("/user/friends");
  return response.data;
}

export async function getRecommendedUsers() {
  const response = await axiosInstance.get("/user");
  console.log(response.data);
  return response.data;
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/user/outgoing-friend-requests");
  return response.data;
}

export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/user/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/user/friend-requests");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/user/friend-request/${requestId}/accept`);
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}

// Group-related API functions
export async function getMyGroups() {
  const response = await axiosInstance.get("/group");
  console.log(response.data.groups);
  return response.data.groups;
}

export async function createGroup(groupData) {
  const response = await axiosInstance.post("/group/create", groupData);
  return response.data;
}

export async function sendGroupRequest(userId, groupId) {
  const response = await axiosInstance.post(`/group/group-request/${userId}`, { groupId });
  return response.data;
}

export async function acceptGroupRequest(requestId) {
  const response = await axiosInstance.post(`/group/group-request/${requestId}/accept`);
  return response.data;
}

export async function getGroupRequests() {
  const response = await axiosInstance.get("/group/group-requests");
  return response.data.requests;
}

export async function getOutgoingGroupRequests() {
  const response = await axiosInstance.get("/group/outgoing-group-requests");
  return response.data.requests;
}