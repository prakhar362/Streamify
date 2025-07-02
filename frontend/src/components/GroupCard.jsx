import { Link } from "react-router";
import { UsersIcon } from "lucide-react";

const GroupCard = ({ group }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-2">
        {/* GROUP INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12 bg-primary rounded-full flex items-center justify-center">
            <UsersIcon className="size-6 text-primary-content" />
          </div>
          <div>
            <h3 className="font-semibold text-xl truncate">{group.groupName}</h3>
            <p className="text-sm opacity-70">{group.desc}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {group.members?.length || 0} members
          </span>
          {group.learningLanguage && (
            <span className="badge badge-outline text-xs">
              {group.learningLanguage}
            </span>
          )}
        </div>

        <Link to={`/group/${group._id}`} className="btn btn-outline w-full">
          View Group
        </Link>
      </div>
    </div>
  );
};

export default GroupCard; 