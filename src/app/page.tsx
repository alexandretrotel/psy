"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { canChatToday, getAllChats, getLatestSummary } from "@/lib/chat";
import { ChatSelect } from "@/db/zod";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [chats, setChats] = useState<ChatSelect[]>([]);
  const [summary, setSummary] = useState("");
  const [canChat, setCanChat] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      setCanChat(await canChatToday());
      setChats(await getAllChats());
      setSummary((await getLatestSummary()) || "No summary yet.");
    }
    init();
  }, []);

  const handleSubmit = async () => {
    if (!canChat) {
      alert("You've already chatted today!");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      setResponse(data.response);
      setChats(await getAllChats());
      setCanChat(false);
    }
    setLoading(false);
  };

  const handleGenerateSummary = async () => {
    setLoading(true);
    const res = await fetch("/api/summary");
    const { summary } = await res.json();
    setSummary(summary);
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl font-bold">My Psychologue</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today’s Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your thoughts..."
              className="mb-4"
              disabled={!canChat || loading}
            />
            <Button
              onClick={handleSubmit}
              disabled={!canChat || !message || loading}
            >
              {loading ? "Processing..." : "Submit"}
            </Button>
            {response && (
              <div className="mt-4">
                <h3 className="font-semibold">AI Response:</h3>
                <p>{response}</p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Chat History</CardTitle>
          </CardHeader>
          <CardContent>
            {chats.length === 0 ? (
              <p>No chats yet.</p>
            ) : (
              <ul className="space-y-2">
                {chats.map((chat) => (
                  <li key={chat.id}>
                    <strong>{chat.date}:</strong> {chat.content}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Summary of All Chats</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGenerateSummary} disabled={loading}>
            {loading ? "Generating..." : "Generate Summary"}
          </Button>
          <p className="mt-4">{summary}</p>
        </CardContent>
      </Card>
      <Button className="mt-4" asChild>
        <a href="/api/export" download>
          Export Database
        </a>
      </Button>
    </div>
  );
}
