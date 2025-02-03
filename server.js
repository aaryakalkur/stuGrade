const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path')
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/studentGrades')
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define schemas and models

const gradeSchema = new mongoose.Schema({
    username: String,
    subject: String,
    grade: Number
});

const Grade = mongoose.model('Grade', gradeSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Define a User model
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Register route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.json({ success: false, message: 'User already exists' });
        }

        const newUser = new User({ username, password });
        await newUser.save();
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: 'An error occurred' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password });
        if (user) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        res.json({ success: false, message: 'An error occurred' });
    }
});
// Add Grade route
app.post('/addGrade', async (req, res) => {
    try {
        const { subject, grade, username } = req.body; // Ensure username is sent from frontend
        if (!username) {
            return res.status(400).json({ success: false, message: 'Username is required' });
        }
        const gradeRecord = new Grade({ username, subject, grade });
        await gradeRecord.save();
        res.json({ success: true, message: 'Grade added successfully!' });
    } catch (error) {
        console.error('Error adding grade:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Get Grades route
app.get('/getGrades', async (req, res) => {
    try {
        const username = req.query.username; // Expect username as a query parameter
        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }
        const grades = await Grade.find({ username });
        res.json(grades);
    } catch (error) {
        console.error('Error fetching grades:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Server setup
const PORT = 5500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
