import { useChatStore } from "@/store/useChat";
import useEditReplyStore from "@/store/useEditReply";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";

const ImageMessage = ({
  mutation,
  replymutation,
  editmutation,
  setOpenImageModal,
  openImageModal,
}: {
  mutation: any;
  replymutation: any;
  editmutation: any;
  setOpenImageModal: any;
  openImageModal: any;
}) => {
  const { selectedChat } = useChatStore();
  const [selectedImage, setSelectedImage] = useState<string | null | any>(null);
  const queryclient = useQueryClient();
  const { cancelEdit, cancelReply, isEdit, isReply, isSentImageModalOpen } =
    useEditReplyStore();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReply || isEdit) {
      useEditReplyStore.setState({ isSentImageModalOpen: true });
    }

    const file = e.target.files?.[0];

    setSelectedImage(file as any);
    setOpenImageModal(true);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setOpenImageModal(false);
  };

  const handleSubmit = () => {
    if (!selectedChat?.chatId) {
      return;
    }
    if (isReply) {
      const messageData = {
        chatId: selectedChat?.chatId,
        messageId: isReply?._id,
        type: "image",
        image: selectedImage,
      };
      replymutation.mutateAsync(messageData as any);
      cancelReply();
      useEditReplyStore.setState({ isSentImageModalOpen: false });
      return;
    } else if (isEdit) {
      //edit image message
      const editData = {
        messageId: isEdit?._id,
        type: "image",
        image: selectedImage,
      };
      editmutation.mutateAsync(editData as any);
      cancelEdit();
      useEditReplyStore.setState({ isSentImageModalOpen: false });
      return;
    } else {
      const messageData = {
        chatId: selectedChat?.chatId,
        type: "image",
        image: selectedImage,
      };
      mutation.mutateAsync(messageData as any);
    }
  };
  return (
    <div
      className={`absolute ${
        selectedImage ? "-top-[550px] " : "-top-[350px] "
      } left-0 bg-gray-800 w-[300px] p-4 rounded-xl  duration-500 ${
        openImageModal
          ? "translate-y-1 scale-100 opacity-100"
          : "translate-y-0 scale-0 opacity-0"
      }`}
    >
      {selectedImage ? (
        <div className="mt-4">
          <div className="h-[220px] w-auto">
            <Image
              src={URL.createObjectURL(selectedImage)}
              width={150}
              height={150}
              alt="Selected"
              className="w-full h-full object-cover mx-auto rounded m-2"
            />
          </div>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <span className="btn float-right w-full bg-lime-500">Change</span>
          </label>
          <button
            disabled={
              mutation.isPending || replymutation.isPending || editmutation.isPending
            }
            className="btn w-full m-2"
            onClick={handleSubmit}
          >
            {mutation.isPending || replymutation.isPending || editmutation.isPending
              ? "Sending"
              : "Sent"}
          </button>
          <button className="btn float-right m-2 bg-rose-500" onClick={handleCloseModal}>
            Close
          </button>
        </div>
      ) : (
        <div>
          {" "}
          {/*   className={`${!selectedImage ? "hidden" : "block"}`} */}
          <label className="cursor-pointer p-6">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <div>
              <AiOutlineCloudUpload className="block text-sky-500 mx-auto h-20 w-20 my-2" />
              <p className="text-[8px] md:text-[10px]">
                Select an image to send (png, jpg, jpeg)
              </p>
            </div>
          </label>
        </div>
      )}
    </div>
  );
};

export default ImageMessage;
