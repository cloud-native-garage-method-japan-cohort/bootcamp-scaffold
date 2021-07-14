
import axios from 'axios';

const API_ENDPOINT = process.env.REACT_APP_API_BASE_URL;

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