"use client";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
const MatchPage = () => {
  const [next, goNext] = useState<Boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    const update = async () => {
      const data = await
    }
  })
};
