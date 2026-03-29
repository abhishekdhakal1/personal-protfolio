import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { apiClient, endpoints } from "@/utils/api";
import {
  MdLogout as LogOut,
  MdMail as Mail,
  MdPhone as Phone,
  MdSearch as Search,
  MdSearch as SearchIcon,
  MdDelete as Trash2,
  MdCheckCircle as CheckCircle,
  MdError as AlertCircle,
} from "react-icons/md";

interface Message {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  important: boolean;
  createdAt: string;
}

export function AdminPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "important">("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ unread: 0, total: 0 });
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 10 };
      if (filter === "unread") params.read = "false";
      if (filter === "important") params.important = "true";
      if (search) params.search = search;

      const response = await apiClient.get(endpoints.messages.list, { params });
      setMessages(response.data.messages);
      setTotalPages(response.data.pagination.pages);
      setStats(response.data.stats);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page, filter, search]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/admin-login");
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await apiClient.delete(endpoints.messages.delete(id));
      setMessages(messages.filter((m) => m._id !== id));
      setSelectedMessage(null);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiClient.patch(endpoints.messages.markAsRead(id));
      setMessages(
        messages.map((m) => (m._id === id ? { ...m, read: true } : m)),
      );
    } catch (error) {
      console.error("Failed to mark message as read:", error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-slate-400">
              Manage messages from your "Get in Touch" form
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">
              Total Messages
            </div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">
              Unread Messages
            </div>
            <div className="text-2xl font-bold text-cyan-400">
              {stats.unread}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Important</div>
            <div className="text-2xl font-bold text-orange-400">
              {messages.filter((m) => m.important).length}
            </div>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages by name, email, subject..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => {
                  setFilter("all");
                  setPage(1);
                }}
              >
                All
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "outline"}
                onClick={() => {
                  setFilter("unread");
                  setPage(1);
                }}
              >
                Unread
              </Button>
              <Button
                variant={filter === "important" ? "default" : "outline"}
                onClick={() => {
                  setFilter("important");
                  setPage(1);
                }}
              >
                Important
              </Button>
            </div>
          </div>
        </Card>

        {/* Messages List and Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <Card className="divide-y max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-muted-foreground">
                  Loading...
                </div>
              ) : messages.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No messages found
                </div>
              ) : (
                messages.map((msg) => (
                  <button
                    key={msg._id}
                    onClick={() => setSelectedMessage(msg)}
                    className={`w-full p-4 text-left hover:bg-slate-700/50 transition-colors ${
                      selectedMessage?._id === msg._id ? "bg-cyan-500/20" : ""
                    } ${msg.read ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-white">
                          {msg.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {msg.email}
                        </div>
                      </div>
                      {msg.important && (
                        <AlertCircle className="h-4 w-4 text-orange-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-300 truncate">
                      {msg.subject || msg.message}
                    </p>
                    <div className="text-xs text-slate-500 mt-1">
                      {formatDate(msg.createdAt)}
                    </div>
                  </button>
                ))
              )}
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      From
                    </div>
                    <div className="text-lg font-semibold">
                      {selectedMessage.name}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        Email
                      </div>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-cyan-400 hover:underline break-all"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground mb-1">
                        Date
                      </div>
                      <div>{formatDate(selectedMessage.createdAt)}</div>
                    </div>
                  </div>

                  {selectedMessage.subject && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Subject
                      </div>
                      <div className="text-base font-medium">
                        {selectedMessage.subject}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Message
                    </div>
                    <div className="bg-slate-700/50 rounded p-3 whitespace-pre-wrap text-sm leading-relaxed">
                      {selectedMessage.message}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    {!selectedMessage.read && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(selectedMessage._id)}
                        className="gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Mark as Read
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(selectedMessage._id)}
                      className="gap-2 ms-auto"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-6 text-center text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Select a message to view details</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
