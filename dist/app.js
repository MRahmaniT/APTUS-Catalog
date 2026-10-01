import { company, spans, heights, parts } from "./content.js";
import { copy, translatedParts } from "./i18n.js";
import { partCopy, benefitGroups, applications, facades, documents } from "./supplied-content.js";
import { editorialUI, editorialParts, editorialBenefits, editorialApplications, editorialDocumentTitles } from "./editorial-i18n.js";

const app = document.querySelector("#app");
const params = new URLSearchParams(location.search);
let lang = params.get("lang");
try {
  if (!["fa", "en", "tr"].includes(lang)) lang = localStorage.getItem("aptus-language");
  if (!["fa", "en", "tr"].includes(lang)) lang = "fa";
  localStorage.setItem("aptus-language", lang);
} catch {
  if (!["fa", "en", "tr"].includes(lang)) lang = "fa";
}
const ui = copy[lang];
const extra = editorialUI[lang];
const isFa = lang === "fa";
const number = new Intl.NumberFormat(lang === "fa" ? "en-US" : lang === "tr" ? "tr-TR" : "en-US", { maximumFractionDigits: 1 });
const n = value => number.format(value);
const text = (template, values = {}) => Object.entries(values).reduce((result, [key, value]) => result.replaceAll(`{${key}}`, String(value)), template);
const faPartRoles = {
  column: "عضو اصلی باربر قائم و جانبی",
  "longitudinal-beam": "اتصال گیردار قاب‌های اصلی در راستای طولی",
  girder: "انتقال بارهای سقف به ستون‌ها",
  purlin: "انتقال بار پوشش سقف به شاه‌تیرها",
  "self-standing-wall": "جداره پیرامونی مستقل از قاب اصلی",
  "tie-beam": "پیوند عرضی قاب‌ها و کنترل تغییرشکل",
  foundation: "انتقال نیروهای ستون به بستر خاک"
};
const localizedParts = parts.map(part => ({
  ...part, ...(partCopy[part.id] || {}),
  ...(isFa ? { name: partCopy[part.id]?.sourceTitle || part.name, role: faPartRoles[part.id] || part.role } : {}),
  ...(translatedParts[lang]?.[part.id] || {}),
  ...(editorialParts[lang]?.[part.id] || {})
}));
const localizedBenefits = isFa ? benefitGroups : editorialBenefits[lang];
const localizedApplications = applications.map(item => ({ ...item, title: editorialApplications[lang]?.[item.id] || item.title }));
const localizedDocuments = documents.map((item, index) => ({ ...item, title: editorialDocumentTitles[lang]?.[index] || item.title }));
const companyName = isFa ? company.persianName : company.englishName;
const country = isFa ? company.location : ui.about.location;
const sectionIds = ["about", "system", "types", "facades", "parts", "applications", "explore", "benefits", "contact"];
const pageLink = id => `./index.html${isFa ? "" : `?lang=${lang}`}#${id}`;
const typeLink = (h, s) => `./index.html?type=${h}H-${s}M${isFa ? "" : `&lang=${lang}`}`;
const partLink = id => `./index.html?part=${id}${isFa ? "" : `&lang=${lang}`}`;
const detailLink = (key, value = "all") => `./index.html?${key}=${encodeURIComponent(value)}${isFa ? "" : `&lang=${lang}`}`;
const typeName = (h, s) => `${s}M × ${h}H`;
const contactPhone = company.phone ? String(company.phone).replace(/[^+\d]/g, "") : "";
const ariaPart = part => text(ui.parts.imageAlt, { name: part.name });
const arrow = kind => `<svg class="directional-arrow ${kind === "back" ? "is-back" : ""}" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const safe = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

document.documentElement.lang = lang;
document.documentElement.dir = isFa ? "rtl" : "ltr";
if (!isFa) document.querySelector('meta[name="description"]')?.setAttribute("content", ui.cover.sub);

function sectionHead(index, title, aside = "") {
  return `<div class="section-head"><div><span class="eyebrow"></span><h2>${title}</h2></div>${aside ? `<p class="section-aside">${aside}</p>` : ""}</div>`;
}

function header(active = "cover") {
  const submenu = (id, label, entries) => `<details class="nav-group ${active === id ? "is-active" : ""}"><summary>${label}<span class="nav-chevron" aria-hidden="true"></span></summary><div class="nav-submenu">${entries.map(([href, name]) => `<a href="${href}">${name}</a>`).join("")}</div></details>`;
  return `<header class="site-header" id="top">
    <a class="brand" href="${pageLink("cover")}" aria-label="${ui.homeLabel}">
      <img src="./assets/aptus-logo.jpg" alt="" style="border-radius: 0px; width="43" height="43">
      <span class="brand-copy"><strong>${companyName}</strong><small lang="en" dir="ltr">APTUS IRAN</small></span>
    </a>
    <nav class="primary-nav" id="primary-nav" aria-label="${ui.menu}">
      <a href="${pageLink("cover")}" ${active === "cover" ? 'aria-current="page"' : ""}>${extra.nav.home}</a>
      <a href="${pageLink("about")}" ${active === "about" ? 'aria-current="page"' : ""}>${ui.about.title}</a>
      <a href="${pageLink("system")}" ${active === "system" ? 'aria-current="page"' : ""}>${ui.system.title}</a>
      ${submenu("types", extra.nav.types, [[pageLink("types"), extra.nav.standard], [pageLink("facades"), extra.nav.facades]])}
      ${submenu("parts", extra.nav.parts, [[pageLink("parts"), extra.nav.overview], [pageLink("explore"), extra.nav.interactive], ...localizedParts.map(part => [partLink(part.id), part.name])])}
      ${submenu("applications", extra.nav.applications, [[pageLink("applications"), extra.nav.applications], ...localizedApplications.map(item => [pageLink(`application-${item.id}`), item.title])])}
      <a href="${pageLink("benefits")}" ${active === "benefits" ? 'aria-current="page"' : ""}>${extra.nav.benefits}</a>
      ${submenu("contact", extra.nav.contact, [[pageLink("contact"), extra.nav.contactInfo], [detailLink("documents"), extra.nav.documents]])}
    </nav>
    <div class="header-actions">
      <div class="language-switch" role="group" aria-label="${ui.language}">
        ${[["fa", "فا"], ["en", "EN"], ["tr", "TR"]].map(([code, label]) => `<button type="button" data-lang="${code}" lang="${code}" aria-pressed="${lang === code}">${label}</button>`).join("")}
      </div>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="${ui.openMenu}"><span aria-hidden="true">☰</span></button>
    </div>
  </header>`;
}

function footer() {
  const footerParts = [localizedParts[6], localizedParts[0], localizedParts[2]];
  return `<footer class="site-footer">
    <div class="footer-hero"><div><span class="eyebrow">APTUS INDUSTRIAL PRECAST SYSTEM</span><h2>${ui.footer.tagline}</h2></div><strong lang="en" dir="ltr">APTUS<span>.</span></strong></div>
    <div class="footer-grid">
      <div class="footer-about"><div class="footer-brand"><img src="./assets/aptus-logo.jpg" alt="" style="border-radius: 0px; width="50" height="50"><span>${companyName}<small lang="en" dir="ltr">APTUS IRAN</small></span></div><p>${ui.footer.summary}</p></div>
      <div class="footer-column"><h3>${ui.footer.explore}</h3><a href="${pageLink("about")}">${ui.about.title}</a><a href="${pageLink("system")}">${ui.system.title}</a><a href="${pageLink("types")}">${ui.types.title}</a><a href="${pageLink("facades")}">${extra.nav.facades}</a><a href="${pageLink("applications")}">${extra.nav.applications}</a></div>
      <div class="footer-column"><h3>${ui.footer.components}</h3>${footerParts.map(part => `<a href="${partLink(part.id)}">${part.name}</a>`).join("")}<a href="${pageLink("explore")}">${ui.explore.title}</a><a href="${detailLink("benefits")}">${extra.benefits.all}</a></div>
      <div class="footer-column"><h3>${ui.footer.contact}</h3><span>${company.address || country}</span><span>${company.phone ? `<a dir="ltr" href="tel:${contactPhone}">${company.phone}</a>` : ui.footer.missing}</span></div>
    </div>
    <div class="footer-bottom"><span>© ${new Date().getFullYear()} APTUS ${ui.footer.rights}</span><a href="${pageLink("cover")}">${ui.footer.back} ↑</a></div>
  </footer>`;
}

function roofIcon() {
  return `<svg class="roof-icon" viewBox="0 0 72 42" aria-hidden="true"><path d="M6 37V17L36 7l30 10v20" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 39h64" fill="none" stroke="currentColor" stroke-width="1" opacity=".32"/></svg>`;
}

