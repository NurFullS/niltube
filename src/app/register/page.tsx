'use client'
import React, { useState } from 'react'
import axios from 'axios'

export default function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')
    const [avatar, setAvatar] = useState<File | null>(null)
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            let avatarUrl = ''
            if (avatar) {
                const formData = new FormData()
                formData.append('file', avatar)
                const uploadRes = await axios.post(
                    'http://localhost:8080/auth/upload-avatar',
                    formData,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' },
                        withCredentials: true,
                    }
                )
                avatarUrl = uploadRes.data
            }

            const res = await axios.post('http://localhost:8080/auth/register', {
                username,
                email,
                password,
                avatar: avatarUrl,
                role
            })
            setMessage('Пользователь зарегистрирован: ' + res.data.username)
        } catch (err: any) {
            setMessage('Ошибка: ' + err.response?.data || err.message)
        }
    }

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Регистрация</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required className="border p-2 rounded" />
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="border p-2 rounded" />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="border p-2 rounded" />
                <select onChange={(e) => setRole(e.target.value)}>
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                </select>
                <input type="file" onChange={e => setAvatar(e.target.files?.[0] || null)} />
                <button type="submit" className="bg-blue-600 text-white p-2 rounded">Зарегистрироваться</button>
            </form>
            {message && <p className="mt-4">{message}</p>}
        </div>
    )
}