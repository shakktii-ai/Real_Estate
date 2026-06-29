"use client";

import { useEffect, useState } from "react";

export default function YoutubeFeed() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("/api/youtube")
      .then((res) => res.json())
      .then(setVideos);
  }, []);

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {videos.map((video) => (
        <a
          key={video.videoId}
          href={video.url}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl overflow-hidden shadow hover:shadow-lg"
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-56 object-cover"
          />

          <div className="p-4">
            <h2 className="font-semibold line-clamp-2">
              {video.title}
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              {new Date(video.publishedAt).toDateString()}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}