
import axios from 'axios';

const API_ENDPOINT = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'json',
})

export const queryDiscovery = async (searchText) => {
  return await api.post('/discovery/search', {
    searchText: searchText
  })
}