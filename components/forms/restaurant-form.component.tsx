"use client";

import useRestaurantStore from "@/hooks/use-restaurant-store";
import { createImages, deleteImages } from "@/lib/db/images";
import {
  createRestaurant,
  deleteRestaurant,
  linkImagesToRestaurant,
  RestaurantFull,
  updateRestaurant,
} from "@/lib/db/restaurants";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectViewportWidth } from "@/lib/store/ui/ui.selector";
import { addSnackbar, ViewportSize } from "@/lib/store/ui/ui.slice";
import { makeRequest } from "@/utils/misc";
import { prepareImagesToUpload } from "@/utils/misc.client";
import { useEffect, useState } from "react";
import Button from "../button/button.component";
import { ButtonColor, ButtonSize } from "../button/button.types";
import Input from "../inputs/generic-input.component";
import TextArea from "../inputs/generic-textarea.component";
import ImageInput from "../inputs/image-input.component";
import RangeInput from "../inputs/range-input.component";
import Switch from "../inputs/switch.component";
import RestaurantSelector from "../lists/restaurant-selector";
import styles from "./dashboard-forms.module.scss";

const WEEKDAYS = {
  Mon: "Poniedziałek",
  Tue: "Wtorek",
  Wen: "Środa",
  Thu: "Czwartek",
  Fri: "Piątek",
  Sat: "Sobota",
  Sun: "Niedziela",
};

