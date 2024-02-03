import React, { useState } from 'react'
import { IoIosLink } from "react-icons/io";
import { FaCopy } from "react-icons/fa6";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validurl from "valid-url"

const Home = () => {
    const [data, setData] = useState({
        longURL: "",
        aliase: ""
    })
    const [gotURL, setGotURL] = useState(false)
    const [shortURL, setShortURL] = useState("")
    const handleClick = async () => {
        if (!validurl.isUri(data.longURL)) {
            return toast.error("Please provide a valid URL", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            })
        }
        try {
            const response = await fetch("http://localhost:8080/api/v1/url-create", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    longUrl: data.longURL,
                    aliase: data.aliase
                })
            })
            const value = await response.json()
            console.log(value)
            if (value.data.statusCode === 201) {
                setGotURL(true)
                setShortURL(value.data.value)
                toast.success('Created a short URL', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
            } else if (value.data.statusCode === 400) {
                toast.error(`${value.data.message}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div className='flex flex-col w-full justify-center items-center'>
            <ToastContainer
                position="bottom-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
            <div className="navbar bg-neutral text-neutral-content w-full h-fit">
                <button className="btn btn-ghost text-xl">daisyUI</button>
            </div>
            <div className='w-1/2 mt-8 flex justify-center'>
                <div className='ring-2 ring-gray-600 mt-8 ml-8 px-4 gap-4 w-3/4 flex flex-col rounded pb-4 pt-2'>
                    <div className='flex gap-4 p-2 items-center'>
                        <IoIosLink className='text-white text-4xl' />
                        <p className='text-white text-lg font-semibold'>Shorten a long URL</p>
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                        {
                            gotURL && <p className='text-lg text-white'>Long URL</p>
                        }
                        <input type="text" placeholder="Enter long URL here" className="input input-bordered w-full mb-2" value={data.longURL} onChange={(e) => setData(prev => ({ ...prev, longURL: e.target.value }))} />
                        {
                            !gotURL ? <input type="text" placeholder="Enter alias" className="input input-bordered w-full" onChange={(e) => setData(prev => ({ ...prev, aliase: e.target.value }))} /> : (
                                <div className='flex flex-col gap-3'>
                                    <div className='flex flex-col gap-1'>
                                        <p className='text-lg text-white'>Short URL</p>
                                        <input type="text" placeholder="" className="input input-bordered w-full" value={shortURL} />
                                    </div>
                                    <div className='flex gap-2 mx-auto'>
                                        <button className='btn btn-active text-lg' onClick={async () => await navigator.clipboard.writeText(shortURL)}><FaCopy className='text-2xl' />Copy</button>
                                        <button
                                            className='btn btn-accent text-lg text-gray-700'
                                            onClick={() => { setData({ longURL: "", aliase: "" }); setGotURL(false); }}
                                        >Shorten another</button>
                                    </div>
                                </div>
                            )
                        }

                    </div>
                    {
                        !gotURL && <button className='btn btn-active text-lg' onClick={handleClick}>Shorten URL</button>
                    }
                </div>
            </div>
        </div>
    )
}

export default Home