import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getMyGroups,
  getUserFriends,
  sendGroupRequest,
  getStreamToken,
} from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";

import {
  UsersIcon,
  VideoIcon,
  UserPlusIcon,
  CheckCircleIcon,
  XIcon,
} from "lucide-react";

import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

const GroupDetailPage = () => {
  const { id: groupId } = useParams();
  const queryClient = useQueryClient();

  const [group, setGroup] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [eligibleFriends, setEligibleFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState(new Set());
  const [showAddModal, setShowAddModal] = useState(false);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

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

  // Find group & eligible friends
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

  // Initialize Stream Chat
  useEffect(() => {
    const initChat = async () => {
      if (!authUser || !tokenData?.token || !group?.streamChannelId) return;

      try {
        const client = StreamChat.getInstance(apiKey);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        const streamChannel = client.channel("messaging", group.streamChannelId, {
          name: group.groupName,
          members: group.members.map((m) => m._id),
        });

        await streamChannel.watch();
        setChatClient(client);
        setChannel(streamChannel);
      } catch (err) {
        console.error("Stream Chat init error:", err);
      }
    };

    initChat();

    return () => {
      if (chatClient) chatClient.disconnectUser();
    };
  }, [authUser, tokenData, group]);

  if (loadingGroups || loadingFriends || !group) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!chatClient || !channel) {
    return <div className="text-center p-8">Connecting to chat...</div>;
  }

  return (
    <div className="flex flex-col flex-1 h-full w-full min-h-0 min-w-0">
      <div className="bg-white h-full w-full rounded-none shadow-none border-none flex-1 flex flex-col min-h-0 min-w-0">
        <Chat client={chatClient} theme="messaging light">
          <Channel channel={channel}>
            <Window>
              {/* ⬇️ Your Custom Header INSIDE the chat UI */}
              <div className="flex items-center justify-between gap-4 p-4 border-b bg-white">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="avatar size-12 rounded-full bg-primary text-primary-content flex items-center justify-center">
                    <UsersIcon className="size-6" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold truncate">{group.groupName}</h2>
                    <div className="flex items-center gap-1 mt-1">
                      {/* Member Avatars */}
                      {group.members.slice(0, 5).map((member) => (
                        <div
                          key={member._id}
                          className="avatar size-6 border-2 border-white -ml-2 first:ml-0"
                          title={member.fullName}
                          style={{ zIndex: 10 }}
                        >
                          <img
                            src={member.profilePic}
                            alt={member.fullName}
                            className="rounded-full object-cover"
                          />
                        </div>
                      ))}
                      {/* Show "+N" if more members */}
                      {group.members.length > 5 && (
                        <div className="avatar size-6 border-2 border-white -ml-2 bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700">
                          +{group.members.length - 5}
                        </div>
                      )}
                      <span className="text-xs text-muted-foreground ml-2">
                        {group.members.length} members • {group.members.length} online
                      </span>
                    </div>
                  </div>
                </div>

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

              <div className="flex-1 flex flex-col min-h-0">
                <MessageList />
                <MessageInput />
              </div>
            </Window>
          </Channel>
        </Chat>
      </div>
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setShowAddModal(false)}
            >
              <XIcon className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-black mb-4">Add Friends to Group</h3>
            {eligibleFriends.length === 0 ? (
              <p className="text-sm text-black text-muted-foreground">
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
                        <div className="font-semibold text-black">{friend.fullName}</div>
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
