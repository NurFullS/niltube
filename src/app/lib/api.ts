import axios from "axios";
import { Video } from "@/app/types/video";

export const fetchVideos = async (): Promise<Video[]> => {
  const res = await axios.get("http://localhost:8080/video/videos", {
    withCredentials: true,
  });
  return res.data;
};

export const fetchSearchResults = async (query: string, limit = 10): Promise<Video[]> => {
  const res = await axios.get("http://localhost:8080/video/search", {
    params: { query, limit },
    withCredentials: true,
  });
  return res.data;
};