function benefitsList() {
  return `<ol class="benefits-single-list" role="list">${localizedBenefits.flatMap(group => group.items).map((item, i) => `<li><bdi>${String(i + 1).padStart(2, "0")}</bdi><span>${safe(item)}</span></li>`).join("")}</ol>`;
}

function catalog() {
  const abstract = isFa ? company.about : ui.about.abstract;
  document.title = isFa ? "سوله بتنی پیش‌ساخته آپتوس | APTUS IRAN" : lang === "tr" ? "APTUS İran | Prefabrik Beton Yapı Kataloğu" : "APTUS Iran | Precast Concrete Shed Catalog";
  return `${header()}<main>
    <section id="cover" class="cover-section" aria-labelledby="cover-title">
      <div class="cover-copy">
        <!-- <div class="cover-kicker"><span class="orange-line"></span><span>${ui.cover.kicker}</span></div> -->
        <div class="cover-title-wrap"><h1 id="cover-title">${ui.cover.title}</h1></div>
        <!-- <a class="cover-scroll" href="${pageLink("about")}">${ui.cover.enter}<span aria-hidden="true">↓</span></a> -->
      </div>
      <div class="cover-company"><img src="./assets/aptus-logo.jpg" alt="" width="54" height="54"><span><strong>${companyName}</strong><small>${ui.about.legal}</small></span></div>
      <div class="cover-visual"><div class="visual-stage"><img src="./assets/cover-render1.jpg" alt="${ui.cover.visualAlt}"></div></div>
    </section>

    <section id="about" class="page-section about-section"><div class="section-inner">
      ${sectionHead(1, ui.about.title, ui.about.aside)}
      <div class="about-grid"><div class="about-quote"><span class="large-quote" aria-hidden="true">“</span><p>${ui.about.quote}</p><span class="about-rule"></span></div><div class="about-body"><p>${abstract}</p><p>${ui.about.extra}</p><a class="text-link" href="${pageLink("system")}">${ui.about.link}${arrow()}</a></div></div>
    </div></section>

    <section id="system" class="page-section system-section"><div class="section-inner">
      ${sectionHead(2, ui.system.title, ui.system.aside)}
      <div class="system-grid"><div class="system-picture"><img src="./assets/facades/facade-02.jpg" alt="${ui.system.imageAlt}" loading="lazy"></div><div class="system-copy"><p>${ui.system.p1}</p><p>${ui.system.p2}</p></div></div></div>
    </div></section>

    <section id="types" class="page-section types-section"><div class="section-inner">
      ${sectionHead(3, ui.types.title, ui.types.aside)}
      <div class="types-intro"><p>${ui.types.intro}</div>
      <div class="table-wrap" tabindex="0" role="region" aria-label="${ui.types.region}"><table class="types-table"><thead><tr><th scope="col" class="row-corner">${ui.types.underRoof}<br><small>${ui.types.clearSpan}</small></th>${spans.map(s => `<th scope="col"><span class="latin-token" dir="ltr">${s.module}M</span><small>${n(s.clearCm/100)} ${ui.types.meter}</small></th>`).join("")}</tr></thead><tbody>${heights.map(h => `<tr><th scope="row"><span class="latin-token" dir="ltr">${h.module}H</span><small>${n(h.underRoofCm/100)} ${ui.types.meter}</small></th>${spans.map(s => `<td><a class="type-cell" href="${typeLink(h.module,s.module)}" aria-label="${text(ui.types.cell,{ type:typeName(h.module,s.module), span:n(s.clearCm/100), height:n(h.underRoofCm/100) })}">${roofIcon()}<strong dir="ltr">${typeName(h.module,s.module)}</strong><span>${ui.types.view} ${arrow()}</span></a></td>`).join("")}</tr>`).join("")}</tbody></table></div>
    </div></section>

    <section id="facades" class="page-section facades-section"><div class="section-inner">
      ${sectionHead(4, extra.facades.title, extra.facades.aside)}
      <div class="facade-grid">${facades.slice(0,6).map((item,i) => `<figure class="facade-card"><img src="${item.image}" alt="${text(extra.galleryAlt,{number:n(i+1),name:extra.facades.title})}" loading="lazy"><figcaption>${extra.facades.caption} <bdi>${n(i+1).toString().padStart(2,"0")}</bdi></figcaption></figure>`).join("")}</div>
      <div class="section-action"><a class="solid-button" href="${detailLink("facades")}">${extra.facades.all}${arrow()}</a></div>
    </div></section>

    <section id="applications" class="page-section applications-section"><div class="section-inner">
      ${sectionHead(6, extra.applications.title, extra.applications.aside)}
      <div class="applications-grid">${localizedApplications.map((item,i) => `<article class="application-card" id="application-${item.id}"><img src="${item.image}" alt="${safe(item.title)}" loading="lazy"><div><span class="eyebrow">${String(i+1).padStart(2,"0")} / 05</span><h3>${safe(item.title)}</h3></div></article>`).join("")}</div>
    </div></section>

    <section id="explore" class="page-section explore-section"><div class="section-inner">
      ${sectionHead(7, ui.explore.title, ui.explore.aside)}
      <div class="explore-layout"><div class="diagram-column"><div class="diagram-board"><div class="board-bar"><span>${ui.explore.diagramTitle}</span><span>01—08</span></div><div class="diagram-canvas"><img src="./assets/semi-assembly.png" alt="${ui.explore.diagramAlt}" loading="lazy">${localizedParts.filter(part => part.pin).map(part => `<button type="button" class="hotspot" data-part="${part.id}" style="left:${part.pin[0]}%;top:${part.pin[1]}%" aria-label="${text(ui.explore.select,{name:part.name})}"><span>${n(Number(part.number))}</span></button>`).join("")}</div><p class="diagram-source">${ui.explore.diagramHelp}</p></div><div class="part-selector" role="group" aria-label="${ui.explore.selectGroup}">${localizedParts.map(part => `<button type="button" data-part="${part.id}"><bdi>${n(Number(part.number))}</bdi> ${safe(part.name)}</button>`).join("")}</div></div><aside class="preview-panel" aria-live="polite" id="part-preview"></aside></div>
    </div></section>

    <section id="benefits" class="page-section benefits-section"><div class="section-inner">
      ${sectionHead(8, ui.benefits.title)}
      <div class="benefits-window">
        <div class="benefits-scroll" id="benefits-scroll" role="region" aria-label="${safe(ui.benefits.title)}">${benefitsList()}</div>
        <button class="benefits-toggle" type="button" aria-expanded="false" aria-controls="benefits-scroll"><span>${extra.benefits.preview}</span><span class="benefits-chevron" aria-hidden="true"></span></button>
      </div>
    </div></section>

  </main>${footer()}`;
}

