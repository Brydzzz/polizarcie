import LandingHeader from "@/components/headers/landing-header.component";
import CenterSection from "@/components/sections/center-section.component";
import styles from "./page.module.scss";

export default async function Home() {
  return (
    <main className={styles.container}>
      <LandingHeader />
      <div className={styles.leftAlign}>
        <h1>Co to jest?</h1>
        <p>
          Poliżarcie to portal dla prawdziwych politechnicznych żarłoków. Jesteś
          głodny, a przed tobą jeszcze 4 godziny labów? Długie okienko i nie
          wiesz co ze sobą zrobić? Czy może po prostu chcesz zjeść coś fajnego
          ze znajomymi ze studiów? Nie martw się, Poliżarcie to miejsce dla
          ciebie! Możesz wyszukać interesujący cię lokal, sprawdzić gdzie się
          znajduje, zerknąć na menu i ceny przeczytać recenzje albo nawet dodać
          własne. Wszystko jest możliwe dzięki Poliżarciu!
        </p>
      </div>
      <section className={styles.light}>
        <div className={styles.rightAlign}>
          <h1>Chcesz kogoś poznać?</h1>
          <p>
            Nie martw się! Poliżarcie wprowadza innowacyjny system łączenia
            użytkowników na podstawie ich ulubionych restauracji. Dzięki temu
            możesz miło spędzić przerwę z kimś nowym. A kto wie? Może wyniknie z
            tego coś więcej...
          </p>
        </div>
      </section>
    </main>
  );
}
