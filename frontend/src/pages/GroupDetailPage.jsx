import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  getMyGroups,
  getUserFriends,
  sendGroupRequest,
} from "../lib/api";
import {
  UsersIcon,
  VideoIcon,
  UserPlusIcon,
  CheckCircleIcon,
  XIcon,
} from "lucide-react";

const GroupDetailPage = () => {
  const { id: groupId } = useParams();
  const queryClient = useQueryClient();
  const [group, setGroup] = useState(null);
  const [eligibleFriends, setEligibleFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState(new Set());
  const [showAddModal, setShowAddModal] = useState(false);

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

      {/* Main content area (could be chat/messages in future) */}
      <div className="w-full max-w-3xl flex-1 px-4 py-8">
        {/* You can add group chat/messages here if needed */}
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
