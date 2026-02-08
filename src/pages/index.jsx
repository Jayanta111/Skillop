import UserLayout from "@/layout/userLayout";
import { useRouter } from "next/router";
import React from "react";

function HomePage() {
  const router = useRouter();

  return (
    <UserLayout>

   
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center max-w-6xl w-full">
        
        {/* Left Content */}
        <div className="text-center md:text-left space-y-4 ">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 font-sans">
            Connect with friends <br /> without exaggeration
          </h1>

          <p className="text-gray-600">
            A true social media platform — with stories, no bluffs!
          </p>

          <button
            onClick={() => router.push("/login")}
            className="mt-4 px-8 py-2 cursor-pointer bg-blue-500 hover:bg-blue-600 transition text-white font-semibold rounded-full shadow-md"
          >
            Join Now
          </button>
        </div>

        {/* Right Image */}
        <div className="md:col-span-2 flex justify-center">
          <img
            src="/images/HomeBanner.jpg"
            alt="Home Banner"
            className="rounded-2xl w-full max-w-2xl object-cover shadow-lg"
          />
        </div>

      </div>
    </div>
     </UserLayout>
  );
}

export default HomePage;