const RestaurantForm = () => {
  const dispatch = useAppDispatch();
  const [files, setFiles] = useState<File[] | undefined>();
  const [loading, setLoading] = useState(false);
  const store = useRestaurantStore();
  const [selected, setSelected] = useState<RestaurantFull | undefined>();
  const size = useAppSelector(selectViewportWidth);

  useEffect(() => {
    store.loadData(selected);
    if (!selected) store.reset();
  }, [selected]);

  const saveAndUpdate =
    <
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Func extends (...args: any[]) => Promise<any>
    >(
      func: Func
    ) =>
    async () => {
      setLoading(true);
      try {
        await func();
      } catch (error) {
        const message = (error as Error).message;
        if (!message.startsWith("POLI_ERROR")) {
          setLoading(false);
          throw error;
        }
      }
      setLoading(false);
    };

  const saveNew = async () => {
    let imagesPaths: string[] = [];
    const result = await makeRequest(
      createRestaurant,
      [{ ...store.getCreator() }],
      dispatch
    );
    if (!result) {
      dispatch(addSnackbar({ message: "Wystąpił błąd", type: "error" }));
      return;
    }
    if (files) {
      imagesPaths = await makeRequest(
        createImages,
        [
          await prepareImagesToUpload(
            files,
            `restaurants/${result.id}`,
            `Restaurant image for ${result.name}`
          ),
        ],
        dispatch
      );
      await makeRequest(
        linkImagesToRestaurant,
        [result.id, imagesPaths],
        dispatch
      );
    }
    dispatch(addSnackbar({ message: "Dodano restauracje", type: "success" }));
    store.reset();
  };

  const updateOld = async () => {
    if (!selected) return;
    let imagesPaths: string[] = [];
    const result = await makeRequest(
      updateRestaurant,
      [{ ...store.getCreator(), id: selected.id }],
      dispatch
    );
    if (files) {
      await makeRequest(
        deleteImages,
        [selected.images.map((image) => image.path)],
        dispatch
      );
      imagesPaths = await makeRequest(
        createImages,
        [
          await prepareImagesToUpload(
            files,
            `restaurants/${result.id}`,
            `Restaurant image for ${result.name}`
          ),
        ],
        dispatch
      );
      await makeRequest(
        linkImagesToRestaurant,
        [result.id, imagesPaths],
        dispatch
      );
    }
    dispatch(addSnackbar({ message: "Zapisano zmiany", type: "success" }));
  };

  const remove = async () => {
    if (!selected) return;
    let imagesPaths: string[] = [];
    const result = await makeRequest(deleteRestaurant, [selected.id], dispatch);
    setSelected(undefined);
    dispatch(addSnackbar({ message: "Usunięto", type: "success" }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Zarządzaj restauracjami</h1>
      <div className={styles.sectionTitle}>
        <h2>Wybierz restaurację</h2>
      </div>
      <RestaurantSelector onSelected={setSelected} />
      <div className={styles.sectionTitle}>
        <h2>{selected ? `Aktualizuj dane` : "Dodaj nową restaurację"}</h2>
      </div>
      <Input
        label="Nazwa restauracji"
        value={store.getState("name")}
        onChange={(e) => store.setState("name", e.target.value)}
        required
      ></Input>
      <TextArea
        label="Opis"
        value={store.getState("description")}
        onChange={(e) => store.setState("description", e.target.value)}
        required
      ></TextArea>
      <Input
        label="Adres"
        value={store.getState("addressName")}
        onChange={(e) => store.setState("addressName", e.target.value)}
        required
      ></Input>
      <div className={styles.row}>
        <Input
          label="Współrzędne X"
          value={store.getState("addressXcoords")}
          onChange={(e) => store.setState("addressXcoords", e.target.value)}
          required
        ></Input>
        <Input
          label="Współrzędne Y"
          value={store.getState("addressYcoords")}
          onChange={(e) => store.setState("addressYcoords", e.target.value)}
          required
        ></Input>
      </div>
      <div className={styles.sectionTitle}>
        <h2>Godziny otwarcia</h2>
      </div>
      {Object.keys(WEEKDAYS).map((key) => {
        const weekday = key as keyof typeof WEEKDAYS;
        return (
          <div
            key={weekday}
            className={styles.row}
            style={{
              flexDirection: size < ViewportSize.SM ? "column-reverse" : "row",
            }}
          >
            <RangeInput
              label={size < ViewportSize.SM ? "" : WEEKDAYS[weekday]}
              value={{
                min: store.getState(`openingTime${weekday}`),
                max: store.getState(`closingTime${weekday}`),
              }}
              onChange={(v) => {
                store.setState(`openingTime${weekday}`, v.min);
                store.setState(`closingTime${weekday}`, v.max);
              }}
              limit={{
                min: 0,
                max: 24 * 60,
              }}
              step={15}
              time
              disabled={!store.getState(`enabled${weekday}`)}
            />
            <Switch
              label={size < ViewportSize.SM ? WEEKDAYS[weekday] : ""}
              checked={store.getState(`enabled${weekday}`)}
              onChange={(v) => store.setState(`enabled${weekday}`, v)}
            />
          </div>
        );
      })}
      <div className={styles.sectionTitle}>
        <h2>Zdjęcia</h2>
      </div>
      <ImageInput
        label="Zdjęcia"
        multiple
        onChange={(v) => setFiles(v && Object.values(v))}
        initialPreview={
          selected
            ? selected.images.map(
                (image) =>
                  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/render/image/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME}/images/${image.path}`
              )
            : undefined
        }
      />
      {selected && (
        <div className={styles.right}>
          <Button
            type="button"
            onClick={saveAndUpdate(remove)}
            size={ButtonSize.SMALL}
            color={ButtonColor.NEGATIVE}
            disabled={loading}
          >
            <i className="fa-solid fa-trash"></i>&nbsp;&nbsp; Usuń
          </Button>
        </div>
      )}
      <div className={styles.right}>
        <Button
          type="button"
          onClick={selected ? saveAndUpdate(updateOld) : saveAndUpdate(saveNew)}
          size={ButtonSize.SMALL}
          color={ButtonColor.SECONDARY}
          disabled={loading}
        >
          <i className="fa-solid fa-floppy-disk"></i>&nbsp;&nbsp;
          {loading ? "Zapisywanie..." : "Zapisz"}
        </Button>
      </div>
    </div>
  );
};

export default RestaurantForm;
