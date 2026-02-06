# Bazos - Nekonečné načítavanie (Auto-Pagination)

Použivateľský skript pre Bazos, ktorý umožňuje nekonečné načítavanie. Automaticky načíta ďalšiu stránku inzerátov, keď sa posúvate nadol, čím eliminuje potrebu klikať na "Ďalšie/Další".

## Funkcie

-   **Plynulé nekonečné rolovanie**: Automaticky načíta a pridá ďalšiu stranu inzerátov, keď dosiahnete koniec zoznamu.
-   **Inteligentné vkladanie**: Nové inzeráty sa vložia prirodzene pred pätičku/stránkovanie a zastaví načítavanie na konci výsledkov.
-   **Podpora viacerých regiónov**: Kompatibilné s Bazos doménami.

## Podporované stránky

-   **Bazos.sk** (Slovensko)
-   **Bazos.cz** (Česko)
-   **Bazos.at** (Rakúsko)
-   **Bazos.pl** (Poľsko)

## Inštalácia

1.  Uistite sa, že máte nainštalovaného správcu skriptov:
    -   [Tampermonkey](https://www.tampermonkey.net/) (Odporúčané)
    -   [Violentmonkey](https://violentmonkey.github.io/)
    -   [Greasemonkey](https://www.greasespot.net/)

2.  Kliknite **[Inštalovať tu](https://raw.githubusercontent.com/NightMean/Bazos_Infinite_Scroll/main/bazos_autopager.user.js)**
3.  Potvrďte inštaláciu vo vašom správcovi.
4.  Užite si nekonečné rolovanie na stránke Bazos!

## Ako to funguje

Skript deteguje, kedy sa posuniete blízko ku koncu stránky. Následne:
1.  Vypočíta URL pre ďalšiu stranu (pomocou parametra `?crp=` alebo cesty).
2.  Načíta obsah na pozadí (fetch).
3.  Extrahuje inzeráty (`.inzeraty`).
4.  Pridá ich do aktuálneho zoznamu pred pätičku.

## Príspevky
Ak ma chcete podporiť, môžete použiť odkaz nižšie:

<a href="https://www.buymeacoffee.com/nightmean" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="width: 200px !important;" ></a>

## Licencia

Tento projekt je licencovaný pod licenciou **MIT**.