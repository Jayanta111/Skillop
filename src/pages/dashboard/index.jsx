import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import {
  createPost,
  getAllComments,
  getAllPost,
  incrementPostLike,
  postComment,
} from "@/config/redux/action/postAction";
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
  const postState = useSelector((state) => state.posts);
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
  const [likedPosts, setLikedPosts] = useState({});
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
  const { comments } = useSelector((state) => state.posts);

  const [commentText, setCommentText] = useState("");
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

  const handleComment = (postId) => {
    console.log("Open comments for:", postId);
    // later you can scroll to comment box or open modal
  };

  const handleRepost = (postId) => {
    alert("Repost feature coming soon 🚀");
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
        <div className="mt-6 h-[calc(100vh-260px)] overflow-y-auto pr-2 flex justify-center">
          <div className="w-full max-w-[640px]">
            {postState?.posts?.map((post) => (
              <div key={post._id} className="mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  {/* HEADER */}
                  <div className="p-4 flex items-start gap-3">
                    <img
                      src={`${BASE_URL}/uploads/${
                        post.userId?.profilePicture || "default.jpg"
                      }`}
                      alt="profile"
                      className="h-12 w-12 rounded-full object-cover shrink-0"
                    />

                    <div className="flex justify-between flex-1 min-w-0">
                      <div className={`${styles.cardProfileDetails} min-w-0`}>
                        <p className="font-semibold text-sm truncate">
                          {post.userId?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          @{post.userId?.username}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {new Date(post.creatAt).toLocaleString()}
                        </p>
                      </div>

                      <div
                        className="
                        cursor-pointer
                        bg-white
                  flex items-center gap-1
                  text-blue-600 font-medium text-xs
                  px-3 py-1
                  hover:bg-blue-50
                  shrink-0
                "
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
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                        Connect
                      </div>
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="px-4 pb-3">
                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                      {post.body}
                    </p>
                  </div>

                  {/* IMAGE — LINKEDIN STYLE */}
                  {post.media && (
                    <div className="bg-gray-50 flex justify-center items-center max-h-[520px] overflow-hidden">
                      <img
                        src={`${BASE_URL}/uploads/${post.media}`}
                        alt="Post"
                        className="
                  w-auto
                  h-auto
                  max-h-[520px]
                  max-w-full
                  object-contain
                "
                      />
                    </div>
                  )}

                  <div className="px-4 py-2 border-t flex justify-between text-sm text-gray-600">
                    {/* LIKE */}
                    <div
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
                      className={`flex items-center gap-2 cursor-pointer hover:text-blue-600 ${
                        likedPosts[post._id]
                          ? "text-blue-600 font-medium pointer-events-none"
                          : ""
                      }`}
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
                    <div
                      className={`flex items-center gap-2 cursor-pointer hover:text-blue-600 ${
                        likedPosts[post._id] ? "text-blue-600 font-medium" : ""
                      }`}
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
                          d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54"
                        />
                      </svg>
                    </div>

                    {/* COMMENT */}
                    <div
                      onClick={async () => {
                        if (openCommentsPostId === post._id) {
                          // close if already open
                          setOpenCommentsPostId(null);
                        } else {
                          // open only this post
                          setOpenCommentsPostId(post._id);

                          // fetch comments for this post
                          await dispatch(getAllComments({ post_id: post._id }));
                        }
                      }}
                      className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
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
                          d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                        />
                      </svg>
                      {post.comments}
                    </div>

                    {/* Share */}
                    <div
                      onClick={() => {
                        const text = encodeURIComponent(post.body);
                        const url = encodeURIComponent(
                          `http://localhost:3000/post/${post._id}`,
                        );

                        window.open(
                          `https://wa.me/?text=${text}%0A${url}`,
                          "_blank",
                        );
                      }}
                      className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
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
                          d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                        />
                      </svg>
                    </div>
                  </div>
                  {openCommentsPostId === post._id && (
                    <div className={styles.commentsContainer}>
                      <h4 className={styles.commentTitle}>Comments</h4>

                      <div className={styles.commentList}>
                        {comments.length > 0 ? (
                          comments.map((comment) => (
                            <div
                              key={comment._id}
                              className={styles.commentItem}
                            >
                              <div className={styles.commentContent}>
                                <span className={styles.username}>
                                  {comment.userId?.name || "Unknown User"}
                                </span>
                                <span className={styles.username}>
                                  @{comment.userId?.username || "Unknown User"}
                                </span>
                                <p className={styles.commentText}>
                                  {comment.body}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className={styles.noComments}>
                            No comments yet 👀
                          </p>
                        )}
                      </div>

                      <div className={styles.commentInputBox}>
                        <input
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          type="text"
                          placeholder="Write a comment..."
                          className={styles.commentInput}
                        />

                        <button
                          className={styles.commentBtn}
                          disabled={!commentText.trim()}
                          onClick={async () => {
                            if (!commentText.trim()) return;

                            await dispatch(
                              postComment({
                                post_id: post._id,
                                body: commentText,
                              }),
                            );

                            setCommentText("");

                            await dispatch(
                              getAllComments({ post_id: post._id }),
                            );
                          }}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default DashboardPage;
