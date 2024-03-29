import React from "react";
import { Tuser } from "./leftsearchDrawer/UserCard";
import Image from "next/image";

const TypingIndicator = ({ user }: any) => {
  return (
    <div className=" flex  items-center">
      {user && (
        <div className="ml-3 relative h-8 w-8 md:h-9 md:w-9  ring-3 ring-blue-700 rounded-full">
          {" "}
          <Image
            height={32}
            width={32}
            className="rounded-full object-fill h-full w-full"
            alt={user.username}
            src={user.pic}
          />
          <span className="absolute bottom-0 right-0 p-[4px] bg-green-500 rounded-full"></span>
        </div>
      )}
      <div className="typingIndicatorContainer">
        <div className="typingIndicatorBubble">
          <div className="typingIndicatorBubbleDot"></div>
          <div className="typingIndicatorBubbleDot"></div>
          <div className="typingIndicatorBubbleDot"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
