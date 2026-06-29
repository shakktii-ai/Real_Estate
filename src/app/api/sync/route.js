//app/api/sync/route.js
import { connectToDatabase } from "@/lib/db";
import YoutubeVideo from "@/models/YoutubeVideo";

export async function GET() {
  await connectToDatabase();

  const url = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${process.env.UPLOAD}&key=${process.env.API_KEY}`;

  const response = await fetch(url);
console.log("Status:", response.status);
  const data = await response.json();
console.log("Data:", data);
  for (const item of data.items) {
    const video = {
      videoId: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
    };

    await YoutubeVideo.findOneAndUpdate(
      {
        videoId: video.videoId,
      },
      video,
      {
        upsert: true,
      }
    );
  }

  return Response.json({
    success: true,
    total: data.items.length,
  });
}