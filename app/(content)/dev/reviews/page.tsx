import ReviewList from "@/components/lists/review-list.component";
import { getCurrentUser } from "@/utils/users";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <div
      className="centralized-x"
      style={{ marginTop: "100px", paddingBottom: "100px" }}
    >
      <div className="centralized-y" style={{ width: "600px" }}>
        <ReviewList mode="author" authorId={user?.id || ""} />
      </div>
    </div>
  );
};

export default Page;
