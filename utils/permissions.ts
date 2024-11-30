import { DishReview, RestaurantReview, Role, User } from "@prisma/client";

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: User, data: Permissions[Key]["dataType"]) => boolean);

type RolesWithPermissions = {
  [R in Role]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]["action"]]: PermissionCheck<Key>;
    }>;
  }>;
};

type Permissions = {
  reviews: {
    dataType: RestaurantReview | DishReview;
    action: "view" | "viewHidden" | "create" | "edit" | "hide" | "delete";
  };
};

const ifOwnReview = (user: User, review: RestaurantReview | DishReview) =>
  review.userId == user.id;

const ROLES = {
  ADMIN: {
    reviews: {
      view: true,
      viewHidden: true,
      create: true,
      edit: true,
      hide: true,
      delete: true,
    },
  },
  MODERATOR: {
    reviews: {
      view: true,
      viewHidden: true,
      create: true,
      edit: ifOwnReview,
      hide: true,
      delete: ifOwnReview,
    },
  },
  USER: {
    reviews: {
      view: true,
      viewHidden: ifOwnReview,
      create: true,
      edit: ifOwnReview,
      hide: ifOwnReview,
      delete: ifOwnReview,
    },
  },
} as const satisfies RolesWithPermissions;

export function hasPermission<Resource extends keyof Permissions>(
  user: User,
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"]
) {
  return user.roles.some((role) => {
    const permission = (ROLES as RolesWithPermissions)[role][resource]?.[
      action
    ];
    if (permission == null) return false;

    if (typeof permission === "boolean") return permission;
    return data != null && permission(user, data);
  });
}
