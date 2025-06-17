const getAccurateTime = async () => {
  try {
    const response = await fetch(
      "https://worldtimeapi.org/api/timezone/Asia/Kolkata"
    );
    const data = await response.json();
    return new Date(data.datetime);
  } catch (error) {
    console.error("Failed to get accurate time:", error);
    // Fallback to client time
    return new Date();
  }
};

export { getAccurateTime };
