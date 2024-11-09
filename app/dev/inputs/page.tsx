"use client";

import Input from "@/components/inputs/generic-input.component";
import SelectBox from "@/components/inputs/generic-select.component";
import TextArea from "@/components/inputs/generic-textarea.component";
import RangeInput from "@/components/inputs/range-input.component";
import StarInput from "@/components/inputs/star-input.component";
import { useState } from "react";

const FiltersPage = () => {
  const [range, setRange] = useState({ min: 15, max: 65 });
  const [stars, setStars] = useState(3);
  const [text1, setText1] = useState("test");
  const [text2, setText2] = useState("");
  const [text3, setText3] = useState("Uzupełnione wcześniej");
  const [text4, setText4] = useState("1qaz@WSX");
  const [text5, setText5] = useState("");
  const [text6, setText6] = useState("");
  const [text7, setText7] = useState("pg1");

  return (
    <div
      className="centralized-x"
      style={{ marginTop: "100px", paddingBottom: "100px" }}
    >
      <div className="centralized-y" style={{ width: "350px" }}>
        <RangeInput
          value={range}
          limit={{ min: 0, max: 100 }}
          onChange={setRange}
          suffix=" zł"
        />
        <StarInput value={stars} max={5} onChange={setStars} />
        <Input
          label="Imię"
          value={text1}
          onChange={(e) => setText1(e.target.value)}
        />
        <Input
          label="Wymagany"
          value={text2}
          onChange={(e) => setText2(e.target.value)}
          required
        />
        <Input
          label="Wyłączony"
          value={text3}
          onChange={(e) => setText3(e.target.value)}
          disabled
        />
        <Input
          type="password"
          label="Hasło"
          value={text4}
          onChange={(e) => setText4(e.target.value)}
        />
        <Input
          type="date"
          label="Data"
          value={text5}
          onChange={(e) => setText5(e.target.value)}
        />
        <TextArea
          label="Pole tekstowe"
          value={text6}
          onChange={(e) => setText6(e.target.value)}
        />
        <SelectBox
          label="Wybierz coś"
          value={text7}
          onChange={(e) => setText7(e.target.value)}
          options={[
            {
              name: "Opcja 1",
              value: "p1",
            },
            {
              name: "Opcja 2",
              value: "p2",
            },
            {
              name: "Opcja 3",
              value: "p3",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default FiltersPage;
