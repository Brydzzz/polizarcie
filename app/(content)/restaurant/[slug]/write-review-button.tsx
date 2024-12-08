"use client";

import Button from "@/components/button/button.component";
import { useAppDispatch } from "@/lib/store/hooks";
import { setRestaurantPageView } from "@/lib/store/ui/ui.slice";

const WriteReviewButton = () => {
  const dispatch = useAppDispatch();

  return (
    <Button onClick={() => dispatch(setRestaurantPageView("reviews"))}>
      <i className="fa-solid fa-pen-to-square"></i>&nbsp; Napisz Opinię
    </Button>
  );
};

export default WriteReviewButton;
