"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { exportData, importData } from "@/lib/chat";
import { saveAs } from "file-saver";
import { toast } from "sonner";

interface ExportImportControlsProps {
  onDataImported: () => void;
}

export function Controls({ onDataImported }: ExportImportControlsProps) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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
    <div className="flex gap-4">
      <Button size="sm" onClick={handleExport} disabled={loading}>
        Export Data
      </Button>

      <div className="relative">
        <Button
          size="sm"
          variant="secondary"
          disabled={loading}
          onClick={triggerFileSelect}
        >
          Import Data
        </Button>
        <input
          id="file-input"
          type="file"
          ref={fileInputRef}
          onChange={handleImport}
          accept=".json"
          className="hidden"
          disabled={loading}
        />
      </div>
    </div>
  );
}
