export const BASE_URL =  import.meta.env.MODE === 'development' ? 'http://localhost:5000/api/v1' : 'https://doc-finder-d44b.onrender.com/api/v1';
export const token = localStorage.getItem('token')