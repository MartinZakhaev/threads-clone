"use client";

import { useEffect, useState } from "react";
import useLike from "@/hooks/useLike";
import Image from "next/image";

interface Props {
  threadId: string;
  userId: string;
}

const LikeButton = ({ threadId, userId }: Props) => {
  const [heartImageSrc, setHeartImageSrc] = useState("/assets/heart-gray.svg");
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeFunctions, setLikeFunctions] = useState<{
    addLike: () => Promise<void>;
    removeLike: () => Promise<void>;
  } | null>(null);

  useEffect(() => {
    const heartImage = isLiked
      ? "/assets/heart-filled.svg"
      : "/assets/heart-gray.svg";

    setHeartImageSrc(heartImage);

    async function setupLikeFunctions() {
      const likeFunctions = await useLike({ threadId, userId });
      setLikeFunctions(likeFunctions);
    }

    async function fetchInitialLikeStatus() {
      try {
        const response = await fetch("/api/check-like", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ threadId, userId }),
        });

        if (response.ok) {
          const data = await response.json();
          setIsLiked(data.isLiked);
        } else {
          // Handle error
        }
      } catch (error) {
        // Handle error
      }
    }

    fetchInitialLikeStatus();
    setupLikeFunctions();
  }, [threadId, userId, isLiked]);

  const handleLike = async () => {
    if (isLiked) {
      await likeFunctions?.removeLike();
    } else {
      await likeFunctions?.addLike();
    }
    setIsLiked(!isLiked);
  };

  // const heartImageSrc = isLiked
  //   ? "/assets/heart-filled.svg"
  //   : "/assets/heart-gray.svg";

  return (
    <>
      <Image
        src={heartImageSrc}
        alt="heart"
        width={24}
        height={24}
        className="cursor-pointer object-contain"
        onClick={handleLike}
      />
    </>
  );
};

export default LikeButton;
