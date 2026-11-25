import { Badge } from "@/components/ui/badge";
import type { User } from "@/types";

type SelectedUsersListProps = {
  users: User[];
};

/** A scrollable list of the users that a confirm dialog will change (name, email, role). */
const SelectedUsersList = ({
  users,
}: SelectedUsersListProps) => {
  return (
    <ul className="max-h-60 divide-y overflow-y-auto rounded-md border text-sm">
      {users.map((user) => (
        <li
          key={user.id}
          className="flex items-center justify-between gap-3 px-3 py-2"
        >
          <div className="min-w-0">
            <p className="truncate font-medium">
              {user.first_name} {user.last_name}
            </p>
            <p className="truncate text-muted-foreground">
              {user.email}
            </p>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {user.role}
          </Badge>
        </li>
      ))}
    </ul>
  );
};

export default SelectedUsersList;
