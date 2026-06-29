//app/api/youtube/route.js
import { connectToDatabase } from "@/lib/db";
import YoutubeVideo from "@/models/YoutubeVideo";

export async function GET() {
  await connectToDatabase();

  const videos = await YoutubeVideo.find()
    .sort({
      publishedAt: -1,
    });

  return Response.json(videos);
}