'use client'

import React, { useEffect, useState } from 'react'
import { User } from '@/app/types/user'
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Header = () => {

    const [user, setUser] = useState<User | null>(null);
    const [searchInput, setSearchInput] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const resUser = await axios.get('http://localhost:8080/auth/me', {
                    withCredentials: true
                })
                setUser(resUser.data)
            } catch (error) {
                console.error(error)
            }
        }

        fetchUser()
    }, [])

    const handleUser = () => {
        if (user?.username) {
            router.push('/profile')
        } else {
            router.push('/login')
        }
    }

    return (
        <header>
            <div className='flex justify-around mt-2'>
                <h1 className='text-blue-400 font-bold text-2xl items-center cursor-pointer' onClick={() => router.push('/')}>NilTube</h1>
                <input className='border-2 border-blue-400 p-2 rounded-[10px] w-120 text-white outline-none bg-gray-800 placeholder:text-gray-500 ml-50 focus:border-blue-600' placeholder='Введите запрос...' type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                <div>
                </div>
                <div className='flex cursor-pointer'>
                    <button onClick={() => router.push('/upload_video')} className='text-blue-400 bg-gray-800 rounded-2xl p-2 text-center font-bold cursor-pointer'>➕ Создать</button>
                    <div className='flex gap-2 items-center ml-10 cursor-pointer bg-gray-800 rounded-2xl p-2'>
                        <img
                            className="w-6 h-6 rounded-full object-cover"
                            src={
                                !user?.avatar || user.avatar === "null"
                                    ? "https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
                                    : user.avatar
                            }
                            alt="avatar"
                        />
                        <p className='text-[18px] items-center font-bold text-blue-400' onClick={handleUser}>{user?.username || 'Войти'}</p>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header