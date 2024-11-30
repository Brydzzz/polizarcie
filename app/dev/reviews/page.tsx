import ReviewList from "@/components/lists/review-list.component";

const Page = async () => {
  return (
    <div
      className="centralized-x"
      style={{ marginTop: "100px", paddingBottom: "100px" }}
    >
      <div className="centralized-y" style={{ width: "600px" }}>
        <ReviewList type="restaurant" subjectId="1" />
      </div>
    </div>
  );
};

export default Page;
