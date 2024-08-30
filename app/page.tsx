"use client";

import { useChat } from "ai/react";
import JokesUI from '@/components/jokesUI';

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <JokesUI />
  );
}