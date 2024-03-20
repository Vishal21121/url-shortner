import React, { useState } from 'react'
import signup from "../assets/signup.svg"
import { useUserContext } from "../context/UserContext"
import { Link } from 'react-router-dom'
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

const Signup = () => {
    const { registerUser } = useUserContext()
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: ""
    })

    const googleSignup = async () => {
        try {
            window.open("http://localhost:8080/api/v1/users/google", "_self")
        } catch (error) {
            console.log(error)
        }
    }

    const githubSignup = async () => {
        try {
            window.open("http://localhost:8080/api/v1/users/github", "_self")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="hero sm:min-h-screen max-h-dvh bg-base-200">
            <div className="hero-content flex-col gap-8 lg:flex-row-reverse">
                <img src={signup} alt="" />
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Username</span>
                            </label>
                            <input
                                type="text"
                                placeholder="username"
                                className="input input-bordered"
                                required
                                value={userData.username}
                                onChange={(e) => setUserData(pre => ({ ...pre, username: e.target.value }))}
                            />
                        </div>
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
                        <div className="flex flex-col w-full border-opacity-50">
                            <div className="form-control mt-6">
                                <button
                                    className="btn btn-primary"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        registerUser(userData)
                                    }}
                                >Sign up</button>
                            </div>
                            <div className="divider">OR</div>
                            <div className='flex flex-col gap-2'>
                                <div className="form-control">
                                    <button
                                        className="btn"
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            googleSignup()
                                        }}
                                    > <FaGoogle className='text-xl' />Continue with Google</button>
                                </div>
                                <div className="form-control">
                                    <button
                                        className="btn"
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            githubSignup()
                                        }}
                                    > <FaGithub className='text-xl' />Continue with GitHub</button>
                                </div>
                            </div>

                        </div>


                        <div className='flex gap-2 mx-auto'>
                            <span>Already have an account?</span>
                            <Link to='/signin' className='hover:text-blue-500'>Sign in</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup