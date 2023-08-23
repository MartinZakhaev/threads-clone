import Like from "@/lib/models/like.model";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { connectToDB } from "@/lib/mongoose";
import { NextApiRequest, NextApiResponse } from "next";

export async function fetchLikesCount(threadId: string): Promise<number> {
  try {
    await connectToDB();
    const likesCount = await Like.countDocuments({ threadId });
    return likesCount;
  } catch (error) {
    return 0;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "DELETE") {
    return res.status(405).end();
  }
  try {
    const { threadId } = req.body;
    if (!threadId || typeof threadId !== "string") {
      throw new Error("Invalid thread ID");
    }

    const thread = await fetchThreadById(threadId);
    if (!thread) {
      throw new Error("Invalid thread ID");
    }

    if (req.method === "POST") {
      const { threadId, userId } = req.body;
      try {
        await connectToDB();
        const newLike = new Like({
          userId,
          threadId,
        });
        await newLike.save();
        res.status(200).json({ message: "Like added successfully" });
      } catch (error) {
        console.error("Error adding like: ", error);
        res.status(500).json({ error: "An error occurred" });
      }
    }

    if (req.method === "DELETE") {
      const { threadId, userId } = req.body;
      try {
        await connectToDB();
        // Find the like document and delete it
        await Like.findOneAndDelete({ userId, threadId });
        res.status(200).json({ message: "Like deleted successfully" });
      } catch (error) {
        console.error("Error deleting like: ", error);
        res.status(500).json({ error: "An error occurred" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
