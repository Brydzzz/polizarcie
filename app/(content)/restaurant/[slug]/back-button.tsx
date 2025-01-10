"use client";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  return (
    <span
      onClick={() => router.back()}
      style={{ fontSize: "30pt", color: "var(--primary)" }}
    >
      <i className="fa-solid fa-arrow-left"></i>
    </span>
  );
};

export default BackButton;
