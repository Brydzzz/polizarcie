"use server";

import ProfilePage from "@/app/(content)/profile/[id]/page";
import { getCurrentUser } from "@/utils/users";

const MyProfilePage = async () => {
  const user = await getCurrentUser();
  if (!user) {
    return <div>User not found</div>;
  }
  return (
    <ProfilePage params={Promise.resolve({ id: user.id, onDashboard: true })} />
  );
};

export default MyProfilePage;
