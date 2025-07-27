'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Bot, Send, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Header } from '@/components/Header';
import { getAiResponse } from './actions';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  type: 'text' | 'image';
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    setMessages([
        { id: Date.now(), text: "Hello! I'm Urobili, your AI assistant. You can ask me anything or type `/imagine <prompt>` to generate an image.", sender: 'ai', type: 'text' }
    ]);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now(), text: input, sender: 'user', type: 'text' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const result = await getAiResponse(input);
    
    const isImage = result.response.startsWith('image:');
    const aiMessage: Message = { 
      id: Date.now() + 1, 
      text: isImage ? result.response.replace('image:', '') : result.response, 
      sender: 'ai',
      type: isImage ? 'image' : 'text',
    };
    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto flex h-full max-w-2xl flex-col px-4 pt-6">
      <Header title="AI Assistant" subtitle="Chat with Urobili's AI or create images." />

      <div className="mt-6 flex-1 space-y-6 overflow-y-auto pr-2 pb-20">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn('flex items-start gap-4', message.sender === 'user' ? 'justify-end' : 'justify-start')}
          >
            {message.sender === 'ai' && (
              <Avatar className="h-8 w-8 border-2 border-primary/50">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Sparkles className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                'max-w-xs rounded-lg px-4 py-3 sm:max-w-md',
                message.sender === 'user' ? 'rounded-br-none bg-primary text-primary-foreground' : 'rounded-bl-none bg-card',
                message.type === 'image' && 'p-2'
              )}
            >
              {message.type === 'image' ? (
                <Image src={message.text} alt="Generated image" width={256} height={256} className="rounded-md" />
              ) : (
                <p className="text-base">{message.text}</p>
              )}
            </div>
             {message.sender === 'user' && (
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
         {isLoading && (
          <div className="flex items-start gap-4 justify-start">
             <Avatar className="h-8 w-8 border-2 border-primary/50">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Sparkles className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="max-w-xs sm:max-w-md rounded-lg px-4 py-3 bg-card flex items-center space-x-2">
                 <Skeleton className="h-4 w-4 rounded-full" />
                 <Skeleton className="h-4 w-4 rounded-full" />
                 <Skeleton className="h-4 w-4 rounded-full" />
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-16 left-0 right-0 z-10 bg-background/80 pb-4 pt-2 backdrop-blur-md sm:bottom-0">
        <form onSubmit={handleSubmit} className="container mx-auto max-w-2xl">
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything or type /imagine..."
              className="min-h-[52px] resize-none rounded-full border-2 border-border bg-card pr-16 shadow-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full"
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