function frameDiagram(h, s) {
  /*
   * Professional technical-drawing style dimensions
   * - Thin orange dimension lines
   * - Closed filled arrowheads
   * - Proper extension lines
   * - Dimensions inside the frame, matching the supplied sketch
   * - Consistent typography
   */

  const width = 250 + s.module * 32;
  const x1 = (760 - width) / 2;
  const x2 = x1 + width;

  const bottom = 296;
  const eaves = 190 - (h.module - 3) * 27;
  const peak = eaves - 35;
  const innerX1 = x1 + 6.5;
  const innerX2 = x2 - 6.5;
  const underRoofY = eaves + 6.5;

  /* Dimension styling */
  const dimColor = "#f58220";
  const dimTextColor = "#58595b";

  const extensionStroke = 1.15;
  const dimensionStroke = 1.5;
  const textSize = 17;

  /* -----------------------------------------
     HORIZONTAL DIMENSION — CLEAR SPAN
     ----------------------------------------- */

  const horizontalDimY = bottom - 12;

  const horizontalExtTop = bottom - 4;
  const horizontalExtBottom = horizontalDimY - 8;

  /* -----------------------------------------
     VERTICAL DIMENSION — UNDER ROOF HEIGHT
     ----------------------------------------- */

  const verticalDimX = innerX1 + 24;

  const verticalExtEnd = verticalDimX + 8;

  const verticalTextX = verticalDimX + 46;
  const verticalTextY = (bottom + underRoofY) / 2;

  const horizontalLabel = `${n(s.clearCm / 100)} m`;
  const verticalLabel = `${n(h.underRoofCm / 100)} m`;

  return `
  <svg
    class="frame-diagram"
    role="img"
    aria-label="${text(
      ui.detail.frameAlt,
      { type: typeName(h.module, s.module) }
    )}"
    viewBox="0 0 760 420"
    direction="ltr"
    xmlns="http://www.w3.org/2000/svg"
  >

    <defs>

      <!-- Professional filled technical-drawing arrow -->
      <marker
        id="dimArrow"
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path
          d="M0 0 L10 5 L0 10 Z"
          fill="${dimColor}"
        />
      </marker>

    </defs>


    <!-- =========================================
         REFERENCE / GROUND LINE
         ========================================= -->

    <path
      d="M70 ${bottom + 8} H690"
      stroke="#e6e6e6"
      stroke-width="1.4"
      stroke-dasharray="5 5"
      fill="none"
    />


    <!-- =========================================
         MAIN STRUCTURE
         ========================================= -->

    <path
      d="
        M${x1} ${bottom}
        V${eaves}
        L380 ${peak}
        L${x2} ${eaves}
        V${bottom}
      "
      fill="none"
      stroke="#58595b"
      stroke-width="13"
      stroke-linejoin="round"
    />

    <!-- Base plates -->

    <path
      d="
        M${x1 - 21} ${bottom + 2}
        h42
        v18
        h-42
        z

        M${x2 - 21} ${bottom + 2}
        h42
        v18
        h-42
        z
      "
      fill="#666666"
    />


    <!-- =========================================
         HORIZONTAL DIMENSION
         CLEAR SPAN
         ========================================= -->


    <!-- Extension lines -->

    <path
      d="
        M${innerX1} ${horizontalExtTop}
        V${horizontalExtBottom}

        M${innerX2} ${horizontalExtTop}
        V${horizontalExtBottom}
      "
      fill="none"
      stroke="${dimColor}"
      stroke-width="${extensionStroke}"
    />


    <!-- Dimension line -->

    <path
      d="
        M${innerX1} ${horizontalDimY}
        H${innerX2}
      "
      fill="none"
      stroke="${dimColor}"
      stroke-width="${dimensionStroke}"
      marker-start="url(#dimArrow)"
      marker-end="url(#dimArrow)"
    />


    <!-- Dimension label background -->

    <rect
      x="${(x1 + x2) / 2 - 45}"
      y="${horizontalDimY - textSize / 2 - 5}"
      width="90"
      height="${textSize + 10}"
      rx="2"
      fill="#ffffff"
    />


    <!-- Dimension label -->

    <text
      x="${(x1 + x2) / 2}"
      y="${horizontalDimY}"
      text-anchor="middle"
      dominant-baseline="middle"
      font-family="Arial, Helvetica, sans-serif"
      font-size="${textSize}"
      font-weight="500"
      letter-spacing="0.2"
      fill="${dimTextColor}"
    >
      ${horizontalLabel}
    </text>



    <!-- =========================================
         VERTICAL DIMENSION
         UNDER-ROOF HEIGHT
         ========================================= -->


    <!-- Horizontal extension lines -->

    <path
      d="
        M${innerX1 + 3} ${underRoofY}
        H${verticalExtEnd}

        M${innerX1 + 3} ${bottom}
        H${verticalExtEnd}
      "
      fill="none"
      stroke="${dimColor}"
      stroke-width="${extensionStroke}"
    />


    <!-- Vertical dimension line -->

    <path
      d="
        M${verticalDimX} ${bottom}
        V${underRoofY}
      "
      fill="none"
      stroke="${dimColor}"
      stroke-width="${dimensionStroke}"
      marker-start="url(#dimArrow)"
      marker-end="url(#dimArrow)"
    />


    <!-- Vertical dimension label background -->

    <rect
      x="${verticalTextX - 34}"
      y="${verticalTextY - textSize / 2 - 5}"
      width="68"
      height="${textSize + 10}"
      rx="2"
      fill="#ffffff"
    />


    <!-- Vertical dimension label -->

    <text
      x="${verticalTextX}"
      y="${verticalTextY}"
      text-anchor="middle"
      dominant-baseline="middle"
      font-family="Arial, Helvetica, sans-serif"
      font-size="${textSize}"
      font-weight="500"
      letter-spacing="0.2"
      fill="${dimTextColor}"
    >
      ${verticalLabel}
    </text>

  </svg>`;
}

