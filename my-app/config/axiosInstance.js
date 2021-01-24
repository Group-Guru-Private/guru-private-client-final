import axios from 'axios'

const instance = axios.create({
  // baseURL: 'http://localhost:3000'
  baseURL: 'http://192.168.43.9:3000' // alamat IP litha --> setiap orang akan berbeda2
})

export default instance