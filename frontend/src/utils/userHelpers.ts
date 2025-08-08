import { API_URL } from "@/App";

export interface UserData {
  id: string;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
}

export const createOrUpdateUser = async (userData: UserData) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to create/update user');
    }

    return {
      success: true,
      user: result.user
    };
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const getUser = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch user');
    }

    return {
      success: true,
      user: result.user
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};