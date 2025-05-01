"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exportData, importData } from "@/lib/chat";
import { useChatStore } from "@/stores/chat.store";
import { saveAs } from "file-saver";
import { motion } from "motion/react";
import { toast } from "sonner";

interface ExportImportControlsProps {
  onDataImported: () => void;
}

export function ExportImportControls({
  onDataImported,
}: ExportImportControlsProps) {
  const { loading, setLoading } = useChatStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    setLoading(true);
    try {
      const data = await exportData();

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      saveAs(blob, "psychologue.json");

      toast.success("Data exported successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to export data.",
      );
    }
    setLoading(false);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      await importData(data);
      onDataImported();

      toast.success("Data imported successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to import data.",
      );
    }
    setLoading(false);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <motion.div
      className="flex gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Button onClick={handleExport} disabled={loading}>
        Export Data
      </Button>

      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".json"
        className="w-auto"
        disabled={loading}
      />
    </motion.div>
  );
}
