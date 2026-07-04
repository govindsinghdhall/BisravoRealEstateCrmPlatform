import { useCallback, useMemo, useState } from 'react'
import { Alert, Box, Button, IconButton } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import Grid from '@mui/material/Grid2'
import AddIcon from '@mui/icons-material/Add'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AppTable, type AppTableColumn } from '@/components/common/AppTable'
import tableStyles from './UsersTable.module.css'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { PageHeader } from '@/components/common/PageHeader'
import { PageSummaryGrid, PageSummaryItem } from '@/components/common/PageSummaryGrid'
import { SideDrawer } from '@/components/common/SideDrawer'
import { StatCard } from '@/components/common/StatCard'
import { StatusBadge } from '@/components/common/StatusBadge'
import { FormTextField } from '@/components/forms/FormTextField'
import { FormSelect } from '@/components/forms/FormSelect'
import { FormSwitch } from '@/components/forms/FormSwitch'
import { getErrorMessage } from '@/api/client'
import { normalizeRoleKey, rolesMatch } from '@/api/utils/enums'
import { userSchema, type UserFormData } from '@/schemas/user.schema'
import { rolesService, usersService } from '@/api/services'
import {
  invalidateListQueries,
  prependToListCaches,
  removeFromListCaches,
  updateInListCaches,
} from '@/api/utils/query'
import { useAuthStore } from '@/store/authStore'
import type { UserRecord } from '@/types'

function mapRoleFromName(name: string): UserRecord['role'] {
  return normalizeRoleKey(name) as UserRecord['role']
}

const defaultValues: UserFormData = {
  email: '',
  firstName: '',
  lastName: '',
  roleId: '',
  phone: '',
  password: '',
  isActive: true,
}