function typeDetail(h, s) {
  const all = heights.flatMap(a => spans.map(b => [a,b]));
  const index = all.findIndex(([a,b]) => a.module===h.module && b.module===s.module);
  const previous = all[(index-1+all.length)%all.length], next = all[(index+1)%all.length];
  const type = typeName(h.module,s.module);
  document.title = `${text(ui.detail.typeTitle,{type})} | APTUS IRAN`;
  return `${header("types")}<main class="detail-main"><div class="detail-container"><nav class="breadcrumbs" aria-label="${ui.detail.catalog}"><a href="${pageLink("cover")}">${ui.detail.catalog}</a><span>›</span><a href="${pageLink("types")}">${ui.types.title}</a><span>›</span><strong dir="ltr">${type}</strong></nav>
    <div class="detail-heading"><div><span class="eyebrow">AIPS / ${String(index+1).padStart(2,"0")}</span><h1>${text(ui.detail.typeTitle,{type:`<bdi dir="ltr">${type}</bdi>`})}</h1><p>${text(ui.detail.typeDescription,{height:n(h.underRoofCm/100),span:n(s.clearCm/100)})}</p></div><a class="outline-button" href="${pageLink("types")}">${ui.detail.backTypes}${arrow("back")}</a></div>
    <div class="detail-grid"><div class="detail-visual"><div class="drawing-header"><span>${ui.detail.frame}</span><bdi dir="ltr">AIPS / ${h.module}H-${s.module}M</bdi></div>${frameDiagram(h,s)}<div class="drawing-foot">${ui.detail.drawingNote}</div></div><aside class="dimension-panel"><h2>${ui.detail.dimensions}</h2><dl><div><dt>${ui.types.clearSpan}</dt><dd>${n(s.clearCm/100)} <small>${ui.types.meter}</small></dd></div><div><dt>${ui.detail.outside}</dt><dd>${n(s.axesCm/100)} <small>${ui.types.meter}</small></dd></div><div><dt>${ui.types.underRoof}</dt><dd>${n(h.underRoofCm/100)} <small>${ui.types.meter}</small></dd></div><div><dt>${ui.detail.module}</dt><dd>${n(2.4)} <small>${ui.types.meter}</small></dd></div></dl></aside></div>
    <div class="detail-lower"><div><span class="eyebrow">AIPS / ${type}</span><h2>${ui.detail.notes}</h2><p>${text(ui.detail.p1,{spanCode:`<bdi dir="ltr">${s.module}M</bdi>`,heightCode:`<bdi dir="ltr">${h.module}H</bdi>`})}</p><p>${ui.detail.p2}</p></div><nav class="type-navigation" aria-label="${ui.detail.otherTypes}"><span>${ui.detail.otherTypes}</span><a href="${typeLink(previous[0].module,previous[1].module)}">${arrow("back")}<span>${ui.detail.previous} <bdi dir="ltr">${typeName(previous[0].module,previous[1].module)}</bdi></span></a><a href="${typeLink(next[0].module,next[1].module)}"><span>${ui.detail.next} <bdi dir="ltr">${typeName(next[0].module,next[1].module)}</bdi></span>${arrow()}</a></nav></div>
  </div></main>${footer()}`;
}

