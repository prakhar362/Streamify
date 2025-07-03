import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getMyGroups,
  getRecommendedUsers,
  getUserFriends,
  getOutgoingFriendReqs,
  sendFriendRequest,
  createGroup,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon, PlusIcon, CameraIcon, ShuffleIcon } from "lucide-react";
import { toast } from "react-hot-toast";

import { capitialize } from "../lib/utils";

import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import GroupCard from "../components/GroupCard";
import NoGroupFound from "../components/NoGroupFound";
import useAuthUser from "../hooks/useAuthUser";

const GroupPage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const { data: groups = [], isLoading: loadingGroups } = useQuery({
    queryKey: ["groups"],
    queryFn: getMyGroups,
  });
  console.log("Groups array:",groups);

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formState, setFormState] = useState({
    groupName: "",
    desc: "",
    profilePic: "",
    learningLanguage: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { authUser } = useAuthUser();

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        if (req.recipient && req.recipient._id) {
          outgoingIds.add(req.recipient._id);
        }
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createGroup({
        ...formState,
        createdBy: authUser?._id,
        members: [authUser?._id],
      });
      setShowCreateModal(false);
      setFormState({ groupName: "", desc: "", profilePic: "", learningLanguage: "" });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        {/* Groups Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Groups</h2>
          <div className="flex gap-2">
            <Link to="/group-requests" className="btn btn-outline btn-sm">
              <UsersIcon className="mr-2 size-4" />
              Group Requests
            </Link>
            <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
              <PlusIcon className="mr-2 size-4" />
              Create Group
            </button>
          </div>
        </div>

        {loadingGroups ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : groups.length === 0 ? (
          <NoGroupFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {groups.map((group) => (
              <GroupCard key={group._id} group={group} />
            ))}
          </div>
        )}

        {/* Friends Section */}
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col items-center justify-center text-center w-full">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
              <p className="opacity-70 max-w-2xl">
                Connect with your friends and invite them to groups
              </p>
            </div>
          </div>

          {loadingFriends ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : friends.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">No friends found</h3>
              <p className="text-base-content opacity-70">
                Add some friends to start connecting!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          )}
        </section>

        {/* Recommended Users Section */}
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col items-center justify-center text-center w-full">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
              <p className="opacity-70 max-w-2xl">
                Discover perfect language exchange partners based on your profile
              </p>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
              <p className="text-base-content opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full">
                          <img src={user.profilePic} alt={user.fullName} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages with flags */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bio && <p className="text-md opacity-70">Bio: {user.bio}</p>}

                      {/* Action button */}
                      <button
                        className={`btn w-full mt-2 ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        } `}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Create Group Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <form
              className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative space-y-4"
              onSubmit={handleCreateGroup}
            >
              <button
                type="button"
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
              <h3 className="text-lg font-semibold mb-4">Create New Group</h3>
              {/* PROFILE PIC CONTAINER */}
              <div className="flex flex-col items-center justify-center space-y-3">
                {/* IMAGE PREVIEW */}
                <div className="size-28 rounded-full border-4 border-[#3498db]/30 shadow-sm bg-[#eaf6fb] overflow-hidden flex items-center justify-center">
                  {formState.profilePic ? (
                    <img
                      src={formState.profilePic}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <CameraIcon className="size-10 text-[#3498db] opacity-40" />
                    </div>
                  )}
                </div>
                {/* Generate Random Avatar BTN */}
                <button type="button" onClick={handleRandomAvatar} className="btn btn-sm bg-[#3498db] text-white border-none hover:bg-[#217dbb] flex items-center gap-2">
                  <ShuffleIcon className="size-4" />
                  Random Avatar
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Group Name</label>
                <input
                  className="input input-bordered w-full"
                  name="groupName"
                  value={formState.groupName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  name="desc"
                  value={formState.desc}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Learning Language</label>
                <input
                  className="input input-bordered w-full"
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={handleInputChange}
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <button
                className="btn btn-primary w-full mt-2"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Group"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupPage;
