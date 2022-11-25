import axios from "axios"
import { Route, Routes } from "react-router-dom"
import UserDetail from "./pages/UserDetail"
import UserList from "./pages/UserList"

const App = () => {

  axios.defaults.baseURL = 'https://gorest.co.in/public/v2/'
  return (
    <Routes>
      <Route path="/" element={<UserList />}/>
      <Route path="user-detail/:id" element={<UserDetail />} />
    </Routes>
  )
}

export default App
