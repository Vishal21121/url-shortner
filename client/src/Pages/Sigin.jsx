import React, { useState } from 'react'
import sigin from "../assets/sigin.svg"
import { useUserContext } from '../context/UserContext'
import { Link } from 'react-router-dom'

const Sigin = () => {
    const [userData, setUserData] = useState({
        email: "",
        password: ""
    })
    const { login } = useUserContext()

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <img src={sigin} alt="" />
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100 mr-4">
                    <form className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="email"
                                className="input input-bordered"
                                required
                                value={userData.email}
                                onChange={(e) => setUserData(pre => ({ ...pre, email: e.target.value }))}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="password"
                                className="input input-bordered"
                                required
                                value={userData.password}
                                onChange={(e) => setUserData(pre => ({ ...pre, password: e.target.value }))}
                            />
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary" onClick={(e) => {
                                e.preventDefault();
                                login(userData)
                            }}>Sign in</button>
                        </div>
                        <div className='flex gap-2 mx-auto'>
                            <span>Don't have an account?</span>
                            <Link to='/signup' className='hover:text-blue-500'>Sign Up</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Sigin