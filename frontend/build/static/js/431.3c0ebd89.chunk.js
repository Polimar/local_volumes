"use strict";(self.webpackChunkwaichat_frontend=self.webpackChunkwaichat_frontend||[]).push([[431],{431:(e,t,i)=>{i.r(t),i.d(t,{default:()=>F});var r=i(43),o=i(867),a=i(16),n=i(606),s=i(579);const l=o.Ay.div`
  width: 350px;
  height: 100%;
  background-color: var(--chat-bg);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    display: ${e=>e.isMobileVisible?"flex":"none"};
  }
`,d=o.Ay.div`
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--chat-bg);
  border-bottom: 1px solid var(--border-color);
`,c=o.Ay.div`
  display: flex;
  align-items: center;
`,p=o.Ay.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 12px;
`,x=o.Ay.div`
  font-weight: 600;
`,h=o.Ay.div`
  display: flex;
  gap: 16px;
`,g=o.Ay.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 20px;
  cursor: pointer;
  
  &:hover {
    color: var(--primary-color);
  }
`,u=o.Ay.div`
  padding: 12px 16px;
  background-color: var(--chat-bg);
`,v=o.Ay.input`
  width: 100%;
  padding: 10px 16px;
  border-radius: 20px;
  border: none;
  background-color: var(--background-color);
  color: var(--text-color);
  
  &::placeholder {
    color: var(--text-secondary);
  }
  
  &:focus {
    outline: none;
  }
`,m=o.Ay.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
`,y=o.Ay.div`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: ${e=>e.isActive?"rgba(0, 0, 0, 0.05)":"transparent"};
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`,f=o.Ay.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${e=>e.isAI?"var(--accent-color)":"var(--primary-color)"};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 16px;
  flex-shrink: 0;
`,b=o.Ay.div`
  flex: 1;
  min-width: 0;
`,j=o.Ay.div`
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,A=o.Ay.div`
  font-size: 14px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,w=o.Ay.div`
  font-size: 12px;
  color: var(--text-secondary);
  margin-left: 8px;
  white-space: nowrap;
`,S=o.Ay.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  text-align: center;
  color: var(--text-secondary);
  
  p {
    margin-top: 12px;
    font-size: 14px;
  }
`,k=o.Ay.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--text-secondary);
`,C=e=>{let{chats:t=[],activeChat:i,onSelectChat:o,loading:n}=e;const{user:C,logout:z}=(0,a.A)(),[I,$]=(0,r.useState)(""),M=t.filter((e=>(e.name||("direct"===e.type?"Chat Diretta":"Gruppo")).toLowerCase().includes(I.toLowerCase()))),D=e=>e?e.split(" ").map((e=>e[0])).join("").toUpperCase().substring(0,2):"?",E=e=>{if(!e)return"";const t=new Date(e),i=new Date;return t.toDateString()===i.toDateString()?t.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):t.toLocaleDateString()};return(0,s.jsxs)(l,{children:[(0,s.jsxs)(d,{children:[(0,s.jsxs)(c,{children:[(0,s.jsx)(p,{children:C?D(C.fullName||C.username):"?"}),(0,s.jsx)(x,{children:C?C.fullName||C.username:"Utente"})]}),(0,s.jsx)(h,{children:(0,s.jsx)(g,{onClick:z,children:(0,s.jsx)("span",{role:"img","aria-label":"Logout",children:"\ud83d\udeaa"})})})]}),(0,s.jsx)(u,{children:(0,s.jsx)(v,{type:"text",placeholder:"Cerca chat...",value:I,onChange:e=>$(e.target.value)})}),(0,s.jsx)(m,{children:n?(0,s.jsx)(k,{children:"Caricamento chat..."}):M.length>0?M.map((e=>(0,s.jsxs)(y,{isActive:i&&i.id===e.id,onClick:()=>o(e),children:[(0,s.jsx)(f,{isAI:"ai"===e.type,children:"ai"===e.type?"AI":D(e.name||"Chat")}),(0,s.jsxs)(b,{children:[(0,s.jsx)(j,{children:e.name||("direct"===e.type?"Chat Diretta":"ai"===e.type?"Assistente AI":"Gruppo")}),(0,s.jsx)(A,{children:e.lastMessage||"Nessun messaggio"})]}),e.lastMessageTime&&(0,s.jsx)(w,{children:E(e.lastMessageTime)})]},e.id))):(0,s.jsxs)(S,{children:[(0,s.jsx)("span",{role:"img","aria-label":"Empty",style:{fontSize:"32px"},children:"\ud83d\udcac"}),(0,s.jsx)("p",{children:"Nessuna chat disponibile. Inizia una nuova conversazione!"})]})})]})},z=o.Ay.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
  height: 100%;
  overflow: hidden;
`,I=o.Ay.div`
  padding: 16px;
  display: flex;
  align-items: center;
  background-color: var(--chat-bg);
  border-bottom: 1px solid var(--border-color);
`,$=o.Ay.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${e=>e.isAI?"var(--accent-color)":"var(--primary-color)"};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 16px;
`,M=o.Ay.div`
  flex: 1;
`,D=o.Ay.div`
  font-weight: 600;
`,E=o.Ay.div`
  font-size: 13px;
  color: var(--text-secondary);
`,L=o.Ay.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`,T=o.Ay.div`
  display: flex;
  flex-direction: column;
  align-items: ${e=>e.isSent?"flex-end":"flex-start"};
  margin-bottom: 16px;
  max-width: 80%;
  align-self: ${e=>e.isSent?"flex-end":"flex-start"};
`,N=o.Ay.div`
  padding: 10px 16px;
  border-radius: 16px;
  background-color: ${e=>e.isAI?"var(--ai-message)":e.isSent?"var(--message-sent)":"var(--message-received)"};
  margin-bottom: 4px;
  box-shadow: 0 1px 2px var(--shadow-color);
  position: relative;
  
  &:first-child {
    border-top-left-radius: ${e=>e.isSent?"16px":"4px"};
    border-top-right-radius: ${e=>e.isSent?"4px":"16px"};
  }
  
  &:last-child {
    border-bottom-left-radius: ${e=>(e.isSent,"16px")};
    border-bottom-right-radius: ${e=>(e.isSent,"16px")};
    margin-bottom: 0;
  }
`,G=o.Ay.div`
  word-break: break-word;
`,U=o.Ay.div`
  font-size: 11px;
  color: var(--text-secondary);
  text-align: ${e=>e.isSent?"right":"left"};
  margin-top: 4px;
`,W=o.Ay.div`
  padding: 16px;
  background-color: var(--chat-bg);
  display: flex;
  align-items: center;
`,O=o.Ay.input`
  flex: 1;
  padding: 12px 16px;
  border-radius: 24px;
  border: none;
  background-color: var(--background-color);
  color: var(--text-color);
  
  &::placeholder {
    color: var(--text-secondary);
  }
  
  &:focus {
    outline: none;
  }
`,R=o.Ay.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
  cursor: pointer;
  border: none;
  
  &:disabled {
    background-color: var(--text-secondary);
    cursor: not-allowed;
  }
`,V=o.Ay.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  text-align: center;
  color: var(--text-secondary);
  
  p {
    margin-top: 12px;
    font-size: 14px;
  }
`,_=e=>{let{chat:t,messages:i=[],onSendMessage:o}=e;const{user:n}=(0,a.A)(),[l,d]=(0,r.useState)(""),c=(0,r.useRef)(null);(0,r.useEffect)((()=>{p()}),[i]);const p=()=>{var e;null===(e=c.current)||void 0===e||e.scrollIntoView({behavior:"smooth"})},x=e=>{if(!e)return"";return new Date(e).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};return t?(0,s.jsxs)(z,{children:[(0,s.jsxs)(I,{children:[(0,s.jsx)($,{isAI:"ai"===t.type,children:"ai"===t.type?"AI":(h=t.name||"Chat",h?h.split(" ").map((e=>e[0])).join("").toUpperCase().substring(0,2):"?")}),(0,s.jsxs)(M,{children:[(0,s.jsx)(D,{children:t.name||("direct"===t.type?"Chat Diretta":"ai"===t.type?"Assistente AI":"Gruppo")}),(0,s.jsx)(E,{children:"ai"===t.type?"Assistente AI":"Online"})]})]}),(0,s.jsxs)(L,{children:[0===i.length?(0,s.jsxs)(V,{children:[(0,s.jsx)("span",{role:"img","aria-label":"Start",style:{fontSize:"32px"},children:"\ud83d\udcac"}),(0,s.jsx)("p",{children:"Inizia la conversazione inviando un messaggio!"})]}):i.map(((e,i)=>{const r=e.senderId===(null===n||void 0===n?void 0:n.id),o="ai"===t.type&&!r;return(0,s.jsxs)(T,{isSent:r,children:[(0,s.jsx)(N,{isSent:r,isAI:o,children:(0,s.jsx)(G,{children:e.content})}),(0,s.jsx)(U,{isSent:r,children:x(e.createdAt)})]},e.id||i)})),(0,s.jsx)("div",{ref:c})]}),(0,s.jsx)(W,{children:(0,s.jsxs)("form",{onSubmit:e=>{e.preventDefault(),l.trim()&&(o(l),d(""))},style:{display:"flex",width:"100%"},children:[(0,s.jsx)(O,{type:"text",placeholder:"Scrivi un messaggio...",value:l,onChange:e=>d(e.target.value)}),(0,s.jsx)(R,{type:"submit",disabled:!l.trim(),children:(0,s.jsx)("span",{role:"img","aria-label":"Send",children:"\u27a4"})})]})})]}):(0,s.jsx)(z,{children:(0,s.jsxs)(V,{children:[(0,s.jsx)("span",{role:"img","aria-label":"Welcome",style:{fontSize:"48px"},children:"\ud83d\udc4b"}),(0,s.jsx)("p",{children:"Seleziona una chat per iniziare a messaggiare"})]})});var h};var B=i(621);const P=o.Ay.div`
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: var(--background-color);
`,q=o.Ay.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--chat-bg);
  color: var(--text-secondary);
  
  h2 {
    font-size: 24px;
    margin-bottom: 16px;
    color: var(--primary-color);
  }
  
  p {
    font-size: 16px;
    max-width: 400px;
    text-align: center;
    line-height: 1.6;
  }
  
  img {
    width: 200px;
    margin-bottom: 24px;
    opacity: 0.8;
  }
`,F=()=>{const{user:e}=(0,a.A)(),[t,i]=(0,r.useState)([]),[o,l]=(0,r.useState)(null),[d,c]=(0,r.useState)([]),[p,x]=(0,r.useState)(!0);(0,r.useEffect)((()=>{e&&(async()=>{try{const e=await B.A.get("/chats");i(e.data),x(!1)}catch(e){console.error("Errore durante il caricamento delle chat:",e),x(!1)}})()}),[e]),(0,r.useEffect)((()=>((async()=>{if(o)try{const e=await B.A.get(`/messages/${o.id}`);c(e.data),n.A.joinChat(o.id)}catch(e){console.error("Errore durante il caricamento dei messaggi:",e)}})(),()=>{o&&n.A.leaveChat(o.id)})),[o]),(0,r.useEffect)((()=>{const e=n.A.onReceiveMessage((e=>{e.chatId===(null===o||void 0===o?void 0:o.id)&&(c((t=>[...t,e])),i((t=>t.map((t=>t.id===e.chatId?{...t,lastMessage:e.content,lastMessageTime:e.createdAt}:t)))))}));return()=>{e()}}),[o]);return(0,s.jsxs)(P,{children:[(0,s.jsx)(C,{chats:t,activeChat:o,onSelectChat:e=>{l(e)},loading:p}),o?(0,s.jsx)(_,{chat:o,messages:d,onSendMessage:async function(t){let r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"text";if(o&&t.trim())try{const a={content:t,type:r,chatId:o.id,senderId:e.id},s=await B.A.post("/messages",a);n.A.sendMessage(s.data),c((e=>[...e,s.data])),i((e=>e.map((e=>e.id===o.id?{...e,lastMessage:t,lastMessageTime:(new Date).toISOString()}:e))))}catch(a){console.error("Errore durante l'invio del messaggio:",a)}}}):(0,s.jsxs)(q,{children:[(0,s.jsx)("img",{src:"/logo192.png",alt:"WaiChat Logo"}),(0,s.jsx)("h2",{children:"Benvenuto su WaiChat"}),(0,s.jsx)("p",{children:"Seleziona una chat per iniziare a messaggiare o crea una nuova conversazione. Puoi anche chattare con l'AI utilizzando il nostro assistente integrato!"})]})]})}}}]);
//# sourceMappingURL=431.3c0ebd89.chunk.js.map