export default ({ config }) => ({
  ...config,
  extra: {
    backendUrl:
      process.env.EXPO_PUBLIC_BACKEND_URL || "https://book-w.onrender.com/api",
  },
});
