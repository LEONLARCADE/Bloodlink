import apiClient from "./client";

export const fetchMyProfile = async () => {
  const { data } = await apiClient.get("/profile/me");
  return data.profile; // null if not yet created
};

export const saveDonorProfile = async (payload) => {
  const { data } = await apiClient.put("/profile/donor", payload);
  return data.profile;
};

export const saveRecipientProfile = async (payload) => {
  const { data } = await apiClient.put("/profile/recipient", payload);
  return data.profile;
};