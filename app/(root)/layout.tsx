import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
// import { LikeProvider } from "@/lib/context/LikeContext";
import "../globals.css";
import Topbar from "@/components/shared/Topbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import Bottombar from "@/components/shared/Bottombar";

export const metatada = {
  title: "Threads",
  description: "A Next.js 13 Meta Threads Clone Application",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      {/* <LikeProvider> */}
      <html lang="en">
        <body className={`${inter.className}`}>
          <Topbar />
          <main className="flex flex-row">
            <LeftSidebar />
            <section className="main-container">
              <Toaster />
              <div className="w-full max-w-4xl">{children}</div>
            </section>
            <RightSidebar />
          </main>
          <Bottombar />
        </body>
      </html>
      {/* </LikeProvider> */}
    </ClerkProvider>
  );
}