function partDetail(part) {
  document.title = `${part.name} | APTUS IRAN`;
  return `${header("parts")}<main class="detail-main"><div class="detail-container"><nav class="breadcrumbs" aria-label="${ui.detail.catalog}"><a href="${pageLink("cover")}">${ui.detail.catalog}</a><span>›</span><a href="${pageLink("explore")}">${ui.explore.title}</a><span>›</span><strong>${part.name}</strong></nav>
    <div class="detail-heading"><div><span class="eyebrow">AIPS / ${part.number}</span><h1>${safe(part.name)}</h1><p>${safe(part.role)}</p></div><a class="outline-button" href="${pageLink("parts")}">${extra.nav.overview}${arrow("back")}</a></div>
    <div class="part-detail-layout"><div class="part-detail-image"><span>${text(extra.part.total,{number:n(Number(part.number))})}</span><img src="${part.image}" alt="${safe(ariaPart(part))}"><small lang="en" dir="ltr">${part.english}</small></div><div class="part-detail-copy"><span class="eyebrow">AIPS / ${part.number}</span><h2>${extra.part.details}</h2>${(part.paragraphs || [part.description]).map(p => `<p>${safe(p)}</p>`).join("")}${part.technicalPdf ? `<a class="outline-button source-pdf" href="${part.technicalPdf}" target="_blank" rel="noopener">${extra.part.source} <span aria-hidden="true">↗</span></a>` : ""}${!part.pin ? `<p class="detail-note">${extra.part.corner}</p>` : ""}</div></div>
    ${part.gallery?.length ? `<section class="component-gallery"><div class="section-head"><h2>${extra.part.additional}</h2><span class="section-aside">${extra.gallery}</span></div><div class="component-gallery-grid">${part.gallery.map((src,i) => `<a href="${src}" target="_blank" rel="noopener"><img src="${src}" loading="lazy" alt="${text(extra.galleryAlt,{number:n(i+1),name:safe(part.name)})}"></a>`).join("")}</div></section>` : ""}
    <div class="detail-bottom-link"><span>${ui.detail.placement}</span><a href="${pageLink("explore")}">${ui.explore.title}${arrow("back")}</a></div>
  </div></main>${footer()}`;
}

