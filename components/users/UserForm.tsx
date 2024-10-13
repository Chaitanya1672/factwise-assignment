'use client'
import React from 'react'
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { calculateAge } from '@/utils/user'
import { User } from '@/types/user'
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline'
import CancelIcon from '@mui/icons-material/CancelOutlined'
import { IconButton } from '@mui/material'
import { GENDERS, LABELS } from '@/constants/strings'

interface UserFormProps {
  handleCancel: () => void
  editedUser: User | null
  setEditedUser: React.Dispatch<React.SetStateAction<User | null>>
  errors: Record<string, string>
  handleSave: () => void
  user: User
}
const UserForm = ({
  handleCancel,
  editedUser,
  setEditedUser,
  errors,
  handleSave,
  user,
}: UserFormProps) => {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid size={4}>
          <TextField
            label="Age"
            value={editedUser?.age || calculateAge(editedUser?.dob || '')}
            disabled={calculateAge(editedUser?.dob ?? '') < 18}
            margin="normal"
            size="small"
            fullWidth
            type="number"
            onChange={(e) => {
              setEditedUser((prevState) => ({
                ...prevState!,
                age: Number(e.target.value),
              }))
            }}
            required
            error={!!errors.age}
            helperText={errors.age}
          />
        </Grid>

        <Grid size={4}>
          <FormControl fullWidth margin="normal" error={!!errors.gender}>
            <InputLabel id="gender-label">{LABELS.gender}</InputLabel>
            <Select
              value={editedUser?.gender ?? ''}
              onChange={(e) =>
                setEditedUser({
                  ...editedUser!,
                  gender: e.target.value,
                })
              }
              id="gender-label"
              size="small"
              label="Gender"
              required
            >
              <MenuItem value="male">{GENDERS.male}</MenuItem>
              <MenuItem value="female">{GENDERS.female}</MenuItem>
              <MenuItem value="transgender">{GENDERS.transgender}</MenuItem>
              <MenuItem value="rather not say">
                {GENDERS.ratherNotToSay}
              </MenuItem>
              <MenuItem value="other">{GENDERS.other}</MenuItem>
            </Select>
            {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid size={4}>
          <TextField
            label="Country"
            value={editedUser?.country ?? ''}
            onChange={(e) =>
              setEditedUser({
                ...editedUser!,
                country: e.target.value,
              })
            }
            fullWidth
            error={!!errors.country}
            helperText={errors.country}
            margin="normal"
            size="small"
            type="text"
            required
          />
        </Grid>

        <Grid size={12}>
          <TextField
            label="Description"
            value={editedUser?.description ?? ''}
            onChange={(e) =>
              setEditedUser({
                ...editedUser!,
                description: e.target.value,
              })
            }
            fullWidth
            error={!!errors.description}
            helperText={errors.description}
            multiline
            rows={4}
            size="small"
            required
          />
        </Grid>
      </Grid>
      <Grid size={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton
          color="success"
          onClick={handleSave}
          disabled={JSON.stringify(user) === JSON.stringify(editedUser)}
        >
          <CheckCircleIcon fontSize="large" />
        </IconButton>

        <IconButton color="error" onClick={handleCancel}>
          <CancelIcon fontSize="large" />
        </IconButton>
      </Grid>
    </div>
  )
}

export default UserForm
