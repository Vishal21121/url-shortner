import React, { createContext, useContext } from 'react'

const UserContext = createContext()

export const useUserContext = () => {
    return useContext(UserContext)
}

const UserContextProvider = ({ Children }) => {
    return (
        <UserContext.Provider value={{}}>
            {Children}
        </UserContext.Provider>
    )
}

export default UserContextProvider