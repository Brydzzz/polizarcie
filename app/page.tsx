import LandingHeader from "@/components/headers/landing-header.component";
import CenterSection from "@/components/sections/center-section.component";
import { prisma } from "@/utils/prisma";
import styles from "./page.module.scss";

export default async function Home() {
  const users = await prisma.users.findMany();
  console.log(users);

  return (
    <main className={styles.container}>
      <LandingHeader />
      <CenterSection width="600px" offsetX="-200px">
        <h1>Co to jest?</h1>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce luctus
        blandit neque sit amet imperdiet. Aliquam vehicula nec justo ac
        imperdiet. Vivamus elementum sit amet libero ut scelerisque. Phasellus
        sit amet arcu quis nibh cursus vestibulum nec non velit. Phasellus eget
        cursus mi, nec mattis eros. Proin eget consectetur nisi, nec rutrum
        erat. In bibendum augue vitae odio convallis, in mattis ipsum pharetra.
        Aenean aliquet in tellus ac tincidunt. Quisque sit amet risus malesuada
        eros lacinia semper id volutpat risus. Aenean tristique libero massa, in
        efficitur neque eleifend quis. Etiam porttitor mauris neque, mollis
        mattis dolor lacinia sit amet. Phasellus molestie urna ut metus egestas,
        vitae bibendum tortor tristique. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit. Nullam posuere pellentesque rhoncus. Sed faucibus metus
        purus, a scelerisque mi tempus at. Duis ac porta nisl.
      </CenterSection>
      <section className={styles.light}>
        <CenterSection width="600px" offsetX="200px">
          <h1>Co to jest?</h1>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce luctus
          blandit neque sit amet imperdiet. Aliquam vehicula nec justo ac
          imperdiet. Vivamus elementum sit amet libero ut scelerisque. Phasellus
          sit amet arcu quis nibh cursus vestibulum nec non velit. Phasellus
          eget cursus mi, nec mattis eros. Proin eget consectetur nisi, nec
          rutrum erat. In bibendum augue vitae odio convallis, in mattis ipsum
          pharetra. Aenean aliquet in tellus ac tincidunt. Quisque sit amet
          risus malesuada eros lacinia semper id volutpat risus. Aenean
          tristique libero massa, in efficitur neque eleifend quis. Etiam
          porttitor mauris neque, mollis mattis dolor lacinia sit amet.
          Phasellus molestie urna ut metus egestas, vitae bibendum tortor
          tristique. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Nullam posuere pellentesque rhoncus. Sed faucibus metus purus, a
          scelerisque mi tempus at. Duis ac porta nisl.
        </CenterSection>
      </section>
    </main>
  );
}
