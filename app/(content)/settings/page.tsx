"use client";

import React, { useState, useEffect } from 'react';
import styles from './page.module.scss';
import { useAppSelector } from '@/lib/store/hooks';
import { saveUserSettings, getUserMedias, saveUserMedias, saveProfileImagePath } from '@/lib/db/users';
import { createImages } from "@/lib/db/images";
import { selectCurrentUser } from '@/lib/store/user/user.selector';
import { Gender, UserMedia } from "@prisma/client"

import { useAppDispatch } from "@/lib/store/hooks";
import { addSnackbar, SnackbarData } from "@/lib/store/ui/ui.slice";
import SupabaseImage from "@/components/images/supabase-image.component";

import Input from "@/components/inputs/generic-input.component";
import TextArea from "@/components/inputs/generic-textarea.component";
import SelectBox from "@/components/inputs/generic-select.component";
import ImageInput from "@/components/inputs/image-input.component";
import Switch from "@/components/inputs/switch.component";

// Define Gender enum directly in the file
// enum Gender {
//   FEMALE = 'FEMALE',
//   MALE = 'MALE',
//   NOT_SET = 'NOT_SET',
//   NON_BINARY = 'NON_BINARY',
// }

//     FACEBOOK
//     INSTAGRAM
//     SNAPCHAT
//     TWITTER
//     TIKTOK


