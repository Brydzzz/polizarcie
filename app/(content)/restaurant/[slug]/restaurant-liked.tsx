"use client";

import HeartInput from "@/components/inputs/heart-input.component";
import { addToLiked, checkIfRestLikedByUser } from "@/lib/db/users";
import { useAppSelector } from "@/lib/store/hooks";
import { selectCurrentUser } from "@/lib/store/user/user.selector";
import { useEffect, useState } from "react";
type Props = {
  restId: string;
};

const RestaurantLiked = ({ restId }: Props) => {
  const [liked, setLiked] = useState<boolean>(false);
  const user = useAppSelector(selectCurrentUser);
  useEffect(() => {
    const update = async () => {
      console.log(user);
      if (!user) {
        return false;
      }
      const data = await checkIfRestLikedByUser(user.id, restId);
      console.log(data);
      setLiked(data);
      return data;
    };
    update();
  }, [user]);
  useEffect(() => {
    const update = async () => {
      if (!user) {
        return false;
      }
      console.log(liked);
      if (!liked) {
        addToLiked(user?.id, restId);
      }
    };
    update();
  }, [liked]);
  return <HeartInput liked={liked} heartSize="30pt" onChange={setLiked} />;
};

export default RestaurantLiked;
