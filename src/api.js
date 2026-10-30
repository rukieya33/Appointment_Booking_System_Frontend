import axios from 'axios';

// Create a reusable API client pointing to your custom Spring Boot port
const API = axios.create({
    baseURL: 'http://localhost:5000' +
        '',
    timeout: 5000, // Timeout request if server takes longer than 5 seconds
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // Ensures session cookies or auth tokens pass safely
});

export default API;
