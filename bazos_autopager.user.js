// ==UserScript==
// @name         Bazos Infinite Scroll
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Infinite scroll for Bazos websites
// @author       NightMean
// @match        https://*.bazos.sk/*
// @match        https://*.bazos.cz/*
// @match        https://*.bazos.at/*
// @match        https://*.bazos.pl/*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/NightMean/Bazos_Infinite_Scroll/main/bazos_autopager.user.js
// @updateURL    https://raw.githubusercontent.com/NightMean/Bazos_Infinite_Scroll/main/bazos_autopager.user.js
// ==/UserScript==

(function () {
    'use strict';

    let isLoading = false;
    let offset = 0;
    const itemsPerPage = 20;

    // Helper to determine pagination parameter
    function getPaginationParam() {
        return window.location.pathname.includes('search.php') ? 'crz' : 'crp';
    }

    // Helper to get current offset from URL
    function getInitialOffset() {
        const urlParams = new URLSearchParams(window.location.search);
        const param = getPaginationParam();
        const offsetVal = urlParams.get(param);
        if (offsetVal) return parseInt(offsetVal, 10);

        // Check for path-based pagination (e.g., /20/) - usually only for categories
        const path = window.location.pathname;
        const match = path.match(/\/(\d+)\/?$/);
        if (match) {
            return parseInt(match[1], 10);
        }

        return 0;
    }

    offset = getInitialOffset();

    // STRICT CHECK: Only enable infinite scroll if pagination exists ("Next" button usually)
    // This prevents running on pages like "Moje inzeráty" causing infinite loops of duplicates
    const hasPagination = document.querySelector('.strankovani');
    if (!hasPagination) {
        console.log('[Bazos Infinite Scroll] No pagination detected. Script will not run.');
        return;
    }

    // Function to fetch next page
    async function loadNextPage() {
        if (isLoading) return;
        isLoading = true;

        const nextOffset = offset + itemsPerPage;
        const currentUrl = new URL(window.location.href);
        const param = getPaginationParam();

        // Strip existing path-based pagination if present before adding param
        // e.g., /Category/20/ -> /Category/
        // Only needed if we are NOT on search.php, because search.php uses query params
        if (param === 'crp') {
            currentUrl.pathname = currentUrl.pathname.replace(/\/(\d+)\/?$/, '/');
        }

        currentUrl.searchParams.set(param, nextOffset);

        console.log(`[Bazos Infinite Scroll] Loading next page: ${nextOffset} from ${currentUrl.toString()}`);

        try {
            const response = await fetch(currentUrl.toString());
            if (!response.ok) {
                console.error(`[Bazos Infinite Scroll] Failed to load next page (Status: ${response.status}). Stopping.`);
                window.removeEventListener('scroll', handleScroll);
                return;
            }
            const text = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            // Allow multiple potential main content selectors based on analysis
            // .maincontent is usually the wrapper, but sometimes items are directly in forms or other divs
            // Best bet: find the parent of the first .inzeraty on the current page
            const currentAd = document.querySelector('.inzeraty');
            if (!currentAd) {
                console.log('[Bazos Infinite Scroll] No listings found on current page, stopping.');
                return;
            }
            const container = currentAd.parentElement;

            const newAds = Array.from(doc.querySelectorAll('.inzeraty'));
            console.log(`[Bazos Infinite Scroll] Found ${newAds.length} new listings`);

            if (newAds.length === 0) {
                console.log('[Bazos Infinite Scroll] No more listings found.');
                window.removeEventListener('scroll', handleScroll);
                appendEndMessage(container);
                return;
            }

            // DEDUPLICATION SAFEGUARD
            // Check if the first new ad is already on the page.
            // This handles cases where the server ignores '?crp=' and returns the first page again.
            const firstNewAdLink = newAds[0].querySelector('a');
            if (firstNewAdLink) {
                const existingLink = document.querySelector(`.inzeraty a[href="${firstNewAdLink.getAttribute('href')}"]`);
                if (existingLink) {
                    console.warn('[Bazos Infinite Scroll] Detected duplicate content. Server likely ignored pagination. Stopping.');
                    window.removeEventListener('scroll', handleScroll);
                    appendEndMessage(container);
                    return;
                }
            }

            // Append new listings
            // We want to insert valid listings BEFORE the footer/pagination/sponsored content
            // The structure is usually: [Listings...] [Sponsored(#container_two)] [Pagination(.strankovani)]
            // So we look for the first of these to exist.
            const insertTarget = container.querySelector('#container_two') || container.querySelector('.strankovani');

            newAds.forEach(ad => {
                if (insertTarget) {
                    container.insertBefore(ad, insertTarget);
                } else {
                    container.appendChild(ad);
                }
            });

            // Update offset
            offset = nextOffset;

            // Update history to allow back button to work somewhat (optional, maybe skip for simple infinite scroll)
            // history.replaceState(null, '', currentUrl.toString());

        } catch (error) {
            console.error('[Bazos Infinite Scroll] Error loading next page:', error);
            // Optionally stop on error to prevent loops
            window.removeEventListener('scroll', handleScroll);
        } finally {
            isLoading = false;
        }
    }

    function appendEndMessage(container) {
        const endMsg = document.createElement('div');
        endMsg.style.textAlign = 'center';
        endMsg.style.padding = '20px';
        endMsg.style.fontWeight = 'bold';
        endMsg.innerText = '--- Koniec výsledkov ---';
        // Insert end message before footer if possible
        const insertTarget = container.querySelector('#container_two') || container.querySelector('.strankovani');
        if (insertTarget) {
            container.insertBefore(endMsg, insertTarget);
        } else {
            container.appendChild(endMsg);
        }
    }

    function handleScroll() {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        // Load when within 500px of bottom
        if (scrollTop + clientHeight >= scrollHeight - 800) {
            loadNextPage();
        }
    }

    // Identify if we are on a list page
    if (document.querySelector('.inzeraty')) {
        console.log('[Bazos Infinite Scroll] Initialized');
        window.addEventListener('scroll', handleScroll);
    }

})();
