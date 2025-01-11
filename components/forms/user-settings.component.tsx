"use client";

import { Gender, MediaType, UserMedia } from "@prisma/client";
import Input from "../inputs/generic-input.component";
import SelectBox from "../inputs/generic-select.component";
import TextArea from "../inputs/generic-textarea.component";
import ImageInput from "../inputs/image-input.component";
import Switch from "../inputs/switch.component";

import { createImages } from "@/lib/db/images";
import {
  linkProfileImage,
  saveUserMedias,
  saveUserSettings,
  UserFull,
} from "@/lib/db/users";
import { useAppDispatch } from "@/lib/store/hooks";
import { addSnackbar } from "@/lib/store/ui/ui.slice";
import { blobToDataURL, makeRequest } from "@/utils/misc";
import { useState } from "react";
import Button from "../button/button.component";
import { ButtonColor, ButtonSize } from "../button/button.types";
import styles from "./user-settings.module.scss";

type Props = {
  user: UserFull;
};

const GENDER_SELECTION_OPTIONS = [
  {
    name: "Nie chcę podawać",
    value: Gender.NOT_SET,
  },
  {
    name: "Kobieta",
    value: Gender.FEMALE,
  },
  {
    name: "Mężczyzna",
    value: Gender.MALE,
  },
  {
    name: "Niebinarny",
    value: Gender.NON_BINARY,
  },
];

const PREFERRED_GENDER_SELECTION_OPTIONS = [
  {
    name: "Nieokreślona",
    value: Gender.NOT_SET,
  },
  {
    name: "Kobieta",
    value: Gender.FEMALE,
  },
  {
    name: "Mężczyzna",
    value: Gender.MALE,
  },
  {
    name: "Niebinarna",
    value: Gender.NON_BINARY,
  },
];

