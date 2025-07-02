import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  getMyGroups,
  getUserFriends,
  sendGroupRequest,
  getStreamToken,
} from "../lib/api";
import {
  UsersIcon,
  VideoIcon,
  UserPlusIcon,
  CheckCircleIcon,
  XIcon,
  PaperclipIcon,
  PaperPlaneIcon,
  SmileIcon,
} from "lucide-react";
import { StreamChat } from "stream-chat";
import { StreamVideoClient } from "@stream-io/video-react-sdk";
import useAuthUser from "../hooks/useAuthUser";
import toast from "react-hot-toast";
import { Chat, Channel, ChannelHeader, MessageList, MessageInput, Thread } from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const GroupDetailPage = () => {
  const { id: groupId } = useParams();
  const queryClient = useQueryClient();
  const [group, setGroup] = useState(null);
  const [eligibleFriends, setEligibleFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [message, setMessage] = useState("");
  const [videoClient, setVideoClient] = useState(null);
  const { authUser } = useAuthUser();
  const navigate = useNavigate();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  // Initialize chat client and channel
  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser || !group) return;

      try {
        // Initialize Stream Chat
        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        // Initialize Stream Video Client
        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user: {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          token: tokenData.token,
        });
        setVideoClient(videoClient);

        // Set up chat channel
        const channelId = `group-${group._id}`;
        const channel = client.channel("messaging", channelId, {
          name: group.groupName,
          members: group.members.map(m => m._id),
          image: group.profilePic,
        });

        await channel.watch();
        setChatClient(client);
        setChannel(channel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      }
    };

    if (group?.members?.length > 0) {
      initChat();
    }

    return () => {
      if (chatClient) {
        chatClient.disconnectUser();
      }
      if (videoClient) {
        videoClient.disconnectUser();
      }
    };
  }, [tokenData, authUser, group?._id]);

  const handleVideoCall = async () => {
    if (!videoClient || !group) return;
    
    try {
      // Create a unique call ID for this group
      const callId = `group-call-${group._id}-${Date.now()}`;
      
      // Navigate to the call page
      navigate(`/call/${callId}`);
      
      // Optionally, you can send a message to the group chat about the call
      if (channel) {
        const callUrl = `${window.location.origin}/call/${callId}`;
        await channel.sendMessage({
          text: `I've started a video call. Join me here: ${callUrl}`,
        });
      }
    } catch (error) {
      console.error("Error starting video call:", error);
      toast.error("Could not start video call. Please try again.");
    }
  };

  const { data: groups = [], isLoading: loadingGroups } = useQuery({
    queryKey: ["groups"],
    queryFn: getMyGroups,
  });
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });
  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: ({ friendId, groupId }) => sendGroupRequest(friendId, groupId),
    onSuccess: (_, variables) => {
      setSentRequests((prev) => new Set(prev).add(variables.friendId));
    },
  });

  useEffect(() => {
    if (groups && groupId) {
      const found = groups.find((g) => g._id === groupId);
      setGroup(found);
      if (found && friends) {
        const eligible = friends.filter(
          (f) => !found.members.some((m) => m._id === f._id)
        );
        setEligibleFriends(eligible);
      }
    }
  }, [groups, groupId, friends]);

  if (loadingGroups || loadingFriends || !group) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  const onlineCount = group.members.length;

  return (
    <div className="min-h-screen flex flex-col items-center bg-base-100">
      {/* Header Bar */}
      <div className="w-full max-w-3xl px-4 pt-6 pb-2 border-b bg-base-100 sticky top-0 z-10">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Group avatar and name */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="avatar size-12 rounded-full bg-primary text-primary-content flex items-center justify-center">
              <UsersIcon className="size-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold truncate">{group.groupName}</h2>
              <p className="text-xs text-muted-foreground">
                {group.members.length} members • {onlineCount} online
              </p>
            </div>
          </div>

          {/* Center: Members avatars */}
          <div className="flex items-center gap-2 flex-1 justify-center overflow-x-auto hide-scrollbar">
            {group.members.map((member) => (
              <div
                key={member._id}
                className="avatar size-9 border-2 border-base-300 hover:border-primary transition-all cursor-pointer group"
                title={member.username}
              >
                <img
                  src={member.profilePic}
                  alt={member.username}
                  className="rounded-full"
                />
                {/* Tooltip on hover */}
                <span className="absolute left-1/2 -translate-x-1/2 mt-10 px-2 py-1 rounded bg-base-200 text-xs text-base-content opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-lg z-20">
                  {member.username}
                </span>
              </div>
            ))}
          </div>

          {/* Right: Action buttons */}
          <div className="flex items-center gap-2">
            <Link
              to={`/call/${group._id}`}
              className="rounded-full bg-orange-400 hover:bg-orange-500 p-2 text-white"
              title="Start Video Call"
            >
              <VideoIcon className="size-5" />
            </Link>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-outline btn-sm flex items-center gap-1"
              title="Add User"
            >
              <UserPlusIcon className="size-4" />
              Add User
            </button>
          </div>
        </div>
        {/* Description below header */}
        {group.desc && (
          <div className="mt-2 text-sm text-muted-foreground truncate">
            {group.desc}
          </div>
        )}
      </div>

      {/* Chat Interface */}
      <div className="w-full max-w-3xl flex-1 flex flex-col bg-base-100">
        {!channel ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading chat...</p>
            </div>
          </div>
        ) : (
          <Chat client={chatClient} theme="str-chat__theme-light">
            <Channel 
              channel={channel}
              Input={MessageInput}
              LoadingIndicator={() => (
                <div className="flex-1 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
            >
              <div className="flex flex-col h-full">
                {/* Channel Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                        <UsersIcon className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold">{group.groupName}</h3>
                      <p className="text-xs text-muted-foreground">
                        {group.members.length} members • {onlineCount} online
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleVideoCall}
                    className="btn btn-ghost btn-circle"
                    title="Start Video Call"
                    disabled={!videoClient}
                  >
                    <VideoIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto">
                  <MessageList />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <MessageInput />
                </div>
              </div>
              <Thread />
            </Channel>
          </Chat>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setShowAddModal(false)}
            >
              <XIcon className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4">Add Friends to Group</h3>
            {eligibleFriends.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                All your friends are already in this group.
              </p>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                {eligibleFriends.map((friend) => {
                  const alreadySent = sentRequests.has(friend._id);
                  return (
                    <div
                      key={friend._id}
                      className="flex items-center gap-3 bg-base-200 rounded-lg p-3"
                    >
                      <div className="avatar size-10">
                        <img
                          src={friend.profilePic}
                          alt={friend.fullName}
                          className="rounded-full"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{friend.fullName}</div>
                      </div>
                      <button
                        className={`btn btn-sm ${alreadySent ? "btn-disabled" : "btn-primary"}`}
                        onClick={() =>
                          sendRequestMutation({
                            friendId: friend._id,
                            groupId: group._id,
                          })
                        }
                        disabled={alreadySent || isPending}
                      >
                        {alreadySent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-1" />
                            Invite Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-1" />
                            Invite
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetailPage;
