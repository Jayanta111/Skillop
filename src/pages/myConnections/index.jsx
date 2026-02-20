import React, { useEffect } from "react";
import DashboardLayout from "@/layout/dashboardLayout";
import UserLayout from "@/layout/userLayout";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "@/config";
import {
  getMyConnections,
  acceptConnection,
} from "@/config/redux/action/authAction";
import { useRouter } from "next/router";

function MyConnectionsPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const { connections, incomingRequests, sentRequests } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (token) {
      dispatch(getMyConnections({ token }));
    }
  }, [dispatch, token]);

  // Accept request
  const handleAccept = async (e, requestId) => {
    e.stopPropagation();
    try {
      await dispatch(
        acceptConnection({ token, requestId, accept_type: "accept" }),
      ).unwrap();
      dispatch(getMyConnections({ token }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleReject = async (e, requestId) => {
    e.stopPropagation();
    try {
      await dispatch(
        acceptConnection({ token, requestId, accept_type: "reject" }),
      ).unwrap();
      dispatch(getMyConnections({ token }));
    } catch (err) {
      console.log(err);
    }
  };

  // User Card Component
  const UserCard = ({ connection, isIncoming, isSent, isConnected }) => {
    const userData = isIncoming ? connection.userId : connection.connectionId;

    return (
      <div
        key={connection._id}
        onClick={() => router.push(`/viewProfile/${userData.username}`)}
        className="flex items-center justify-between mb-3 border p-3 rounded cursor-pointer hover:bg-zinc-200 transition"
        style={{
          border: "1px solid #ddd",
          boxShadow: "10px 10px 10px rgba(0,0,0,0.08)",
        }}
      >
        <div className="flex items-center gap-3">
          <img
            src={
              userData.profilePicture
                ? `${BASE_URL}/uploads/${userData.profilePicture}`
                : "/defaultProfile.png"
            }
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-white">{userData.name}</h3>
            <p className="text-gray-400">@{userData.username}</p>
          </div>
        </div>

        <div>
          {isIncoming && (
            <div className="flex gap-2">
              <button
                onClick={(e) => handleAccept(e, connection._id)}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Accept
              </button>
              <button
                onClick={(e) => handleReject(e, connection._id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Reject
              </button>
            </div>
          )}

          {isSent && (
            <span className="px-3 py-1 bg-yellow-600 text-white rounded">
              Pending
            </span>
          )}

          {isConnected && (
            <span className="px-3 py-1 bg-blue-600 text-white rounded">
              Connected
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <UserLayout>
      <DashboardLayout>
        {/* Incoming Requests */}
        <h2 className="text-xl font-bold mb-3 text-blue-500">
          Incoming Requests
        </h2>
        {incomingRequests.length > 0 ? (
          incomingRequests.map((conn) => (
            <UserCard key={conn._id} connection={conn} isIncoming />
          ))
        ) : (
          <p>No incoming requests</p>
        )}

        {/* Sent Requests */}
        <h2 className="text-xl font-bold mt-6 mb-3 text-yellow-500">
          Sent Requests
        </h2>
        {sentRequests.length > 0 ? (
          sentRequests.map((conn) => (
            <UserCard key={conn._id} connection={conn} isSent />
          ))
        ) : (
          <p>No sent requests</p>
        )}

        {/* Accepted Connections */}
        <h2 className="text-xl font-bold mt-6 mb-3 text-green-500">
          My Connections
        </h2>
        {connections.length > 0 ? (
          connections.map((conn) => (
            <UserCard key={conn._id} connection={conn} isConnected />
          ))
        ) : (
          <p>No connections yet</p>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}

export default MyConnectionsPage;
