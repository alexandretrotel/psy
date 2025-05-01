import Link from "next/link";
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface MarkdownProps {
  text: string;
}

export const Markdown = ({ text }: MarkdownProps) => {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mt-8 mb-4 text-3xl font-bold">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-6 mb-3 text-2xl font-semibold">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-5 mb-2 text-xl font-semibold">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-4 mb-2 text-lg font-semibold">{children}</h4>
          ),
          p: ({ children }) => (
            <p className="my-4 text-base leading-relaxed">{children}</p>
          ),
          a: ({ href, children }) => (
            <Link
              href={href || ""}
              className="text-blue-500 transition-colors duration-200 hover:text-blue-700 hover:underline"
            >
              {children}
            </Link>
          ),
          li: ({ children }) => (
            <li className="my-1 text-base leading-relaxed">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 rounded-r border-l-4 border-gray-300 bg-gray-50 py-2 pl-4 italic dark:border-gray-700 dark:bg-gray-900">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded-md bg-gray-100 px-1.5 py-0.5 font-mono text-sm dark:bg-gray-800">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-foreground text-background my-4 overflow-x-auto rounded-lg p-4">
              {children}
            </pre>
          ),
          ul: ({ children }) => (
            <ul className="my-4 list-disc space-y-1 pl-6">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-4 list-decimal space-y-1 pl-6">{children}</ol>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
        }}
        rehypePlugins={[rehypeRaw]}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};
