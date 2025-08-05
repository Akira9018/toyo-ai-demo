import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "こんにちは！TANAKA INFO AIへようこそ。",
    },
  ]);
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    const botMessage: Message = { sender: "bot", text: data.message };
    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <>
      {/* 背景動画：これを一番上に固定 */}
      <video
        autoPlay
        muted
        loop
        id="background-video"
        style={{
          position: "fixed",
          right: 0,
          bottom: 0,
          minWidth: "100%",
          minHeight: "100%",
          zIndex: -1,
          objectFit: "cover",
        }}
      >
        <source src="/space.mp4" type="video/mp4" />
      </video>

      <div className={styles.container}>
        <Head>
          <title>TANAKA INFO AI</title>
        </Head>

        <div className={styles.chatContainer}>
          <h1 className={styles.title}>TANAKA INFO AI</h1>
          <div className={styles.chatBox}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`${styles.message} ${msg.sender === "user" ? styles.user : styles.bot}`}
              >
                <img
                  src={msg.sender === "user" ? "/user-icon.png" : "/bot-icon.png"}
                  alt={msg.sender}
                  className={styles.icon}
                />
                <div className={styles.text}>{msg.text}</div>
              </div>
            ))}
            <div ref={endOfMessagesRef} />
          </div>
          <div className={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="メッセージを入力..."
              className={styles.input}
            />
            <button onClick={handleSend} className={styles.button}>
              送信
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
