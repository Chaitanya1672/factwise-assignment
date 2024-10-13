'use client'
import React, { useState, useEffect } from 'react'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Avatar,
  IconButton,
  styled,
  CircularProgress,
  InputAdornment,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/CloseOutlined'
import UserForm from './UserForm'
import { calculateAge } from '@/utils/user'
import { User } from '@/types/user'
import UserView from './UserView'
import { DIALOG_TEXT, VALIDATION_ERRORS } from '@/constants/strings'
import styles from './User.module.css'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import SearchIcon from '@mui/icons-material/SearchOutlined'

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  width: '80px',
}))

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [editableUsers, setEditableUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedUser, setExpandedUser] = useState<number | false>(false)
  const [editingUserId, setEditingUserId] = useState<number | null>(null)
  const [editedUser, setEditedUser] = useState<User | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Created Next js route to fetch users, path:- app/api/users
    fetch('/api/users')
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        const enhancedUserData = data.map((user: User) => ({
          ...user,
          age: calculateAge(user.dob),
          fullName: `${user.first} ${user.last}`,
        }))
        setUsers(enhancedUserData)
        setEditableUsers(enhancedUserData)
      })
  }, [])

  const validateForm = () => {
    const formErrors: Record<string, string> = {}
    if (!editedUser) {
      return false
    }

    // Age validation
    if (isNaN(editedUser.age!) || !(Number(editedUser.age) >= 18)) {
      formErrors.age = VALIDATION_ERRORS.age
    }

    // Country validation
    if (!/^[A-Za-z\s]+$/.test(editedUser.country.trim())) {
      formErrors.country = VALIDATION_ERRORS.country
    }

    // Description validation
    if (!editedUser.description) {
      formErrors.description = VALIDATION_ERRORS.description
    }

    setErrors(formErrors)
    return Object.keys(formErrors).length === 0
  }
  const handleAccordionChange =
    (userId: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedUser(isExpanded ? userId : false)
      handleCancel()
    }

  const handleEdit = (user: User) => {
    setEditingUserId(user.id)
    setEditedUser({ ...user })
  }

  const handleSave = () => {
    if (editedUser && validateForm()) {
      setEditableUsers(
        editableUsers.map((user) =>
          user.id === editedUser.id ? editedUser : user,
        ),
      )
      setEditingUserId(null)
      setEditedUser(null)
    }
  }

  const handleCancel = () => {
    setEditingUserId(null)
    setEditedUser(null)
    setErrors({})
  }

  const handleDelete = (userId: number) => {
    setUserToDelete(userId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (userToDelete) {
      setEditableUsers(users.filter((user) => user.id !== userToDelete))
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  const handleSearchTerm = (searchTerm: string) => {
    setSearchTerm(searchTerm)
    const filteredUsers = users.filter((user) =>
      `${user.first} ${user.last}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    )
    setEditableUsers(filteredUsers)
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editedUser) {
      setEditedUser((prevState: any) => ({
        ...prevState,
        fullName: event.target.value,
      }))
    }
  }

  return (
    <div className={styles.userList}>
      <TextField
        placeholder="Search user"
        variant="outlined"
        fullWidth
        className="search-bar"
        margin="normal"
        value={searchTerm}
        onChange={(e) => handleSearchTerm(e.target.value)}
        size="small"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: {
              borderRadius: '10px',
            },
          },
        }}
      />
      {editableUsers.length === 0 && (
        <div className={styles.circularLoader}>
          <CircularProgress />
        </div>
      )}
      {editableUsers.map((user: User) => (
        <Accordion
          key={user.id}
          expanded={expandedUser === user.id}
          onChange={handleAccordionChange(user.id)}
          className={styles.userAccordion}
          elevation={0}
        >
          <AccordionSummary
            expandIcon={expandedUser === user.id ? <RemoveIcon /> : <AddIcon />}
            sx={{
              '& .Mui-expanded': {
                margin: '10px 0 !important',
              },
            }}
          >
            <div
              className={styles.userSummary}
              onClick={(e) => e.stopPropagation()}
            >
              <Avatar
                src={user.picture}
                alt={`${user.first} ${user.last}`}
                sx={{ width: 40, height: 40, mr: 2 }}
              />
              {editingUserId === user.id ? (
                <TextField
                  autoComplete="off"
                  label="Name"
                  variant="outlined"
                  margin="normal"
                  onChange={handleNameChange}
                  value={editedUser?.fullName}
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              ) : (
                <Typography>{user.fullName}</Typography>
              )}
            </div>
          </AccordionSummary>
          <AccordionDetails>
            {editingUserId === user.id ? (
              <UserForm
                handleCancel={handleCancel}
                user={user}
                editedUser={editedUser}
                setEditedUser={setEditedUser}
                errors={errors}
                handleSave={handleSave}
              />
            ) : (
              <UserView
                user={user}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              />
            )}
          </AccordionDetails>
        </Accordion>
      ))}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        sx={{
          '& .MuiDialog-paper': {
            width: '400px',
          },
        }}
      >
        <DialogContent sx={{ padding: '10px 15px' }}>
          <DialogContentText
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {DIALOG_TEXT.areYouSureToDelete}
            <IconButton
              aria-label="close"
              onClick={() => setDeleteDialogOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '15px' }}>
          <StyledButton
            variant="outlined"
            onClick={() => setDeleteDialogOpen(false)}
          >
            {DIALOG_TEXT.cancel}
          </StyledButton>
          <StyledButton
            variant="contained"
            color="error"
            onClick={confirmDelete}
            autoFocus
          >
            {DIALOG_TEXT.delete}
          </StyledButton>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default UserList
