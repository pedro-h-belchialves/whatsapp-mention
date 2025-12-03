"use client";

import React, { useEffect, useState } from "react";
import { Send, LogOut, User } from "lucide-react";
import { Button } from "./button";
import { deleteCookie } from "cookies-next";

interface HeaderProps {
  user?: string;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [userName, setUserName] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userName");
    localStorage.removeItem("evolutionInstance");

    deleteCookie("userPhone");
    window.location.replace("/login");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("userName");
    if (storedUser) {
      setUserName(storedUser);
    }
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img className="w-8 h-8" src="/logo.png" alt="Workflow" />
            <h1 className="text-xl font-bold text-gray-900">WhatsApp Sender</h1>
          </div>

          <div className="flex  items-center-  gap-4">
            <div className="flex items-center gap-2">
              <div className="text-sm w-8 h-8 bg-zinc-200 rounded-full flex justify-center items-center text-gray-600">
                <User className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold text-gray-900">{userName}</p>
            </div>
            <button
              className="flex hover:text-red-900 cursor-pointer justify-center items-center gap-2 text-sm font-semibold text-gray-900"
              onClick={handleLogout}
            >
              sair
              <LogOut className="w-4 h-4"></LogOut>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
