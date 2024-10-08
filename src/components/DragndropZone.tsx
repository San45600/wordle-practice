"use client";

import { useEffect, useState } from "react";
import { MdAudioFile } from "react-icons/md";
import { toast } from "sonner";

export function DragndropZone({
  onFileChange,
  children
}: {
  onFileChange: (file: File) => void;
  children: JSX.Element | string
}) {
  const [error, setError] = useState<string>();
  const [file, setFile] = useState<File>();
  const [isEnter, setIsEnter] = useState(false);

  useEffect(() => {
    if (!file) return;
    onFileChange(file);
  }, [file]);

  return (
    <label htmlFor="uploadFile" className="flex w-full justify-center">
      <input
        id="uploadFile"
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => {
          if (!e.target.files) return;

          const fileType = e.target.files[0].type;
          if (!fileType.startsWith("application/json")) {
            setError("Please upload an JSON.");
            setFile(undefined);
            return;
          }
          setFile(e.target.files[0]);
          setError("");
        }}
      />
      <div
        className={`w-full h-[72px] border-2 items-center rounded-3xl flex justify-center text-black overflow-hidden ${
          isEnter ? "border-green-400 " : "border-[#F4F4F4]"
        } ${!file ? "border-dashed" : ""}
        `}
        id="dropzone"
        onDragEnter={(e) => {
          e.preventDefault();
          setIsEnter(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsEnter(false);
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsEnter(false);
          const fileType = e.dataTransfer.files[0].type;
          if (!fileType.startsWith("application/json")) {
            toast.error("Please upload an JSON.");
            setFile(undefined);
            return;
          }
          setFile(e.dataTransfer.files[0]);
          setError("");
        }}
      >
        <div
          className={`flex flex-col h-full w-full items-center justify-center pointer-events-none gap-8 ${
            isEnter ? "text-green-400" : "text-[#F4F4F4]"
          }`}
        >
          <div className="items-center flex mx-4 text-center pointer-events-none text-lg gap-2 ">
            {!!file ? (
              file.name
            ) : (
              <>
                <div className="line-clamp-1 sm:text-base text-xs">
                  {children}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </label>
  );
}
