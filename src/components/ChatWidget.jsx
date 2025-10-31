import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ChevronUp, Send, X, Maximize, Minimize, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const ChatWidget = ({ currentUser, users, projects, messages }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const [message, setMessage] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const myProjects = projects.filter(p => 
    (p.client_id === currentUser.id || p.developer_id === currentUser.id) && p.status === 'in-progress'
  );

  const activeChatProject = projects.find(p => p.id === activeChatId);
  const activeChatMessages = messages.filter(m => m.project_id === activeChatId).sort((a,b) => new Date(a.created_at) - new Date(b.created_at));

  const unreadMessagesCount = myProjects.reduce((count, project) => {
    return count + messages.filter(m => m.project_id === project.id && m.sender_id !== currentUser.id && !m.read).length;
  }, 0);

  const handleFileUpload = async (file) => {
    if (!file) return;
    const filePath = `chat-files/${currentUser.id}-${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from('project-files').upload(filePath, file);

    if (uploadError) {
      toast({ title: "Error al subir archivo", description: uploadError.message, variant: "destructive" });
      return null;
    }

    const { data: { publicUrl } } = supabase.storage.from('project-files').getPublicUrl(filePath);
    return { url: publicUrl, name: file.name };
  };

  const handleSendMessage = async (fileInfo = null) => {
    if (!message.trim() && !fileInfo) return;
    
    const contentToInsert = { 
      project_id: activeChatId,
      sender_id: currentUser.id, 
      content: message, 
      file_url: fileInfo?.url,
      file_name: fileInfo?.name,
    };
    
    const { error } = await supabase.from('messages').insert([contentToInsert]);

    if (error) {
      toast({ title: "Error al enviar mensaje", description: error.message, variant: "destructive" });
    } else {
      setMessage('');
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileSelectAndSend = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileInfo = await handleFileUpload(file);
      if (fileInfo) {
        await handleSendMessage(fileInfo);
      }
    }
  };

  const markMessagesAsRead = async (chatId) => {
    const unread = messages.filter(m => m.project_id === chatId && m.sender_id !== currentUser.id && !m.read);
    if(unread.length === 0) return;

    const idsToUpdate = unread.map(m => m.id);
    await supabase.from('messages').update({ read: true }).in('id', idsToUpdate);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChatMessages, isMaximized]);

  useEffect(() => {
    if (isOpen && activeChatId) {
      markMessagesAsRead(activeChatId);
    }
  }, [isOpen, activeChatId, messages]);

  if (myProjects.length === 0) return null;

  return (
    <>
      <motion.div 
        className="fixed bottom-5 right-5 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 20 }}
        whileHover={{ scale: 1.1 }}
      >
        <Button size="icon" className="relative rounded-full w-16 h-16 shadow-lg bg-gradient-to-br from-primary to-primary/70" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ChevronUp /> : <MessageSquare />}
          {unreadMessagesCount > 0 && !isOpen && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
            >
              {unreadMessagesCount}
            </motion.span>
          )}
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-24 right-5 bg-card border rounded-xl shadow-2xl flex flex-col z-40 transition-all duration-300 ${isMaximized ? 'w-[90vw] h-[80vh]' : 'w-96 h-[500px]'}`}
          >
            {activeChatProject ? (
              <>
                <header className="p-4 border-b flex items-center justify-between cursor-grab">
                  <div>
                    <h3 className="font-bold">{activeChatProject.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {currentUser.role === 'client' ? users.find(u => u.id === activeChatProject.developer_id)?.name : users.find(u => u.id === activeChatProject.client_id)?.name}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" onClick={() => setIsMaximized(!isMaximized)}>{isMaximized ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}</Button>
                    <Button variant="ghost" size="icon" onClick={() => setActiveChatId(null)}><X className="w-4 h-4" /></Button>
                  </div>
                </header>
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {activeChatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender_id === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 rounded-lg max-w-[80%] ${msg.sender_id === currentUser.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        {msg.content && <p>{msg.content}</p>}
                        {msg.file_url && (
                          <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mt-2 bg-black/20 p-2 rounded-md hover:bg-black/30">
                            <Paperclip className="w-4 h-4" />
                            <span>{msg.file_name}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <input type="file" ref={fileInputRef} onChange={handleFileSelectAndSend} className="hidden" />
                    <Button variant="ghost" size="icon" onClick={() => fileInputRef.current.click()}><Paperclip className="w-4 h-4" /></Button>
                    <input value={message} onChange={e => setMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} placeholder="Escribe un mensaje..." className="w-full p-2 bg-background border rounded" />
                    <Button onClick={() => handleSendMessage()}><Send className="w-4 h-4" /></Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <header className="p-4 border-b flex items-center justify-between">
                  <h3 className="font-bold">Conversaciones</h3>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}><X className="w-4 h-4" /></Button>
                </header>
                <div className="flex-1 p-2 overflow-y-auto">
                  {myProjects.map(p => {
                    const unreadCount = messages.filter(m => m.project_id === p.id && m.sender_id !== currentUser.id && !m.read).length;
                    return (
                      <div key={p.id} onClick={() => { setActiveChatId(p.id); }} className="p-3 hover:bg-accent rounded-lg cursor-pointer flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{p.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {currentUser.role === 'client' ? `con ${users.find(u => u.id === p.developer_id)?.name}` : `con ${users.find(u => u.id === p.client_id)?.name}`}
                          </p>
                        </div>
                        {unreadCount > 0 && <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">{unreadCount}</span>}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;