import React from "react";
import { Home, User, Bell, MessageCircle, PlusSquare } from "lucide-react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/redux/reducer/authReducer";

function NavbarComp() {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const userName = authState?.user?.userId?.name;
  const profilePic = authState?.user?.userId?.profilePicture;

  return (
    <>
      {/* ===== Desktop / Tablet Top Navbar ===== */}
      <nav className="hidden md:flex fixed top-0 left-0 w-full h-16 bg-white shadow-sm z-50 items-center justify-between px-8">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <img src="/images/logo.png" alt="Logo" className="h-9" />
          <span className="font-bold text-xl text-blue-600">Socially</span>
        </div>

        {/* Right Section */}
        {!authState?.profileFetched ? (
          <button
            onClick={() => router.push("/login")}
            className="w-22 h-8 bg-blue-700 rounded-2xl p-1 text-amber-50 font-semibold"
          >
            Be A part
          </button>
        ) : (
          <div className="flex items-center gap-4 cursor-pointer">
            <span className="font-medium text-gray-700">
              Hey, {userName?.split(" ")[0]}
            </span>

            <img
              src={`http://localhost:8085/uploads/${
                profilePic || "default.jpg"
              }`}
              alt={userName}
              onError={(e) => {
                e.currentTarget.src =
                  "http://localhost:8085/uploads/default.jpg";
              }}
              className="h-9 w-9 rounded-full border object-cover"
              onClick={() => router.push("/profile")}
            />
            <p
              className="text-2xl text-red-600"
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/login");
                dispatch(reset());
              }}
            >
              Logout
            </p>
          </div>
        )}
      </nav>

      {/* ===== Mobile Top Navbar ===== */}
      <nav className="md:hidden fixed top-0 left-0 w-full h-16 bg-white border-b shadow-lg z-50 flex items-center justify-between px-4">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <img src="/images/logo.png" alt="Logo" className="h-9" />
          <span className="font-bold text-xl text-blue-600">Socially</span>
        </div>

        {/* Right Section */}
        {!authState?.profileFetched ? (
          <button
            onClick={() => router.push("/login")}
            className="w-20 h-8 bg-blue-700 rounded-2xl p-1 text-amber-50 font-semibold"
          >
            Be A part
          </button>
        ) : (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/profile")}
          >
            <span className="text-sm font-medium">
              Hi, {userName?.split(" ")[0]}
            </span>
            <img
              src={`http://localhost:8085/uploads/${
                profilePic || "default.jpg"
              }`}
              alt={userName}
              onError={(e) => {
                e.currentTarget.src =
                  "http://localhost:8085/uploads/default.jpg";
              }}
              className="h-9 w-9 rounded-full border object-cover"
              onClick={() => router.push("/profile")}
            />
          </div>
        )}
      </nav>
    </>
  );
}

export default NavbarComp;
