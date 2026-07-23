/* Renders the quote page body from a content object. Pure string building so
   it can be reused both for the live page (innerHTML) and for the
   standalone HTML export in admin.js. */

function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Section titles may legitimately contain a small set of inline tags (e.g. &amp;)
// already escaped in content.js, so render them as-is (trusted, admin-authored).
function raw(str) { return str == null ? '' : String(str); }

function listItems(items) {
  return items.map(item => `<div class="pq-list-item"><span class="dot">&middot;</span>${esc(item)}</div>`).join('');
}

function renderSection(key, title, openSet, bodyHtml, isLast) {
  const isOpen = openSet.has(key);
  return `
  <div class="pq-section${isLast ? ' pq-section-last' : ''}">
    <button type="button" class="pq-section-btn" data-toggle="${key}" aria-expanded="${isOpen}">
      <span style="display:flex;align-items:baseline;gap:16px;">
        <span class="pq-section-title serif">${raw(title)}</span>
      </span>
      <span class="pq-section-icon${isOpen ? ' open' : ''}">+</span>
    </button>
    <div class="pq-section-content" ${isOpen ? '' : 'hidden'}>
      ${bodyHtml}
    </div>
  </div>`;
}

function renderRates(c) {
  const rows = c.rates.rows.map(r => `
    <tr>
      <td>${esc(r.category)}</td>
      <td>${esc(r.day1)}</td>
      <td>${esc(r.day2)}</td>
      <td>${esc(r.totalRooms)}</td>
      <td>${esc(r.rate)}</td>
      <td>${esc(r.subtotal)}</td>
    </tr>`).join('');
  return `
    <div class="pq-rates-dates">
      <div><span>${esc(c.rates.checkInLabel)}</span><br>${esc(c.rates.checkIn)}</div>
      <div><span>${esc(c.rates.checkOutLabel)}</span><br>${esc(c.rates.checkOut)}</div>
    </div>
    <div class="pq-table-wrap">
      <table class="pq-table">
        <thead><tr>
          <th>${esc(c.rates.tableHeaders.category)}</th>
          <th>${esc(c.rates.tableHeaders.col1)}</th>
          <th>${esc(c.rates.tableHeaders.col2)}</th>
          <th>${esc(c.rates.tableHeaders.totalRooms)}</th>
          <th>${esc(c.rates.tableHeaders.rate)}</th>
          <th>${esc(c.rates.tableHeaders.subtotal)}</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="pq-footnote">${esc(c.rates.footnote)}</div>
    <div class="pq-total-box">
      <div>
        <div class="pq-total-label">${esc(c.rates.grandTotalLabel)}</div>
        <div class="pq-total-sub">${esc(c.rates.grandTotalSub)}</div>
      </div>
      <span class="pq-total-amount serif">${esc(c.rates.grandTotalAmount)} <span class="pq-total-currency">${esc(c.rates.grandTotalCurrency)}</span></span>
    </div>
    <div class="pq-label-eyebrow">${esc(c.rates.concessionsLabel)}</div>
    <div class="pq-list-grid">${listItems(c.rates.concessions)}</div>
  `;
}

function renderAgenda(c) {
  const items = c.agenda.items.filter(a => a.visible !== false).map(a => `
    <div class="pq-agenda-item">
      <div class="pq-agenda-item-head">
        <span class="pq-agenda-item-event">${esc(a.event)}</span>
        <span class="pq-agenda-item-total serif">${esc(a.total)}</span>
      </div>
      <div class="pq-agenda-item-meta">${esc(a.day)} &middot; ${esc(a.time)} &middot; ${esc(a.place)} &middot; ${esc(a.pax)} pax</div>
      <div class="pq-agenda-item-desc">${esc(a.description)}</div>
    </div>`).join('');
  return `
    <p class="pq-agenda-intro">${esc(c.agenda.intro)}</p>
    <div class="pq-agenda-items">${items}</div>
    <div class="pq-total-box pq-total-box-agenda">
      <div class="pq-total-label">${esc(c.agenda.totalLabel)}</div>
      <span class="pq-total-amount serif">${esc(c.agenda.totalAmount)} <span class="pq-total-currency">${esc(c.agenda.totalCurrency)}</span></span>
    </div>
  `;
}

function renderRooms(c, assets) {
  const types = c.rooms.types.filter(t => t.visible !== false).map(t => `
    <div class="pq-room-type">
      <img src="${esc(assets[t.imageKey])}" alt="${esc(t.alt)}">
      <div class="pq-room-type-title">${esc(t.title)}</div>
      <div class="pq-room-type-size">${esc(t.size)}</div>
    </div>`).join('');
  return `
    <p class="pq-rooms-intro">${esc(c.rooms.intro)}</p>
    <div class="pq-rooms-types">${types}</div>
    <div class="pq-rooms-amenities">
      <div class="pq-label-eyebrow">${esc(c.rooms.amenitiesLabel)}</div>
      <div class="pq-list-grid pq-list-grid-narrow">${listItems(c.rooms.amenities)}</div>
    </div>
  `;
}

