export const loginUser = async (email, password) => {
  try {
    const response = await fetch("https://reqres.in/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "reqres_749b7724de38432d96c84e8fa7bd7005", 
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.error || "Invalid credentials",
      };
    }

    return {
      success: true,
      token: data.token,
    };
  } catch (error) {
    return {
      success: false,
      message: "Network error. Please check your internet connection.",
    };
  }
};