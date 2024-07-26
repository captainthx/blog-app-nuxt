import { getProfile } from "~/service/account";
import type { AccountResponse } from "~/types";

export const useProfileStore = defineStore("profile", () => {
  const profile = ref<AccountResponse | null>(null);

  const loadProfile = async () => {
    console.log("Loading profile");
    try {
      const res = await getProfile();
      if (res.status === 200 && res.data.result) {
        profile.value = res.data.result;
      }
    } catch (error) {
      console.log("error load profile", error);
    }
  };

  const updateProfile = (data: AccountResponse) => {
    profile.value = data;
  };

  const removeProfile = () => {
    profile.value = null;
  };

  return { profile, loadProfile, updateProfile, removeProfile };
});
