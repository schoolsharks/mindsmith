// Temporary utility for user management
// TODO: Replace with proper authentication context/store

const USER_ID_KEY = 'currentUserId';

export const getCurrentUserId = (): string => {
  // First try to get from localStorage
  const storedUserId = localStorage.getItem(USER_ID_KEY);
  
  if (storedUserId) {
    return storedUserId;
  }
  
  // Fall back to a mock user ID for development
  // TODO: In production, this should redirect to login if no user ID found
  const mockUserId = "67467f30dcb7c2b7797a4b28";
  console.warn("No user ID found in storage, using mock ID for development:", mockUserId);
  return mockUserId;
};

export const setCurrentUserId = (userId: string): void => {
  // Store user ID in localStorage
  try {
    localStorage.setItem(USER_ID_KEY, userId);
    console.log("User ID stored successfully:", userId);
  } catch (error) {
    console.error("Failed to store user ID:", error);
  }
};

export const getCurrentUserIdFromStorage = (): string | null => {
  // Get user ID from localStorage
  try {
    return localStorage.getItem(USER_ID_KEY);
  } catch (error) {
    console.error("Failed to retrieve user ID from storage:", error);
    return null;
  }
};

export const clearCurrentUserId = (): void => {
  // Clear user ID from localStorage (for logout)
  try {
    localStorage.removeItem(USER_ID_KEY);
    console.log("User ID cleared successfully");
  } catch (error) {
    console.error("Failed to clear user ID:", error);
  }
};

export const isUserLoggedIn = (): boolean => {
  // Check if user is logged in by checking if user ID exists
  const userId = getCurrentUserIdFromStorage();
  return userId !== null && userId !== '';
};
