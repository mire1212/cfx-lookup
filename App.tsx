"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Head from 'next/head';
import { Server, User, ComputerIcon as Steam } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion"
import { Analytics } from '@vercel/analytics/react';
import { FiveMTab } from './components/FiveMTab';
import { DiscordTab } from './components/DiscordTab';
import { SteamTab } from './components/SteamTab';
import { KeyAuth } from './components/KeyAuth';
import { UserInfo } from './components/UserInfo';
import { ErrorOverlay } from './components/ErrorOverlay';
import { ServerData } from './types';
import './App.css';
import { ErrorBoundary } from 'react-error-boundary';
import type { AppProps } from 'next/app';



const MemoizedFiveMTab = React.memo(FiveMTab);
const MemoizedDiscordTab = React.memo(DiscordTab);
const MemoizedSteamTab = React.memo(SteamTab);
const MemoizedKeyAuth = React.memo(KeyAuth);
const MemoizedUserInfo = React.memo(UserInfo);

export function App({ Component, pageProps }: AppProps) {
  const [activeTab, setActiveTab] = useState<'fivem' | 'discord' | 'steam'>('fivem');
  const [animatedText, setAnimatedText] = useState('CFX LOOKUP');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [user, setUser] = useState(null);
  const [initialDiscordId, setInitialDiscordId] = useState<string | null>(null);
  const [initialSteamHex, setInitialSteamHex] = useState<string | null>(null);
  const [serverData, setServerData] = useState<ServerData | null>(null);
  const [serverIp, setServerIp] = useState('');
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

  // Simplified animation effect
  useEffect(() => {
    if (!isAuthenticated) return;

    const text = 'CFX LOOKUP';
    let currentIndex = 0;
    const interval = setInterval(() => {
      setAnimatedText(text.slice(0, currentIndex + 1));
      currentIndex = (currentIndex + 1) % (text.length + 1);
    }, 200);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Memoized handlers
  const handleSetInitialDiscordId = useCallback((id: string) => {
    setInitialDiscordId(id);
    setActiveTab('discord');
  }, []);

  const handleSetInitialSteamHex = useCallback((hex: string) => {
    setInitialSteamHex(hex);
    setActiveTab('steam');
  }, []);

  const handleAuthenticate = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      setIsTransitioning(false);
    }, 1000);
  }, []);

  const handleLogout = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('isAuthenticated');
      setIsTransitioning(false);
    }, 1000);
  }, []);


  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center p-6">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-red-500">Please try refreshing the page</p>
          </div>
        </div>
      }
    >
      <Head>
        <title>CFX LOOKUP</title>
        <meta name="description" content="TOOL" />
        <link rel="icon" href="/public/favicon.ico"></link>
      </Head>
      <div className="min-h-screen bg-background text-foreground matrix-bg">
        <ErrorOverlay isVisible={isDevToolsOpen} />
        <AnimatePresence mode="wait">
          {!isAuthenticated && !isTransitioning && (
            <motion.div
              key="auth"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="min-h-screen flex items-center justify-center"
            >
              <MemoizedKeyAuth onAuthenticate={handleAuthenticate} />
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
                    <p className="text-sm opacity-10 mt-1 text-left ">
                      4NEM
                    </p>
                  </motion.h1>
                  <MemoizedUserInfo user={user} onLogout={handleLogout} />
                </div>

                <div className="mb-4">
                  <nav className="flex border-b border-primary">
                    <button
                      onClick={() => !isDevToolsOpen && setActiveTab('fivem')}
                      className={`flex items-center justify-center gap-2 px-4 py-2 focus:outline-none ${activeTab === 'fivem' ? 'border-b-2 border-primary' : ''
                        } ${isDevToolsOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isDevToolsOpen}
                    >
                      <Server className="w-4 h-4" />
                      <span>Server</span>
                    </button>
                    <button
                      onClick={() => !isDevToolsOpen && setActiveTab('discord')}
                      className={`flex items-center justify-center gap-2 px-4 py-2 focus:outline-none ${activeTab === 'discord' ? 'border-b-2 border-primary' : ''
                        } ${isDevToolsOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isDevToolsOpen}
                    >
                      <User className="w-4 h-4" />
                      <span>Discord</span>
                    </button>
                    <button
                      onClick={() => !isDevToolsOpen && setActiveTab('steam')}
                      className={`flex items-center justify-center gap-2 px-4 py-2 focus:outline-none ${activeTab === 'steam' ? 'border-b-2 border-primary' : ''
                        } ${isDevToolsOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isDevToolsOpen}
                    >
                      <Steam className="w-4 h-4" />
                      <span>Steam</span>
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
                      <MemoizedFiveMTab
                        setActiveTab={setActiveTab}
                        setInitialDiscordId={handleSetInitialDiscordId}
                        setInitialSteamHex={handleSetInitialSteamHex}
                        serverData={serverData}
                        setServerData={setServerData}
                        serverIp={serverIp}
                        setServerIp={setServerIp}
                        isDisabled={isDevToolsOpen}
                      />
                    ) : activeTab === 'discord' ? (
                      <MemoizedDiscordTab
                        initialDiscordId={initialDiscordId}
                        activeTab={activeTab}
                        isDisabled={isDevToolsOpen}
                      />
                    ) : (
                      <MemoizedSteamTab
                        initialSteamHex={initialSteamHex}
                        activeTab={activeTab}
                        isDisabled={isDevToolsOpen}
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
    </ErrorBoundary>
  );
}

function ErrorFallback({ error }: { error?: Error }) {  // Make error optional
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Something went wrong:</h1>
        <pre className="text-red-500">
          {error?.message || 'An unexpected error occurred'}  {/* Add fallback message */}
        </pre>
      </div>
    </div>
  );
}
