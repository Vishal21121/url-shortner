import React from 'react'
import { IoIosLink } from "react-icons/io";

const Home = () => {
    return (
        <div className='flex flex-col w-full justify-center items-center'>
            <div className="navbar bg-neutral text-neutral-content w-full h-fit">
                <button className="btn btn-ghost text-xl">daisyUI</button>
            </div>
            <div className='w-1/2 mt-8'>
                <div className='ring-2 ring-gray-600 mt-8 ml-8 px-4 gap-4 w-3/4 flex flex-col rounded pb-4 pt-2'>
                    <div className='flex gap-4 p-2 items-center'>
                        <IoIosLink className='text-white text-4xl' />
                        <p className='text-white text-lg font-semibold'>Shorten a long URL</p>
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                        <input type="text" placeholder="Enter long URL here" className="input input-bordered w-full" />
                        <input type="text" placeholder="Enter alias" className="input input-bordered w-full" />
                    </div>
                    <button className='btn btn-active text-lg'>Shorten URL</button>
                </div>
            </div>
        </div>
    )
}

export default Home