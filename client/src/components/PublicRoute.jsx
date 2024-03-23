import React from 'react'
import { useUserContext } from '../context/UserContext'
import { Navigate } from 'react-router-dom'

const PublicRoute = ({ children }) => {
    const { user } = useUserContext()
    if (user) return <Navigate to="/" replace />
    return children
}

export default PublicRoute