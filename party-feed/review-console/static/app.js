// party-feed review console — vanilla JS, no build step, no external libs.
// Talks only to the local server.py (same origin) via /api/*.

const queueSelect = document.getElementById("queue-select");
const cardsEl = document.getElementById("cards");
const saveBtn = document.getElementById("save-btn");
const saveStatus = document.getElementById("save-status");
const cardTemplate = document.getElementById("card-template");

let currentItems = [];

async function loadQueueList() {
  const res = await fetch("/api/queues");
  const files = await res.json();
  queueSelect.innerHTML = "";
  for (const file of files) {
    const opt = document.createElement("option");
    opt.value = file;
    opt.textContent = file;
    queueSelect.appendChild(opt);
  }
  if (files.length > 0) {
    await loadQueue(files[0]);
  } else {
    cardsEl.innerHTML = '<p class="empty-state">No queue files found in review_queue/.</p>';
  }
}

async function loadQueue(filename) {
  saveStatus.textContent = "";
  const res = await fetch(`/api/queue?file=${encodeURIComponent(filename)}`);
  if (!res.ok) {
    cardsEl.innerHTML = `<p class="empty-state">Could not load ${filename}.</p>`;
    return;
  }
  const items = await res.json();
  // likely_party items first, stable order otherwise.
  currentItems = items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => (b.item.likely_party === true) - (a.item.likely_party === true) || a.index - b.index)
    .map(({ item }) => item);
  renderCards();
}

function renderCards() {
  cardsEl.innerHTML = "";
  if (currentItems.length === 0) {
    cardsEl.innerHTML = '<p class="empty-state">This queue file is empty.</p>';
    return;
  }
  currentItems.forEach((item, idx) => renderCard(item, idx));
}

function renderCard(item, idx) {
  const node = cardTemplate.content.cloneNode(true);
  const article = node.querySelector(".card");

  const img = node.querySelector(".card-image");
  img.src = item.image_url || "";
  img.alt = `flyer for ${item.handle} post ${item.shortcode}`;

  const badge = node.querySelector(".badge-party");
  if (!item.likely_party) badge.classList.add("hidden");

  const handleLink = node.querySelector(".card-handle");
  handleLink.textContent = `@${item.handle}`;
  handleLink.href = `https://www.instagram.com/${item.handle}/`;

  node.querySelector(".card-posted").textContent = formatDate(item.posted_at_utc);
  node.querySelector(".card-caption").textContent = item.caption || "(no caption)";
  node.querySelector(".card-likes").textContent = `♥ ${item.likes ?? 0}`;
  node.querySelector(".card-comments").textContent = `💬 ${item.comments ?? 0}`;

  const permalink = node.querySelector(".card-permalink");
  permalink.href = item.permalink;

  const review = item.review || {};
  const addressMode = review.address_mode;

  const eventTimeInput = node.querySelector(".field-event-time");
  eventTimeInput.value = review.event_time || "";
  eventTimeInput.addEventListener("input", (e) => {
    currentItems[idx].review.event_time = e.target.value;
  });

  const publicBlock = node.querySelector(".address-public");
  const dmBlock = node.querySelector(".address-dm");

  if (addressMode === "public") {
    dmBlock.remove(); // never present in the DOM for a public item
    const addressInput = publicBlock.querySelector(".field-address");
    addressInput.value = review.address || "";
    addressInput.addEventListener("input", (e) => {
      currentItems[idx].review.address = e.target.value;
    });
  } else {
    // dm mode (or unknown -> fail safe to no address input at all)
    publicBlock.remove(); // impossible to enter a full address in the DOM
    dmBlock.querySelector(".dm-note").textContent = `Address: DM @${item.handle}`;
    const areaInput = dmBlock.querySelector(".field-area");
    areaInput.value = review.area || "";
    areaInput.addEventListener("input", (e) => {
      currentItems[idx].review.area = e.target.value;
    });
  }

  const publishInput = node.querySelector(".field-publish");
  publishInput.checked = review.publish === true;
  publishInput.addEventListener("change", (e) => {
    currentItems[idx].review.publish = e.target.checked;
  });

  cardsEl.appendChild(node);
}

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

async function saveReviewed() {
  saveStatus.textContent = "Saving…";
  saveBtn.disabled = true;
  try {
    const res = await fetch("/api/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentItems),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "save failed");
    saveStatus.textContent = `Saved ${result.written} published item(s).`;
  } catch (err) {
    saveStatus.textContent = `Error: ${err.message}`;
  } finally {
    saveBtn.disabled = false;
  }
}

queueSelect.addEventListener("change", (e) => loadQueue(e.target.value));
saveBtn.addEventListener("click", saveReviewed);

loadQueueList();