function benefitsDetail() {
  document.title = `${extra.benefits.detail} | APTUS IRAN`;
  return `${header("benefits")}<main class="detail-main"><div class="detail-container"><nav class="breadcrumbs"><a href="${pageLink("cover")}">${ui.detail.catalog}</a><span>›</span><a href="${pageLink("benefits")}">${ui.benefits.title}</a></nav><div class="detail-heading"><div><span class="eyebrow">AIPS / 25</span><h1>${extra.benefits.detail}</h1><p>${extra.benefits.count}</p></div><a class="outline-button" href="${pageLink("benefits")}">${ui.benefits.title}${arrow("back")}</a></div><div class="benefits-window benefits-window-full">${benefitsList()}</div></div></main>${footer()}`;
}

function facadesDetail() {
  document.title = `${extra.facades.title} | APTUS IRAN`;
  return `${header("types")}<main class="detail-main"><div class="detail-container"><nav class="breadcrumbs"><a href="${pageLink("cover")}">${ui.detail.catalog}</a><span>›</span><a href="${pageLink("facades")}">${extra.facades.title}</a></nav><div class="detail-heading"><div><span class="eyebrow">AIPS / ${n(facades.length)}</span><h1>${extra.facades.title}</h1><p>${extra.facades.note}</p></div><a class="outline-button" href="${pageLink("facades")}">${extra.nav.facades}${arrow("back")}</a></div><div class="facade-grid facade-grid-full">${facades.map((item,i) => `<figure class="facade-card"><img src="${item.image}" alt="${text(extra.galleryAlt,{number:n(i+1),name:extra.facades.title})}" loading="lazy"><figcaption>${extra.facades.caption} <bdi>${String(i+1).padStart(2,"0")}</bdi></figcaption></figure>`).join("")}</div></div></main>${footer()}`;
}