const UserSettingsForm = ({ user }: Props) => {
  const dispatch = useAppDispatch();

  const [name, setUsername] = useState(user.name || "");
  const [isToggledMeeting, setIsToggledMeeting] = useState(user.meetingStatus);
  const [isToggledCensorship, setIsToggledCensorship] = useState(false);
  const currentProfileImage = user.localProfileImagePath
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/render/image/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME}/images/${user.localProfileImagePath}`
    : user.image || undefined;
  const [profileImage, setProfileImage] = useState<File | undefined>();
  const [description, setDescription] = useState(user.description || "");
  const [gender, setGender] = useState<Gender>(user.gender);
  const [genderMeeting, setGenderMeeting] = useState<Gender>(
    user.preferredGender || Gender.NOT_SET
  );

  const medias = user.medias;
  const [facebook, setUserFacebook] = useState(
    medias.filter((media) => media.type === MediaType.FACEBOOK).at(0)?.link ||
      ""
  );
  const [instagram, setUserInstagram] = useState(
    medias.filter((media) => media.type === MediaType.INSTAGRAM).at(0)?.link ||
      ""
  );
  const [snapchat, setUserSnapchat] = useState(
    medias.filter((media) => media.type === MediaType.SNAPCHAT).at(0)?.link ||
      ""
  );
  const [twitter, setUserTwitter] = useState(
    medias.filter((media) => media.type === MediaType.TWITTER).at(0)?.link || ""
  );
  const [tiktok, setUserTiktok] = useState(
    medias.filter((media) => media.type === MediaType.TIKTOK).at(0)?.link || ""
  );

  const handleSave = async () => {
    if (facebook && !facebook.startsWith("https://www.facebook.com/")) {
      dispatch(
        addSnackbar({ message: "Nieprawidłowy Facebook", type: "error" })
      );
      return;
    }
    if (instagram && !instagram.startsWith("https://www.instagram.com/")) {
      dispatch(
        addSnackbar({ message: "Nieprawidłowy Instagram", type: "error" })
      );
      return;
    }
    if (snapchat && !snapchat.startsWith("https://www.snapchat.com/add/")) {
      dispatch(
        addSnackbar({ message: "Nieprawidłowy Snapchat", type: "error" })
      );
      return;
    }
    if (twitter && !twitter.startsWith("https://x.com/")) {
      dispatch(
        addSnackbar({ message: "Nieprawidłowy Twitter/X", type: "error" })
      );
      return;
    }
    if (tiktok && !tiktok.startsWith("https://www.tiktok.com/@")) {
      dispatch(addSnackbar({ message: "Nieprawidłowy TikTok", type: "error" }));
      return;
    }

    try {
      if (profileImage) {
        const paths = await makeRequest(
          createImages,
          [
            [
              {
                info: {
                  path: `profile/${user.id}.${profileImage.name
                    .split(".")
                    .pop()}`,
                  title: `${user.name} profile image`,
                },
                imageDataUrl: await blobToDataURL(profileImage),
              },
            ],
          ],
          dispatch
        );
        await makeRequest(linkProfileImage, [paths[0]], dispatch);
      }
    } catch (error) {
      const message = (error as Error).message;
      if (!message.startsWith("POLI_ERROR")) throw error;
    }

    const userSettings = {
      name: name,
      description: description,
      gender: gender,
      meetingStatus: isToggledMeeting,
      preferredGender: genderMeeting,
    };

    await saveUserSettings(user.id, userSettings);
    const userMedias: { type: UserMedia["type"]; link: string }[] = [
      { type: "FACEBOOK" as UserMedia["type"], link: facebook },
      { type: "INSTAGRAM" as UserMedia["type"], link: instagram },
      { type: "SNAPCHAT" as UserMedia["type"], link: snapchat },
      { type: "TWITTER" as UserMedia["type"], link: twitter },
      { type: "TIKTOK" as UserMedia["type"], link: tiktok },
    ];
    await saveUserMedias(user.id, userMedias);
    dispatch(addSnackbar({ message: "Zapisano", type: "success" }));
    console.log("User settings saved:", userSettings);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ustawienia</h1>
      <div className={styles.sectionTitle}>
        <h2>Podstawowe</h2>
      </div>
      <div className={styles.row}>
        <ImageInput
          label="Profilowe"
          onChange={(v) => setProfileImage(v && Object.values(v).at(0))}
          compact
          width="100px"
          initialPreview={currentProfileImage}
        />
        <div className={styles.column}>
          <Input
            label="Imię"
            value={name}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={50}
          />
          <SelectBox
            label="Płeć"
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
            options={GENDER_SELECTION_OPTIONS}
          />
        </div>
      </div>
      <TextArea
        label="Opis"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className={styles.right}>
        <Button
          type="button"
          onClick={() => handleSave()}
          size={ButtonSize.SMALL}
          color={ButtonColor.SECONDARY}
        >
          <i className="fa-solid fa-floppy-disk"></i>&nbsp;Zapisz
        </Button>
      </div>
      <div className={styles.sectionTitle}>
        <h2>Funkcjonalności</h2>
      </div>
      <Switch
        label="Filtruj wiadomości niecenzuralne"
        checked={isToggledCensorship}
        onChange={setIsToggledCensorship}
      ></Switch>
      <div className={styles.row}>
        <Switch
          label="Randkowanie"
          checked={isToggledMeeting}
          onChange={setIsToggledMeeting}
        ></Switch>
        <SelectBox
          label="Romantyczna preferencja"
          value={genderMeeting}
          onChange={(e) => setGenderMeeting(e.target.value as Gender)}
          options={PREFERRED_GENDER_SELECTION_OPTIONS}
          disabled={!isToggledMeeting}
        />
      </div>
      <div className={styles.right}>
        <Button
          type="button"
          onClick={() => handleSave()}
          size={ButtonSize.SMALL}
          color={ButtonColor.SECONDARY}
        >
          <i className="fa-solid fa-floppy-disk"></i>&nbsp;Zapisz
        </Button>
      </div>
      <div className={styles.sectionTitle}>
        <h2>Podpięte media</h2>
      </div>
      <Input
        label="Facebook"
        value={facebook}
        onChange={(e) => setUserFacebook(e.target.value)}
      />
      <Input
        label="Instagram"
        value={instagram}
        onChange={(e) => setUserInstagram(e.target.value)}
      />
      <Input
        label="Snapchat"
        value={snapchat}
        onChange={(e) => setUserSnapchat(e.target.value)}
      />
      <Input
        label="Twitter/X"
        value={twitter}
        onChange={(e) => setUserTwitter(e.target.value)}
      />
      <Input
        label="TikTok"
        value={tiktok}
        onChange={(e) => setUserTiktok(e.target.value)}
      />
      <div className={styles.right}>
        <Button
          type="button"
          onClick={() => handleSave()}
          size={ButtonSize.SMALL}
          color={ButtonColor.SECONDARY}
        >
          <i className="fa-solid fa-floppy-disk"></i>&nbsp;Zapisz
        </Button>
      </div>
    </div>
  );
};

export default UserSettingsForm;
