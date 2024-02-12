import React from 'react'
import { FaCopy } from "react-icons/fa6";


const UrlCard = () => {
    return (
        <div className='flex flex-col gap-2 ring ring-gray-500 rounded p-2'>
            <p className='text-gray-400 font-bold text-lg'>ShortUrl</p>
            <p>LongURL</p>
            <div className='flex gap-2'>
                <p>0 Count</p>
                <p>Time</p>
            </div>
            <button className='btn btn-active text-lg w-1/4' onClick={async () => await navigator.clipboard.writeText(shortURL)}><FaCopy className='text-2xl' />Copy</button>
        </div>
    )
}

export default UrlCard