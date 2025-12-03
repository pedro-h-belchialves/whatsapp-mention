"use client";

import { ChartArea, Grab, House, SpeakerIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const Sidebar = () => {
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);
  return (
    <div className="lg:h-screen h-fit fixed border-t border-zinc-200 justify-center lg:justify-start    lg:shadow-lg  z-10 bottom-0 lg:left-0 lg:top-0 w-full lg:w-40 flex lg:flex-col bg-white">
      <div className="flex lg:pt-20  lg:flex-col ">
        <a href="/audience">
          <SidebarItem
            isSelected={currentPath === "/audience"}
            page="Audiência"
          >
            <ChartArea className="w-5 h-5 " />
          </SidebarItem>
        </a>
        <a href="/mention">
          <SidebarItem isSelected={currentPath === "/mention"} page="Mencionar">
            <SpeakerIcon className="w-5 h-5 " />
          </SidebarItem>
        </a>
      </div>
    </div>
  );
};

const SidebarItem = ({
  page,
  children,
  isSelected,
}: {
  page: string;
  children?: React.ReactNode;
  isSelected?: boolean;
}) => {
  return (
    <div
      className={` w-full border-b border-zinc-200 ${
        isSelected ? "bg-gray-200 !text-green-950" : " text-zinc-500"
      } flex gap-2 items-center justify-left p-4 hover:bg-zinc-100`}
    >
      {children}
      <span className="">{page}</span>
    </div>
  );
};
