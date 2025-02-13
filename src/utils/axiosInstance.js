import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://192.168.1.49:9090',

  timeout: 1800000,
  //  baseURL: "http://localhost:9090/industrial",
  headers: {'Access-Control-Allow-Origin': '*'},
});

export default instance;
