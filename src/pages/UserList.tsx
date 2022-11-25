import { Button, Container, CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormLabel, Grid, Paper, Radio, RadioGroup, Table, TableBody, 
    TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import axios, { AxiosResponseHeaders } from "axios"
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { config, token } from '../config/config';
import { setUsers, User, usersSelector } from '../features/usersSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

interface Column {
    label: string;
    maxWidth: number;
    align: 'center';
    format?: (value: number) => string;
  }
  
const columns: readonly Column[] = [
    {  label: 'ID', maxWidth: 70, align: 'center', },
    {  label: 'Name', maxWidth: 70, align: 'center' },
    {
      label: 'Email',
      maxWidth: 70,
      align: 'center',
    },
    {
      label: 'GENDER',
      maxWidth: 70,
      align: 'center',
    },
    {
      label: 'STATUS',
      maxWidth: 70,
      align: 'center',
    },
  ];
  
const UserList = () => {

    const [page, setPage] = useState<number>(0);
    const [openDeleteUserDialog, setOpenDeleteUserDialog] = useState<boolean>(false);
    const [openCreateUserDialog, setOpenCreateUserDialog] = useState<boolean>(false);
    const [openUpdateUserDialog, setOpenUpdateUserDialog] = useState<boolean>(false);
    const [userId, setUserId] = useState<number | undefined>();
    const [headers, setHeaders] = useState<AxiosResponseHeaders | 
    Partial<Record<string, string> & { "set-cookie"?: string[] | undefined; }>>();
    const stateUsers = useAppSelector(usersSelector) 
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const [newUser, setNewUser] = useState<User>({
        name: "",
        email: "",
        gender: "",
        status: "",
    })

    const [updateUser, setUpdateUser] = useState<{
        name?: string;
        email?: string;
        gender?: string;
        status?: string;
    }>()

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
      };

    const handleDeleteUser = (id: number | undefined) => {
        axios.delete(`users/${id}`, config)
        .then((res) => {console.log(res.data); setOpenDeleteUserDialog(false); window.location.reload()})
        .catch((err) => console.log(err))
      };

    useEffect(()=>{
        const cancelToken = axios.CancelToken.source()
        axios.get(`users?page=${page+1}&per_page=15`, { cancelToken: cancelToken.token,
        headers: { Authorization: `Bearer ${token}`}} )
        .then((res) => {dispatch(setUsers(res.data)); setHeaders(res.headers)})
        .catch((err) => console.log(err))

        return () => {
            cancelToken.cancel()
          }
    }, [dispatch, page])

    const handleChangeCreateUser = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewUser(prev => ({...prev, [name]: value}))
      };

    const handleChangeUpdateUser = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUpdateUser(prev => ({...prev, [name]: value}))
    };

    const handleCreateUser = () => {
        axios.post("users", newUser, config)
        .then((res) => {console.log(res.data); setOpenCreateUserDialog(false); window.location.reload()})
        .catch((err) => console.log(err))
    }

    const handleUpdateUser = (id: number | undefined) => {
        axios.patch(`users/${id}`, updateUser, config)
        .then((res) => {console.log(res.data); setOpenUpdateUserDialog(false); window.location.reload()})
        .catch((err) => console.log(err))
    }

    return (
    <>
        <CssBaseline />
        <AppBar position="static">
        <Toolbar>
            <Typography variant="h6" component="div">
                Daftar Pengguna
            </Typography>
        </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 3 }}>
            <Grid container justifyContent="flex-end">
                <Button variant="outlined" onClick={() => setOpenCreateUserDialog(true)}>Buat Pengguna</Button>
            </Grid>
            <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 3 }}>
                <TableContainer sx={{ maxHeight: 500 }}>
                    <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                        {columns.map((column, index) => (
                            <TableCell
                            key={index}
                            align={column.align}
                            style={{ maxWidth: column.maxWidth }}
                            >
                            {column.label}
                            </TableCell>
                        ))}
                            <TableCell>

                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stateUsers.users.map((user) => (
                            <TableRow
                            key={user.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="center">
                                    {user.id}
                                </TableCell>
                                <TableCell align="center">{user.name}</TableCell>
                                <TableCell align="center">{user.email}</TableCell>
                                <TableCell align="center">{user.gender}</TableCell>
                                <TableCell align="center">{user.status}</TableCell>
                                <TableCell align="center"> 
                                    <Button variant="text"
                                      onClick={() => navigate(`user-detail/${user.id}`)}
                                    >VIEW</Button>
                                    <Button variant="text" onClick={() => {
                                        setOpenUpdateUserDialog(true); setUserId(user.id)
                                        }}>UPDATE</Button>
                                    <Button variant="text" onClick={() => {
                                        setOpenDeleteUserDialog(true); setUserId(user.id)
                                        }}>DELETE</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[]}
                    component="div"
                    count={headers ? Number(headers?.['x-pagination-total']) : 0}
                    rowsPerPage={15}
                    page={page}
                    onPageChange={handleChangePage}
                />
            </Paper>

            <Dialog
                open={openDeleteUserDialog}
                onClose={() => setOpenDeleteUserDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"ARE YOU SURE TO DELETE THIS USER?"}
                </DialogTitle>
                <DialogActions>
                <Button onClick={() => setOpenDeleteUserDialog(false)}>No</Button>
                <Button onClick={() => handleDeleteUser(userId)}>
                    Yes
                </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openCreateUserDialog} onClose={() => setOpenCreateUserDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Buat Pengguna</DialogTitle>
                <DialogContent>
                <TextField
                    required
                    margin="dense"
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="standard"
                    onChange={handleChangeCreateUser}
                />
                <TextField
                    required
                    margin="dense"
                    name="name"
                    label="Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={handleChangeCreateUser}
                />
                <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="gender"
                    value={newUser.gender}
                    onChange={handleChangeCreateUser}
                >
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                </RadioGroup>
                <FormLabel id="demo-controlled-radio-buttons-group">Status</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="status"
                    value={newUser.status}
                    onChange={handleChangeCreateUser}
                >
                    <FormControlLabel value="active" control={<Radio />} label="Active" />
                    <FormControlLabel value="inactive" control={<Radio />} label="Inactive" />
                </RadioGroup>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => setOpenCreateUserDialog(false)}>Batal</Button>
                <Button onClick={handleCreateUser} disabled={!newUser.email || !newUser.gender || !newUser.name 
                || !newUser.status }>Simpan</Button>
                </DialogActions>
            </Dialog>
            
            <Dialog open={openUpdateUserDialog} onClose={() => setOpenUpdateUserDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Update Pengguna</DialogTitle>
                <DialogContent>
                <TextField
                    required
                    margin="dense"
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="standard"
                    onChange={handleChangeUpdateUser}
                />
                <TextField
                    required
                    margin="dense"
                    name="name"
                    label="Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={handleChangeUpdateUser}
                />
                <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="gender"
                    value={updateUser ? updateUser.gender : " "}
                    onChange={handleChangeUpdateUser}
                >
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                </RadioGroup>
                <FormLabel id="demo-controlled-radio-buttons-group">Status</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="status"
                    value={updateUser ? updateUser.status : " "}
                    onChange={handleChangeUpdateUser}
                >
                    <FormControlLabel value="active" control={<Radio />} label="Active" />
                    <FormControlLabel value="inactive" control={<Radio />} label="Inactive" />
                </RadioGroup>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => setOpenUpdateUserDialog(false)}>Batal</Button>
                <Button onClick={() => handleUpdateUser(userId)}>Simpan</Button>
                </DialogActions>
            </Dialog>
        </Container>
    </>
    )
}
  
  export default UserList
  