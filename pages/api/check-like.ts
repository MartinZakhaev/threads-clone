import { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "@/lib/mongoose";
import Like from "@/lib/models/like.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { threadId, userId } = req.body;

  try {
    await connectToDB();

    // Check if the user has liked the thread
    const existingLike = await Like.findOne({ userId, threadId });

    if (existingLike) {
      res.status(200).json({ isLiked: true });
    } else {
      res.status(200).json({ isLiked: false });
    }
  } catch (error) {
    console.error("Error checking like status: ", error);
    res.status(500).json({ error: "An error occurred" });
  }
}