function documentsDetail() {
  document.title = `${extra.documents.title} | APTUS IRAN`;
  return `${header("contact")}<main class="detail-main"><div class="detail-container"><nav class="breadcrumbs"><a href="${pageLink("cover")}">${ui.detail.catalog}</a><span>›</span><a href="${pageLink("contact")}">${ui.contact.title}</a></nav><div class="detail-heading"><div><span class="eyebrow">APTUS / DOCS</span><h1>${extra.documents.title}</h1><p>${extra.documents.intro}</p></div><a class="outline-button" href="${pageLink("contact")}">${extra.nav.contactInfo}${arrow("back")}</a></div><div class="document-grid">${localizedDocuments.map(doc => `<a class="document-card" href="${doc.href}" target="_blank" rel="noopener"><span class="document-icon" aria-hidden="true">▤</span><span class="document-index">${doc.id} / ${String(localizedDocuments.length).padStart(2,"0")}</span><strong>${safe(doc.title)}</strong><span class="document-action">${extra.documents.view} <span aria-hidden="true">↗</span></span></a>`).join("")}</div></div></main>${footer()}`;
}

function setActivePart(id) {
  const part = localizedParts.find(item => item.id===id);
  if (!part) return;
  document.querySelectorAll("[data-part]").forEach(element => {
    const selected = element.dataset.part===id;
    element.classList.toggle("is-active",selected);
    element.setAttribute("aria-pressed",String(selected));
  });
  document.querySelector("#part-preview").innerHTML = `<div class="preview-top"><span class="eyebrow">AIPS / ${part.number}</span><span class="preview-cross" aria-hidden="true">✳</span></div><div class="preview-image"><img src="${part.image}" alt="${safe(text(ui.explore.imageAlt,{name:part.name}))}"></div><span class="preview-label" lang="en" dir="ltr">${part.english}</span><h3>${safe(part.name)}</h3><p class="preview-excerpt">${safe(part.paragraphs?.[0] || part.description)}</p><a class="solid-button" href="${partLink(part.id)}">${extra.more}${arrow()}</a>`;
}