export function UsersPage() {
  const isAdmin = useAuthStore((state) => state.user?.role === 'admin')
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['users', search],
    queryFn: () => usersService.getAll({ search, pageSize: 50 }),
  })

  const {
    data: roles = [],
    isError: rolesError,
    error: rolesQueryError,
  } = useQuery({
    queryKey: ['roles'],
    queryFn: rolesService.getAll,
  })

  const { control, handleSubmit, reset } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues,
  })

  const [formError, setFormError] = useState('')

  const createMutation = useMutation({
    mutationFn: usersService.create,
    onSuccess: async (user) => {
      prependToListCaches(queryClient, ['users'], user)
      await invalidateListQueries(queryClient, ['users'])
      setFormError('')
      handleCloseDrawer()
    },
    onError: (err) => setFormError(getErrorMessage(err)),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserFormData }) =>
      usersService.update(id, data),
    onSuccess: async (user) => {
      updateInListCaches(queryClient, ['users'], user)
      await invalidateListQueries(queryClient, ['users'])
      setFormError('')
      handleCloseDrawer()
    },
    onError: (err) => setFormError(getErrorMessage(err)),
  })

  const deleteMutation = useMutation({
    mutationFn: usersService.delete,
    onSuccess: async (_data, id) => {
      removeFromListCaches(queryClient, ['users'], id)
      await invalidateListQueries(queryClient, ['users'])
      setDeleteId(null)
    },
  })

  const resolveRoleId = useCallback(
    (user: UserRecord) => {
      if (user.roleId && roles.some((role) => role.id === user.roleId)) {
        return user.roleId
      }
      return roles.find((role) => rolesMatch(role.name, user.role))?.id ?? ''
    },
    [roles],
  )

  const handleOpenCreate = useCallback(() => {
    if (!isAdmin) return
    setFormError('')
    setEditingUser(null)
    reset(defaultValues)
    setDrawerOpen(true)
  }, [isAdmin, reset])

  const handleOpenEdit = useCallback(
    (user: UserRecord) => {
      setFormError('')
      setEditingUser(user)
      reset({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: resolveRoleId(user),
        phone: user.phone ?? '',
        password: '',
        isActive: user.isActive,
      })
      setDrawerOpen(true)
    },
    [reset, resolveRoleId],
  )

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false)
    setEditingUser(null)
    setFormError('')
    reset(defaultValues)
  }, [reset])

  const onSubmit = (formData: UserFormData) => {
    setFormError('')
    const matchedRole = roles.find((r) => r.id === formData.roleId)
    if (!matchedRole) {
      setFormError('Please select a valid role.')
      return
    }

    const payload = {
      ...formData,
      role: mapRoleFromName(matchedRole.name),
    }
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data: payload })
    } else if (isAdmin) {
      createMutation.mutate(payload as UserFormData & { password: string; role: UserRecord['role'] })
    } else {
      setFormError('Only administrators can add users.')
    }
  }

  const rows = useMemo(() => data?.data ?? [], [data?.data])

  const summary = useMemo(() => {
    const active = rows.filter((u) => u.isActive).length
    const admins = rows.filter((u) => u.role === 'admin').length
    const agents = rows.filter((u) => u.role === 'agent').length
    return { total: data?.total ?? rows.length, active, admins, agents }
  }, [data?.total, rows])

  const columns = useMemo<AppTableColumn<UserRecord>[]>(
    () => [
      {
        id: 'name',
        label: 'Name',
        colClassName: tableStyles.colName,
        cellClassName: tableStyles.cellStrong,
        render: (user) => `${user.firstName} ${user.lastName}`,
      },
      {
        id: 'email',
        label: 'Email',
        colClassName: tableStyles.colEmail,
        hideOnMobile: true,
        cellClassName: tableStyles.cellMuted,
        render: (user) => user.email,
      },
      {
        id: 'phone',
        label: 'Phone',
        colClassName: tableStyles.colPhone,
        hideOnTablet: true,
        hideOnMobile: true,
        render: (user) => user.phone || '—',
      },
      {
        id: 'role',
        label: 'Role',
        colClassName: tableStyles.colRole,
        render: (user) => <StatusBadge status={user.role} />,
      },
      {
        id: 'active',
        label: 'Active',
        colClassName: tableStyles.colStatus,
        hideOnMobile: true,
        render: (user) =>
          user.isActive ? <StatusBadge status="available" /> : <StatusBadge status="cancelled" />,
      },
      {
        id: 'actions',
        label: 'Actions',
        align: 'right',
        noTruncate: true,
        colClassName: tableStyles.colActions,
        cellClassName: tableStyles.cellActions,
        render: (user) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 0.5,
              flexShrink: 0,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<EditOutlinedIcon />}
              onClick={() => handleOpenEdit(user)}
            >
              Edit
            </Button>
            <IconButton
              size="small"
              color="error"
              aria-label="Delete user"
              onClick={() => setDeleteId(user.id)}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>
        ),
      },
    ],
    [handleOpenEdit],
  )

  return (
    <Box>
      <PageHeader
        title="Users"
        subtitle="Manage team members and access"
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Users' }]}
        action={
          isAdmin ? (
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
              Add User
            </Button>
          ) : undefined
        }
      />

      {rolesError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Unable to load roles: {getErrorMessage(rolesQueryError)}. Role assignment may be unavailable.
        </Alert>
      )}

      <PageSummaryGrid>
        <PageSummaryItem>
          <StatCard title="Total Users" value={summary.total} icon={GroupsOutlinedIcon} color="#1565C0" subtitle="Team members" />
        </PageSummaryItem>
        <PageSummaryItem>
          <StatCard title="Active" value={summary.active} icon={PersonOutlineIcon} color="#00897B" subtitle="Can access CRM" />
        </PageSummaryItem>
        <PageSummaryItem>
          <StatCard title="Admins" value={summary.admins} icon={AdminPanelSettingsOutlinedIcon} color="#7B1FA2" subtitle="Full access" />
        </PageSummaryItem>
        <PageSummaryItem>
          <StatCard title="Agents" value={summary.agents} icon={SupportAgentOutlinedIcon} color="#0288D1" subtitle="Sales team" />
        </PageSummaryItem>
      </PageSummaryGrid>

      <AppTable
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        tableClassName={tableStyles.table}
        loading={isLoading}
        emptyMessage="No users found"
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search users..."
        onRowClick={handleOpenEdit}
      />

      <SideDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        title={editingUser ? 'Edit User' : 'Add User'}
        subtitle="Manage team member access and role"
        width={480}
        footer={
          <>
            <Button onClick={handleCloseDrawer} variant="outlined" disabled={createMutation.isPending || updateMutation.isPending}>
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={createMutation.isPending || updateMutation.isPending}
              onClick={handleSubmit(onSubmit)}
            >
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </>
        }
      >
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFormError('')}>
              {formError}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormTextField name="firstName" control={control} label="First Name" required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormTextField name="lastName" control={control} label="Last Name" required />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormTextField name="email" control={control} label="Email" type="email" required />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormTextField name="phone" control={control} label="Phone" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormSelect
                name="roleId"
                control={control}
                label="Role"
                options={roles.map((r) => ({ value: r.id, label: r.name }))}
                placeholder={roles.length ? 'Select role' : 'No roles available'}
                disabled={roles.length === 0}
                required
              />
            </Grid>
            {!editingUser && (
              <Grid size={{ xs: 12 }}>
                <FormTextField name="password" control={control} label="Password" type="password" required />
              </Grid>
            )}
            <Grid size={{ xs: 12 }}>
              <FormSwitch name="isActive" control={control} label="Active" />
            </Grid>
          </Grid>
        </Box>
      </SideDrawer>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete User"
        message="Are you sure you want to delete this user?"
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        loading={deleteMutation.isPending}
      />
    </Box>
  )
}
