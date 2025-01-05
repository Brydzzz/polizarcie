"use client";

import HeartInput from "@/components/inputs/heart-input.component";
import {
  addRestaurantToLiked,
  isRestaurantLiked,
  removeRestaurantFromLiked,
} from "@/lib/db/users";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectCurrentUser } from "@/lib/store/user/user.selector";
import { makeRequest } from "@/utils/misc";
import { useEffect, useState } from "react";
type Props = {
  restId: string;
};
const RestaurantLiked = ({ restId }: Props) => {
  const [liked, setLiked] = useState<boolean>(false);
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const update = async () => {
      if (!user) {
        return false;
      }
      try {
        const data = await makeRequest(isRestaurantLiked, [restId], dispatch);
        setLiked(data);
      } catch (error) {}
    };
    update();
  }, [user]);

  const handleChange = async (newValue: boolean) => {
    setLiked(newValue);
    if (!user) {
      return false;
    }
    try {
      const check = await makeRequest(isRestaurantLiked, [restId], dispatch);
      if (newValue && !check) {
        await makeRequest(addRestaurantToLiked, [restId], dispatch);
      } else if (!newValue && check) {
        await makeRequest(removeRestaurantFromLiked, [restId], dispatch);
      }
    } catch (error) {
      setLiked(!newValue);
    }
  };

  return user ? (
    <HeartInput
      value={liked}
      heartSize="30pt"
      onChange={(v) => handleChange(v)}
    />
  ) : (
    <HeartInput value={liked} heartSize="30pt" disabled />
  );
};

export default RestaurantLiked;
