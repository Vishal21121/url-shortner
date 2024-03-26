import React from 'react'
import { FaCopy } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';


const UrlCard = ({ el, clickHandler, setUrls, urls }) => {
    let dateStr = el.createdAt
    let date = new Date(dateStr);
    let options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    let formattedDate = date.toLocaleDateString('en-US', options);

    const handleDelete = async (urlId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URI}/api/v1/url/delete`, {
                method: "DELETE",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    urlId: urlId
                })
            })
            const data = await response.json()
            if (data.statusCode === 404) {
                toast.error(data.message)
            } else if (data.statusCode === 200) {
                toast.success(data.message)
                let filteredUrls = urls.filter((el) => el._id !== urlId)
                setUrls(filteredUrls)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='flex flex-col gap-2 ring ring-gray-500 rounded p-2 w-full sm:w-3/4'>
            <Link className='text-gray-400 font-bold text-base truncate' to={el.shortUrl} target="_blank" onClick={() => clickHandler(el._id)}  >{el.shortUrl}</Link>
            <p className='text-xs sm:text-base'>{el.redirectUrl}</p>
            <div className='flex gap-2'>
                <p className='text-sm sm:text-base'>{el.clicked} clicks</p>
                <p className='text-sm sm:text-base'>{formattedDate}</p>
            </div>
            <div className='flex gap-2 w-full justify-center'>
                <button className='btn btn-active text-lg w-2/5 sm:w-1/4 flex flex-row' onClick={async () => await navigator.clipboard.writeText(el.shortUrl)}><FaCopy className='text-md' />Copy</button>
                <button className='btn btn-active text-lg w-2/5 sm:w-1/4 flex flex-row' onClick={() => handleDelete(el._id)}><MdDelete className='text-md' />Delete</button>
            </div>
        </div>
    )
}

export default UrlCard