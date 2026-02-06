<br/>

<p align="center">
Readme in <a href="translation/sk/README.md"><strong>Slovak language</strong></a>
</p>

# Bazos - Infinite Scroll (Auto-Pagination)

A userscript to enable infinite scrolling on Bazos websites. It automatically loads the next page of results as you scroll down, eliminating the need to click "Ďalšie/Další".

## Features

-   **Seamless Infinite Scrolling**: Automatically fetches and appends the next page of listings when you reach the bottom.
-   **Smart Positioning**: Inserts new listings naturally before the pagination/footer and stops loading at the end of results.
-   **Multi-Region Support**: Compatible with Bazos domains.

## Supported Sites

-   **Bazos.sk** (Slovakia)
-   **Bazos.cz** (Czech Republic)
-   **Bazos.at** (Austria)
-   **Bazos.pl** (Poland)

## Installation

1.  Make sure you have a UserScript manager installed:

    -   [Tampermonkey](https://www.tampermonkey.net/) (Recommended)
    -   [Violentmonkey](https://violentmonkey.github.io/)
    -   [Greasemonkey](https://www.greasespot.net/)

2.  Click **[Install Here](https://raw.githubusercontent.com/NightMean/Bazos_Infinite_Scroll/main/bazos_autopager.user.js)**
3.  Confirm the installation in your manager.
4.  Enjoy infinite scrolling on Bazos!

## How it works

The script detects when you scroll near the bottom of the page. It then:
1.  Calculates the URL for the next page (using `?crp=` parameter or path-based pagination).
2.  Fetches the content in the background.
3.  Extracts the advertisement listings (`.inzeraty`).
4.  Appends them to the current page list, ensuring they appear before the footer.

## Donations
To support me you can use link below:

<a href="https://www.buymeacoffee.com/nightmean" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="width: 200px !important;" ></a>

## License

This project is licensed under the **MIT** License.