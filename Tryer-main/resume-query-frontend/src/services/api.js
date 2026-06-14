import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
})

export const uploadResumes = (files, onUploadProgress) => {
  const formData = new FormData()
  files.forEach((file) => formData.append('resumes', file))

  return api.post('/resumes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  })
}

export const searchResumes = (params) => api.get('/resumes', { params })

export const getAnalytics = () => api.get('/resumes/analytics')

export const getApiError = (error) => error.response?.data?.message || error.message || 'Something went wrong'
