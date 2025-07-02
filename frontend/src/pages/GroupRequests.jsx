import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { 
  getGroupRequests, 
  getOutgoingGroupRequests, 
  acceptGroupRequest 
} from "../lib/api";
import { CheckCircleIcon, UsersIcon, XCircleIcon } from "lucide-react";
import { capitialize } from "../lib/utils";

const GroupRequests = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("incoming");

  const { data: incomingRequests = [], isLoading: loadingIncoming } = useQuery({
    queryKey: ["groupRequests"],
    queryFn: getGroupRequests,
  });

  const { data: outgoingRequests = [], isLoading: loadingOutgoing } = useQuery({
    queryKey: ["outgoingGroupRequests"],
    queryFn: getOutgoingGroupRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptGroupRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupRequests"] });
      queryClient.invalidateQueries({ queryKey: ["outgoingGroupRequests"] });
    },
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Group Requests</h2>
        </div>

        {/* Tab Navigation */}
        <div className="tabs tabs-boxed">
          <button
            className={`tab ${activeTab === "incoming" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("incoming")}
          >
            Incoming Requests ({incomingRequests.length})
          </button>
          <button
            className={`tab ${activeTab === "outgoing" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("outgoing")}
          >
            Outgoing Requests ({outgoingRequests.length})
          </button>
        </div>

        {/* Incoming Requests */}
        {activeTab === "incoming" && (
          <div>
            {loadingIncoming ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : incomingRequests.length === 0 ? (
              <div className="card bg-base-200 p-6 text-center">
                <UsersIcon className="size-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-semibold text-lg mb-2">No incoming requests</h3>
                <p className="text-base-content opacity-70">
                  You don't have any pending group requests at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {incomingRequests.map((request) => (
                  <div key={request._id} className="card bg-base-200">
                    <div className="card-body p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="avatar size-12 bg-primary rounded-full flex items-center justify-center">
                          <UsersIcon className="size-6 text-primary-content" />
                        </div>
                                                 <div>
                           <h3 className="font-semibold">{request.group.groupName}</h3>
                           <p className="text-sm opacity-70">Request from {request.sender.fullName}</p>
                         </div>
                      </div>
                      
                      {request.group.desc && (
                        <p className="text-sm opacity-70 mb-3">{request.group.desc}</p>
                      )}

                      <div className="flex gap-2">
                                                 <button
                           className="btn btn-primary btn-sm flex-1"
                           onClick={() => acceptRequestMutation(request._id)}
                           disabled={isPending}
                         >
                          <CheckCircleIcon className="size-4 mr-1" />
                          Accept
                        </button>
                        <button className="btn btn-outline btn-sm flex-1">
                          <XCircleIcon className="size-4 mr-1" />
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Outgoing Requests */}
        {activeTab === "outgoing" && (
          <div>
            {loadingOutgoing ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : outgoingRequests.length === 0 ? (
              <div className="card bg-base-200 p-6 text-center">
                <UsersIcon className="size-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-semibold text-lg mb-2">No outgoing requests</h3>
                <p className="text-base-content opacity-70">
                  You haven't sent any group requests yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {outgoingRequests.map((request) => (
                  <div key={request._id} className="card bg-base-200">
                    <div className="card-body p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="avatar size-12 bg-primary rounded-full flex items-center justify-center">
                          <UsersIcon className="size-6 text-primary-content" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{request.group.groupName}</h3>
                          <p className="text-sm opacity-70">Request to {request.recipient.fullName}</p>
                        </div>
                      </div>
                      
                      {request.group.desc && (
                        <p className="text-sm opacity-70 mb-3">{request.group.desc}</p>
                      )}

                      <div className="badge badge-outline">Pending</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupRequests; 