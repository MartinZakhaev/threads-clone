const useLike = async ({
  threadId,
  userId,
}: {
  threadId: string;
  userId: string;
}) => {
  const addLike = async () => {
    try {
      const response = await fetch("/api/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ threadId, userId }),
      });

      if (response.ok) {
        // Handle successful like addition
      } else {
        // Handle error
      }
    } catch (error) {
      // Handle error
    }
  };

  const removeLike = async () => {
    try {
      const response = await fetch("/api/like", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ threadId, userId }),
      });

      if (response.ok) {
        // Handle successful like removal
      } else {
        // Handle error
      }
    } catch (error) {
      // Handle error
    }
  };

  return { addLike, removeLike };
};

export default useLike;
