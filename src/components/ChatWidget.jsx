
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ChevronUp, Send, X, Maximize, Minimize, Paperclip, AlertTriangle, AlertOctagon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ChatWidget = ({ currentUser, users, projects, messages, forcedOpenProjectId, forcedContextLabel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const [message, setMessage] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [pendingMessages, setPendingMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Logic 2: Handle specific chat contexts
  const getChatTitle = () => {
      const project = projects.find(p => p.id === activeChatId);
      if (!project) return "";
      
      // Specifically formatted titles as requested
      if (forcedContextLabel) {
          return `${forcedContextLabel} – ${project.title}`;
      }
      
      return project.title;
  };

  const isRiskContext = forcedContextLabel?.includes('Riesgo');

  useEffect(() => {
    if (forcedOpenProjectId) {
      setActiveChatId(forcedOpenProjectId);
      setIsOpen(true);
    }
  }, [forcedOpenProjectId, forcedContextLabel]);

  const myProjects = projects.filter(p => 
    (p.client_id === currentUser.id || p.developer_id === currentUser.id) || currentUser.role === 'admin'
  );

  const activeChatMessages = [
      ...messages.filter(m => m.project_id === activeChatId),
      ...pendingMessages.filter(m => m.project_id === activeChatId)
  ].sort((a,b) => new Date(a.created_at) - new Date(b.created_at));

  // Risk Chat is Admin <-> Developer. Client should not see private messages if they somehow enter.
  const visibleMessages = currentUser.role === 'client' 
    ? activeChatMessages.filter(m => !m.private) 
    : activeChatMessages;

  const unreadMessagesCount = myProjects.reduce((count, project) => {
    return count + messages.filter(m => m.project_id === project.id && m.sender_id !== currentUser.id && !m.read).length;
  }, 0);

  const handleSendMessage = async (fileInfo = null) => {
    if ((!message.trim() && !fileInfo) || !activeChatId) return;
    
    // Risk context -> Private message (Admin <-> Dev)
    const isPrivateMessage = isRiskContext || (currentUser.role === 'admin' && forcedContextLabel?.includes('Riesgo'));

    const tempId = `temp-${Date.now()}`;
    const contentToInsert = { 
      project_id: activeChatId,
      sender_id: currentUser.id, 
      content: message, 
      file_url: fileInfo?.url,
      file_name: fileInfo?.name,
      private: isPrivateMessage, 
      context_label: forcedContextLabel || 'General' 
    };
    
    setPendingMessages(prev => [...prev, { ...contentToInsert, id: tempId, created_at: new Date().toISOString(), isPending: true }]);
    setMessage('');

    const { error } = await supabase.from('messages').insert([contentToInsert]);

    if (error) {
      toast({ title: "Error", variant: "destructive" });
      setPendingMessages(prev => prev.filter(m => m.id !== tempId));
    } else {
      setPendingMessages(prev => prev.filter(m => m.id !== tempId)); 
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const filePath = `chat-files/${currentUser.id}-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('project-files').upload(filePath, file);
    if (!error) {
        const { data } = supabase.storage.from('project-files').getPublicUrl(filePath);
        handleSendMessage({ url: data.publicUrl, name: file.name });
    }
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [activeChatMessages.length, isOpen]);

  if (myProjects.length === 0 && currentUser.role !== 'admin') return null;
  const currentTitle = getChatTitle();

  return (
    <>
      <motion.div className="fixed bottom-5 right-5 z-40" initial={{ scale: 0 }} animate={{ scale: 1 }}>
        <Button size="icon" className="rounded-full w-16 h-16 shadow-xl bg-primary hover:bg-primary/90" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ChevronUp /> : <MessageSquare />}
          {unreadMessagesCount > 0 && !isOpen && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">{unreadMessagesCount}</span>}
        </Button>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className={`fixed bottom-24 right-5 bg-card border rounded-xl shadow-2xl flex flex-col z-40 transition-all ${isMaximized ? 'w-[90vw] h-[80vh]' : 'w-96 h-[500px]'}`}>
            {activeChatId ? (
              <>
                <header className={`p-4 border-b flex items-center justify-between ${currentTitle.includes('Riesgo') ? 'bg-orange-500/20' : currentTitle.includes('Vencido') ? 'bg-red-500/20' : 'bg-secondary/50'}`}>
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-sm truncate flex items-center gap-2" title={currentTitle}>
                        {currentTitle.includes('Riesgo') && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                        {currentTitle.includes('Vencido') && <AlertOctagon className="w-4 h-4 text-red-500" />}
                        {currentTitle}
                    </h3>
                    {isRiskContext && <p className="text-[10px] text-orange-500 font-bold uppercase">Canal Admin-Dev</p>}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMaximized(!isMaximized)}>{isMaximized ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}</Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setActiveChatId(null)}><X className="w-4 h-4" /></Button>
                  </div>
                </header>
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-background/50">
                  {visibleMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender_id === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 rounded-lg max-w-[85%] text-sm shadow-sm relative ${msg.sender_id === currentUser.id ? 'bg-primary text-primary-foreground' : 'bg-card border'} ${msg.private ? 'border-orange-500/50 ring-1 ring-orange-500/20' : ''}`}>
                        {msg.private && <div className="flex items-center gap-1 text-[10px] font-bold opacity-70 mb-1 uppercase"><AlertTriangle className="w-3 h-3"/> Privado</div>}
                        <p>{msg.content}</p>
                        {msg.file_url && <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mt-2 bg-black/10 p-2 rounded-md text-xs"><Paperclip className="w-3 h-3" /> {msg.file_name}</a>}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="p-3 border-t bg-card flex gap-2">
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                  <Button variant="ghost" size="icon" onClick={() => fileInputRef.current.click()}><Paperclip className="w-4 h-4" /></Button>
                  <input value={message} onChange={e => setMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} placeholder={isRiskContext && currentUser.role === 'client' ? "Solo lectura" : "Mensaje..."} disabled={isRiskContext && currentUser.role === 'client'} className="flex-1 bg-transparent border rounded-md px-3 py-2 text-sm" />
                  <Button size="icon" onClick={() => handleSendMessage()} disabled={!message.trim()}><Send className="w-4 h-4" /></Button>
                </div>
              </>
            ) : (
              <div className="flex-1 p-4 overflow-y-auto"><p className="text-center text-muted-foreground">Selecciona un chat para comenzar.</p></div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
