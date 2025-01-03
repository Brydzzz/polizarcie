"use client";

import HeartInput from "@/components/inputs/heart-input.component";
import {
  addRestaurantToLiked,
  isRestaurantLiked,
  removeRestaurantFromLiked,
} from "@/lib/db/users";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addSnackbar } from "@/lib/store/ui/ui.slice";
import { selectCurrentUser } from "@/lib/store/user/user.selector";
import { useEffect, useState } from "react";
type Props = {
  restId: string;
};
/* TODO: make it so that liked restaurants are added and first free ranking spot */
const RestaurantLiked = ({ restId }: Props) => {
  const [liked, setLiked] = useState<boolean>(false);
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const update = async () => {
      if (!user) {
        return false;
      }
      const data = await isRestaurantLiked(restId);
      setLiked(data);
      return data;
    };
    update();
  }, [user]);

  const handleChange = async (newValue: boolean) => {
    setLiked(newValue);
    if (!user) {
      return false;
    }
    const check = await isRestaurantLiked(restId);
    try {
      if (newValue && !check) {
        await addRestaurantToLiked(restId);
      } else if (!newValue && check) {
        await removeRestaurantFromLiked(restId);
      }
    } catch (error) {
      dispatch(
        addSnackbar({ message: (error as Error).message, type: "error" })
      );
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
