import React, { createContext, useContext, useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const UserContext = createContext({
    user: null,
    loginUser: () => { },
    registerUser: () => { },
    logOut: () => { }
})

const useUserContext = () => {
    return useContext(UserContext)
}

const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const { getItem } = useLocalStorage()

    const registerUser = async (userData) => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/users/createAccount", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            })
            const data = await response.json()
            setUser(data)
        } catch (error) {
            console.log(error.message)
        }
    }

    const login = async (userData) => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/users/login", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            })
            const data = await response.json()
            setUser(data)
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        const data = getItem("user")
        setUser(data)
    }, [])

    return (
        <UserContext.Provider value={{ registerUser, login, user }}>
            {children}
        </UserContext.Provider>
    )
}

export { useUserContext, UserContextProvider }