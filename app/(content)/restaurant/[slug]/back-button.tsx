"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const BackButton = () => {
  const searchParams = useSearchParams();
  let origin = searchParams.get("origin");
  if (!origin || !(origin === "map" || origin === "browse" || origin === "favorite")) {
    origin = "browse";
  }
  if (origin === "favorite") origin = "dashboard/favorite";
  return (
    <Link href={`/${origin}`}>
      <span style={{ fontSize: "30pt", color: "var(--primary)" }}>
        <i className="fa-solid fa-arrow-left"></i>
      </span>
    </Link>
  );
};

export default BackButton;
