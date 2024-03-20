import React from 'react'
import { FaCopy } from "react-icons/fa6";
import { Link } from 'react-router-dom';


const UrlCard = ({ el, clickHandler }) => {
    console.log(el)
    let dateStr = el.createdAt
    let date = new Date(dateStr);
    let options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    let formattedDate = date.toLocaleDateString('en-US', options);


    return (
        <div className='flex flex-col gap-2 ring ring-gray-500 rounded p-2 w-full sm:w-3/4'>
            <Link className='text-gray-400 font-bold text-base truncate' to={el.shortUrl} target="_blank" onClick={() => clickHandler(el._id)}  >{el.shortUrl}</Link>
            <p className='text-xs sm:text-base'>{el.redirectUrl}</p>
            <div className='flex gap-2'>
                <p className='text-sm sm:text-base'>{el.clicked} clicks</p>
                <p className='text-sm sm:text-base'>{formattedDate}</p>
            </div>
            <button className='btn btn-active text-lg w-1/2 sm:w-1/4 flex flex-row' onClick={async () => await navigator.clipboard.writeText(el.shortUrl)}><FaCopy className='text-md' />Copy</button>
        </div>
    )
}

export default UrlCard