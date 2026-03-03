import { MoodBoardImage } from "@/hooks/use-styles";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import React from "react";

// 1. Define Props as an interface for the functional component
type Props = {
  image: MoodBoardImage;
  removeImage: (id: string) => void;
  xOffset: number;
  yOffset: number;
  rotation: number;
  zIndex: number;
  marginLeft: string;
  marginTop: string;
};

const UploadStatus = (image: {
  uploading: boolean;
  uploaded: boolean;
  error?: string;
}) => {
  if (image.uploading) {
    return (
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
        <Loader2 className="w-6 h-6 text-white animate-spin" />
      </div>
    );
  }
  if (image.uploaded) {
    return (
      <div className="absolute top-2 right-2">
        <CheckCircle className="w-5 h-5 text-green-400" />
      </div>
    );
  }

  if (image.error) {
    return (
      <div className="absolute top-2 right-2">
        <AlertCircle className="w-5 h-5 text-red-400" />
      </div>
    );
  }
  return null;
};

const ImagesBoard = ({
  image,
  removeImage,
  xOffset,
  yOffset,
  rotation,
  zIndex,
  marginLeft,
  marginTop,
}: Props) => {
  // 3. Implement actual rendering logic instead of calling self
  return (
    <>
      <div
        key={`board-${image.id}`}
        className="absolute group"
        style={{
          transform: `translate(${xOffset}px, ${yOffset}px) rotate(${rotation}deg)`,
          zIndex: zIndex,
          left: "50%",
          top: "50%",
          marginLeft: marginLeft, // Half of mobile image width (160px / 2)
          marginTop: marginTop, // Half of mobile image height (192px / 2)
        }}
      >
        <div className="relative w-40 h-48 rounded-2xl overflow-hidden bg-white shadow-xl border border-border/20 hover:scale-105 transition-all duration-200">
          <Image
            src={image.preview}
            alt="Mood board image"
            fill
            className="object-cover"
          />
          <UploadStatus
            uploaded={image.uploaded}
            uploading={image.uploading}
            error={image.error}
          />
        </div>
      </div>
    </>
  );
};

export default ImagesBoard;
