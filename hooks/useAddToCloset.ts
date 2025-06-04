// hooks/useAddToCloset.ts
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import useAuth from './useAuth'; // Adjust path

const useAddToCloset = () => {
  const { token, userId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

  const addToCloset = async (sneaker: any) => {
    setLoading(true);
    setError(null);
    setSuccess(false)
    try {

      const userString = await SecureStore.getItemAsync('user');
      if (!userString) {
        setError('User data not found in SecureStore!');
        return false;
      }
      const user = JSON.parse(userString);
      console.log(user);
      const sneakerSizeString = user.sneakerSize;

      if (sneakerSizeString === undefined || sneakerSizeString === null || sneakerSizeString === '') {
        setError('User sneaker size not found or is empty!');
        return false;
      }
      
      const numericSneakerSize = parseFloat(sneakerSizeString);
      if (isNaN(numericSneakerSize)) {
        setError('User sneaker size is not a valid number.');
        return false;
      }

      if (
        typeof sneaker.name !== 'string' ||
        typeof sneaker.colorway !== 'string' ||
        typeof sneaker.image.small !== 'string' ||
        typeof sneaker.retailPrice !== 'number'
      ) {
        setError('Invalid sneaker data');
        return false;
      }

      const requestBody = {
        snickerId: sneaker.id,
        snickerName: sneaker.name,
        snickerColor: sneaker.colorway,
        snickerImg: sneaker.image.small,
        snickerPrice: sneaker.retailPrice,
        snickerSize: isNaN(numericSneakerSize) ? 0 : numericSneakerSize, // Send as number, default to 0
      };

      console.log('[useAddToCloset] Request Body:', JSON.stringify(requestBody, null, 2)); // Log request body

      const response = await fetch('https://talariafitsbackend.uk.r.appspot.com/closet', { // Your API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('[useAddToCloset] Response Status:', response.status); // Log response status
      const responseData = await response.json();
      console.log('[useAddToCloset] Response Data:', responseData); // Log response data

      if (response.ok) {
        console.log('Sneaker added successfully:', responseData);
        setSuccess(true)
        return true;
      } else if (response.status === 400) {
        setError(responseData.message || 'Sneaker already in closet!');  //Use the message from the server
        return false;
      } else {
        setError(responseData.message || 'Failed to add sneaker'); // Set a more informative error
        throw new Error(`Failed to add sneaker: ${response.status}`);
      }
    } catch (error: any) {
      setError(error.message || 'An unknown error occurred'); // Use error message
      return false;
    } finally {
      setLoading(false);
    }
  };

    return { addToCloset, loading, error, success }; // Add loading and error to the returned object
};

export default useAddToCloset;