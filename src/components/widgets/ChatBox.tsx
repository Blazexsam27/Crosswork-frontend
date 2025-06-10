import { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageSquare,
  X,
  Minimize2,
  Maximize2,
  Send,
  Search,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import type { Message, MessageFromDb } from "@/types/chatbox/chatBoxTypes";
import { getFromLocalStorage } from "@/utils/webstorage.utls";
import chatService from "@/services/chat.service";
import type { UserType } from "@/types/user/userTypes";
import userService from "@/services/user.service";
import useChatSocket from "../../hooks/useChatSocket";

export default function ChatBox() {
  const user = getFromLocalStorage("user");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<UserType | null>(
    null
  );
  const [connections, setConnections] = useState<UserType[]>([]);
  const [chats, setChats] = useState<
    Record<string, Array<MessageFromDb | Message>>
  >({});
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showConnectionsList, setShowConnectionsList] = useState(true);

  const [, setMessages] = useState<MessageFromDb[]>([]);

  // Filter connections based on search term
  const filteredConnections = connections.filter((connection) =>
    connection.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Type the socket event handlers
  const handleIncomingMessage = useCallback((message: Message) => {
    console.log("msg---", message);
    setChats((prev) => ({
      ...prev,
      [message.sender]: [...(prev[message.sender] || []), message],
    }));
  }, []);

  const { sendMessage } = useChatSocket(
    user._id,
    handleIncomingMessage,
    (messageId) =>
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, read: true } : msg
        )
      )
  );

  // Scroll to bottom of messages when new message is added or chat is opened
  useEffect(() => {
    if (messagesEndRef.current && selectedConnection) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedConnection, chats]);

  const fetchMessages = async () => {
    try {
      if (selectedConnection === null) return;
      const response = await chatService.getMessages(
        user._id,
        selectedConnection._id
      );

      const mp: Record<string, MessageFromDb[]> = {};

      response.forEach((msg: MessageFromDb) => {
        if (!mp[selectedConnection._id]) {
          mp[selectedConnection._id] = [];
        }
        mp[selectedConnection._id].push(msg);
      });

      console.log("mp", mp);
      setChats(mp);
      setMessages(response);
    } catch (error) {
      console.error("Error fetching messages:", error);
      ``;
    }
  };

  const fetchConnections = async () => {
    try {
      const response = await userService.getAllConnections(user._id);
      setConnections(response.connections);
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [selectedConnection]);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConnection) return;

    sendMessage(newMessage, selectedConnection._id, user._id);

    const newMsg: Message = {
      sender: user._id,
      receiver: selectedConnection._id,
      content: newMessage.trim(),
    };

    setChats((prev) => ({
      ...prev,
      [selectedConnection._id]: [
        ...(prev[selectedConnection._id] || []),
        newMsg,
      ],
    }));
    setNewMessage("");
  };

  // Handle opening a chat with a connection
  const handleOpenChat = (connection: UserType) => {
    setSelectedConnection(connection);
    setIsMinimized(false);

    // Mark messages as read
    // if (connection.unreadCount && connection.unreadCount > 0) {
    //   setConnections((prev) =>
    //     prev.map((conn) =>
    //       conn.id === connection.id ? { ...conn, unreadCount: 0 } : conn
    //     )
    //   );

    //   setChats((prev) => ({
    //     ...prev,
    //     [connection.id]: (prev[connection.id] || []).map((msg) => ({
    //       ...msg,
    //       read: true,
    //     })),
    //   }));
    // }
  };

  // Format timestamp to a readable format
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Toggle the chat box
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    setIsMinimized(false);
  };

  // Toggle minimize/maximize
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Close the chat
  const closeChat = () => {
    setIsChatOpen(false);
    setSelectedConnection(null);
  };

  // Back to connections list
  const backToConnections = () => {
    setSelectedConnection(null);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={`flex items-center justify-center p-3 rounded-full shadow-lg transition-all duration-200 ${
          isChatOpen
            ? "bg-gray-600"
            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        }`}
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </button>

      {/* Chat Box */}
      {isChatOpen && (
        <div
          className={`absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-200 overflow-hidden ${
            isMinimized ? "w-72 h-12" : "w-80 sm:w-96 h-[480px]"
          }`}
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 flex items-center justify-between">
            {selectedConnection ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={backToConnections}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="relative">
                  <img
                    src={selectedConnection.profilePic || "/placeholder.svg"}
                    alt={selectedConnection.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  {/* <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                      selectedConnection.status === "online"
                        ? "bg-green-500"
                        : selectedConnection.status === "away"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                    }`}
                  ></span> */}
                </div>
                <span className="font-medium truncate">
                  {selectedConnection.name}
                </span>
              </div>
            ) : (
              <span className="font-medium">Messages</span>
            )}
            <div className="flex items-center space-x-1">
              <button
                onClick={toggleMinimize}
                className="p-1 hover:bg-white/10 rounded"
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={closeChat}
                className="p-1 hover:bg-white/10 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Connections List */}
              {!selectedConnection && (
                <div className="flex flex-col h-[calc(480px-48px)]">
                  <div className="p-3 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search messages"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <div className="p-3 border-b flex items-center justify-between">
                      <span className="font-medium text-sm text-gray-700">
                        Recent Messages
                      </span>
                      <button
                        onClick={() =>
                          setShowConnectionsList(!showConnectionsList)
                        }
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {showConnectionsList ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {showConnectionsList && (
                      <div className="divide-y divide-gray-100">
                        {filteredConnections.length > 0 ? (
                          filteredConnections.map((connection) => (
                            <div
                              key={connection._id}
                              onClick={() => handleOpenChat(connection)}
                              className="p-3 flex items-center space-x-3 hover:bg-gray-50 cursor-pointer"
                            >
                              <div className="relative">
                                <img
                                  src={
                                    connection.profilePic || "/placeholder.svg"
                                  }
                                  alt={connection.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                {/* <span
                                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                    connection.status === "online"
                                      ? "bg-green-500"
                                      : connection.status === "away"
                                      ? "bg-yellow-500"
                                      : "bg-gray-500"
                                  }`}
                                ></span> */}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-gray-900 truncate">
                                    {connection.name}
                                  </span>
                                  {/* {connection.unreadCount ? (
                                    <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                      {connection.unreadCount}
                                    </span>
                                  ) : (
                                    connection.lastSeen && (
                                      <span className="text-xs text-gray-500">
                                        {connection.lastSeen}
                                      </span>
                                    )
                                  )} */}
                                </div>
                                <p className="text-sm text-gray-500 truncate">
                                  {chats[connection._id]?.[
                                    chats[connection._id]?.length - 1
                                  ]?.content || "Start a conversation"}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            No connections found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              {selectedConnection && (
                <div className="flex flex-col h-[calc(480px-48px)]">
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {chats[selectedConnection._id]?.length > 0 ? (
                      chats[selectedConnection._id].map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${
                            message.sender === user._id
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg px-3 py-2 ${
                              message.sender === user._id
                                ? "bg-blue-600 text-white rounded-br-none"
                                : "bg-gray-100 text-gray-800 rounded-bl-none"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.sender === user._id
                                  ? "text-blue-100"
                                  : "text-gray-500"
                              }`}
                            >
                              {message.createdAt
                                ? formatTime(message.createdAt)
                                : formatTime(new Date().toISOString())}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-gray-500 text-center">
                          No messages yet.
                          <br />
                          Start a conversation!
                        </p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-3 border-t">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
