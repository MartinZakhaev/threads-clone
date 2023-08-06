import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import ThreadCard from "@/components/cards/ThreadCard";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(params.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  // Get replies
  const activity = await getActivity(userInfo._id);
  const replyIds = activity.map((activity) => activity._id);
  const replies = await Promise.all(
    replyIds.map(async (replyId) => {
      return await fetchThreadById(replyId.toString());
    })
  );

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />
      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <p className="max-sm:hidden">{tab.label}</p>
                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userInfo?.threads?.length}
                  </p>
                )}
                {tab.label === "Replies" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {activity.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent
            key="Threads"
            value="threads"
            className="w-full text-light-1"
          >
            <ThreadsTab
              currentUserId={user.id}
              accountId={userInfo.id}
              accountType="User"
            />
          </TabsContent>
          <TabsContent
            key="Replies"
            value="replies"
            className="w-full text-light-1"
          >
            <section className="mt-9 flex flex-col gap-10">
              {replies.map((reply) => (
                <ThreadCard
                  key={reply._id}
                  id={reply._id}
                  currentUserId={user?.id || ""}
                  parentId={reply.parentId}
                  content={reply.text}
                  author={reply.author}
                  community={reply.community}
                  createdAt={reply.createdAt}
                  comments={reply.children}
                  isComment
                />
              ))}
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default Page;
