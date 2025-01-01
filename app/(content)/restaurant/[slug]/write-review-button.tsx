"use client";

import Button from "@/components/button/button.component";
import { ButtonSize } from "@/components/button/button.types";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectViewportWidth } from "@/lib/store/ui/ui.selector";
import { setRestaurantPageView } from "@/lib/store/ui/ui.slice";

const WriteReviewButton = () => {
  const dispatch = useAppDispatch();
  const size = useAppSelector(selectViewportWidth);

  return (
    <Button
      onClick={() => dispatch(setRestaurantPageView("reviews"))}
      size={size < 700 ? ButtonSize.SMALL : ButtonSize.NORMAL}
    >
      <i className="fa-solid fa-pen-to-square"></i>&nbsp; Napisz Opinię
    </Button>
  );
};

export default WriteReviewButton;
