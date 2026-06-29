import mongoose from "mongoose";

const YoutubeVideoSchema = new mongoose.Schema(
  {
    videoId: {
      type: String,
      unique: true,
    },
    title: String,
    description: String,
    thumbnail: String,
    publishedAt: Date,
    url: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.YoutubeVideo ||
  mongoose.model("YoutubeVideo", YoutubeVideoSchema);