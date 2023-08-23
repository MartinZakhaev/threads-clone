"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";

import { deleteThread } from "@/lib/actions/thread.actions";

interface Props {
  threadId: string;
  loggedInUser: string;
  authorId: string;
  parentId: string | null;
  isComment?: boolean;
}

function DeleteThread({
  threadId,
  loggedInUser,
  authorId,
  parentId,
  isComment,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  if (loggedInUser !== authorId || pathname === "/") return null;

  return (
    <Image
      src="/assets/delete.svg"
      alt="delete"
      width={18}
      height={18}
      className="cursor-pointer object-contain"
      onClick={async () => {
        const shouldDelete = await Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#877eff",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "Cancel",
          customClass: {
            popup: "custom-delete-confirmation",
          },
        }).then(async (result) => {
          if (result.isConfirmed) {
            await deleteThread(JSON.parse(threadId), pathname ?? "");
            if (!parentId || !isComment) {
              router.push("/");
            }
            Swal.fire({
              title: "Deleted!",
              text: "Your thread has been deleted.",
              icon: "success",
              confirmButtonColor: "#877eff",
              customClass: {
                popup: "custom-delete-confirmation",
              },
            });
          }
        });
      }}
    />
  );
}

export default DeleteThread;
