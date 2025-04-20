import { fetchResponse } from "../service/backend";


export interface Message {
  id: number;
  text: string;
  uri: string;
  type: 'image' | 'audio' | 'text';
  sender: 'user' | 'bot';
}

export const addUserMessage = async (
  message: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  id: string|null
) => {
  const newMessage: Message = {
    id: Date.now(), 
    uri: '',
    text: message,  
    sender: 'user',
    type: 'text',
  };

  setMessages((prevMessages) => [...prevMessages, newMessage]);

  addBotMessage(setMessages, newMessage, id);
};

// Function to handle adding bot messages to the chat
export const addBotMessage = async (
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  message: Message,
  id: string|null,
) => {

  const reply = await fetchResponse(message, id);
  console.log("MY RES:",reply)

  const replyMessage: Message = {
    id: Date.now() + 1,
    uri: '',
    text: reply,
    sender: 'bot',
    type: 'text',
  };

  setMessages((prevMessages) => [...prevMessages, replyMessage]);
};


export const addMediaMessage = (
  uri: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  type: 'image' | 'audio',
  id: string|null,
) => {

  const newMessage: Message = {
    id: Date.now(),
    uri: uri,
    text: '',
    sender: 'user',
    type: type,
  };
  console.log(newMessage);
  setMessages((prevMessages) => [...prevMessages, newMessage]);
  addBotMessage(setMessages, newMessage, id);
};

