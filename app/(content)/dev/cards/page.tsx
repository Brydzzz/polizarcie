import DishCard from "@/components/cards/dish-card.component";
import LinkCard from "@/components/cards/link-card.component";
import MatchCard from "@/components/cards/match-card-component";
import UserCard from "@/components/cards/user-desc-card-component";
import {
  Address,
  Dish,
  MediaType,
  Restaurant,
  User,
  UserFavoriteRestaurant,
  UserMedia,
} from "@prisma/client";

const TEST_REST: Partial<Restaurant & { address: Partial<Address> }>[] = [
  {
    name: "Marszałkowski Bar Mleczny",
    address: {
      name: "ul. Czekoladowa 55",
    },
    description:
      "Marszałkowski Bar Mleczny to klasyczna polska restauracja typu bar mleczny, która oferuje tradycyjne dania kuchni polskiej w przystępnych cenach.",
  },
  {
    name: "Marszałkowski Bar Mleczny",
    address: {
      name: "ul. Czekoladowa 55",
    },
    description:
      "Marszałkowski Bar Mleczny to klasyczna polska restauracja typu bar mleczny, która oferuje tradycyjne dania kuchni polskiej w przystępnych cenach.",
  },
];

const TEST_LINK: Partial<UserMedia>[] = [
  {
    link: "https://www.facebook.com/WindaNaWEiti",
    type: MediaType.FACEBOOK,
  },
];

const TEST_USER: Partial<User & { medias: Partial<UserMedia>[] }>[] = [
  {
    name: "Balbinka123",
    points: 100,
    description:
      "Hej jestem balbinka jestem kotem lubie kocia karme, lubie tez strasznie długo opisy tak długie ze nie mozna tego wytrzymac takie dlugie opisy lubie najlepiej takie ktore zabieraja kilka linijek, 3 lub wiecej serio tym wiecej linijek tym jest fajniej. strasznie bym sobie rybke zjadla i mleczkiem popila, no i ja wtedy do niego mówie PANIE JA JESTEM KOTEM i on mi nie wierzyl nie wiec normalnie zamiałkałam mu i juz nie byl taki sprytny ten gosc co nie juz uwierzyl od razu ze jestem prawdzimy kotem",
    medias: [
      {
        link: "https://www.facebook.com/WindaNaWEiti",
        type: MediaType.FACEBOOK,
      },
      {
        link: "https://www.instagram.com/weiti.fc/",
        type: MediaType.INSTAGRAM,
      },
    ],
  },
];

const TEST_USER2: Partial<
  User & {
    favouriteRestaurants: (Partial<UserFavoriteRestaurant> & {
      restaurant: Partial<Restaurant>;
    })[];
  }
>[] = [
  {
    name: "Balbinka123",
    points: 100,
    description:
      "Hej jestem balbinka jestem kotem lubie kocia karme, lubie tez strasznie długo opisy tak długie ze nie mozna tego wytrzymac takie dlugie opisy lubie najlepiej takie ktore zabieraja kilka linijek, 3 lub wiecej serio tym wiecej linijek tym jest fajniej. strasznie bym sobie rybke zjadla i mleczkiem popila, no i ja wtedy do niego mówie PANIE JA JESTEM KOTEM i on mi nie wierzyl nie wiec normalnie zamiałkałam mu i juz nie byl taki sprytny ten gosc co nie juz uwierzyl od razu ze jestem prawdzimy kotem",
    favouriteRestaurants: [
      {
        restaurant: {
          name: "kebab king",
        },
        rankingPosition: 1,
      },
      {
        restaurant: {
          name: "kebab dubai",
        },
        rankingPosition: 2,
      },
      {
        restaurant: {
          name: "amman kebab",
        },
        rankingPosition: 3,
      },
    ],
  },
];

const TEST_DISH: Partial<Dish>[] = [
  {
    name: "Kebab średni",
    description:
      "Baranina/Kurczak, surówka, pita, sosy strasznie długo opis realnie nigdy nie widzialem dluzszego opisu niz ten ktory to jest mega dziwne ze one jest taki dlugo jakby mogl przestac to byloby super",
    priceZl: 23,
    priceGr: 0,
  },
];

const CardPage = () => {
  return (
    <div
      className="centralized-x"
      style={{ marginTop: "100px", paddingBottom: "100px" }}
    >
      <div className="centralized-y" style={{ width: "600px" }}>
        {/* {TEST_REST.map((rest, i) => (
          <RestaurantCard key={i} data={rest}></RestaurantCard>
        ))} */}
        {TEST_DISH.map((dish, i) => (
          <DishCard key={i} data={dish}></DishCard>
        ))}
        {TEST_USER.map((usr, i) => (
          <UserCard key={i} data={usr} socials={true}></UserCard>
        ))}
        {TEST_USER.map((usr, i) => (
          <UserCard key={i} data={usr} socials={false}></UserCard>
        ))}
        {TEST_USER2.map((usr2, i) => (
          <MatchCard key={i} data={usr2} likedRests={[]}></MatchCard>
        ))}
        {TEST_LINK.map((lin, i) => (
          <LinkCard key={i} data={lin}></LinkCard>
        ))}
      </div>
    </div>
  );
};

export default CardPage;
