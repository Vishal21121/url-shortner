import React from 'react'
import { useUserContext } from '../context/UserContext'

const PublicRoute = () => {
    const { user } = useUserContext()
    return (
        user && <Navigate to="/" />
    )
}

export default PublicRoute