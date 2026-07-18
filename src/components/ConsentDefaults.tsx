/**
 * Google Consent Mode v2 defaults.
 *
 * This MUST execute before Google Analytics or the AdSense loader, which is why it
 * uses `beforeInteractive`. With every storage type defaulting to "denied", GA runs
 * in cookieless mode and no `_ga` cookie is written until the visitor accepts, and
 * AdSense serves only non-personalised ads.
 *
 * `wait_for_update` gives CookieConsent a 500ms window to replay a stored decision
 * before any tag acts on the defaults, so returning visitors are not downgraded.
 *
 * Note: once the site is approved for AdSense, replace this and CookieConsent with
 * Google's certified CMP (AdSense → Privacy & messaging), which is mandatory for
 * serving ads to EEA/UK users.
 *
 * Deliberately a raw <script> rather than next/script with `beforeInteractive`:
 * that strategy queues the code into `self.__next_s` and emits it *after*
 * </head>, so execution order becomes a property of Next's bootstrap rather than
 * of document parse order. A consent gate must not depend on that. React hoists
 * this into <head>, where it runs synchronously before any tag loads.
 */
export default function ConsentDefaults() {
  return (
    <script
      id="consent-defaults"
      dangerouslySetInnerHTML={{
        __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = window.gtag || gtag;
        gtag('consent', 'default', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          analytics_storage: 'denied',
          functionality_storage: 'granted',
          security_storage: 'granted',
          wait_for_update: 500
        });
        try {
          var stored = localStorage.getItem('cookie_consent_v2');
          if (stored === 'granted' || stored === 'denied') {
            gtag('consent', 'update', {
              ad_storage: stored,
              ad_user_data: stored,
              ad_personalization: stored,
              analytics_storage: stored
            });
          }
        } catch (e) {}
      `,
      }}
    />
  );
}
