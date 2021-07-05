
import axios from 'axios';

const API_ENDPOINT = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'json',
})

export const queryDiscovery = async (message) => {
  return await api.post('/discovery/message', {
    message: message
  })
}