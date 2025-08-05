import { useState, useRef, useEffect } from "react";
import Head from "next/head";

// メッセージの型定義
interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function Home() {
  // メッセージの状態管理
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Dr. Tanakaです。ご質問がございましたら、お気軽にお聞きください。",
    },
  ]);

  // 入力フィールドの状態管理
  const [input, setInput] = useState("");

  // ローディング状態の管理（APIからの応答待ち）
  const [isLoading, setIsLoading] = useState(false);

  // 入力フィールドのref
  const inputRef = useRef<HTMLInputElement>(null);

  // メッセージリストの最下部へのスクロール用ref
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // チャット履歴をクリアする関数
  const clearChatHistory = () => {
    setMessages([
      {
        sender: "bot",
        text: "こんにちは！Dr. Tanakaです。医学に関するご質問がございましたら、お気軽にでお聞きください。",
      },
    ]);
  };

  // 初回レンダリング時に入力欄にフォーカス
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // メッセージが更新された時、またはローディング状態が変わった時に自動スクロール
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    // ローディングが終わったら入力欄にフォーカスを戻す
    if (!isLoading) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [messages, isLoading]);

  // メッセージ送信ハンドラ
  const handleSend = async () => {
    // 入力が空、またはローディング中の場合は何もしない
    if (!input.trim() || isLoading) return;

    // ユーザーメッセージをメッセージリストに追加
    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput(""); // 入力フィールドをクリア
    setIsLoading(true); // ローディング開始

    try {
      // APIにメッセージを送信
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: input }],
        }),
      });

      // APIからの応答をパース
      const data = await res.json();
      // ボットの応答をメッセージリストに追加
      const botMessage: Message = { sender: "bot", text: data.result };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("API呼び出し失敗:", err);
      // エラーメッセージをボットとして表示
      const errorMessage: Message = {
        sender: "bot",
        text: "申し訳ございません。少々お待ちください。もう一度お試しいただけますでしょうか。",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false); // ローディング終了
    }
  };

  return (
    <>
      {/* 白い背景 */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        }}
      />

      {/* メインコンテナ */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: 0,
          padding: 0,
        }}
      >
        <Head>
          <title>Dr. Tanaka - Medical Consultation</title>
        </Head>

        {/* チャットコンテナ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            height: "90%",
            maxHeight: "900px",
            width: "750px",
            padding: "32px",
            paddingTop: "80px",
            boxSizing: "border-box",
            color: "#1f2937",
            backdropFilter: "blur(20px)",
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "24px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            position: "relative",
          }}
        >
          {/* 会社ロゴ + タイトル - チャットコンテナ内の上部 */}
          <div
            style={{
              position: "absolute",
              top: "32px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              zIndex: 10,
            }}
          >
            <img
              src="/company-logo.svg"
              alt="Company Logo"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                objectFit: "contain",
              }}
            />
            <div
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#374151",
                letterSpacing: "0.025em",
              }}
            >
              Dr. TANAKA
            </div>
            {/* クリアボタン */}
            <button
              onClick={clearChatHistory}
              style={{
                marginLeft: "16px",
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: "500",
                border: "1px solid #d1d5db",
                background: "rgba(255, 255, 255, 0.8)",
                color: "#6b7280",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                e.currentTarget.style.color = "#dc2626";
                e.currentTarget.style.borderColor = "#fca5a5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)";
                e.currentTarget.style.color = "#6b7280";
                e.currentTarget.style.borderColor = "#d1d5db";
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
              クリア
            </button>
          </div>

          {/* チャットメッセージ表示エリア */}
          <div
            style={{
              flex: 1,
              width: "100%",
              overflowY: "auto",
              background: "rgba(248, 250, 252, 0.8)",
              borderRadius: "20px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              boxShadow: "inset 0 0 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginBottom: "32px",
                  width: "100%",
                  justifyContent: msg.sender === "user" ? "flex-start" : "flex-start",
                  flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                  animation: "slideIn 0.4s ease-out",
                }}
              >
                {/* アバター */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    margin: msg.sender === "user" ? "0 0 0 16px" : "0 16px 0 0",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      fontWeight: "600",
                      background: msg.sender === "user"
                        ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                        : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      color: "#ffffff",
                      boxShadow: "0 8px 32px rgba(99, 102, 241, 0.3)",
                      border: "2px solid rgba(255, 255, 255, 0.2)",
                      marginBottom: "4px",
                    }}
                  >
                    {msg.sender === "user" ? "👤" : "👨‍⚕️"}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#9ca3af",
                      fontWeight: "500",
                      textAlign: "center",
                    }}
                  >
                    {msg.sender === "user" ? "YOU" : "Dr. TANAKA"}
                  </div>
                </div>

                {/* メッセージテキスト */}
                <div
                  style={{
                    maxWidth: "75%",
                    padding: "20px 24px",
                    wordWrap: "break-word",
                    fontSize: "16px",
                    lineHeight: "1.6",
                    borderRadius: "20px",
                    position: "relative",
                    background: msg.sender === "user"
                      ? "linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%)"
                      : "rgba(248, 250, 252, 0.95)",
                    color: msg.sender === "user" ? "#ffffff" : "#1e293b",
                    boxShadow: msg.sender === "user"
                      ? "0 12px 32px rgba(16, 185, 129, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                      : "0 12px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(203, 213, 225, 0.5)",
                    border: msg.sender === "user"
                      ? "1px solid rgba(255, 255, 255, 0.2)"
                      : "1px solid rgba(203, 213, 225, 0.3)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* ローディング中の表示 */}
            {isLoading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginBottom: "32px",
                  width: "100%",
                  justifyContent: "flex-start",
                  flexDirection: "row",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    margin: "0 16px 0 0",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      fontWeight: "600",
                      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      color: "#ffffff",
                      boxShadow: "0 8px 32px rgba(99, 102, 241, 0.3)",
                      border: "2px solid rgba(255, 255, 255, 0.2)",
                      marginBottom: "4px",
                    }}
                  >
                    👨‍⚕️
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#9ca3af",
                      fontWeight: "500",
                      textAlign: "center",
                    }}
                  >
                    Dr. TANAKA
                  </div>
                </div>

                <div
                  style={{
                    maxWidth: "75%",
                    padding: "20px 24px",
                    wordWrap: "break-word",
                    fontSize: "16px",
                    lineHeight: "1.6",
                    borderRadius: "20px",
                    position: "relative",
                    background: "rgba(248, 250, 252, 0.95)",
                    color: "#1e293b",
                    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(203, 213, 225, 0.5)",
                    border: "1px solid rgba(203, 213, 225, 0.3)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}>
                    <div style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#6366f1",
                      animation: "pulse1 1.4s infinite ease-in-out",
                    }}></div>
                    <div style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#6366f1",
                      animation: "pulse2 1.4s infinite ease-in-out",
                    }}></div>
                    <div style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#6366f1",
                      animation: "pulse3 1.4s infinite ease-in-out",
                    }}></div>
                  </div>
                </div>
              </div>
            )}
            {/* 自動スクロールのターゲット */}
            <div ref={endOfMessagesRef} />
          </div>

          {/* 入力エリア */}
          <div
            style={{
              display: "flex",
              width: "100%",
              background: "rgba(248, 250, 252, 0.95)",
              borderRadius: "20px",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(203, 213, 225, 0.3)",
              overflow: "hidden",
              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.1)",
              padding: "8px",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                  handleSend();
                }
              }}
              placeholder="Dr. Tanakaにご質問をどうぞ..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: "16px 20px",
                fontSize: "16px",
                border: "none",
                backgroundColor: "transparent",
                color: "#1e293b",
                borderRadius: "16px",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              style={{
                padding: "12px 16px",
                border: "none",
                background: (!isLoading && input.trim())
                  ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                  : "rgba(148, 163, 184, 0.5)",
                color: "#ffffff",
                borderRadius: "12px",
                cursor: (!isLoading && input.trim()) ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "48px",
                boxShadow: (!isLoading && input.trim())
                  ? "0 8px 24px rgba(99, 102, 241, 0.3)"
                  : "none",
              }}
            >
              {isLoading ? (
                <div style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  borderTop: "2px solid #ffffff",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}></div>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* グローバルスタイル */}
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
        
        #__next {
          width: 100%;
          height: 100%;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse1 {
          0%, 80%, 100% {
            transform: scale(0.6);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes pulse2 {
          0%, 80%, 100% {
            transform: scale(0.6);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes pulse3 {
          0%, 80%, 100% {
            transform: scale(0.6);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}