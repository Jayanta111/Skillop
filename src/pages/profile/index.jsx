import DashboardLayout from "@/layout/dashboardLayout";
import UserLayout from "@/layout/userLayout";
import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import {
  deletePost,
  getAllPost,
  incrementPostLike,
} from "@/config/redux/action/postAction";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL, clientServer } from "@/config";
import style from "@/pages/profile/index.module.css";
export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);
  const [likedPosts, setLikedPosts] = useState({});

  const [isTokenThere, setTokenThere] = useState(false);

  const loggedInUserId = authState?.user?.userId?._id;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      setTokenThere(true);
    }
  }, [router]);

  useEffect(() => {
    if (isTokenThere) {
      const token = localStorage.getItem("token");
      dispatch(getAllPost());
      dispatch(getAboutUser({ token }));

      if (!authState.all_profiles_fetched) {
        dispatch(getAllUsers());
      }
    }
  }, [isTokenThere, dispatch, authState.all_profiles_fetched]);

  const profilePosts = postState?.posts?.filter(
    (post) => post.userId?._id === loggedInUserId,
  );
  const uploadProfilePicture = async (file) => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      // ✅ backend expects field name "file"
      formData.append("file", file);

      await clientServer.post("/update_profile_picture", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ important
          "Content-Type": "multipart/form-data",
        },
      });

      // refresh user data
      dispatch(getAboutUser({ token }));

      console.log("Profile picture uploaded successfully");
    } catch (error) {
      console.error(
        "Profile picture upload failed:",
        error?.response?.data || error.message,
      );
    }
  };
  return (
    <UserLayout>
      <DashboardLayout>
        <div className="mt-6 h-[calc(100vh-260px)] overflow-y-auto pr-2 flex justify-center">
          <div className=" min-h-screen">
            <div className="bg-white shadow-sm">
              {/* Cover */}
              <div className={style.backDropContainer}></div>

              {/* Profile Info */}
              <div className="max-w-5xl mx-auto px-6 relative">
                {/* Profile Image */}
                <div className="relative">
                  {/* Hidden File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    id="profilePictureUpload" 
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        uploadProfilePicture(e.target.files[0]);
                      }
                    }}
                  />

                  <label
                    htmlFor="profilePictureUpload"
                    className="cursor-pointer items-center"
                  >
                    <img
                      src={`${BASE_URL}/uploads/${
                        authState?.user?.userId?.profilePicture || "default.jpg"
                      }`}
                      className="h-36 w-36 rounded-full border-4 border-white object-cover absolute -top-16 hover:opacity-80 transition"
                      alt="profile"
                    />
                  </label>
                </div>

                {/* User Details */}
                <div className="pt-24 pb-6 flex flex-col sm:flex-row justify-between">
                  <div>
                    <h1 className="text-2xl font-semibold">
                      {authState?.user?.userId?.name || "No Name"}
                    </h1>

                    <p className="text-gray-600">
                      @{authState?.user?.userId?.username || "username"}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {authState?.user?.bio || "No bio added"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {authState?.user?.location || "No location"} •{" "}
                      {authState?.connections?.length || 0} connections
                    </p>
                  </div>

                  <div className="mt-4 sm:mt-0 flex gap-3">
                    <button className="border border-gray-400 text-gray-700 px-4 py-1.5 rounded-full hover:bg-gray-100 transition">
                      Edit Profile
                    </button>

                    <button className="border border-gray-400 px-4 py-1.5 rounded-full">
                      More
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-5xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
              {/* LEFT COLUMN */}
              <div className="md:col-span-2 space-y-6">
                {/* ABOUT */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4">About</h2>

                  {/* BIO */}
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {authState?.user?.bio || "No bio added"}
                  </p>

                  {/* CURRENT WORK */}
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-800">
                      Current Work
                    </h3>
                    <p className="text-sm text-gray-600">
                      {authState?.user?.currentWork || "Not specified"}
                    </p>
                  </div>

                  {/* PAST WORK */}
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-800">
                      Past Experience
                    </h3>

                    {authState?.user?.pastWork?.length > 0 ? (
                      authState.user.pastWork.map((job, index) => (
                        <div
                          key={index}
                          className="mt-2 border-l-2 border-blue-500 pl-3"
                        >
                          <p className="text-sm font-medium">{job.position}</p>
                          <p className="text-sm text-gray-600">{job.company}</p>
                          <p className="text-xs text-gray-500">{job.years}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No past experience
                      </p>
                    )}
                  </div>

                  {/* EDUCATION */}
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-800">Education</h3>

                    {authState?.user?.education?.length > 0 ? (
                      authState.user.education.map((edu, index) => (
                        <div
                          key={index}
                          className="mt-2 border-l-2 border-green-500 pl-3"
                        >
                          <p className="text-sm font-medium">{edu.degree}</p>
                          <p className="text-sm text-gray-600">{edu.school}</p>
                          <p className="text-xs text-gray-500">
                            {edu.fieldOfStudy}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No education added
                      </p>
                    )}
                  </div>
                </div>

                {/* ACTIVITY / POSTS */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4">Activity</h2>

                  {profilePosts?.length > 0 ? (
                    profilePosts.map((post) => (
                      <div
                        key={post._id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6"
                      >
                        {/* TOP ACTION BAR */}
                        <div className="flex justify-end gap-4 px-4 pt-4 text-gray-500">
                          {/* DELETE */}
                          <div
                            title="Delete"
                            className="hover:text-red-600 transition cursor-pointer"
                            onClick={async () => {
                              dispatch(deletePost({ post_id: post._id }));
                              dispatch(getAllPost());
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6 text-red-600"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </div>

                          {/* EDIT */}
                          <div
                            title="Edit"
                            className="hover:text-blue-600 transition cursor-pointer"
                            onClick={() => handleEditPost(post)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* POST CONTENT */}
                        <div className="px-4 pb-4">
                          <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                            {post.body}
                          </p>

                          {/* IMAGE */}
                          {post.media && (
                            <div className="mt-4 rounded-lg overflow-hidden ">
                              <img
                                src={`${BASE_URL}/uploads/${post.media}`}
                                alt="post"
                                className="w-full h-auto object-contain bg-black/5"
                              />
                            </div>
                          )}

                          {/* TIME */}
                          <p className="text-xs text-gray-500 mt-3">
                            {new Date(post.creatAt).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex justify-around border-t py-2 text-sm text-gray-600">
                          <div
                            className="hover:text-blue-600  cursor-pointer"
                            onClick={async () => {
                              if (likedPosts[post._id]) return;

                              await dispatch(
                                incrementPostLike({ post_id: post._id }),
                              );

                              setLikedPosts((prev) => ({
                                ...prev,
                                [post._id]: true,
                              }));

                              dispatch(getAllPost());
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                              />
                            </svg>
                            {post.likes}
                          </div>
                          <div className="hover:text-blue-600  cursor-pointer">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                              />
                            </svg>{" "}
                          </div>
                          <div className="hover:text-blue-600 cursor-pointer">
                            🔁 Repost
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      You haven’t posted anything yet
                    </p>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                {/* PROFILE STATS */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <p className="text-sm font-medium">Profile strength</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Complete your profile to get more visibility
                  </p>
                </div>

                {/* SKILLS */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <h3 className="font-semibold mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">
                      React
                    </span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">
                      Node.js
                    </span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">
                      MongoDB
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
