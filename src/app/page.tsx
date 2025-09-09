'use client'

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { User } from "./types/user";

export default function Home() {

  const [users, setUsers] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8080/auth/me', {
          withCredentials: true
        });
        setUsers(res.data);
      } catch (error) {
        console.error('Ошибка при загрузке пользователей:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Пользователи</h1>
      <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 border p-2 rounded">
              <img src={users?.avatar} width={50} height={50} alt={users?.username} className="rounded-full" />
            <div>
              <p className="font-semibold">{users?.username}</p>
              <p className="text-sm text-gray-500">{users?.email}</p>
              <p>{users?.role}</p>
            </div>
          </div>
      </div>
    </div>
  );
}
