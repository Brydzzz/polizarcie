"use client";

import { MouseEventHandler, useState } from "react";
import Button from "../button/button.component";
import { ButtonStyle } from "../button/button.types";
import SelectBox from "../inputs/generic-select.component";
import RangeInput from "../inputs/range-input.component";
import StarInput from "../inputs/star-input.component";
import Switch from "../inputs/switch.component";
import styles from "./filter-modal.module.scss";

// TODO add onclicks for buttons
type Props = {
  onCancelButtonClick?: MouseEventHandler;
};

const FilterModal = ({ onCancelButtonClick }: Props) => {
  const sortOptions = [
    { name: "Nazwa", value: "name" },
    { name: "Ocena", value: "rating" },
    { name: "Cena na osobę", value: "price" },
  ];
  const facultyOptions = [
    { name: "Wybierz", value: "none" },
    { name: "Kolegium Nauk Ekonomicznych i Społecznych", value: "knes" },
    { name: "Wydział Administracji i Nauk Społecznych", value: "admin_social" },
    { name: "Wydział Architektury", value: "arch" },
    {
      name: "Wydział Budownictwa, Mechaniki i Petrochemii",
      value: "civil_mech_petro",
    },
    { name: "Wydział Chemiczny", value: "chemical" },
    { name: "Wydział Elektroniki i Technik Informacyjnych", value: "weiti" },
    { name: "Wydział Elektryczny", value: "electric" },
    { name: "Wydział Fizyki", value: "physics" },
    { name: "Wydział Geodezji i Kartografii", value: "geodesy_cartography" },
    {
      name: "Wydział Instalacji Budowlanych, Hydrotechniki i Inżynierii Środowiska",
      value: "building_hydrotechnics",
    },
    {
      name: "Wydział Inżynierii Chemicznej i Procesowej",
      value: "chemical_process",
    },
    { name: "Wydział Inżynierii Lądowej", value: "land_engineering" },
    { name: "Wydział Inżynierii Materiałowej", value: "material_engineering" },
    { name: "Wydział Matematyki i Nauk Informacyjnych", value: "mini" },
    {
      name: "Wydział Mechaniczny Energetyki i Lotnictwa",
      value: "mech_energy_aero",
    },
    { name: "Wydział Mechaniczny Technologiczny", value: "mech_tech" },
    { name: "Wydział Mechatroniki", value: "mech" },
    {
      name: "Wydział Samochodów i Maszyn Roboczych",
      value: "vehicles_machines",
    },
    { name: "Wydział Transportu", value: "transport" },
    { name: "Wydział Zarządzania", value: "management" },
  ];

  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [isOpen, setIsOpen] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [selectedSort, setSelectedSort] = useState("name");
  const [selectedFaculty, setSelectedFaculty] = useState("none");

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Filtry</h1>
        <span onClick={onCancelButtonClick}>
          <i className="fa-solid fa-xmark"></i>
        </span>
      </div>
      <div className={styles.filters}>
        <SelectBox
          label="Sortuj"
          options={sortOptions}
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
        ></SelectBox>
        <RangeInput
          value={priceRange}
          limit={{ min: 0, max: 100 }}
          onChange={setPriceRange}
          suffix=" zł"
          label="Cena na osobę"
        ></RangeInput>
        <div className={styles.rating}>
          <h3>Minimalna Ocena</h3>
          <StarInput
            value={minRating}
            max={5}
            onChange={setMinRating}
          ></StarInput>
        </div>
        <Switch
          label="Otwarte Teraz"
          checked={isOpen}
          onChange={setIsOpen}
        ></Switch>
        <SelectBox
          label="Wydział"
          options={facultyOptions}
          value={selectedFaculty}
          onChange={(e) => setSelectedFaculty(e.target.value)}
        ></SelectBox>
      </div>
      <div className={styles.buttons}>
        <Button style={ButtonStyle.BACKDROP}>Wyczyść</Button>
        <Button>Zastosuj</Button>
      </div>
    </div>
  );
};

export default FilterModal;
