import { UserMedia } from "@prisma/client";
import styles from "./link-card.module.scss";
type Props = {
  data: Partial<UserMedia>;
};

const MediaTypeDict: { [key: string]: JSX.Element } = {
  FACEBOOK: <i className="fa-brands fa-facebook"></i>,
  INSTAGRAM: <i className="fa-brands fa-instagram"></i>,
  TWITTER: <i className="fa-brands fa-twitter"></i>,
  SNAPCHAT: <i className="fa-brands fa-snapchat"></i>,
  TIKTOK: <i className="fa-brands fa-tiktok"></i>,
  GITHUB: <i className="fa-brands fa-github"></i>,
};

const LinkCard = ({ data }: Props) => {
  const { link, type } = data;
  return (
    <div className={styles.container}>
      <p className={styles.type}>{MediaTypeDict[String(type)]}</p>
      <a href={link}>{String(type).toLowerCase()}</a>
    </div>
  );
};

export default LinkCard;
