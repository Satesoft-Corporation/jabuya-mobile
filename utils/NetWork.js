import NetInfo from "@react-native-community/netinfo";

/**
 *
 * @returns returns a bool whether someone has an active internet connection
 */
export const hasInternetConnection = async () => {
  try {
    const state = await NetInfo.fetch();
    return state.isInternetReachable;
  } catch (error) {
    return false; // Return false in case of an error
  }
};
