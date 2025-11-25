import "dotenv/config";

export default {
  expo: {
    name: "Front",
    slug: "front",
    extra: {
      API_BASE_URL: process.env.API_BASE_URL,
    },
    plugins: ["expo-secure-store", "expo-router"],
  },
};