function renderAmenities(c, assets) {
  const groups = c.amenities.activityGroups.map(g => `
    <div>
      <div class="pq-activity-group-title">${esc(g.title)}</div>
      ${g.items.map(it => `<div class="pq-activity-group-item">${esc(it)}</div>`).join('')}
    </div>`).join('');
  return `
    <div class="pq-amenities-photos">
      <img src="${esc(assets.courtyard)}" alt="patio interior">
      <img src="${esc(assets.lobby)}" alt="lobby">
      <img src="${esc(assets.pool)}" alt="alberca">
    </div>
    <div class="pq-label-eyebrow">${esc(c.amenities.hotelAmenitiesLabel)}</div>
    <div class="pq-list-grid pq-list-grid-narrow" style="margin-bottom:32px;">${listItems(c.amenities.hotelAmenities)}</div>
    <div class="pq-label-eyebrow" style="margin-bottom:16px;">${esc(c.amenities.activitiesLabel)}</div>
    <div class="pq-activity-groups">${groups}</div>
    <div class="pq-tour-photos">
      <img src="${esc(assets.beach1)}" alt="malec&oacute;n">
      <img src="${esc(assets.beach2)}" alt="tour de dunas">
      <img src="${esc(assets.beach3)}" alt="isla esp&iacute;ritu santo">
    </div>
    <div class="pq-tour-caption">${esc(c.amenities.tourCaption)}</div>
  `;
}

function renderVenues(c) {
  const rows = c.venues.list.map((v, i) => `
    <div class="pq-venue-row" style="background:${i % 2 === 0 ? '#F6EEE3' : '#FFFFFF'};">
      <span class="name">${esc(v.name)}</span>
      <span class="size">${esc(v.size)}</span>
    </div>`).join('');
  return `
    <p class="pq-venues-intro">${esc(c.venues.intro)}</p>
    <div>${rows}</div>
  `;
}

function renderPolicies(c) {
  const facts = c.policies.quickFacts.map(f => `<div><span>${esc(f.label)}</span><br>${esc(f.value)}</div>`).join('');
  const blocks = c.policies.blocks.map(b => `
    <div class="pq-policy-block">
      <div class="pq-policy-block-title">${esc(b.title)}</div>
      <div class="pq-policy-block-text">${esc(b.text)}</div>
    </div>`).join('');
  return `
    <div class="pq-policy-facts">${facts}</div>
    ${blocks}
  `;
}

function renderContact(c, assets) {
  return `
    <div class="pq-contact-row">
      <img class="pq-contact-photo" src="${esc(assets.exteriorBuilding)}" alt="fachada del hotel">
      <div class="pq-contact-info">
        <div class="pq-contact-hotel">${esc(c.contact.hotelName)}</div>
        ${esc(c.contact.addressLine1)}<br>${esc(c.contact.addressLine2)}
        <div class="pq-contact-name">${esc(c.contact.contactName)}</div>
        ${esc(c.contact.contactTitle)}<br>
        <a href="mailto:${esc(c.contact.contactEmail)}">${esc(c.contact.contactEmail)}</a>
      </div>
    </div>
  `;
}

/**
 * Builds the full body markup (hero through footer) for the given content/locale.
 * @param {object} content  DEFAULT_CONTENT[locale]-shaped object
 * @param {object} assets   asset key -> url (path or data URI)
 * @param {Set<string>} openSections  keys of currently-open accordion sections
 */
function renderQuotePage(content, assets, openSections) {
  const c = content;
  const open = openSections || new Set();

  const sectionDefs = [
    { key: 'rates', enabled: c.rates.enabled !== false, title: c.rates.title, body: () => renderRates(c) },
    { key: 'agenda', enabled: c.agenda.enabled !== false, title: c.agenda.title, body: () => renderAgenda(c) },
    { key: 'rooms', enabled: c.rooms.enabled !== false, title: c.rooms.title, body: () => renderRooms(c, assets) },
    { key: 'amenities', enabled: c.amenities.enabled !== false, title: c.amenities.title, body: () => renderAmenities(c, assets) },
    { key: 'venues', enabled: c.venues.enabled !== false, title: c.venues.title, body: () => renderVenues(c) },
    { key: 'policies', enabled: c.policies.enabled !== false, title: c.policies.title, body: () => renderPolicies(c) },
    { key: 'contact', enabled: c.contact.enabled !== false, title: c.contact.title, body: () => renderContact(c, assets) }
  ].filter(s => s.enabled);

  const sections = sectionDefs.map((s, i) =>
    renderSection(s.key, s.title, open, s.body(), i === sectionDefs.length - 1)
  ).join('');

  return `
<div class="pq-hero">
  <img class="pq-hero-img" src="${esc(assets.hero)}" alt="Hotel Perla La Paz">
  <div class="pq-hero-overlay"></div>
  <div class="pq-hero-logo"><img src="${esc(assets.logo)}" alt="Perla Tapestry Collection by Hilton"></div>
  <div class="pq-hero-text">
    <div class="pq-hero-eyebrow">${esc(c.hero.eyebrow)}</div>
    <div class="pq-hero-headline serif">${esc(c.hero.headline)}</div>
  </div>
</div>

<div class="pq-meta-wrap">
  <div class="pq-meta-card">
    <div><div class="pq-meta-label">${esc(c.meta.contactLabel)}</div><div class="pq-meta-value">${esc(c.meta.contact)}</div></div>
    <div><div class="pq-meta-label">${esc(c.meta.companyLabel)}</div><div class="pq-meta-value">${esc(c.meta.company)}</div></div>
    <div><div class="pq-meta-label">${esc(c.meta.datesLabel)}</div><div class="pq-meta-value">${esc(c.meta.dates)}</div></div>
    <div><div class="pq-meta-label">${esc(c.meta.dateLabel)}</div><div class="pq-meta-value">${esc(c.meta.date)}</div></div>
  </div>
</div>

<div class="pq-intro-wrap"><p>${esc(c.intro)}</p></div>

<div class="pq-accordion-wrap">
  <div class="pq-tap-hint">${esc(c.tapHint)}</div>
  ${sections}
</div>

<div class="pq-footer">${esc(c.footer)}</div>
`;
}

window.PQRender = { renderQuotePage, esc };
