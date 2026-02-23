import React from "react";
import styles from "@/layout/dashboardLayout/index.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTokenThere } from "@/config/redux/reducer/authReducer";
import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import { BASE_URL } from "@/config";
function DashboardLayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  // Auth check
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
      } else {
        dispatch(setTokenThere());
      }
    }
  }, [router]);
  return (
    <div className="container">
      <div className={styles.homeContainer}>
        <div className={styles.homeContainer_leftBar}>
          <div
            className={styles.sideBarOption}
            onClick={() => router.push("/dashboard")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            <p>Feed</p>
          </div>

          <div
            className={styles.sideBarOption}
            onClick={() => router.push("/discover")}
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
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <p>Discover</p>
          </div>

          <div
            className={styles.sideBarOption}
            onClick={() => router.push("/myConnections")}
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
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
              />
            </svg>
            <p>My Connections</p>
          </div>
          <div
            className={styles.sideBarOption}
            onClick={() => router.push("/projects")}
          >
            {" "}
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
                d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
              />
            </svg>
            <p>Projects</p>
          </div>
          <div className={styles.activitySection}>
            <p className={styles.activityTitle}>Your Activity</p>

            <div className={styles.activity}>
              <span>Posts</span>
              <span>21</span>
            </div>

            <div className={styles.activity}>
              <span>Connections</span>
              <span>10</span>
            </div>

            <div className={styles.activity}>
              <span>Projects</span>
              <span>3</span>
            </div>
          </div>
        </div>

        <div className={styles.homeContainer_feedContainer}>{children}</div>
        <div className={styles.homeContainer_extraContainer}>
          <h3 className={styles.topProfilesTitle}>Top Profiles</h3>

          {authState.all_users.map((profile) => (
            <div key={profile._id} className={styles.topProfileCard}>
              <img
              className={styles.profileAvatar}
               src={`${BASE_URL}/uploads/${
                                  authState?.user?.userId?.profilePicture || "default.jpg"
                                }`}
                // src={`http://localhost:8085/uploads/${profile.userId.profilePicture}`}
                alt={profile.userId.name}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://sociallybackend12.vercel.app/uploads/default.jpg";
                }}
              />

              <div>
                <p className={styles.name}>{profile.userId.name}</p>
                <p className={styles.username}>@{profile.userId.username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
