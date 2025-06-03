import { configDotenv } from "dotenv";

configDotenv();

export const { 
    PORT, 
    MONGO_URI,
    REDIS_PASSWORD, REDIS_HOST,
    ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET,
    CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET,
    STRIPE_SECRET_KEY,
    CLIENT_URL
 } = process.env;