import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../redux/store' 

export interface User {
  id?: number;
  name: string;
  email: string;
  gender: string;
  status: string;
}

interface UserPosts {
  id: number;
  title: string;
  body: string;
}

export interface UsersState {
  users: Array<User>;
  user: User | null;
  userPosts: Array<UserPosts>
}

const initialState: UsersState = {
  users: [],
  user: null,
  userPosts: []
}

export const usersSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<UsersState['users']>) => {
      state.users = action.payload;
    },
    setUser: (state, action: PayloadAction<UsersState['user']>) => {
      state.user = action.payload;
    },
    setUserPosts: (state, action: PayloadAction<UsersState['userPosts']>) => {
      state.userPosts = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUsers, setUser, setUserPosts } = usersSlice.actions

export const usersSelector = (state: RootState) => state.users;

export default usersSlice.reducer