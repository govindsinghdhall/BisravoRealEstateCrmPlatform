import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  Typography,
} from '@mui/material'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import CloseIcon from '@mui/icons-material/Close'
import type { PropertyImage } from '@/types'
import { getImageUrl } from '@/utils/formatters'

interface PendingImage {
  id: string
  file: File
  previewUrl: string
}

interface PropertyImageUploadProps {
  existingImages?: PropertyImage[]
  files: File[]
  onFilesChange: (files: File[]) => void
  maxPhotos?: number
  disabled?: boolean
  uploading?: boolean
}

const ACCEPTED_TYPES = 'image/jpeg,image/jpg,image/png,image/webp,image/gif,image/heic,image/heif'
const MAX_FILE_SIZE_MB = 10

export function PropertyImageUpload({
  existingImages = [],
  files,
  onFilesChange,
  maxPhotos = 20,
  disabled = false,
  uploading = false,
}: PropertyImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')

  const totalPhotos = existingImages.length + files.length
  const remainingSlots = Math.max(0, maxPhotos - existingImages.length)

  const pendingImages = useMemo<PendingImage[]>(
    () =>
      files.map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    [files],
  )

  useEffect(
    () => () => {
      pendingImages.forEach((image) => URL.revokeObjectURL(image.previewUrl))
    },
    [pendingImages],
  )

  const handleSelect = (selected: FileList | null) => {
    if (!selected?.length) return

    const validFiles: File[] = []
    const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024
    const availableSlots = maxPhotos - existingImages.length - files.length

    if (availableSlots <= 0) {
      setError(`Maximum ${maxPhotos} photos allowed per property`)
      return
    }

    Array.from(selected).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not a supported image file`)
        return
      }
      if (file.size > maxBytes) {
        setError(`${file.name} exceeds ${MAX_FILE_SIZE_MB}MB limit`)
        return
      }
      if (validFiles.length < availableSlots) {
        validFiles.push(file)
      }
    })

    if (validFiles.length < selected.length) {
      setError(`Only ${availableSlots} more photo(s) can be added (max ${maxPhotos} total)`)
    } else {
      setError('')
    }

    if (validFiles.length) {
      onFilesChange([...files, ...validFiles])
    }

    if (inputRef.current) inputRef.current.value = ''
  }

  const removePending = (id: string) => {
    onFilesChange(files.filter((file) => `${file.name}-${file.size}-${file.lastModified}` !== id))
    setError('')
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
        <Typography variant="subtitle2">Property Photos</Typography>
        <Typography variant="caption" color="text.secondary">
          {totalPhotos}/{maxPhotos} photos
        </Typography>
      </Box>
      <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
        Upload up to {maxPhotos} photos at once (max {MAX_FILE_SIZE_MB}MB each). The first photo
        becomes the cover image on the website gallery.
      </Typography>

      <Button
        variant="outlined"
        startIcon={<CloudUploadOutlinedIcon />}
        onClick={() => inputRef.current?.click()}
        disabled={disabled || uploading || remainingSlots === 0}
      >
        {remainingSlots === 0 ? 'Photo limit reached' : `Choose Photos (${remainingSlots} remaining)`}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        multiple
        hidden
        onChange={(event) => handleSelect(event.target.files)}
      />

      {uploading && (
        <Box mt={2}>
          <LinearProgress />
          <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
            Uploading photos to server...
          </Typography>
        </Box>
      )}

      {error && (
        <Typography variant="caption" color="error" display="block" mt={1}>
          {error}
        </Typography>
      )}

      {(existingImages.length > 0 || pendingImages.length > 0) && (
        <Box
          mt={2}
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(88px, 1fr))"
          gap={1.5}
        >
          {existingImages.map((image) => (
            <Box
              key={image.id}
              sx={{
                position: 'relative',
                aspectRatio: '1',
                borderRadius: 1.5,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: image.isPrimary ? 'primary.main' : 'divider',
              }}
            >
              <Box
                component="img"
                src={getImageUrl(image.url)}
                alt={image.caption || 'Property photo'}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {image.isPrimary && (
                <Chip
                  label="Cover"
                  size="small"
                  color="primary"
                  sx={{ position: 'absolute', top: 4, left: 4, height: 20, fontSize: 10 }}
                />
              )}
            </Box>
          ))}

          {pendingImages.map((image, index) => (
            <Box
              key={image.id}
              sx={{
                position: 'relative',
                aspectRatio: '1',
                borderRadius: 1.5,
                overflow: 'hidden',
                border: '1px dashed',
                borderColor: 'primary.light',
              }}
            >
              <Box
                component="img"
                src={image.previewUrl}
                alt={image.file.name}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {existingImages.length === 0 && index === 0 && (
                <Chip
                  label="Cover"
                  size="small"
                  color="primary"
                  sx={{ position: 'absolute', top: 4, left: 4, height: 20, fontSize: 10 }}
                />
              )}
              <IconButton
                size="small"
                onClick={() => removePending(image.id)}
                disabled={disabled || uploading}
                sx={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}
