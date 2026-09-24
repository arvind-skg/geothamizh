/**
 * GeoThamizh AI Heritage Chatbot Module
 * 
 * Exportable, self-contained AI Chatbot with Anime.js v4 animations.
 * 
 * Quick Start for your main file:
 * -------------------------------------------------------------
 * import { AIChatbotDrawer, AIChatbotFloatingButton } from './components/AIChatbot';
 * 
 * function App() {
 *   const [isChatOpen, setIsChatOpen] = useState(false);
 * 
 *   return (
 *     <div>
 *       <AIChatbotFloatingButton onClick={() => setIsChatOpen(true)} />
 *       <AIChatbotDrawer 
 *         isOpen={isChatOpen} 
 *         onClose={() => setIsChatOpen(false)} 
 *         onSelectPlace={(place) => console.log('Selected place:', place)}
 *       />
 *     </div>
 *   );
 * }
 * -------------------------------------------------------------
 */

export { AIChatbotDrawer, default as AIChatbot } from './AIChatbotDrawer';
export { AIChatbotFloatingButton } from './AIChatbotFloatingButton';
export * from './chatbotAnimations';
