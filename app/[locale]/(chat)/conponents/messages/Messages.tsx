"use client";
import React, { useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useSuspenseInfiniteQuery } from "@tanstack/react-query";

import { useChatStore } from "@/store/useChat";
import dynamic from "next/dynamic";
const InfiniteScroll = dynamic(() => import("react-infinite-scroll-component"));
const ChatLoading = dynamic(() => import("../ChatLoading"));
const MessageCard = dynamic(() => import("./MessageCard"), {
  ssr: false,
  loading: () => <ChatLoading count={1} height={65} inline={false} radius={5} />,
});
import { allMessages } from "@/functions/messageActions";
import { FaArrowDown } from "react-icons/fa";
import { useRouter } from "@/navigation";
import { Metadata } from "next";
import { useMessageStore } from "@/store/useMessage";
import { useSearchParams } from "next/navigation";
import useIncomingMessageStore from "@/store/useIncomingMessage";
import { useMediaQuery } from "@uidotdev/usehooks";
import { findLastSeenMessageIndex } from "../logics/logics";
const NoChatProfile = dynamic(() => import("../NoChatProfile"));

const Messages = () => {
  const { selectedChat } = useChatStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { message: initialUserMessage, clearData } = useMessageStore();

  const {
    data,
    isSuccess,
    status,
    fetchStatus,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isFetched,
  } = useInfiniteQuery({
    queryKey: [
      "messages",
      selectedChat?.chatId ? selectedChat?.chatId : searchParams.get("chatId"),
    ],

    queryFn: allMessages as any,

    getNextPageParam: (lastPage: any) => {
      const { prevOffset, total, limit } = lastPage;
      // Calculate the next offset based on the limit
      const nextOffset = prevOffset !== undefined ? prevOffset + limit : 0;

      // Check if there are more items to fetch
      if (nextOffset >= total) {
        return;
      }

      return nextOffset;
    },
    initialPageParam: 0,

    // staleTime: 100000 * 60,
  });
  // const messages = data?.pages.flatMap((page) => page.messages);
  // Check if data.pages is available and not empty
  const messages = data?.pages
    ? [].concat(...data.pages.map((page) => page.messages))
    : [];

  // useEffect(() => {
  //   if (isFetching && initialUserMessage) {
  //     const timeoutId = setTimeout(() => {
  //       clearData();
  //     }, 0);

  //     return () => {
  //       clearTimeout(timeoutId);
  //     };
  //   }
  // }, [initialUserMessage, isFetching])
  //   let messages = xmessages;
  //  if (!isFetching) {
  //    messages = xmessages.filter((message) => message._id);
  //    // Now 'updatedMessages' contains messages without null or undefined _id
  //    // You can use 'updatedMessages' directly for your rendering logic
  //  }
  //  console.log({  messages:messages});
  // console.log({ messages, initialUserMessage });

  const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const { isIncomingMessage, isFriendsIncomingMessage } = useIncomingMessageStore();
  useEffect(() => {
    // console.log({ isFetching, isLoading, isFetched });
    if (messageEndRef.current && (isIncomingMessage || isFriendsIncomingMessage)) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    // if (isIncomingMessage || isFriendsIncomingMessage) {
    //   const timeoutId = setTimeout(() => {
    //     useMessageStore.setState({
    //       isIncomingMessage: false,
    //       isFriendsIncomingMessage: false,
    //     });
    //   }, 1000);
    //   return () => {
    //     clearTimeout(timeoutId);
    //   };
    // }
  }, [isIncomingMessage, isFriendsIncomingMessage, messages]);
  useEffect(() => {
    const handleScroll = () => {
      const container = document.getElementById("CustomscrollableTarget");
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container;

        setShowScrollToBottomButton(scrollTop <= -600);
      }
    };

    const container = document.getElementById("CustomscrollableTarget");
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    // Check initial scroll position

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [messages]);

  const scrollToBottom = () => {
    if (messageEndRef.current)
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  return (
    <>
      <div>
        <div
          ref={containerRef}
          // onScroll={handleScroll}
          id="CustomscrollableTarget"
          className="menu p-2 md:p-4 bg-base-200 h-[80vh] overflow-y-scroll overflow-x-hidden flex flex-col-reverse"
        >
          {/* //if no messages then show only the profile */}
          <div className="init_profile">
            {messages.length === 0 && !isLoading && (
              <NoChatProfile user={selectedChat as any} />
            )}
          </div>
          <InfiniteScroll
            dataLength={messages ? messages?.length : 0}
            next={() => {
              fetchNextPage();
            }}
            hasMore={hasNextPage}
            loader={
              // <h1 className="text-4xl ">Loading..........</h1>
              <div className="m-4 h-8 w-8 block mx-auto animate-spin rounded-full border-4 border-blue-500  border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            }
            endMessage={
              !isLoading &&
              messages.length > 10 && (
                <h1 className="text-rose-500 text-center p-2 text-sm md:text-xl">
                  <b>You have seen all messages!</b>
                </h1>
              )
            }
            style={{ display: "flex", flexDirection: "column-reverse" }}
            inverse={true}
            scrollableTarget="CustomscrollableTarget"
            scrollThreshold={1}
          >
            <div className="flex flex-col gap-5 mb-16">
              {isLoading ? (
                <div className="m-4 h-8 w-8 block mx-auto animate-spin rounded-full border-4 border-blue-500  border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              ) : (
                messages &&
                messages.reverse().length > 0 &&
                messages.map((message: any,index:number) => {
                 
                  return (
                    <MessageCard
                      message={message}
                      key={message?._id}
                      isLastSeenMessage={index === findLastSeenMessageIndex(messages)}
                    />
                  );
                })
              )}

              <div ref={messageEndRef} />
            </div>

            {showScrollToBottomButton && (
              <button
                onClick={scrollToBottom}
                className={`fixed flex items-center z-50 ${
                  isSmallDevice ? "bottom-[100px]" : "bottom-24"
                }  md:bottom-48 right-2  md:right-4 bg-gray-800  p-1 md:p-3 rounded-full hover:bg-gray-500 focus:outline-none`}
              >
                <FaArrowDown className="w-3 md:w-5 h-3 md:h-5 mt-1 animate-bounce text-green-400" />
              </button>
            )}
          </InfiniteScroll>
          {/* //show on the top of message */}
          {!hasNextPage && !isFetching && !isLoading && messages.length > 0 && (
            <NoChatProfile user={selectedChat as any} />
          )}
        </div>
      </div>
    </>
  );
};

export default Messages;
