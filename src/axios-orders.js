import axios from 'axios';

const instance = axios.create({
    // baseURL: 'http://35.243.172.120'
    //  baseURL: 'http://192.168.10.121:8000'
    // baseURL: 'http://192.168.1.23:8002'
    baseURL: 'http://192.168.10.82:8002'
});

export default instance;
