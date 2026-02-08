import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import { createPost, getAllPost } from "@/config/redux/action/postAction";
import DashboardLayout from "@/layout/dashboardLayout";
import UserLayout from "@/layout/userLayout";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "@/config";
import styles from "@/pages/dashboard/index.module.css";
function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postState =useSelector((state)=>state.post);
  const [isTokenThere, setTokenThere] = useState(false);
  const profilePic = authState?.user?.userId?.profilePicture;

  // Refs
  const imageRef = useRef(null);
  const videoRef = useRef(null);

  // Article modal
  const [showPostBox, setShowPostBox] = useState(false);
  const [postText, setPostText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
//Post 
  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      setTokenThere(true);
    }
  }, [router]);

  // Fetch data
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

  // Upload handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };
  const openPostModal = (type) => {
    setShowPostBox(true);
    if (type === "image") imageRef.current.click();
    if (type === "video") videoRef.current.click();
  };
  const handleCreatePost = async () => {
    await dispatch(
      createPost({
        body: postText,
        file: selectedFile,
      }),
    );

    setPostText("");
    setSelectedFile(null);
    setPreview(null);
    setShowPostBox(false);
  };

  if (!authState.user) {
    return (
      <UserLayout>
        <DashboardLayout>
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-4 border-gray-200"></div>
              <div className="w-14 h-14 rounded-full border-4 border-blue-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Loading your Feed
            </h2>
          </div>
        </DashboardLayout>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <DashboardLayout>
        {/* Hidden Inputs */}
        <input
          type="file"
          accept="image/*"
          ref={imageRef}
          hidden
          onChange={handleFileChange}
        />
        <input
          type="file"
          accept="video/*"
          ref={videoRef}
          hidden
          onChange={handleFileChange}
        />

        {/* Post Box */}
        <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={`${BASE_URL}/uploads/${profilePic || "default.jpg"}`}
              onError={(e) =>
                (e.currentTarget.src = `${BASE_URL}/uploads/default.jpg`)
              }
              className="h-12 w-12 rounded-full object-cover"
            />

            <input
              onClick={() => setShowPostBox(true)}
              type="text"
              placeholder="Create a post"
              className="flex-1 rounded-full border px-4 py-2 text-sm outline-none hover:bg-gray-50 cursor-pointer"
              readOnly
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap sm:flex-nowrap justify-between gap-4 text-xs sm:text-sm font-medium">
            {/* Photo */}
            <div
              onClick={() => openPostModal("image")}
              className="flex flex-1 sm:flex-none items-center justify-center sm:justify-start gap-2 text-gray-600 cursor-pointer hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 7h4l2-2h6l2 2h4v12H3V7z"
                />
              </svg>
              Photo
            </div>

            {/* Video */}
            <div
              onClick={() => openPostModal("video")}
              className="flex flex-1 sm:flex-none items-center justify-center sm:justify-start gap-2 text-gray-600 cursor-pointer hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14m-9 1V9a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H7a1 1 0 01-1-1z"
                />
              </svg>
              Video
            </div>

            {/* Write Article */}
            <div
              onClick={() => setShowPostBox(true)}
              className="flex flex-1 sm:flex-none items-center justify-center sm:justify-start gap-2 text-gray-600 cursor-pointer hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-orange-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 20h9M16.5 3.75a2.121 2.121 0 113 3L7.5 18.75 3 21l2.25-4.5L16.5 3.75z"
                />
              </svg>
              <span className="hidden xs:inline">Write article</span>
              <span className="xs:hidden">Article</span>
            </div>
          </div>
        </div>

        {/* Article Modal */}
        {showPostBox && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg rounded-xl p-4 space-y-4">
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="What do you want to talk about?"
                className="w-full h-32 border rounded-lg p-3 resize-none"
              />

              {preview && (
                <div className="border rounded-lg overflow-hidden">
                  {selectedFile?.type.startsWith("image") ? (
                    <img
                      src={preview}
                      className="w-full max-h-80 object-cover"
                    />
                  ) : (
                    <video src={preview} controls className="w-full max-h-80" />
                  )}
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <button onClick={() => imageRef.current.click()}>
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
                        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                      />
                    </svg>
                  </button>
                  <button onClick={() => videoRef.current.click()}>
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
                        d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPostBox(false)}
                    className="text-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePost}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="mt-10 bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-start gap-3">
            {/* Profile Image */}
            <img
              src={`${BASE_URL}/uploads/${profilePic || "default.jpg"}`}
              className="h-16 w-16 rounded-full object-cover shrink-0"
            />

            <div className="flex items-start justify-between flex-1 min-w-0">
              <div className={`${styles.cardProfileDetails} min-w-0`}>
                <p className={styles.name}>Jayanta</p>
                <p className={styles.role}>
                  Senior Software Engineer @ TechCorp International Division
                </p>
                <p className={styles.time}>2hr ago</p>
              </div>

              <button
                className="
        flex items-center gap-1
        text-blue-600 font-medium text-xs sm:text-sm
        border border-blue-600
        px-2 sm:px-3 py-1
        rounded-full
        hover:bg-blue-50
        whitespace-nowrap
        shrink-0
      "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3M8 11a4 4 0 100-8 4 4 0 000 8zm-6 9a6 6 0 1112 0H2z"
                  />
                </svg>
                Connect
              </button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 pt-3 pb-2">
              <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
                Hello I am Happy
              </p>
            </div>

            <div className="w-full">
              <img
                src="/images/HomeBanner.jpg"
                alt="Post"
                className="w-full max-h-[420px] object-cover"
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default DashboardPage;
