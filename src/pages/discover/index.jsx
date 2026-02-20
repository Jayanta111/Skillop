import DashboardLayout from "@/layout/dashboardLayout";
import UserLayout from "@/layout/userLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/pages/discover/index.module.css";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";
function DiscoverPage() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, []);
  const router = useRouter();
  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          {authState.all_users.map((profile) => (
            <div
              onClick={() => {
                router.push(`/viewProfile/${profile.userId.username}`);
              }}
              key={profile._id}
              className={styles.topProfileCard}
            >
              <img
                className={styles.profileAvatar}
                src={`${BASE_URL}/uploads/${
                  profile?.userId?.profilePicture || "default.jpg"
                }`}
                alt={profile.userId.name}
                onError={(e) => {
                  e.currentTarget.src =
                    "http://localhost:8085/uploads/default.jpg";
                }}
              />

              <div>
                <p className={styles.name}>{profile.userId.name}</p>
                <p className={styles.username}>@{profile.userId.username}</p>
              </div>
            </div>
          ))}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default DiscoverPage;
