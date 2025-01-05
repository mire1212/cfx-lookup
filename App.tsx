import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Server, User } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { FiveMTab } from './components/FiveMTab';
import { DiscordTab } from './components/DiscordTab';
import { KeyAuth } from './components/KeyAuth';
import { UserInfo } from './components/UserInfo';
import { ServerData } from './types';
import './App.css';

export function App() {
  const [activeTab, setActiveTab] = useState<'fivem' | 'discord'>('fivem');
  const [animatedText, setAnimatedText] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [user, setUser] = useState(null);
  const [initialDiscordId, setInitialDiscordId] = useState<string | null>(null);
  const [serverData, setServerData] = useState<ServerData | null>(null);
  const [serverIp, setServerIp] = useState('');

  const handleSetInitialDiscordId = (id: string) => {
    setInitialDiscordId(id);
    setActiveTab('discord');
  };

  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }

    const text = 'CFX LOOKUP';
    let direction = 'forward';
    let currentIndex = 0;
    let timer: NodeJS.Timeout;

    const animate = () => {
      if (direction === 'forward') {
        if (currentIndex <= text.length) {
          setAnimatedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          direction = 'backward';
        }
      } else {
        if (currentIndex >= 0) {
          setAnimatedText(text.slice(0, currentIndex));
          currentIndex--;
        } else {
          direction = 'forward';
        }
      }

      timer = setTimeout(animate, direction === 'forward' ? 150 : 75);
    };

    animate();

    return () => clearTimeout(timer);
  }, []);

  const handleAuthenticate = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsTransitioning(false);
    }, 1000);
  };

  const handleLogout = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('isAuthenticated');
      setIsTransitioning(false);
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>404 Not Found | Access Denied</title>
        <meta name="description" content="Error 404: The requested resource could not be found. Access to this page is restricted." />
      </Head>
      <div className="min-h-screen bg-background text-foreground matrix-bg">
        <AnimatePresence mode="wait">
          {!isAuthenticated && !isTransitioning && (
            <motion.div
              key="auth"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="min-h-screen flex items-center justify-center"
            >
              <KeyAuth onAuthenticate={handleAuthenticate} />
            </motion.div>
          )}

          {isTransitioning && (
            <motion.div
              key="blackout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 bg-black z-50"
            />
          )}

          {isAuthenticated && !isTransitioning && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="min-h-screen"
            >
              <div className="container mx-auto p-4 max-w-4xl">
                <div className="flex justify-between items-center mb-8">
                  <motion.h1 
                    className="text-2xl md:text-4xl font-bold text-center terminal-text glow"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="inline-block w-[200px] text-left nowrap">{animatedText}</span>
                  </motion.h1>
                  <UserInfo user={user} onLogout={handleLogout} />
                </div>

                <div className="mb-4">
                  <nav className="flex border-b border-primary">
                    <button
                      onClick={() => setActiveTab('fivem')}
                      className={`flex items-center justify-center gap-2 px-4 py-2 focus:outline-none ${
                        activeTab === 'fivem' ? 'border-b-2 border-primary' : ''
                      }`}
                    >
                      <Server className="w-4 h-4" />
                      <span>FiveM Server</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('discord')}
                      className={`flex items-center justify-center gap-2 px-4 py-2 focus:outline-none ${
                        activeTab === 'discord' ? 'border-b-2 border-primary' : ''
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span>Discord ID</span>
                    </button>
                  </nav>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeTab === 'fivem' ? (
                      <FiveMTab
                        setActiveTab={setActiveTab}
                        setInitialDiscordId={handleSetInitialDiscordId}
                        serverData={serverData}
                        setServerData={setServerData}
                        serverIp={serverIp}
                        setServerIp={setServerIp}
                      />
                    ) : (
                      <DiscordTab
                        initialDiscordId={initialDiscordId}
                        activeTab={activeTab}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Analytics />
      </div>
    </>
  );
}

