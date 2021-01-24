import axios from 'axios'

const instance = axios.create({
  // baseURL: 'http://localhost:3000'
  // baseURL: 'http://192.168.43.9:3000' // alamat IP litha --> setiap orang akan berbeda2
  baseURL: 'http://192.168.0.100:3000' // farhat
})

export default instance