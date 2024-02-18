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
        <div className='flex flex-col gap-2 ring ring-gray-500 rounded p-2 w-3/4'>
            <Link className='text-gray-400 font-bold text-lg' to={el.shortUrl} target="_blank" onClick={() => clickHandler(el._id)}  >{el.shortUrl}</Link>
            <p>{el.redirectUrl}</p>
            <div className='flex gap-2'>
                <p>{el.clicked} clicks</p>
                <p>{formattedDate}</p>
            </div>
            <button className='btn btn-active text-lg w-1/4' onClick={async () => await navigator.clipboard.writeText(el.shortUrl)}><FaCopy className='text-2xl' />Copy</button>
        </div>
    )
}

export default UrlCard