function bind() {
  const benefitsToggle = document.querySelector(".benefits-toggle");
  benefitsToggle?.addEventListener("click", () => {
    const open = benefitsToggle.getAttribute("aria-expanded") !== "true";
    const scroll = document.getElementById("benefits-scroll");
    benefitsToggle.setAttribute("aria-expanded", String(open));
    benefitsToggle.querySelector("span").textContent = open ? extra.benefits.collapse : extra.benefits.preview;
    benefitsToggle.closest(".benefits-window").classList.toggle("is-expanded", open);
    if (open) scroll.setAttribute("tabindex", "0");
    else {
      scroll.removeAttribute("tabindex");
      scroll.scrollTop = 0;
    }
  });
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".primary-nav");
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded")!=="true";
    toggle.setAttribute("aria-expanded",String(open));
    toggle.setAttribute("aria-label",open?ui.closeMenu:ui.openMenu);
    menu.classList.toggle("is-open",open);
  });
  document.querySelectorAll(".primary-nav a").forEach(link => link.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded","false");
    menu.classList.remove("is-open");
    menu.querySelectorAll("details[open]").forEach(group => group.removeAttribute("open"));
  }));
  document.querySelectorAll("[data-lang]").forEach(button => button.addEventListener("click", () => {
    const next = button.dataset.lang;
    if (next===lang) return;
    try { localStorage.setItem("aptus-language",next); } catch {}
    const nextUrl = new URL(location.href);
    if (next==="fa") nextUrl.searchParams.delete("lang");
    else nextUrl.searchParams.set("lang",next);
    location.assign(nextUrl.href);
  }));
  document.querySelectorAll("[data-part]").forEach(button => button.addEventListener("click", () => setActivePart(button.dataset.part)));
  if (document.querySelector("#part-preview")) setActivePart(localizedParts[0].id);
  if (location.hash && !params.has("type") && !params.has("part")) requestAnimationFrame(() => {
    try { document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView(); } catch {}
  });
  if (!params.has("type") && !params.has("part") && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
      if (!visible) return;
      document.querySelectorAll(".primary-nav a").forEach(link => {
        if (link.getAttribute("href").endsWith(`#${visible.target.id}`)) link.setAttribute("aria-current","page");
        else link.removeAttribute("aria-current");
      });
    },{rootMargin:"-22% 0px -55% 0px",threshold:[0,.15,.4]});
    ["cover",...sectionIds].forEach(id => { const section=document.getElementById(id); if(section) observer.observe(section); });
  }
}

const typeMatch = /^([345])H-([5-9]|10)M$/.exec(params.get("type") || "");
if (typeMatch) {
  app.innerHTML = typeDetail(heights.find(h => h.module===Number(typeMatch[1])),spans.find(s => s.module===Number(typeMatch[2])));
} else if (params.get("benefits") === "all") {
  app.innerHTML = benefitsDetail();
} else if (params.get("facades") === "all") {
  app.innerHTML = facadesDetail();
} else if (params.get("documents") === "all") {
  app.innerHTML = documentsDetail();
} else {
  const part = localizedParts.find(item => item.id===params.get("part"));
  app.innerHTML = part ? partDetail(part) : catalog();
}
bind();
