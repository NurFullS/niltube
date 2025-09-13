'use client'

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Video } from "@/app/types/video"
import { fetchSearchResults } from "../lib/api"
import VideoList from "../components/video/VideoList"
import Header from "../components/body/Header"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || ""
  const [videos, setVideos] = useState<Video[]>([])

  useEffect(() => {
    if (query.trim()) {
      fetchSearchResults(query)
        .then(setVideos)
        .catch(console.error)
    } else {
      setVideos([])
    }
  }, [query])

  if (!query.trim()) return <div>
    <p className="text-white p-4">Введите поисковый запрос</p>
  </div>
  if (!videos.length) return <div>
    <Header />
    <p className="text-white p-4 text-center mt-50">Ничего не найдено</p>
  </div>

  return <VideoList initialVideos={videos} />
}
