'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { User } from '@/app/types/user'

interface Props {
    user: User
    setUser: (user: User) => void
}

const API = process.env.NEXT_PUBLIC_API_ON_BACKEND

export default function AvatarUpload({ user, setUser }: Props) {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

    const handleUpload = async () => {
        if (!file) return
        setLoading(true)
        const formData = new FormData()
        formData.append('file', file)
        try {
            const res = await axios.post(`${API}/auth/upload-avatar`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setUser({ ...user, avatar: res.data })
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center gap-2">
            <img
                src={user.avatar || 'https://cdn-icons-png.flaticon.com/512/9187/9187604.png'}
                alt="Avatar"
                className="w-28 h-28 rounded-full border-2 border-blue-600 object-cover"
            />
            <input type="file" onChange={e => e.target.files && setFile(e.target.files[0])} />
            <button
                onClick={handleUpload}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                {loading ? 'Загрузка...' : 'Загрузить аватар'}
            </button>
        </div>
    )
}
