import { LoadingButton } from '@mui/lab'
import { AppBar, Button, Container, CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle, Grid, 
  Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TextField, Toolbar, Typography } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AlertDialog from '../component/AlertDialog'
import { config, token } from '../config/config'
import { setUser, setUserPosts, usersSelector } from '../features/usersSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'

const UserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch()
  const stateUser = useAppSelector(usersSelector) 
  const [openDeletePostDialog, setOpenDeletePostDialog] = useState <boolean>(false)
  const [openCreatePostDialog, setOpenCreatePostDialog] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [postId, setPostId] = useState<number>(0)
  const [title, setTitle] = useState<string>('')
  const [body, setBody] = useState<string>('')


  useEffect(() => {
    const cancelToken = axios.CancelToken.source()
    axios.get(`users/${id}`, { cancelToken: cancelToken.token, headers: { Authorization: `Bearer ${token}` }})
    .then((res) => {
        dispatch(setUser(res.data))
      })
    .catch((err) => console.log(err.message))

    return () => {
      cancelToken.cancel()
    }
  }, [dispatch, id])

  useEffect(() => {
    const cancelToken = axios.CancelToken.source()
    console.log(cancelToken.token)
    axios.get(`/users/${id}/posts`, { cancelToken: cancelToken.token, headers: { Authorization: `Bearer ${token}` } })
    .then((res) => {
        dispatch(setUserPosts(res.data))
    })
    .catch((err) => console.log(err.message))

    return () => {
      cancelToken.cancel()
    }
  }, [dispatch, id])

  const handleDeletePost = (id: number) => {
    setIsLoading(true)
    axios.delete(`posts/${id}`, config)
      .then((res) => {console.log(res.data); setOpenDeletePostDialog(false); navigate(0);})
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false))
  }

  const handleCreatePost = () => {
    setIsLoading(true)
    axios.post(`users/${id}/posts`, {
      title: title,
      body: body
    }, config)
    .then((res) => {console.log(res.data); setOpenCreatePostDialog(false); navigate(0);})
    .catch((err) => console.log(err))
    .finally(() => setIsLoading(false))
  }

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
      <Toolbar>
          <Typography variant="h6" component="div">
              Lihat Pengguna
          </Typography>
      </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          NAMA : {stateUser.user?.name}
        </Typography>
        <Typography variant="h4" sx={{ mb: 5 }}>
          GENDER : {stateUser.user?.gender}
        </Typography>
        <Typography variant="h4" sx={{ mb: 9 }}>
          EMAIL : {stateUser.user?.email}
        </Typography>
        <Grid container justifyContent="space-between">
          <Typography variant="h4">
            DAFTAR POST
          </Typography>
          <Button variant="outlined" onClick={() => setOpenCreatePostDialog(true)}>BUAT POST</Button>
        </Grid>
        <Paper sx={{ width: '100%', overflow: 'hidden', mt: 3}}>
            <TableContainer sx={{ maxHeight: 250 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                      <TableRow>
                          <TableCell
                          align='center'
                          style={{ maxWidth: 30 }}
                          >
                            TITLE
                          </TableCell>
                          <TableCell
                          align='center'
                          style={{ maxWidth: 300}}
                          >
                            BODY
                          </TableCell>
                          <TableCell>

                          </TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {stateUser.userPosts.map((post) => (
                          <TableRow
                          key={post.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                              <TableCell align="center">{post.title}</TableCell>
                              <TableCell align="center">{post.body}</TableCell>
                              <TableCell align="center">
                                  <Button onClick={() => {setOpenDeletePostDialog(true); setPostId(post.id)}} 
                                  variant="text">DELETE</Button>
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
                </Table>
            </TableContainer>
        </Paper>

        <AlertDialog 
            title='ARE YOU SURE TO DELETE THIS POST?'
            onClose={() => setOpenDeletePostDialog(false)}
            isOpen={openDeletePostDialog}
            onConfirm={() => handleDeletePost(postId)}
            isLoading={isLoading}
        />
  
      <Dialog open={openCreatePostDialog} onClose={() => setOpenCreatePostDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Buat Post</DialogTitle>
        <DialogContent>
          <TextField
            required
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            required
            margin="dense"
            id="Body"
            label="Body"
            type="text"
            rows={4}
            multiline
            fullWidth
            variant="standard"
            onChange={(e) => setBody(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreatePostDialog(false)}>Batal</Button>
          <LoadingButton onClick={handleCreatePost} disabled={!title || !body} loading={isLoading}>Simpan</LoadingButton>
        </DialogActions>
      </Dialog>
      </Container>
    </>
  )
}

export default UserDetail