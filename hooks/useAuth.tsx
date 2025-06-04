// useAuth.tsx
import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null); // Add user state

  const checkAuth = useCallback(async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('accessToken');
      const userString = await SecureStore.getItemAsync('user');

      
      if (storedToken && userString) {
        const user = JSON.parse(userString);
        console.log(user);
        setIsAuthenticated(true);
        setToken(storedToken);
      
        setUserId(user[0]._id);
        setUser(user[0]); // Set the user data
      } else {
        setIsAuthenticated(false);
        setToken(null);
        setUserId(null);
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      setIsAuthenticated(false);
      setToken(null);
      setUserId(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const addToCloset = async (sneaker: any) => {
    try {
      if (!token) {
        console.error('[useAuth] No auth token found!');
        return false;
      }
      if (!userId) {
        console.error('[useAuth] User ID not found');
        return false;
      }

      const userString = await SecureStore.getItemAsync('user');
      if (!userString) {
        console.error('[useAuth] User data not found in SecureStore!');
        return false;
      }
      const userArray = JSON.parse(userString); // User data is stored as an array
      if (!userArray || userArray.length === 0) {
        console.error('[useAuth] User data is empty or invalid in SecureStore!');
        return false;
      }
      const currentUser = userArray[0]; // Get the first user object

      const sneakerSizeString = currentUser?.sneakerSize?.toString();

      if (sneakerSizeString === undefined || sneakerSizeString === null || sneakerSizeString.trim() === '') {
        console.error('[useAuth] User sneaker size not found, is empty, or invalid!');
        // Decide if you want to default or return false
        // For now, returning false as it's crucial data
        return false; 
      }
      
      const numericSneakerSize = parseFloat(sneakerSizeString);
      // No isNaN check for numericSneakerSize needed here if defaulting in requestBody, but good for clarity if logging

      // Validate sneaker object properties
      if (
        !sneaker || // Check if sneaker object itself is null or undefined
        typeof sneaker.id !== 'string' || // Assuming sneaker.id is the snickerId
        typeof sneaker.name !== 'string' ||
        typeof sneaker.colorway !== 'string' ||
        !sneaker.image || typeof sneaker.image.small !== 'string' || // Check sneaker.image exists
        typeof sneaker.retailPrice !== 'number'
      ) {
        console.error('[useAuth] Invalid sneaker data structure or types:', sneaker);
        return false;
      }

      const retailPrice = sneaker.retailPrice; // Already a number due to check above

      const requestBody = {
        snickerId: sneaker.id,
        snickerName: sneaker.name,
        snickerColor: sneaker.colorway,
        snickerImg: sneaker.image.small,
        snickerPrice: retailPrice, 
        snickerSize: isNaN(numericSneakerSize) ? 0 : numericSneakerSize,
      };

      console.log('[useAuth] Request Body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch('https://talariafitsbackend.uk.r.appspot.com/closet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-User-ID': userId,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('[useAuth] Response Status:', response.status);
      // Try to parse JSON, but handle cases where it might not be JSON (e.g., empty response for 204)
      let responseData;
      try {
        responseData = await response.json();
        console.log('[useAuth] Response Data:', responseData);
      } catch (e) {
        console.log('[useAuth] Response not JSON or empty, Status:', response.status);
        // If response.ok is true but not JSON, it might be a 204 No Content or similar
        if (response.ok) {
          console.log('Sneaker added successfully (non-JSON response).');
          return true; 
        }
        responseData = { message: `Server returned non-JSON response: ${await response.text()}` }; // Store text for error
      }


      if (response.ok) {
        console.log('Sneaker added successfully:', responseData);
        return true;
      } else if (response.status === 400) {
        console.log('[useAuth] Sneaker already in closet or bad request:', responseData?.message || responseData);
        return false;
      } else {
        console.error('[useAuth] Failed to add sneaker:', response.status, response.statusText);
        console.error('[useAuth] Error Response Data:', responseData); 
        throw new Error(`Failed to add sneaker: ${response.status}`);
      }
    } catch (error: any) {
      console.error('[useAuth] Error in addToCloset:', error);
      return false;
    }
  };

  const checkIfInCloset = async (sneakerId: string): Promise<boolean> => {
    try {
      if (!userId) {
        return false;
      }
      const response = await fetch(`https://talariafitsbackend.uk.r.appspot.com/closet`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-User-ID': userId,
        },
      });

      if (response.ok) {
        const closetData = await response.json();
        return closetData.data.some((item: any) => item.snickerId === sneakerId);
      } else {
        console.error('Failed to fetch closet:', response.status);
        return false;
      }

    } catch (error) {
      console.error('Error checking if in closet:', error);
      return false;
    }
  };
  const login = async (authToken: string, userData: any) => {
    try {
        await SecureStore.setItemAsync('accessToken', authToken);
        await SecureStore.setItemAsync('user', JSON.stringify([userData])); // Store user as an array
        setIsAuthenticated(true);
        setToken(authToken);

        // Check if user is an array and access the first element
        if (Array.isArray(userData) && userData.length > 0) {
            setUserId(userData[0]._id);
            setUser(userData[0]);
        } else if (userData && userData._id) {
            // Handle the case where user is a single object
            setUserId(userData._id);
            setUser(userData);
        } else {
            console.error("Invalid user data format:", userData);
            setIsAuthenticated(false);
            setToken(null);
            setUserId(null);
            setUser(null);
        }
    } catch (error) {
        console.error("Error logging in:", error);
    }
};

  const logout = async () => { // Add logout
    try {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('user');
      setIsAuthenticated(false);
      setToken(null);
      setUserId(null);
        setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  
  // *** Corrected Return Value ***
  return {
    isAuthenticated,
    isLoading,
    token,
    userId,
    user, // Return user
    login,
    setUser, // Return setUser
    refreshAuth: checkAuth, //This isn't used, but good practice
    logout,
    checkIfInCloset,
    addToCloset
  };
};

export default useAuth;