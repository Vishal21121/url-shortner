import React, { useCallback, useEffect, useState } from 'react'
import { IoIosLink } from "react-icons/io";
import { FaCopy } from "react-icons/fa6";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validurl from "valid-url"
import { useUserContext } from "../context/UserContext"
import UrlCard from '../components/UrlCard';
import { FiLogOut } from "react-icons/fi";

const Home = () => {
    const { user, logOut } = useUserContext()
    const [data, setData] = useState({
        longURL: "",
        aliase: ""
    })
    const [gotURL, setGotURL] = useState(false)
    const [shortURL, setShortURL] = useState("")
    const [urls, setUrls] = useState([])

    const handleClick = async () => {
        if (!validurl.isUri(data.longURL)) {
            return toast.error("Please provide a valid URL")
        }
        try {
            console.log(user)
            const response = await fetch(`${import.meta.env.VITE_SERVER_URI}/api/v1/url/create`, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    longUrl: data.longURL,
                    aliase: data.aliase,
                    userId: user.data._id
                })
            })
            const value = await response.json()
            if (value.statusCode === 201) {
                setGotURL(true)
                setShortURL(value.data.value.shortUrl)
                setUrls((pre) => [...pre, value.data.value])
                toast.success('Created a short URL');
            } else if (value.statusCode === 400) {
                toast.error(value.message);
            } else if (value.statusCode === 422) {
                let firstELement = value.errors[0]
                let errorMessage = ""
                if ("longUrl" in firstELement) {
                    errorMessage = firstELement["longUrl"]
                } else if ("aliase" in firstELement) {
                    errorMessage = firstELement["aliase"]
                } else if ("userId" in firstELement) {
                    errorMessage = firstELement["userId"]
                }
                toast.error(errorMessage)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const fetchUrls = useCallback(async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URI}/api/v1/url/myurls/${user.data._id}`)
            const data = await response.json()
            if (data.statusCode === 200) {
                setUrls(data.data.value)
            }
        } catch (error) {
            console.log(error.message)
        }
    }, [user])

    const clickHandler = (id) => {
        let urlIndex = urls.findIndex((el) => el._id == id)
        let tempUrlArray = [...urls]
        tempUrlArray[urlIndex].clicked = tempUrlArray[urlIndex].clicked + 1
        setUrls(tempUrlArray)
    }

    useEffect(() => {
        fetchUrls()
    }, [fetchUrls])

    return (
        <div className='flex flex-col w-full items-center h-screen'>
            <div className="navbar bg-neutral text-neutral-content w-full flex justify-between">
                <button className="btn btn-ghost text-xl">URL Shortner</button>
                <button className="btn btn-ghost text-xl" onClick={logOut} ><FiLogOut className='mt-1' />LogOut</button>
            </div>
            <div className='flex flex-col items-center sm:flex-row sm:items-baseline gap-4 w-full h-[80%] '>
                <div className='w-3/4 sm:w-1/2 mt-8 flex flex-col justify-center max-h-screen h-fit'>
                    <div className='ring-2 ring-gray-600 mt-8 ml-8 px-4 gap-4 w-3/4 flex flex-col items-center rounded pb-4 pt-2 h-full'>
                        <div className='flex gap-1 items-center'>
                            <IoIosLink className='text-white text-lg' />
                            <p className='text-white text-base font-semibold'>Shorten a long URL</p>
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
                            !gotURL && <button className='btn btn-active text-sm sm:text-lg' onClick={handleClick}>Shorten URL</button>
                        }
                    </div>
                </div>
                <div className='w-full sm:w-1/2 mt-6 p-4 h-full flex flex-col gap-4'>
                    <p className='text-2xl text-center font-semibold'>Saved Urls</p>
                    <div className='flex flex-col gap-4 p-4 overflow-auto h-full items-center w-full'>
                        {
                            urls.length > 0 ? (
                                urls.map((el) => (
                                    <UrlCard key={el._id} el={el} clickHandler={clickHandler} />
                                ))
                            ) : <p>Nothing to display</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home