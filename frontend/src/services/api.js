import axios from 'axios'
import { API_ENDPOINTS } from '../config/api'

const api = {
  uploadFiles: async (files, onProgress) => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))

    try {
      const response = await axios.post(API_ENDPOINTS.UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      })
      return response.data
    } catch (error) {
      throw new Error('Erreur lors du téléchargement des fichiers')
    }
  },

  getFiles: async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.FILES)
      return response.data
    } catch (error) {
      throw new Error('Erreur lors de la récupération des fichiers')
    }
  }
}

export default api 