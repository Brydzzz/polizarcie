import { hasPermission, Permissions } from "@/lib/permissions";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";

const useHasPermission = <Resource extends keyof Permissions>(
  user: User | undefined,
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"]
) => {
  const [has, setHas] = useState(false);

  useEffect(() => {
    const exec = async () => {
      setHas(hasPermission(user, resource, action, data));
    };
    exec();
  }, [user, resource, action, data]);

  return { has };
};

export default useHasPermission;
