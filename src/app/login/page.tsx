'use client'
import React, { useState } from 'react'
import axios from 'axios'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:8080/auth/login', {
        email,
        password
      }, { withCredentials: true }) // для cookie
      setMessage('Добро пожаловать, ' + res.data.username)
    } catch (err: any) {
      setMessage('Ошибка: ' + err.response?.data || err.message)
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Логин</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="border p-2 rounded" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="border p-2 rounded" />
        <button type="submit" className="bg-green-600 text-white p-2 rounded">Войти</button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  )
}
