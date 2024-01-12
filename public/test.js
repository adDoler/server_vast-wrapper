const idEl = [ 
    "AdvertisingDiv_0", "ArticleContentAd", "SidebarAd", "aboveplayerad", "ad-300x250-sidebar", "ad-300x250-b",
    "ad-placeholder", "adPosition9", "ad_buttons", "ads-leader", "banner", "reklama", "adv_overlay", "banner-300x250",
    "video-banner", "googleAds", "adriver", "native_ads", "pageAds", "pause-ads", "sky-ad", "AdContainer", "video_adv",
    "taboola-stream-", "yandex_ad", "vuukle-ad-", "pa_sticky_ad_box_middle_", "google_dfp_", "_vdo_ads_player_ai_",
    "ads300_250-widget-"
];

const classEl = [
    "AdMod", "AdSlot", "Ad_container", "AdsSlot", "CommentAd", "ButtonAd", "LazyLoadAd", "SponsorLink", "Video-Ad", "a-ad--aside",
    "ad--300", "ad--desktop", "ad-banner-header", "ad-field", "ad-title", "ad-wireframe", "adContentAd", "adsense-top",
    "adunit-container", "adv-700", "advImagesbox", "adx-wrapper", "adx-ads", "apiAds", "article-ad-box", "Adstyled__AdWrapper-",
    "Display_displayAd", "kiwi-ad-wrapper", "native-ad-", "yaAds"
]

const size = "20px";
const left = document.getElementById("left");
const right = document.getElementById("right");

function createIdEl() {
    idEl.forEach((id, i) => {
        const el = document.createElement("div");
        el.id = id;
        el.style.width = size;
        el.style.height = size;
        el.textContent = i;
        el.style.background = "#dfc1c1";
        left.append(el);
    });
    classEl.forEach((className, i) => {
        const el = document.createElement("div");
        el.className = className;
        el.style.width = size;
        el.style.height = size;
        el.textContent = i;
        el.style.background = "#bad5ba";
        right.append(el);
    });
}

createIdEl();