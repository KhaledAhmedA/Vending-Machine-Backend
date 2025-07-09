import app from './app';
import connectDB from './config/db';
import dotenv from 'dotenv';


dotenv.config(); // ✅ Load .env

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
