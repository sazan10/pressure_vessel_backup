import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://192.168.1.13:8002'
});

export default instance;