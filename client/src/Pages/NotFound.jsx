import React from 'react'
import error from "../assets/not_found.svg"

const NotFound = () => {
    return (
        <div className='flex justify-center items-center w-full h-screen'>
            <div className='w-1/2 flex flex-col items-center'>
                <p className='text-4xl font-bold'>Page not found</p>
                <img src={error} />
            </div>
        </div>
    )
}

export default NotFound