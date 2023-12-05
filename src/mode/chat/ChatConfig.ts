interface ChatConfig {
    clientId: string;
    clientSecret: string;
    host: string;
    httProtocol: string;
    wsProtocol: string;
    scope: string;
    httPort: number;
    wsPort: number;
  }
  
  const chatConfig: ChatConfig = {
    clientId: "app",
    clientSecret: "app",
    host: "192.168.1.170",
    httProtocol: "http",
    wsProtocol: "ws",
    scope: "server",
    httPort: 8085,
    wsPort: 9326,
  };
  export default chatConfig;
  