"use client";

import * as React from "react";
import { Button } from "../ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import {
  Send,
  Trash2,
  PhoneCall,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  Bot,
  User,
  HeartHandshake,
  RotateCcw,
} from "lucide-react";
import { formatTelLink, formatSmsLink, type Hotline } from "@haven/shared";

export interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatSafetyAlert {
  isImminentCrisis: boolean;
  distressLevel: string;
  triggers?: string[];
  hotline?: Hotline;
}

/**
 * Pure SSE line parser function for streaming responses.
 * Extracted and exported for hermetic testing.
 */
export function parseSseLines(text: string): Array<{ event?: string; data: string }> {
  const results: Array<{ event?: string; data: string }> = [];
  const blocks = text.split(/\r?\n\r?\n/);

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    let eventType: string | undefined;
    const dataLines: string[] = [];

    const lines = trimmed.split(/\r?\n/);
    for (const line of lines) {
      if (line.startsWith("event:")) {
        eventType = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        dataLines.push(line.slice(5).trim());
      }
    }

    if (dataLines.length > 0) {
      results.push({
        event: eventType,
        data: dataLines.join("\n"),
      });
    }
  }

  return results;
}

const DEFAULT_GREETING: ChatMessageItem = {
  id: "greeting-0",
  role: "assistant",
  content:
    "Hello. I'm here with you in this quiet sanctuary. There is no judgment here, and nothing you say is saved or logged. You don't have to carry this alone. How are you feeling in your body and mind right now?",
  timestamp: Date.now(),
};

const SUGGESTED_PROMPTS = [
  "I'm feeling completely overwhelmed right now",
  "I'm having a panic attack and can't slow down",
  "I feel so empty and exhausted of everything",
  "Help me take a few gentle breaths together",
];

