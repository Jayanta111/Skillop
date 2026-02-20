import { clientServer, BASE_URL } from "@/config";
import DashboardLayout from "@/layout/dashboardLayout";
import UserLayout from "@/layout/userLayout";
import React, { useEffect, useState } from "react";
import styles from "@/pages/viewProfile/index.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import { getAllPost } from "@/config/redux/action/postAction";
import {
  getMyConnections,
  sendConnectionRequest,
} from "@/config/redux/action/authAction";

export default function ViewProfile({ userProfile }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const posts = useSelector((state) => state.posts?.posts || []);
  const connections = useSelector((state) => state.auth?.connections || []);

  const [userPosts, setUserPosts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("none");
  const [loadingConnect, setLoadingConnect] = useState(false);

  if (!userProfile) return <div>Profile not found</div>;

  const profileId = userProfile?.userId?._id;

  const { userId, bio, pastWork, education, currentPost } = userProfile;

  // Logged user
  const loggedUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  const loggedUserId = loggedUser?._id;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    dispatch(getAllPost());
    dispatch(getMyConnections({ token }));
  }, [dispatch]);

  // ================= FILTER USER POSTS =================
  useEffect(() => {
    if (!Array.isArray(posts) || !profileId) return;

    const filteredPosts = posts.filter(
      (post) => post?.userId?._id?.toString() === profileId?.toString(),
    );

    setUserPosts(filteredPosts);
  }, [posts, profileId]);

  // ================= CONNECTION STATUS LOGIC =================
  useEffect(() => {
    if (!Array.isArray(connections) || !profileId || !loggedUserId) return;

    const foundConnection = connections.find((conn) => {
      const sender = conn.userId?._id?.toString() || conn.userId?.toString();

      const receiver =
        conn.connectionId?._id?.toString() || conn.connectionId?.toString();

      return (
        (sender === loggedUserId && receiver === profileId) ||
        (sender === profileId && receiver === loggedUserId)
      );
    });

    if (!foundConnection) {
      setConnectionStatus("none");
    } else if (foundConnection.status_accepted === true) {
      setConnectionStatus("connected");
    } else if (foundConnection.status_accepted === null) {
      setConnectionStatus("pending");
    } else {
      setConnectionStatus("none");
    }
  }, [connections, profileId, loggedUserId]);

  // ================= CONNECT BUTTON ACTION =================
  const handleConnect = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setLoadingConnect(true);

      await dispatch(
        sendConnectionRequest({
          token: token,
          connectionId: profileId,
        }),
      ).unwrap();

      setConnectionStatus("pending");

      dispatch(getMyConnections({ token }));
    } catch (err) {
      console.log("Connection error:", err);
    } finally {
      setLoadingConnect(false);
    }
  };

  // ================= BUTTON RENDER =================
  const renderButton = () => {
    if (loggedUserId === profileId) return null;

    if (connectionStatus === "connected") {
      return (
        <button
          className={styles.connectedBtn}
          disabled
          style={{ cursor: "default" }}
        >
          Connected
        </button>
      );
    }

    if (connectionStatus === "pending") {
      return (
        <button
          className={styles.pendingBtn}
          disabled
          style={{ cursor: "not-allowed" }}
        >
          Pending
        </button>
      );
    }

    return (
      <button
        className={styles.connectBtn}
        onClick={handleConnect}
        disabled={loadingConnect}
        style={{ cursor: "pointer" }}
      >
        {loadingConnect ? "Connecting..." : "Connect"}
      </button>
    );
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          {/* PROFILE IMAGE */}
          <div className={styles.backDropContainer}>
            <img
              src={
                userId?.profilePicture
                  ? `${BASE_URL}/uploads/${userId.profilePicture}`
                  : `${BASE_URL}/uploads/default.jpg`
              }
              alt="Profile"
              className={styles.profileImage}
            />
          </div>

          {/* PROFILE INFO */}
          <div className={styles.profileCard}>
            <h1 className={styles.profileName}>{userId?.name}</h1>

            <p className={styles.profileUsername}>@{userId?.username}</p>

            {renderButton()}

            {/* Resume */}
            <div
              onClick={async () => {
                const res = await clientServer.get(
                  `/user/download_resume?id=${profileId}`,
                );

                window.open(`${BASE_URL}/${res.data.url}`, "_blank");
              }}
              style={{
                display: "flex",
                marginTop: "10px",
                cursor: "pointer",
              }}
            >
              Resume
            </div>

            <h3>About</h3>
            <p>{bio || "No bio available"}</p>

            <h3>Current Position</h3>
            <p>{currentPost || "Not specified"}</p>

            <h3>Experience</h3>

            {pastWork?.length > 0 ? (
              <ul>
                {pastWork.map((work) => (
                  <li key={work._id}>
                    <strong>{work.position}</strong> at {work.company}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No experience</p>
            )}

            <h3>Education</h3>

            {education?.length > 0 ? (
              <ul>
                {education.map((edu) => (
                  <li key={edu._id}>
                    {edu.degree} - {edu.school}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No education</p>
            )}
          </div>

          {/* POSTS */}
          <div className={styles.postContainer}>
            <h2>Posts</h2>

            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <div key={post._id} className={styles.postCard}>
                  <p>{post.body}</p>

                  {post.media && (
                    <img
                      src={`${BASE_URL}/uploads/${post.media}`}
                      alt="Post"
                      style={{
                        width: "100%",
                        maxWidth: "400px",
                        borderRadius: "10px",
                        marginTop: "10px",
                      }}
                    />
                  )}
                </div>
              ))
            ) : (
              <p>No posts yet</p>
            )}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

// ================= SSR =================
export async function getServerSideProps(context) {
  const username = context.query.username;

  if (!username) return { props: { userProfile: null } };

  try {
    const res = await clientServer.get("/user/get_profile_based_on_username", {
      params: { username },
    });

    return {
      props: {
        userProfile: res.data.profile || null,
      },
    };
  } catch {
    return {
      props: {
        userProfile: null,
      },
    };
  }
}
