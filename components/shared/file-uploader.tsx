"use client";

import { useCallback } from "react";
import Image from "next/image";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";

import { Button } from "../ui/button";
import { convertFileToUrl } from "@/lib/utils";

type FileUploaderProps = {
  imageUrl: string;
  onFieldChange: (value: string) => void;
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
};

export default function FileUploader({
  imageUrl,
  onFieldChange,
  setImageFiles,
}: FileUploaderProps) {
  // handle dropzone images by updating state and create file URL
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImageFiles(acceptedFiles);
    onFieldChange(convertFileToUrl(acceptedFiles[0]));
    console.log(convertFileToUrl(acceptedFiles[0]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // dropzone config
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(["image/*"]),
  });

  return (
    <div
      {...getRootProps()}
      className="flex-center bg-dark-3 h-72 cursor-pointer flex-col overflow-hidden rounded-xl bg-gray-50"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {/* render uploaded image if available or dropzone */}
      {imageUrl ? (
        <div className="flex h-full w-full flex-1 justify-center">
          <Image
            src={imageUrl}
            alt="image"
            width={250}
            height={250}
            className="w-full object-cover object-center"
          />
        </div>
      ) : (
        <div className="flex-center flex-col py-5 text-gray-500">
          <Image
            src="/assets/icons/upload.svg"
            alt="file upload"
            width={77}
            height={77}
            className="h-[77px] w-[77px]"
          />
          <h3 className="my-2">Drag photo here</h3>
          <p className="p-medium-12 mb-4">SVG ,PNG, JPG</p>
          <Button type="button" className="rounded-full">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
}
