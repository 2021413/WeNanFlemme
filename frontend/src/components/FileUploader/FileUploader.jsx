import { useState } from 'react'
import { Box, Button, LinearProgress, Typography } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import useStore from '../../store/useStore'

const FileUploader = () => {
  const [isDragging, setIsDragging] = useState(false)
  const { uploadProgress } = useStore()

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    // Logique de téléchargement à implémenter
  }

  return (
    <Box
      sx={{
        border: '2px dashed',
        borderColor: isDragging ? 'primary.main' : 'grey.300',
        borderRadius: 2,
        p: 3,
        textAlign: 'center',
        bgcolor: isDragging ? 'action.hover' : 'background.paper',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Glissez-déposez vos fichiers ici
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        ou
      </Typography>
      <Button variant="contained" component="label">
        Sélectionner des fichiers
        <input type="file" hidden multiple />
      </Button>
      {uploadProgress > 0 && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}
    </Box>
  )
}

export default FileUploader 