"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useState } from "react";
import { Send, Phone, Video, MoreVertical, Search } from "lucide-react";
import { mockProperties, mockUser } from "@/lib/mock-data";
import Image from "next/image";
import toast from "react-hot-toast";

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  type: "text" | "image";
}

interface ChatThread {
  id: string;
  propertyId: string;
  property: typeof mockProperties[0];
  otherUser: { name: string; avatar: string };
  lastMessage: string;
  timestamp: string;
  unread: number;
  messages: Message[];
}

const mockThreads: ChatThread[] = [
  {
    id: "thread_1",
    propertyId: mockProperties[0].id,
    property: mockProperties[0],
    otherUser: { name: mockProperties[0].ownerName, avatar: mockProperties[0].ownerAvatar },
    lastMessage: "Yes, the property is still available",
    timestamp: "2 hours ago",
    unread: 2,
    messages: [
      {
        id: "msg_1",
        text: "Hi, is this property still available?",
        senderId: mockUser.id,
        timestamp: "2025-01-15T10:00:00Z",
        type: "text",
      },
      {
        id: "msg_2",
        text: "Yes, the property is still available",
        senderId: mockProperties[0].ownerId,
        timestamp: "2025-01-15T10:15:00Z",
        type: "text",
      },
      {
        id: "msg_3",
        text: "Great! Can I schedule a visit?",
        senderId: mockUser.id,
        timestamp: "2025-01-15T10:20:00Z",
        type: "text",
      },
    ],
  },
  {
    id: "thread_2",
    propertyId: mockProperties[1].id,
    property: mockProperties[1],
    otherUser: { name: mockProperties[1].ownerName, avatar: mockProperties[1].ownerAvatar },
    lastMessage: "The rent is negotiable",
    timestamp: "1 day ago",
    unread: 0,
    messages: [
      {
        id: "msg_4",
        text: "Is the rent negotiable?",
        senderId: mockUser.id,
        timestamp: "2025-01-14T14:00:00Z",
        type: "text",
      },
      {
        id: "msg_5",
        text: "The rent is negotiable",
        senderId: mockProperties[1].ownerId,
        timestamp: "2025-01-14T14:30:00Z",
        type: "text",
      },
    ],
  },
];

export default function ChatPage() {
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(mockThreads[0]);
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (!message.trim() || !selectedThread) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      text: message,
      senderId: mockUser.id,
      timestamp: new Date().toISOString(),
      type: "text",
    };

    // In real app, this would be sent via WebSocket
    selectedThread.messages.push(newMessage);
    selectedThread.lastMessage = message;
    selectedThread.timestamp = "Just now";
    setMessage("");
    toast.success("Message sent");
  };

  return (
    <div className="min-h-screen flex flex-col bg-zh-soft pb-16 md:pb-0">
      <Header />

      <main className="flex-1 py-8 px-4 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto h-[calc(100vh-200px)] md:h-[calc(100vh-200px)]">
          <div className="bg-white rounded-xl shadow-sm border border-zh-gray-light h-full flex flex-col md:flex-row overflow-hidden">
            {/* Threads List */}
            <div className={`w-full md:w-80 border-r border-zh-gray-light flex flex-col ${selectedThread ? 'hidden md:flex' : 'flex'}`}>
              <div className="p-4 border-b border-zh-gray-light">
                <h1 className="text-2xl font-bold text-zh-navy mb-4">Messages</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zh-gray" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    className="w-full pl-10 pr-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {mockThreads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThread(thread)}
                    className={`w-full p-4 border-b border-zh-gray-light hover:bg-zh-soft transition-colors text-left ${selectedThread?.id === thread.id ? "bg-zh-pink/10" : ""
                      }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-zh-navy truncate">
                            {thread.otherUser.name}
                          </h3>
                          {thread.unread > 0 && (
                            <span className="bg-zh-pink text-zh-navy text-xs font-semibold px-2 py-1 rounded-full">
                              {thread.unread}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-zh-gray truncate">{thread.lastMessage}</p>
                        <p className="text-xs text-zh-gray mt-1">{thread.timestamp}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Window */}
            <div className={`flex-1 flex flex-col ${selectedThread ? 'flex' : 'hidden md:flex'}`}>
              {selectedThread ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-zh-gray-light flex items-center justify-between">
                    <button
                      onClick={() => setSelectedThread(null)}
                      className="md:hidden mr-2 p-2 hover:bg-zh-soft rounded-lg"
                    >
                      ← Back
                    </button>
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full" />
                      <div>
                        <h2 className="font-semibold text-zh-navy">{selectedThread.otherUser.name}</h2>
                        <p className="text-sm text-zh-gray">{selectedThread.property.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-zh-soft rounded-lg">
                        <Phone className="w-5 h-5 text-zh-navy" />
                      </button>
                      <button className="p-2 hover:bg-zh-soft rounded-lg">
                        <Video className="w-5 h-5 text-zh-navy" />
                      </button>
                      <button className="p-2 hover:bg-zh-soft rounded-lg">
                        <MoreVertical className="w-5 h-5 text-zh-navy" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zh-soft">
                    {selectedThread.messages.map((msg) => {
                      const isOwn = msg.senderId === mockUser.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${isOwn
                                ? "bg-zh-pink text-zh-navy"
                                : "bg-white text-zh-navy"
                              }`}
                          >
                            <p>{msg.text}</p>
                            <p className="text-xs mt-1 opacity-70">
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-zh-gray-light">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                      />
                      <button
                        onClick={sendMessage}
                        className="p-2 bg-zh-pink text-zh-navy rounded-lg hover:opacity-90"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-zh-gray-dark">Select a conversation to start chatting</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

