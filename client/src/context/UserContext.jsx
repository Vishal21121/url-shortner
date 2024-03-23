import React, { createContext, useContext, useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from "react-toastify"

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

    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const { getItem, setItem, deleteItem } = useLocalStorage()

    const registerUser = async (userData) => {
        if (userData.email === "") {
            toast.error("Please provide email")
            return
        }
        if (userData.password === "") {
            toast.error("Please provide password")
            return
        }
        if (userData.username === "") {
            toast.error("Please provide username")
        }
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
            if (data.statusCode === 201) {
                toast.dismiss()
                toast.success("User account created successfully")
                setUser(data)
                setItem("user", data)
                navigate("/")
            } else if (data.statusCode === 409) {
                toast.error(data.message)
            } else if (data.statusCode === 422) {
                let firsElement = data.errors[0]
                let message = ""
                if ("username" in firsElement) {
                    message = firsElement["username"]
                } else if ("email" in firsElement) {
                    message = firsElement["email"]
                } else if ("password" in firsElement) {
                    message = firsElement["password"]
                }
                toast.error(message)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const login = async (userData) => {
        if (userData.email === "") {
            toast.error("Please provide email")
            return
        }
        if (userData.password === "") {
            toast.error("Please provide password")
            return
        }
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
            if (data.statusCode === 200) {
                toast.dismiss()
                toast.success("User logged in successfully")
                setUser(data)
                setItem("user", data)
                navigate("/")
            } else if (data.statusCode === 401) {
                toast.error(data.data.message)
            } else if (data.statusCode === 422) {
                let firsElement = data.errors[0]
                let message = ""
                if ("email" in firsElement) {
                    message = firsElement["email"]
                } else if ("password" in firsElement) {
                    message = firsElement["password"]
                }
                toast.error(message)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const logOut = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/users/logout", {
                credentials: "include"
            })
            const data = await response.json()
            if (data.statusCode === 200) {
                deleteItem("user")
                setUser(null)
                toast.success("log out successfully")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchUserDetails = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/users/user-details", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Access-Control-Allow-Credentials": true
                }
            })
            const data = await response.json()
            if (data.statusCode === 200) {
                setUser(data)
                setItem("user", data)
                navigate("/")
            }
            else if (data.statusCode === 401) {
                const data = getItem("user")
                setUser(data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUserDetails()
    }, [])

    return (
        <UserContext.Provider value={{ registerUser, login, user, logOut }}>
            {children}
        </UserContext.Provider>
    )
}

export { useUserContext, UserContextProvider }