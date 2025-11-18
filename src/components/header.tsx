import React from "react";
import { Send, LogOut } from "lucide-react";
import { Button } from "./button";

interface HeaderProps {
  user?: string;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img className="w-8 h-8" src="/logo.png" alt="Workflow" />
            <h1 className="text-xl font-bold text-gray-900">WhatsApp Sender</h1>
          </div>
          {user && onLogout && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Conectado como</p>
                <p className="text-sm font-semibold text-gray-900">{user}</p>
              </div>
              <Button variant="secondary" icon={LogOut} onClick={onLogout}>
                Sair
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
