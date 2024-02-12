import React from 'react'
import { useUserContext } from "../context/UserContext"
import { Navigate } from 'react-router-dom'

const PrivateRoute = () => {
  const { user } = useUserContext()
  return (
    !user && <Navigate to="/signin" />
  )
}

export default PrivateRoute