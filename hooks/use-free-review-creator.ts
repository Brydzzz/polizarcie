import { useAppSelector } from "@/lib/store/hooks";
import { selectReviewsFreeCreatorForced } from "@/lib/store/reviews/reviews.selector";
import { forceCreatorFree } from "@/lib/store/reviews/reviews.slice";
import { ReviewType } from "@/utils/factories/reviews";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useFreeReviewCreator = (type: keyof ReviewType) => {
  const freeCreator = useAppSelector(selectReviewsFreeCreatorForced);
  const [localFreeCounter, setLocalFreeCounter] = useState(freeCreator[type]);
  const [freeForced, setFreeForced] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (freeCreator[type] === localFreeCounter) return;
    setLocalFreeCounter(freeCreator[type]);
    setFreeForced(freeForced + 1);
  }, [freeCreator]);

  const forceFree = () => {
    setLocalFreeCounter(localFreeCounter + 1);
    dispatch(forceCreatorFree(type));
  };

  return { freeForced, forceFree };
};

export default useFreeReviewCreator;
