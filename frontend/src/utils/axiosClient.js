import axios from 'axios'

const axiosClient=axios.create({
    // baseURL:  import.meta.env.BACKEND_URL,
    baseURL:'http://localhost:3000/AnimalBreed/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

export default  axiosClient;