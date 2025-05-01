"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import {
  getOrCreateTodayChat,
  getAllChats,
  getLatestSummary,
  addMessageToChat,
  saveSummary,
  exportData,
  importData,
} from "@/lib/chat";
import { Chat } from "@/lib/db";
import { useChatStore } from "@/stores/chat.store";
import { saveAs } from "file-saver";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [summary, setSummary] = useState("");
  const { loading, setLoading } = useChatStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function init() {
      await getOrCreateTodayChat();
      setChats(await getAllChats());
      setSummary((await getLatestSummary()) || "No summary yet.");
    }
    init();
  }, []);

  const handleSubmit = async () => {
    if (!message) return;
    setLoading(true);
    const allChats = await getAllChats();
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, chatHistory: allChats }),
    });
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let aiResponse = "";
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiResponse += decoder.decode(value);
        setResponse(aiResponse);
      }
    }
    await addMessageToChat(message, aiResponse);
    setChats(await getAllChats());
    setMessage("");
    setLoading(false);
  };

  const handleGenerateSummary = async () => {
    setLoading(true);
    const allChats = await getAllChats();
    const res = await fetch("/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatHistory: allChats }),
    });
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let summaryText = "";
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        summaryText += decoder.decode(value);
        setSummary(summaryText);
      }
    }
    await saveSummary(summaryText);
    setLoading(false);
  };

  const handleExport = async () => {
    const data = await exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, "psychologue.json");
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await importData(data);
      setChats(await getAllChats());
      setSummary((await getLatestSummary()) || "No summary yet.");
      alert("Data imported successfully!");
    } catch {
      alert("Failed to import data.");
    }
    setLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="container mx-auto p-4">
      <motion.h1
        className="mb-4 text-3xl font-bold"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        My Psychologue
      </motion.h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
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
                disabled={loading}
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button onClick={handleSubmit} disabled={!message || loading}>
                  {loading ? "Processing..." : "Submit"}
                </Button>
              </motion.div>
              {response && (
                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-semibold">AI Response:</h3>
                  <p>{response}</p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Chat History</CardTitle>
            </CardHeader>
            <CardContent>
              {chats.length === 0 ? (
                <p>No chats yet.</p>
              ) : (
                <ul className="space-y-4">
                  {chats.map((chat) => (
                    <li key={chat.id}>
                      <strong>{chat.date}:</strong>
                      <ul className="ml-4 space-y-2">
                        {chat.messages.map((msg, idx) => (
                          <li key={idx}>
                            <p>
                              <strong>You:</strong> {msg.user}
                            </p>
                            <p>
                              <strong>AI:</strong> {msg.ai}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <motion.div
        className="mt-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Summary of All Chats</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={handleGenerateSummary} disabled={loading}>
                {loading ? "Generating..." : "Generate Summary"}
              </Button>
            </motion.div>
            <p className="mt-4">{summary}</p>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mt-4 flex space-x-4"
      >
        <Button onClick={handleExport} disabled={loading}>
          Export Database
        </Button>
        <div>
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            className="mb-2"
            disabled={loading}
          />
        </div>
      </motion.div>
    </div>
  );
}
