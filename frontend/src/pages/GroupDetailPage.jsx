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
    <div className="min-h-screen flex flex-col items-center bg-base-100">
      {/* Header */}
      <div className="w-full max-w-3xl px-4 pt-6 pb-2 border-b sticky top-0 z-10 bg-white">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="avatar size-12 rounded-full bg-primary text-primary-content flex items-center justify-center">
              <UsersIcon className="size-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold truncate">{group.groupName}</h2>
              <p className="text-xs text-muted-foreground">
                {group.members.length} members • {group.members.length} online
              </p>
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
              Add
            </button>
          </div>
        </div>
        {group.desc && (
          <div className="mt-2 text-sm text-muted-foreground truncate">
            {group.desc}
          </div>
        )}
      </div>

      {/* Chat UI */}
      <div className="w-full max-w-3xl flex-1 px-4 py-8">
        <Chat client={chatClient} theme="messaging light">
          <Channel channel={channel}>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>
          </Channel>
        </Chat>
      </div>

      {/* Add Friends Modal */}
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
                      <div className="flex-1 font-semibold">{friend.fullName}</div>
                      <button
                        className={`btn btn-sm ${alreadySent ? "btn-disabled" : "btn-primary"}`}
                        onClick={() =>
                          sendRequestMutation({ friendId: friend._id, groupId: group._id })
                        }
                        disabled={alreadySent || isPending}
                      >
                        {alreadySent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-1" />
                            Sent
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