export function CrisisChat() {
  const [messages, setMessages] = React.useState<ChatMessageItem[]>([DEFAULT_GREETING]);
  const [inputValue, setInputValue] = React.useState("");
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [safetyAlert, setSafetyAlert] = React.useState<ChatSafetyAlert | null>(null);
  const [errorStatus, setErrorStatus] = React.useState<string | null>(null);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleClearChat = () => {
    // Pure volatile reset — zero residual memory
    setMessages([
      {
        ...DEFAULT_GREETING,
        id: `greeting-${Date.now()}`,
        timestamp: Date.now(),
      },
    ]);
    setSafetyAlert(null);
    setErrorStatus(null);
    setInputValue("");
    inputRef.current?.focus();
  };

  const handleSendMessage = async (userPrompt?: string) => {
    const promptToSend = (userPrompt ?? inputValue).trim();
    if (!promptToSend || isStreaming) return;

    setErrorStatus(null);
    const userMessage: ChatMessageItem = {
      id: `user-${Date.now()}`,
      role: "user",
      content: promptToSend,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    setIsStreaming(true);

    const assistantId = `assistant-${Date.now()}`;
    const initialAssistantMessage: ChatMessageItem = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, initialAssistantMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat API responded with status ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Chat API returned no readable stream body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let streamBuffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        streamBuffer += decoder.decode(value, { stream: true });
        const events = parseSseLines(streamBuffer);

        // Keep unprocessed tail if buffer didn't end with double newline
        if (!streamBuffer.endsWith("\n\n")) {
          const lastDoubleNewline = streamBuffer.lastIndexOf("\n\n");
          if (lastDoubleNewline !== -1) {
            streamBuffer = streamBuffer.slice(lastDoubleNewline + 2);
          }
        } else {
          streamBuffer = "";
        }

        for (const evt of events) {
          if (evt.event === "safety") {
            try {
              const parsedSafety: ChatSafetyAlert = JSON.parse(evt.data);
              if (
                parsedSafety.isImminentCrisis ||
                parsedSafety.distressLevel === "imminent_crisis" ||
                parsedSafety.distressLevel === "severe"
              ) {
                setSafetyAlert(parsedSafety);
              }
            } catch (jsonErr) {
              console.error("Failed to parse safety event payload:", jsonErr);
            }
          } else if (evt.event === "token") {
            try {
              const payload = JSON.parse(evt.data) as { token: string; done: boolean };
              if (payload.token) {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantId
                      ? { ...msg, content: msg.content + payload.token }
                      : msg
                  )
                );
              }
              if (payload.done) {
                setIsStreaming(false);
              }
            } catch (jsonErr) {
              console.error("Failed to parse token payload:", jsonErr);
            }
          }
        }
      }
    } catch (err) {
      console.error("Crisis chat communication error:", err);
      setErrorStatus(
        "We had difficulty reaching the calm response stream. If you are in immediate crisis, please connect to a 24/7 lifeline below right away."
      );
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId && !msg.content
            ? {
                ...msg,
                content:
                  "I want to make sure you are safe. If you need someone immediately, please press the call or text buttons above to reach a live crisis counselor.",
              }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl flex flex-col h-[650px]">
      {/* Chat Header */}
      <CardHeader className="border-b border-slate-800/80 pb-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold text-white">
                Live Calm De-Escalation Chat
              </CardTitle>
              <Badge variant="teal" className="text-[10px] py-0 px-2 font-mono">
                100% Zero-PII Volatile
              </Badge>
            </div>
            <CardDescription className="text-xs text-slate-400">
              Gentle pacing • No chat history saved to disk or server
            </CardDescription>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearChat}
          title="Instantly clear chat memory"
          className="text-slate-400 hover:text-rose-300 gap-1 text-xs px-2.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </Button>
      </CardHeader>

      {/* Escalation Alert Card (Rendered if safety classifier detects high distress or imminent crisis) */}
      {safetyAlert && (
        <div className="m-3 p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 shadow-lg text-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold text-rose-200">
                You are not alone. Please reach out to live human lifelines now.
              </p>
              <p className="text-rose-300/90 mt-0.5">
                {safetyAlert.hotline?.name ?? "Bangladesh National Emergency (999) & Kaan Pete Roi"} — Free, confidential support.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={formatTelLink(safetyAlert.hotline?.primaryPhone ?? "999")}
              className="flex-1 sm:flex-none"
            >
              <Button variant="crisis" size="sm" className="w-full text-xs gap-1.5 py-1 px-3">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call {safetyAlert.hotline?.primaryPhone ?? "999"}</span>
              </Button>
            </a>

            {safetyAlert.hotline?.smsNumber ? (
              <a
                href={formatSmsLink(
                  safetyAlert.hotline.smsNumber,
                  safetyAlert.hotline.smsKeyword ?? "HELP"
                )}
                className="flex-1 sm:flex-none"
              >
                <Button
                  variant="sanctuary"
                  size="sm"
                  className="w-full text-xs gap-1.5 py-1 px-3 border-rose-400/40 text-rose-200 hover:bg-rose-900/60"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-rose-300" />
                  <span>Text {safetyAlert.hotline.smsNumber}</span>
                </Button>
              </a>
            ) : safetyAlert.hotline?.countryCode === "BD" ? (
              <a href="tel:+8801779554391" className="flex-1 sm:flex-none">
                <Button
                  variant="sanctuary"
                  size="sm"
                  className="w-full text-xs gap-1.5 py-1 px-3 border-teal-400/40 text-teal-200 hover:bg-teal-900/60"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-teal-300" />
                  <span>Kaan Pete Roi</span>
                </Button>
              </a>
            ) : null}
          </div>
        </div>
      )}

      {/* Messages Stream Container */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-teal-600/30 text-teal-300 border border-teal-500/30"
              }`}
            >
              {msg.role === "user" ? (
                <User className="w-3.5 h-3.5" />
              ) : (
                <Bot className="w-3.5 h-3.5" />
              )}
            </div>

            <div
              className={`rounded-2xl px-4 py-2.5 max-w-[85%] text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white shadow-md rounded-tr-none"
                  : "bg-slate-800/90 text-slate-100 border border-slate-700/60 shadow-inner rounded-tl-none"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {isStreaming && (
          <div className="flex items-center gap-2 text-xs text-teal-400/80 italic pl-10">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Haven is breathing with you and responding gently...</span>
          </div>
        )}

        {errorStatus && (
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-600/30 text-xs text-amber-200">
            {errorStatus}
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      {/* Suggested Quick Prompts (visible when few messages exist) */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              disabled={isStreaming}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] bg-slate-800/80 hover:bg-slate-700/90 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700 transition-colors disabled:opacity-50 text-left"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 rounded-b-2xl">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            placeholder={
              isStreaming
                ? "Listening..."
                : "Type anything here... take all the time you need"
            }
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 disabled:opacity-50"
          />
          <Button
            variant="default"
            size="sm"
            onClick={() => handleSendMessage()}
            disabled={isStreaming || !inputValue.trim()}
            className="bg-teal-600 hover:bg-teal-500 text-white rounded-xl h-10 px-4 gap-1.5"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