const UserSettings = () => {

    const dispatch = useAppDispatch();

    const [text1, setText1] = useState("test");
    const [checkbox, setCheckbox] = useState(false);
    const [isToggled, setIsToggled] = useState(false);

    const [files, setFiles] = useState<File[] | undefined>();

  const user = useAppSelector(selectCurrentUser);


  const [name, setUsername] = useState('');

  const [facebook, setUserFacebook] = useState('');
  const [instagram, setUserInstagram] = useState('');
  const [snapchat, setUserSnapchat] = useState('');
  const [twitter, setUserTwitter] = useState('');
  const [tiktok, setUserTiktok] = useState('');

  const [bio, setBio] = useState('');
  const [gender, setGender] = useState<Gender>(Gender.NOT_SET); // Add gender state
  const NAME_CHAR_LIMIT = 50; // Add character limit constant

  useEffect(() => {
    const fetchUserMedias = async () => {
      if (user) {
        setUsername(user.name || '');
        setBio(user.description || '');
        setGender((user.gender as Gender) || Gender.NOT_SET); // Initialize gender state

        const userMedias = await getUserMedias(user.id);
        setUserFacebook(userMedias.find(media => media.type === 'FACEBOOK')?.link || '');
        setUserInstagram(userMedias.find(media => media.type === 'INSTAGRAM')?.link || '');
        setUserSnapchat(userMedias.find(media => media.type === 'SNAPCHAT')?.link || '');
        setUserTwitter(userMedias.find(media => media.type === 'TWITTER')?.link || '');
        setUserTiktok(userMedias.find(media => media.type === 'TIKTOK')?.link || '');
        console.log('Facebook media:', facebook);
        console.log('User medias:', userMedias);
      }
    };

    fetchUserMedias();
  }, [user]);

  if (!user) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const handleSave = async () => {
    if (!facebook.startsWith("https://www.facebook.com/profile.php?id=")) {
        dispatch(addSnackbar({ message: "Invalid Facebook URL", type: "error" }));
        return;
    }
    if (!instagram.startsWith("https://www.instagram.com/")) {
        dispatch(addSnackbar({ message: "Invalid Instagram URL", type: "error" }));
        return;
    }
    if (!snapchat.startsWith("https://www.snapchat.com/add/")) {
        dispatch(addSnackbar({ message: "Invalid Snapchat URL", type: "error" }));
        return;
    }
    if (!twitter.startsWith("https://x.com/")) {
        dispatch(addSnackbar({ message: "Invalid Twitter/X URL", type: "error" }));
        return;
    }
    if (!tiktok.startsWith("https://www.tiktok.com/@")) {
        dispatch(addSnackbar({ message: "Invalid TikTok URL", type: "error" }));
        return;
    }
    
    const userSettings = {
      name: name || null,
      description: bio || null,
      gender: gender || Gender.NOT_SET, // Add gender to user settings
    };

    try {
        if (files){
            const paths = await createImages(
                files.map((file) => ({
                info: {
                    path: "profile/" + user.id + "/" + file.name,
                    title: "Example image",
                },
                imageBody: file,
                }))
            );
            await saveProfileImagePath(user.id, paths);
        }
    } catch (error) {
    dispatch(
        addSnackbar({ message: (error as Error).message, type: "error" })
    );
    }


    await saveUserSettings(user.id, userSettings);
    const userMedias: { type: UserMedia["type"], link: string }[] = [
        { type: 'FACEBOOK' as UserMedia["type"], link: facebook },
        { type: 'INSTAGRAM' as UserMedia["type"], link: instagram },
        { type: 'SNAPCHAT' as UserMedia["type"], link: snapchat },
        { type: 'TWITTER' as UserMedia["type"], link: twitter },
        { type: 'TIKTOK' as UserMedia["type"], link: tiktok },
    ];
    await saveUserMedias(user.id, userMedias);
    dispatch(addSnackbar({ message: "Saved", type: "success" }));
    console.log('User settings saved:', userSettings);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ustawienia</h1>
      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <div className={styles.formGroup}>
        <Input
          label="Imię"
          value={name}
          onChange={(e) => setUsername(e.target.value)}
          required
          maxLength={NAME_CHAR_LIMIT}
        />
          {/* <label htmlFor="name" className={styles.label}>Name</label>
          <input
            type="text"
            id="name"
            className={styles.inputText}
            value={name}
            style={{ color: nameColor }}
            maxLength={NAME_CHAR_LIMIT} // Add maxLength attribute
            onChange={(e) => {
              if (isFirstChange) {
                setUsername(e.target.value.slice(-1));
                setIsFirstChange(false);
              } else {
                setUsername(e.target.value);
              }
              setNameColor('black');
            }}
            onBlur={(e) => {
              setUsername(e.target.value);
            }}
          /> */}
        </div>
        <div className={styles.formGroup}>
        <TextArea
          label="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
          {/* <label htmlFor="bio" className={styles.label}>Bio</label>
          <textarea
            id="bio"
            className={styles.textarea}
            value={bio}
            style={{ color: bioColor }}
            onChange={(e) => {
              setBio(e.target.value);
              setBioColor('black');
            }}
          /> */}
        </div>
        <div className={styles.formGroup}>
        <SelectBox
          label="Płeć"
          value={gender}
          onChange={(e) => setGender(e.target.value as Gender)}
          options={[
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
          ]}
        />
          {/* <label htmlFor="gender" className={styles.label}>Gender</label>
          <select
            id="gender"
            className={styles.select}
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
          >
            <option value={Gender.NOT_SET}>Not Set</option>
            <option value={Gender.FEMALE}>Female</option>
            <option value={Gender.MALE}>Male</option>
            <option value={Gender.NON_BINARY}>Non-Binary</option>
          </select> */}
        </div>
        <div className={styles.formGroup}>
        <ImageInput
            label="Zdjęcie profilowe"
            multiple
            onChange={(v) => setFiles(v && Object.values(v))}
          />
        </div>
        <h1 className={styles.title}>Social</h1>
        <div className={styles.formGroup}>
        <Input
          label="Facebook"
          value={facebook}
          onChange={(e) => setUserFacebook(e.target.value)}
          maxLength={NAME_CHAR_LIMIT}
        />
        </div>
        <div className={styles.formGroup}>
        <Input
          label="Instagram"
          value={instagram}
          onChange={(e) => setUserInstagram(e.target.value)}
          maxLength={NAME_CHAR_LIMIT}
        />
        </div>
        <div className={styles.formGroup}>
        <Input
          label="Snapchat"
          value={snapchat}
          onChange={(e) => setUserSnapchat(e.target.value)}
          maxLength={NAME_CHAR_LIMIT}
        />
        </div>
        <div className={styles.formGroup}>
        <Input
          label="Twitter/X"
          value={twitter}
          onChange={(e) => setUserTwitter(e.target.value)}
          maxLength={NAME_CHAR_LIMIT}
        />
        </div>
        <div className={styles.formGroup}>
        <Input
          label="TikTok"
          value={tiktok}
          onChange={(e) => setUserTiktok(e.target.value)}
          maxLength={NAME_CHAR_LIMIT}
        />
        </div>
        <Switch
          label="Randkowanie"
          checked={isToggled}
          onChange={setIsToggled}
        ></Switch>
        
        <button type="submit" className={styles.saveButton}>Save Changes</button>
      </form>
    </div>
  );
};

export default UserSettings;