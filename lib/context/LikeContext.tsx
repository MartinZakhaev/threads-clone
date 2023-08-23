"use client";

import { currentUser } from "@clerk/nextjs";
import { createContext, useContext, useState, useEffect } from "react";
import { fetchUser } from "../actions/user.actions";

interface LikeContextType {
  likeStatus: Record<string, boolean>;
  toggleLike: (threadId: string) => void;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export function useLikeContext() {
  const context = useContext(LikeContext);
  if (!context) {
    throw new Error("useLikeContext must be used within a LikeProvider");
  }
  return context;
}

export function LikeProvider({ children }: { children: React.ReactNode }) {
  const [likeStatus, setLikeStatus] = useState<Record<string, boolean>>({});

  const toggleLike = (threadId: string) => {
    setLikeStatus((prevStatus) => ({
      ...prevStatus,
      [threadId]: !prevStatus[threadId],
    }));
    // Make an API call to update the like status on the server
    fetch("/api/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ threadId }),
    });
  };

  // useEffect(() => {
  //   const fetchUserId = async () => {
  //     const user = await currentUser();
  //     if (!user) return null;

  //     const userInfo = await fetchUser(user.id);
  //     console.log("USER INFOOOOOOOO", userInfo._id);
  //     // // Fetch the initial like status from the API
  //     // try {
  //     //   const response = await fetch("/api/getLikeStatus"); // Replace with your API endpoint
  //     //   const data = await response.json();
  //     //   setLikeStatus(data); // Initialize the likeStatus state
  //     // } catch (error) {
  //     //   console.error("Error fetching initial like status:", error);
  //     // }
  //   };
  //   // // Fetch the initial like status from the API
  //   // fetch("/api/getLikeStatus") // Replace with your API endpoint
  //   //   .then((response) => response.json())
  //   //   .then((data) => {
  //   //     setLikeStatus(data); // Initialize the likeStatus state
  //   //   })
  //   //   .catch((error) => {
  //   //     console.error("Error fetching initial like status:", error);
  //   //   });
  //   fetchUserId();
  // }, []); // Run this effect only once upon component mount

  const contextValue: LikeContextType = {
    likeStatus,
    toggleLike,
  };

  return (
    <LikeContext.Provider value={contextValue}>{children}</LikeContext.Provider>
  );
}
