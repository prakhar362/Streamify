import { UsersIcon } from "lucide-react";

const NoGroupFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4">
        <UsersIcon className="size-16 opacity-50" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No Groups Found</h3>
      <p className="text-base-content opacity-70 max-w-md">
        You haven't joined any groups yet. Create a new group or join existing ones to start learning with others!
      </p>
    </div>
  );
};

export default NoGroupFound; 