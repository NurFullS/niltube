'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { User } from '@/app/types/user'
import AvatarUpload from './components/AvatarUpload'
import ProfileInfo from './components/ProfileInfo'

const API = process.env.NEXT_PUBLIC_API_ON_BACKEND

export default function SettingsPage() {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${API}/auth/me`, { withCredentials: true })
                setUser(res.data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchUser()
    }, [])

    if (!user) return <p>Загрузка...</p>

    return (
        <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-lg space-y-6">
            <h1 className="text-2xl font-bold text-center">Настройки профиля</h1>
            <AvatarUpload user={user} setUser={setUser} />
            <ProfileInfo />
        </div>
    )
}
