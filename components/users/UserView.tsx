'use client'
import React from 'react'
import { Typography, IconButton, styled, Box } from '@mui/material'
import Grid from '@mui/material/Grid2'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import EditIcon from '@mui/icons-material/EditOutlined'
import { calculateAge } from '@/utils/user'
import { User } from '@/types/user'
import { LABELS } from '@/constants/strings'
import styles from './User.module.css'

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '12px',
}))

interface UserViewProps {
  user: User
  handleDelete: (id: number) => void
  handleEdit: (user: User) => void
}

const UserView = ({ user, handleDelete, handleEdit }: UserViewProps) => {
  return (
    <div>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={4}>
          <Box>
            <StyledTypography>{LABELS.age}</StyledTypography>
            <Typography variant="body2">
              {user.age || calculateAge(user.dob)} {LABELS.years}
            </Typography>
          </Box>
        </Grid>
        <Grid size={4}>
          <Box>
            <StyledTypography>{LABELS.gender}</StyledTypography>
            <Typography variant="body2">{user.gender}</Typography>
          </Box>
        </Grid>
        <Grid size={4}>
          <Box>
            <StyledTypography>{LABELS.country}</StyledTypography>
            <Typography variant="body2">{user.country}</Typography>
          </Box>
        </Grid>
      </Grid>
      <Box>
        <StyledTypography>{LABELS.description}</StyledTypography>
        <Typography variant="body2">{user.description}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={() => handleDelete(user.id)}>
          <DeleteIcon color="error" fontSize="large" />
        </IconButton>
        <IconButton onClick={() => handleEdit(user)}>
          <EditIcon color="primary" fontSize="large" />
        </IconButton>
      </Box>
    </div>
  )
}

export default UserView
