import { LoaderIcon, MessageCircle } from "lucide-react";

function ChatLoader() {
  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 bg-base-100">
      <div className="text-center max-w-md">
        <div className="relative mb-6">
          <MessageCircle className="size-16 text-primary/30 mx-auto" />
          <LoaderIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin size-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-base-content mb-2">Connecting to Chat</h2>
        <p className="text-base-content/70 text-sm">Please wait while we establish your connection...</p>
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatLoader;