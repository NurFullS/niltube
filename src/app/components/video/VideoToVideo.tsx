import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

type Video = {
    id: number
    videoUrl: string
    videoName: string
    videoDescription: string
    videoPreview: string
    ownerUsername: string
    ownerEmail: string
    created_at: string
}

export default function VideoToVideo() {
    const [videos, setVideos] = useState<Video[]>([])
    const router = useRouter()

    useEffect(() => {
        fetch("http://localhost:8080/video/videos", {
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                setVideos(shuffleArray(data))
            })
            .catch(err => console.error(err))
    }, [])

    function timeAgo(dateString: string) {
        const now = new Date()
        const past = new Date(dateString)
        const diff = Math.floor((now.getTime() - past.getTime()) / 1000)

        if (diff < 60) return `${diff} секунд назад`
        if (diff < 3600) return `${Math.floor(diff / 60)} минут назад`
        if (diff < 86400) return `${Math.floor(diff / 3600)} часов назад`
        if (diff < 604800) return `${Math.floor(diff / 86400)} дней назад`
        if (diff < 2592000) return `${Math.floor(diff / 604800)} недель назад`
        if (diff < 31536000) return `${Math.floor(diff / 2592000)} месяцев назад`
        return `${Math.floor(diff / 31536000)} лет назад`
    }

    function shuffleArray<T>(array: T[]): T[] {
        const newArray = [...array]
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
        }
        return newArray
    }

    if (!videos.length) return <p className="p-4">Нет видео</p>

    return (
        <div className="p-4">
            {videos.map(video => (
                <div key={video.id} className="flex max-h-30 mb-5">

                    <div
                        className="relative ml-5 mr-5 rounded overflow-hidden cursor-pointer"
                        onClick={() => router.push(`/video/${video.id}`)}
                    >
                        <img
                            src={video.videoPreview}
                            alt={video.videoName}
                            className="w-50 h-30 object-cover"
                        />
                    </div>

                    <div>
                        <h2 className="text-lg mt-1 text-white">{video.videoName}</h2>
                        <p className="text-[16px] text-gray-400">{video.ownerUsername}</p>
                        <p className="text-white mb-1 w-80 overflow-hidden text-ellipsis whitespace-nowrap">
                            {video.videoDescription}
                        </p>
                        <p className="text-xs text-gray-400">Вышел: {timeAgo(video.created_at)}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
