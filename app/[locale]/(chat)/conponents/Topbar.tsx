"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Image from "next/image";
import { useUserStore } from "@/store/useUser";

import { Link, useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useClickAway } from "@uidotdev/usehooks";
import { useTheme } from "next-themes";
import { FaHome } from "react-icons/fa";
import { CiLogin, CiLogout } from "react-icons/ci";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { logoutUser } from "@/functions/authActions";
import RevalidateTag from "@/functions/serverActions";
const LanguageChanger = dynamic(() => import("@/components/LanguageChanger"));
const ThemeButton = dynamic(() => import("@/components/ThemeButton"));
const Topbar = ({ user }: any) => {

  const { theme } = useTheme();
  const [dropdown, setDropdown] = useState(false);
  const clickOutsideRef: any = useClickAway(() => {
    setDropdown(false);
  });
  const { setCurrentUser, currentUser } = useUserStore();
  const router = useRouter();
  const t = useTranslations("navigations");
  const t2 = useTranslations();
  const links = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Chat", path: "/Chat", icon: <IoChatbubbleEllipsesOutline /> },
    { name: "Login", path: "/login", icon: <CiLogin /> },
  ];

  useEffect(() => {
    if (user && user?._id) {
      setCurrentUser(user);
    }
  }, [user, setCurrentUser]);
  const handleLogout = async() => {
    await logoutUser();
  
    localStorage.removeItem("userInfo");
    toast.success("Logged Out!");
    Cookies.remove("authToken")
    RevalidateTag("user");
    router.push("/login");

    setCurrentUser(null as any);

  };

  return (
    <>
      <section className="flex items-center justify-between py-5 px-10 bg-blue-600  ">
        <h1 className="text-xl md:text-4xl">{t2("logo")}</h1>
        <div className="flex items-center gap-4 flex-wrap">
          <div className=" transition-transform hidden md:flex md:items-center md:gap-3">
            {links.map((link, i) => (
              <Link key={i} href={link.path} className="hover:text-gray-200 duration-500">
                {/* Wrap the link content inside an anchor tag */}
                {currentUser && link.name === "Login" ? (
                  ""
                ) : !currentUser && link.name === "Chat" ? (
                  ""
                ) : (
                  <p className="">{t(link.name)}</p>
                )}
              </Link>
            ))}
          </div>
          {/* Language */}

          <div className="">
            <LanguageChanger />
          </div>
          {/* Theme button */}
          <ThemeButton />

          <div
            ref={clickOutsideRef}
            className="h-8 w-8 relative"
            onClick={() => setDropdown(!dropdown)}
            onMouseOver={() => setDropdown(true)}
            onMouseLeave={() => setDropdown(false)}
          >
            {currentUser && currentUser._id ? (
              <div className="flex flex-col items-center">
                {" "}
                <div className="h-6 w-6 md:h-9 md:w-9 ">
                  <Image
                    height={35}
                    width={35}
                    className="rounded-full h-full w-full object-cover"
                    alt={currentUser?.username}
                    src={currentUser?.pic}
                  />
                </div>
                <h1 className="text-[10px] md:text-sm ">
                  {currentUser.username.slice(0, 8)}
                </h1>
              </div>
            ) : (
              <div className="h-5 md:h-9 w-5 md:w-9">
                <CgProfile className="h-full w-full" />
              </div>
            )}
            {/* Dropdown */}
            <div
              className={`absolute ${
                theme === "dark" ? "bg-white text-black " : "bg-black text-white"
              } right-0 p-3 min-w-40 z-50 transition-all duration-500 rounded-md ring-2 ring-violet-500  ${
                dropdown
                  ? "translate-y-1 scale-100 opacity-100"
                  : "translate-y-0 scale-0 opacity-0"
              }`}
            >
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 ">
                  {links.map((link, i) => (
                    <Link
                      key={i}
                      href={link.path}
                      className="text-xs md:text-sm flex items-center gap-2 hover:text-blue-500"
                    >
                      {/* Wrap the link content inside an anchor tag */}
                      {currentUser && link.name === "Login" ? (
                        ""
                      ) : !currentUser && link.name === "Chat" ? (
                        ""
                      ) : (
                        <>
                          {" "}
                          <span>{link.icon}</span>
                          <p className="">{t(link.name)}</p>
                        </>
                      )}
                    </Link>
                  ))}
                </div>
                {currentUser && currentUser._id && (
                  <>
                    {" "}
                    <Link
                      href={"/profile"}
                      className="flex items-center gap-2 text-xs md:text-sm duration-300 hover:text-blue-500"
                    >
                      <CgProfile />
                      Profile
                    </Link>
                    <li
                      className="flex items-center gap-2 text-xs md:text-sm cursor-pointer list-none text-red-400 duration-300 hover:text-rose-500"
                      onClick={() => handleLogout()}
                    >
                      <CiLogout />
                      Logout
                    </li>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Topbar;
