"use client";

import Checkbox from "@/components/inputs/checkbox.component";
import Input from "@/components/inputs/generic-input.component";
import SelectBox from "@/components/inputs/generic-select.component";
import TextArea from "@/components/inputs/generic-textarea.component";
import ImageInput from "@/components/inputs/image-input.component";
import Multiselect from "@/components/inputs/multiselect.component";
import PasswordInput from "@/components/inputs/password-input.component";
import RangeInput from "@/components/inputs/range-input.component";
import Searchbar from "@/components/inputs/searchbar.component";
import {
  SearchbarSize,
  SearchbarStyle,
} from "@/components/inputs/searchbar.types";
import SliderInput from "@/components/inputs/slider-input.component";
import StarInput from "@/components/inputs/star-input.component";
import { useState } from "react";

const FiltersPage = () => {
  const [range, setRange] = useState({ min: 15, max: 65 });
  const [stars, setStars] = useState(3);
  const [slider, setSlider] = useState(3);
  const [text1, setText1] = useState("test");
  const [text2, setText2] = useState("");
  const [text3, setText3] = useState("Uzupełnione wcześniej");
  const [text4, setText4] = useState("1qaz@WSX");
  const [text5, setText5] = useState("");
  const [text6, setText6] = useState("");
  const [text7, setText7] = useState("pg1");
  const [text8, setText8] = useState("");
  const [text9, setText9] = useState("");
  const [multiselect, setMultiselect] = useState<string[]>([]);
  const [checkbox, setCheckbox] = useState(false);

  return (
    <div
      className="centralized-x"
      style={{ marginTop: "100px", paddingBottom: "100px" }}
    >
      <div className="centralized-y" style={{ width: "350px" }}>
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
          label="Błąd"
          value={text8}
          onChange={(e) => setText8(e.target.value)}
          error
        />
        <Input
          label="Wyłączony"
          value={text3}
          onChange={(e) => setText3(e.target.value)}
          disabled
        />
        <PasswordInput
          label="Hasło"
          value={text4}
          onChange={(e) => setText4(e.target.value)}
          // disabled
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
        <Multiselect
          label="Wybierz coś"
          value={multiselect}
          onChange={setMultiselect}
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
        <RangeInput
          value={range}
          limit={{ min: 0, max: 100 }}
          onChange={setRange}
          suffix=" zł"
          label="Cena"
        />
        <SliderInput
          value={slider}
          limit={{ min: 0, max: 10 }}
          onChange={setSlider}
          suffix=" zł"
          label="Cena"
        />
        <ImageInput label="Zdjęcie" />
        <Checkbox
          value={checkbox}
          onChange={(e) => setCheckbox(e.target.checked)}
          label="Wyrażam zgodę"
        />
        <Checkbox
          value={checkbox}
          onChange={(e) => setCheckbox(e.target.checked)}
          label="Wyrażasz zgodę."
          required
        />
        <StarInput value={stars} max={5} onChange={setStars} />
        <Searchbar
          placeholder="Wyszukaj coś"
          value={text9}
          onChange={(e) => setText9(e.target.value)}
          onCancelButtonClick={() => setText9("")}
          style={SearchbarStyle.INPUT_LIKE}
          size={SearchbarSize.SMALL}
        />
        <Searchbar
          placeholder="Wyszukaj coś"
          value={text9}
          onChange={(e) => setText9(e.target.value)}
          onCancelButtonClick={() => setText9("")}
          style={SearchbarStyle.HERO}
          size={SearchbarSize.NORMAL}
          filters
        />
        <Searchbar
          placeholder="Wyszukaj coś"
          value={text9}
          onChange={(e) => setText9(e.target.value)}
          onCancelButtonClick={() => setText9("")}
          style={SearchbarStyle.HERO}
          size={SearchbarSize.LARGE}
          filters
        />
      </div>
    </div>
  );
};

export default FiltersPage;
