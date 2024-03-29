import Image from "next/image";
import React from "react";
import { RenderMessageWithEmojis } from "../logics/checkEmoji";
import Reactions from "./Reactions";
import { useMediaQuery } from "@uidotdev/usehooks";
import DownloadAndView from "./DownloadAndView";

const RenderMesseage = ({
  message,

  isCurrentUserMessage,
  handleRemoveReact,
  isReactionListModal,
  setReactionListVisible,
  reactionListModalRef,
}: {
  message: any;

  isCurrentUserMessage: any;
  handleRemoveReact: any;
  isReactionListModal: any;
  setReactionListVisible: any;
  reactionListModalRef: any;
}) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  return (
    <div>
      {" "}
      <div className="text-[10px] md:text-xs relative duration-300 bg-gray-200 hover:bg-gray-100  dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg p-2  max-w-[40vw] md:max-w-[40vw] break-words !h-fit  ">
        {message.content ? (
          RenderMessageWithEmojis(message?.content, isSmallDevice)
        ) : message.image ? (
          // h-[130px] w-[130px]
          <div className=" rounded relative">
            <Image
              src={message.image.url}
              alt={message?.sender?.username}
              height={isSmallDevice ? 300 : 600}
              width={isSmallDevice ? 300 : 600}
              className="h-full w-full rounded-lg"
            />
            <DownloadAndView url={message.image.url} />
          </div>
        ) : (
          ""
        )}

        {/* Reactions */}

        <Reactions
          message={message}
          isCurrentUserMessage={isCurrentUserMessage}
          handleRemoveReact={handleRemoveReact}
          isReactionListModal={isReactionListModal}
          setReactionListVisible={setReactionListVisible}
          reactionListModalRef={reactionListModalRef}
        />
        {/*Display Reactions end */}
      </div>
    </div>
  );
};

export default RenderMesseage;
