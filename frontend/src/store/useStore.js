import { create } from 'zustand'

const useStore = create((set) => ({
  files: [],
  setFiles: (files) => set({ files }),
  uploadProgress: 0,
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  clearStore: () => set({ files: [], uploadProgress: 0 })
}))

export default useStore 