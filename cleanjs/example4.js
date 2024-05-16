// Sử dụng function để đóng gói logic và giảm lặp code

console.log("Starting process...");
if (process.env.NODE_ENV === "development") {
  console.log("development mode");
  // Development-specific logic
}
if (process.env.NODE_ENV === "production") {
  console.log("production mode");
  // Production-specific logic
}

console.log("Process started.");

// ==============================================

function bootstrap() {
  console.log("Starting process...");

  const env = process.env.NODE_ENV;

  if (env === "development") {
    console.log("development mode");
  } else if (env === "production") {
    console.log("production mode");
  }

  console.log("Process started.");
}
