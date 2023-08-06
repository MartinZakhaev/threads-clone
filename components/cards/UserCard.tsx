"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  key: string;
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  personType: string;
}

const UserCard = ({ key, id, name, username, imgUrl, personType }: Props) => {
  const router = useRouter();
  const isCommunity = personType === "Community";

  const handleClick = () => {
    if (isCommunity) {
      router.push(`/communities/${id}`);
    } else {
      router.push(`/profile/${id}`);
    }
  };

  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <Image
          src={imgUrl}
          alt="Profile image"
          width={48}
          height={48}
          className="rounded-full"
        />
        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </div>
      <Button className="user-card_btn" onClick={handleClick}>
        View
      </Button>
    </article>
  );
};

export default UserCard;
