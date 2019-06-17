import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://35.243.172.120'
});

export default instance;