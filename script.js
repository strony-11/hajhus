const CONTACT_EMAIL = "hajhus.bussines@gmail.com";
const CONTACT_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;
const DEFAULT_FORM_STATUS = "Wiadomość trafi prosto na mój e-mail. Odpowiadam w ciągu doby, bez newslettera i sprzedażowych telefonów.";

const chatLog = document.getElementById("chat-log");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatSubmit = chatForm.querySelector('button[type="submit"]');
const typingIndicator = document.getElementById("typing");
const suggestionsBox = document.getElementById("chat-suggestions");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const DEFAULT_SUGGESTIONS = [
  { label: "Wędka na szczupaka do 300 zł", question: "Jaką wędkę na szczupaka do 300 zł?" },
  { label: "Ile trwa dostawa?", question: "Ile trwa dostawa?" },
  { label: "Jak wygląda zwrot?", question: "Jak wygląda zwrot?" },
  { label: "Kołowrotek do 200 zł", question: "Macie kołowrotek do 200 zł?" }
];

const rods = {
  pike: {
    label: "szczupaka",
    sizeHint: "spinning 2,40–2,70 m o cw. 10–35 g",
    options: [
      {
        name: "Jaxon Grey Stream",
        length: "2,40 m",
        cw: "10–35 g",
        price: 269,
        stock: 4,
        why: "lekki spinning, który dobrze prowadzi woblery i gumy na jeziorze",
        category: "rod"
      },
      {
        name: "Daiwa Sweepfire-X",
        length: "2,70 m",
        cw: "15–50 g",
        price: 329,
        stock: 2,
        why: "mocniejszy kij, gdy łowisz większe gumy i spinningujesz na rzece",
        category: "rod"
      }
    ]
  },
  zander: {
    label: "sandacza",
    sizeHint: "szybki spinning 2,60–2,80 m o cw. 10–30 g",
    options: [
      {
        name: "Shimano FX",
        length: "2,70 m",
        cw: "10–30 g",
        price: 289,
        stock: 3,
        why: "czuły kij, który dobrze przekazuje pracę gumy i jiga",
        category: "rod"
      }
    ]
  },
  perch: {
    label: "okonia",
    sizeHint: "lekki spinning 2,00–2,30 m o cw. 3–15 g",
    options: [
      {
        name: "Mikado Sensei",
        length: "2,10 m",
        cw: "3–15 g",
        price: 219,
        stock: 5,
        why: "lekki kij, przy którym nawet małe okonie dają frajdę",
        category: "rod"
      }
    ]
  },
  carp: {
    label: "karpia",
    sizeHint: "karpiówka 3,30–3,60 m o ciężarze wyrzutu 2,75–3 lb",
    options: [
      {
        name: "Dragon Carp Fighter",
        length: "3,60 m",
        cw: "3 lb",
        price: 299,
        stock: 2,
        why: "klasyczna karpiówka, dobra zarówno do metody, jak i zwykłych zestawów",
        category: "rod"
      }
    ]
  },
  bream: {
    label: "leszcza",
    sizeHint: "feeder 3,00–3,30 m o cw. do 60–90 g",
    options: [
      {
        name: "Mikado Ultraviolet Feeder",
        length: "3,30 m",
        cw: "do 90 g",
        price: 279,
        stock: 3,
        why: "uniwersalny feeder na jezioro i wolno płynącą rzekę",
        category: "rod"
      }
    ]
  },
  trout: {
    label: "pstrąga",
    sizeHint: "lekki kij 2,20–2,50 m o cw. 5–25 g",
    options: [
      {
        name: "Robinson River",
        length: "2,40 m",
        cw: "5–25 g",
        price: 249,
        stock: 4,
        why: "lekki i szybki kij do woblerków oraz małych gum",
        category: "rod"
      }
    ]
  },
  catfish: {
    label: "suma",
    sizeHint: "mocny kij 2,70–3,00 m o cw. do 150 g",
    options: [
      {
        name: "Jaxon Exceed Cat",
        length: "2,70 m",
        cw: "do 150 g",
        price: 349,
        stock: 1,
        why: "mocny kij do ciężkich przynęt i dużych sumów",
        category: "rod"
      }
    ]
  }
};

const speciesAliases = {
  pike: ["szczupak", "szczupaka", "szczupaki", "szczupakiem", "szczupakow"],
  zander: ["sandacz", "sandacza", "sandacze", "sandaczy", "sandaczem"],
  perch: ["okon", "okonia", "okonie", "okoni", "okoniem"],
  carp: ["karp", "karpia", "karpie", "karpi", "karpiem", "karpiowy", "karpiowa"],
  bream: ["leszcz", "leszcza", "leszcze", "leszczy", "leszczem"],
  trout: ["pstrag", "pstraga", "pstragi", "pstragiem"],
  catfish: ["sum", "suma", "sumy", "sumem", "sumow"]
};

const reels = [
  {
    name: "Daiwa Sweepfire 2500",
    price: 169,
    stock: 3,
    why: "prosty, przewidywalny kołowrotek do lekkiego spinu",
    category: "reel"
  },
  {
    name: "Shimano Sienna 2500",
    price: 189,
    stock: 6,
    why: "płynna praca i hamulec, który spokojnie wystarcza do średniego spinu",
    category: "reel"
  },
  {
    name: "Okuma Ceymar C-30",
    price: 249,
    stock: 2,
    why: "lżejsza i trochę bardziej „mięsista” konstrukcja do częstego łowienia",
    category: "reel"
  }
];

const lineProducts = {
  spinning: {
    name: "Dragon Invisible 0,10 mm",
    price: 89,
    stock: 8,
    category: "line"
  },
  coarse: {
    name: "Dragon VHS 0,22 mm",
    price: 39,
    stock: 12,
    category: "line"
  }
};

const lurePicks = {
  pike: { name: "Salmo Executor 10 cm", price: 69 },
  perch: { name: "Relax Kopyto 2”", price: 19 },
  zander: { name: "Relax Kopyto 4”", price: 32 },
  carp: { name: "Kulki 15 mm", price: 24 },
  bream: { name: "Pellet 4 mm", price: 16 },
  trout: { name: "Robinson River 4 cm", price: 29 },
  catfish: { name: "Guma 22 cm", price: 49 }
};

const state = {
  budget: null,
  species: null,
  category: null,
  lastProduct: null,
  selected: { rod: null, reel: null, line: null },
  awaitingOrder: false,
  awaitingLead: false,
  messageCount: 0
};

function normalize(value) {
  const map = { ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ó: "o", ś: "s", ź: "z", ż: "z" };
  return value
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (letter) => map[letter])
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function findSpecies(text) {
  for (const [key, aliases] of Object.entries(speciesAliases)) {
    if (aliases.some((alias) => new RegExp(`\\b${alias}\\b`, "i").test(text))) {
      return key;
    }
  }
  return null;
}

function extractBudget(text) {
  const patterns = [
    /(?:do|za|max|maks|maksymalnie|budzet|budzetem|ponizej|kwoty|okolo)\s*(?:jakies\s*)?(\d{2,4})/,
    /(\d{2,4})\s*(?:zl|pln|zlotych|zeta)/,
    /(?:mam|dysponuje)\s*(\d{2,4})/,
    /^(\d{2,4})$/
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const value = Number(match[1]);
      if (value >= 30 && value <= 10000) return value;
    }
  }

  return null;
}

function formatPrice(value) {
  return value.toLocaleString("pl-PL");
}

function pickProduct(options, budget) {
  const sorted = [...options].sort((a, b) => a.price - b.price);
  if (!budget) return { product: sorted[0], overBudget: false };

  const affordable = sorted.filter((product) => product.price <= budget);
  if (affordable.length) {
    return { product: affordable[affordable.length - 1], overBudget: false };
  }

  return { product: sorted[0], overBudget: true };
}

function isCoarseSpecies(speciesKey) {
  return speciesKey === "carp" || speciesKey === "bream";
}

function rodReply(speciesKey, budget) {
  const species = rods[speciesKey];
  const { product, overBudget } = pickProduct(species.options, budget);
  const productName = `${product.name} ${product.length} / ${product.cw}`;

  state.category = "rod";
  state.species = speciesKey;
  state.budget = budget;
  state.lastProduct = product;

  if (!budget) {
    return {
      html: `Na ${species.label} najczęściej bierze się ${species.sizeHint}. Jaki masz budżet? Wskażę konkretny model, a nie pierwszy z brzegu.`,
      suggestions: [
        { label: "Do 300 zł" },
        { label: "Do 500 zł" },
        { label: "Do 800 zł" }
      ]
    };
  }

  const intro = overBudget
    ? `W budżecie do ${formatPrice(budget)} zł nie znajdę kija, który chciałbym Ci polecić. Najtańsza sensowna propozycja to`
    : `Na ${species.label} w budżecie do ${formatPrice(budget)} zł polecam`;

  const budgetNote = overBudget
    ? " Lepiej dołożyć te kilkadziesiąt złotych niż kupić kij, który zniechęci Cię po pierwszym wypadzie."
    : "";

  return {
    html: `${intro} <strong>${productName}</strong> — <strong>${formatPrice(product.price)} zł</strong>. To ${product.why}.${budgetNote}<span class="chat-stock">Dostępne: ${product.stock} szt.</span><span class="chat-meta">Masz już kołowrotek, czy dobrać coś do zestawu?</span>`,
    suggestions: [
      { label: "Dobierz kołowrotek" },
      { label: isCoarseSpecies(speciesKey) ? "Jaka żyłka?" : "Jaka plecionka?" },
      { label: "Cały zestaw" },
      { label: "Ile trwa dostawa?" }
    ]
  };
}

function reelReply(budget) {
  if (!budget) {
    state.category = "reel";
    return {
      html: `Jasne. Do jakiej kwoty szukasz kołowrotka? Dobry start to 200–300 zł — w tej cenie da się kupić coś, co posłuży kilka sezonów.`,
      suggestions: [
        { label: "Do 200 zł" },
        { label: "Do 300 zł" },
        { label: "Do 500 zł" }
      ]
    };
  }

  const { product, overBudget } = pickProduct(reels, budget);
  state.category = "reel";
  state.budget = budget;
  state.lastProduct = product;
  state.selected.reel = product;

  const intro = overBudget
    ? `Do ${formatPrice(budget)} zł nie ma kołowrotka, który chciałbym polecić bez zastrzeżeń. Najtańsza sensowna opcja to`
    : `W budżecie do ${formatPrice(budget)} zł polecam`;

  return {
    html: `${intro} <strong>${product.name}</strong> — <strong>${formatPrice(product.price)} zł</strong>. ${product.why[0].toUpperCase() + product.why.slice(1)}.<span class="chat-stock">Dostępne: ${product.stock} szt.</span><span class="chat-meta">Wielkość 2500 sprawdzi się przy lekkim i średnim spinie. Chcesz dobrać plecionkę?</span>`,
    suggestions: [
      { label: "Jaka plecionka?" },
      { label: "Cały zestaw" },
      { label: "Ile trwa dostawa?" }
    ]
  };
}

function lineReply() {
  const isCoarse = isCoarseSpecies(state.species);
  const product = isCoarse ? lineProducts.coarse : lineProducts.spinning;
  const description = isCoarse
    ? "Dobra żyłka do feeder/karpiówki — odporna na przetarcia i dobrze trzyma się na szpuli."
    : "Jest cienka, cicha w przelotkach i wystarczająco mocna na zaczepy.";

  state.category = "line";
  state.lastProduct = product;
  state.selected.line = product;

  return {
    html: `Do tego zestawu dobrałbym <strong>${isCoarse ? "żyłkę" : "plecionkę"} ${product.name}</strong> — <strong>${formatPrice(product.price)} zł</strong>. ${description}<span class="chat-stock">Dostępne: ${product.stock} szt.</span><span class="chat-meta">${isCoarse ? "Do methody i klasycznego feederka to bezpieczny wybór." : "Do szczupaka i sandacza w zupełności wystarczy. Przy sumie poszedłbym w grubszą linkę."}</span>`,
    suggestions: [
      { label: "Cały zestaw" },
      { label: "Dobierz kołowrotek" },
      { label: "Ile trwa dostawa?" }
    ]
  };
}

function bundleReply(speciesKey, budget) {
  const key = speciesKey || state.species;
  const limit = budget || state.budget;

  if (!key || !rods[key]) {
    state.category = "bundle";
    return {
      html: "Zbiorę cały zestaw. Powiedz tylko, na jaką rybę — dobiorę kij, kołowrotek i linkę tak, żeby do siebie pasowały.",
      suggestions: [
        { label: "Zestaw na okonia do 300 zł" },
        { label: "Zestaw na szczupaka do 500 zł" },
        { label: "Zestaw na karpia do 600 zł" }
      ]
    };
  }

  const species = rods[key];
  const rod = state.selected.rod || pickProduct(species.options, limit).product;
  const reel = state.selected.reel || pickProduct(reels, limit).product;
  const line = state.selected.line || (isCoarseSpecies(key) ? lineProducts.coarse : lineProducts.spinning);
  const total = rod.price + reel.price + line.price;
  const lineLabel = isCoarseSpecies(key) ? "Żyłka" : "Plecionka";

  state.category = "bundle";
  state.species = key;
  state.lastProduct = reel;
  state.selected = { rod, reel, line };

  const items = [
    `<span class="chat-line"><strong>Kij:</strong> ${rod.name} ${rod.length} / ${rod.cw} — ${formatPrice(rod.price)} zł</span>`,
    `<span class="chat-line"><strong>Kołowrotek:</strong> ${reel.name} — ${formatPrice(reel.price)} zł</span>`,
    `<span class="chat-line"><strong>${lineLabel}:</strong> ${line.name} — ${formatPrice(line.price)} zł</span>`
  ].join("");

  const budgetNote = !limit
    ? "Ceny są łączne. Chcesz, żebym sprawdził dostępność?"
    : total > limit
      ? `Budżet ${formatPrice(limit)} zł nie wystarczy na całość. Czy ${formatPrice(limit)} zł dotyczy całego zestawu, czy jednej rzeczy?`
      : `Całość mieści się w budżecie do ${formatPrice(limit)} zł.`;

  return {
    html: `Zestaw na ${species.label}:${items}<span class="chat-total">Razem: <strong>${formatPrice(total)} zł</strong></span><span class="chat-meta">${budgetNote}</span>`,
    suggestions: [
      { label: "Ile trwa dostawa?" },
      { label: "Jakie są płatności?" },
      { label: "Dobierz przynęty" }
    ]
  };
}

function multiReply({ key, budget, intents }) {
  const points = [];
  let total = 0;
  let missingPrice = false;

  if (intents.rod) {
    if (key) {
      const { product } = pickProduct(rods[key].options, budget);
      state.selected.rod = product;
      total += product.price;
      points.push(`<span class="chat-line"><strong>Wędka:</strong> ${product.name} ${product.length} / ${product.cw} — ${formatPrice(product.price)} zł</span>`);
    } else {
      missingPrice = true;
      points.push('<span class="chat-line"><strong>Wędka:</strong> podaj gatunek ryby, dobiorę długość i ciężar wyrzutu.</span>');
    }
  }

  if (intents.reel) {
    const { product } = pickProduct(reels, budget);
    state.selected.reel = product;
    total += product.price;
    points.push(`<span class="chat-line"><strong>Kołowrotek:</strong> ${product.name} — ${formatPrice(product.price)} zł</span>`);
  }

  if (intents.line) {
    const product = isCoarseSpecies(key) ? lineProducts.coarse : lineProducts.spinning;
    state.selected.line = product;
    total += product.price;
    points.push(`<span class="chat-line"><strong>${isCoarseSpecies(key) ? "Żyłka" : "Plecionka"}:</strong> ${product.name} — ${formatPrice(product.price)} zł</span>`);
  }

  if (intents.lure) {
    const lure = key ? lurePicks[key] : null;
    if (lure) {
      total += lure.price;
      points.push(`<span class="chat-line"><strong>Przynęty:</strong> ${lure.name} — ${formatPrice(lure.price)} zł</span>`);
    } else {
      missingPrice = true;
      points.push('<span class="chat-line"><strong>Przynęty:</strong> powiedz, na jaką rybę — szczupak, okoń czy karp.</span>');
    }
  }

  const totalLabel = missingPrice ? "Razem sprzęt:" : "Razem:";
  const totalHtml = total
    ? `<span class="chat-total">${totalLabel} <strong>${formatPrice(total)} zł</strong></span>`
    : "";

  return {
    html: `${key ? `Krótko na ${rods[key].label}:` : "Krótko, w jednym miejscu:"}${points.join("")}${totalHtml}<span class="chat-meta">Chcesz, żebym połączył to w cały zestaw?</span>`,
    suggestions: [
      { label: "Cały zestaw" },
      { label: "Ile trwa dostawa?" },
      { label: "Sprawdź dostępność" }
    ]
  };
}

function stockReply(product) {
  const availability = product.stock === 1
    ? "Tak, została ostatnia sztuka."
    : `Tak, mamy ${product.stock} szt. na stanie.`;

  return {
    html: `${availability} <strong>${product.name}</strong> możesz zamówić od razu. Zamówienie złożone do 13:00 wysyłamy jeszcze tego samego dnia.<span class="chat-meta">Jeśli chcesz, sprawdzę też, co dobrać do tego zestawu.</span>`,
    suggestions: [
      { label: "Ile trwa dostawa?" },
      { label: "Jakie są płatności?" },
      { label: "Dobierz linkę" }
    ]
  };
}

function priceReply(product) {
  return {
    html: `<strong>${product.name}</strong> kosztuje <strong>${formatPrice(product.price)} zł</strong>.<span class="chat-stock">Dostępne: ${product.stock} szt.</span><span class="chat-meta">Cena zawiera VAT. Wysyłka jest gratis od 299 zł.</span>`,
    suggestions: [
      { label: "Sprawdź dostępność" },
      { label: "Ile trwa dostawa?" },
      { label: "Dobierz linkę" }
    ]
  };
}

function lureReply(speciesKey) {
  const replies = {
    pike: {
      html: "Na szczupaka sprawdzają się woblery <strong>9–12 cm</strong> i gumy <strong>12–15 cm</strong>. Z tego, co mamy, dobrze schodzą <strong>Salmo Executor 10 cm</strong> (69 zł) i <strong>Relax Kopyto 4”</strong> z główką 15 g (32 zł).<span class=\"chat-meta\">Na okoń zejdź do 5–8 cm. Chcesz konkretny kolor?</span>",
      suggestions: [
        { label: "Jaka plecionka?" },
        { label: "Ile trwa dostawa?" },
        { label: "Sprawdź dostępność" }
      ]
    },
    perch: {
      html: "Na okonia bierz <strong>woblerki 5–7 cm</strong> i gumy <strong>5–8 cm</strong> na główkach 2–5 g. Z półki polecam Relax Kopyto 2” (19 zł) i jigi 3 g (12 zł).<span class=\"chat-meta\">Lekki zestaw robi tu całą robotę.</span>",
      suggestions: [
        { label: "Jaka plecionka?" },
        { label: "Ile trwa dostawa?" },
        { label: "Wędka na okonia do 250 zł" }
      ]
    },
    zander: {
      html: "Na sandacza sprawdzą się gumy <strong>10–12 cm</strong> na główkach 10–20 g. Z półki: Relax Kopyto 4” (32 zł) i jig 15 g (14 zł).<span class=\"chat-meta\">W dzień schodź niżej, wieczorem możesz łowić śmielej.</span>",
      suggestions: [
        { label: "Jaka plecionka?" },
        { label: "Ile trwa dostawa?" },
        { label: "Wędka na sandacza do 300 zł" }
      ]
    },
    carp: {
      html: "Na karpia polecam <strong>kulki 15 mm</strong> (24 zł / 250 g) i <strong>pellet 6 mm</strong> (18 zł / 500 g). Do tego zanęta Method Mix 2,5 kg za 39 zł.<span class=\"chat-meta\">Chcesz dobrać koszyk method?</span>",
      suggestions: [
        { label: "Dobierz koszyk method" },
        { label: "Ile trwa dostawa?" },
        { label: "Wędka na karpia do 300 zł" }
      ]
    },
    bream: {
      html: "Leszcz to ryba spokojnego żeru — tu najlepiej sprawdzą się <strong>pellet 4 mm</strong> (16 zł / 500 g) i zanęta feederowa (29 zł / 2 kg).<span class=\"chat-meta\">Do metody dobierzemy też koszyk.</span>",
      suggestions: [
        { label: "Dobierz koszyk method" },
        { label: "Ile trwa dostawa?" },
        { label: "Wędka na leszcza do 300 zł" }
      ]
    },
    trout: {
      html: "Na pstrąga bierz <strong>małe woblerki 3–5 cm</strong> i gumy 4–6 cm. Z półki: Robinson River 4 cm (29 zł) i główki 2 g (10 zł).<span class=\"chat-meta\">W zimnej wodzie wolniejsze prowadzenie działa lepiej.</span>",
      suggestions: [
        { label: "Jaka plecionka?" },
        { label: "Ile trwa dostawa?" },
        { label: "Wędka na pstrąga do 300 zł" }
      ]
    },
    catfish: {
      html: "Na suma potrzebujesz <strong>dużych gum 20–25 cm</strong> i ciężkich główek 30–60 g. Mamy gumy 22 cm (49 zł) i główki 40 g (19 zł).<span class=\"chat-meta\">Do tego mocny kij i plecionka — dobiorę zestaw.</span>",
      suggestions: [
        { label: "Jaka plecionka?" },
        { label: "Wędka na suma do 400 zł" },
        { label: "Ile trwa dostawa?" }
      ]
    }
  };

  return replies[speciesKey] || {
    html: "Powiedz, na jaką rybę łowisz — dobiorę przynętę do wody i warunków. Np. szczupak, okoń albo karp.",
    suggestions: [
      { label: "Przynęty na szczupaka" },
      { label: "Przynęty na okonia" },
      { label: "Przynęty na karpia" }
    ]
  };
}

function findProductByName(text) {
  const allProducts = [
    ...Object.values(rods).flatMap((entry) => entry.options),
    ...reels,
    ...Object.values(lineProducts)
  ];

  return allProducts.find((product) => {
    const tokens = normalize(product.name).split(" ").filter((token) => token.length > 3);
    return tokens.length > 0 && tokens.every((token) => text.includes(token));
  }) || null;
}

function setSuggestions(items) {
  suggestionsBox.replaceChildren();

  items.slice(0, 4).forEach((item) => {
    const suggestion = typeof item === "string" ? { label: item, question: item } : item;
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.question = suggestion.question || suggestion.label;
    button.textContent = suggestion.label;
    suggestionsBox.appendChild(button);
  });
}

function scrollChat(immediate = false) {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      chatLog.scrollTo({
        top: chatLog.scrollHeight,
        behavior: reducedMotion || immediate ? "auto" : "smooth"
      });
    });
  });
}

function addMessage(role, text, isHtml = false) {
  const message = document.createElement("div");
  const paragraph = document.createElement("p");
  message.className = `message ${role}`;

  if (isHtml) {
    paragraph.innerHTML = text;
  } else {
    paragraph.textContent = text;
  }

  message.appendChild(paragraph);
  chatLog.insertBefore(message, typingIndicator);
  scrollChat();
}

function setTyping(isTyping) {
  typingIndicator.hidden = !isTyping;
  chatSubmit.disabled = isTyping;
  chatForm.setAttribute("aria-busy", String(isTyping));
  if (isTyping) scrollChat();
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function replyFor(text) {
  const normalized = normalize(text);
  const budget = extractBudget(normalized);
  const speciesKey = findSpecies(normalized);
  const speciesChanged = Boolean(speciesKey && speciesKey !== state.species);
  const budgetChanged = Boolean(budget && budget !== state.budget);

  if (speciesChanged || budgetChanged) {
    state.selected = { rod: null, reel: null, line: null };
  }

  if (speciesKey) state.species = speciesKey;
  if (budget) state.budget = budget;

  if (state.awaitingOrder) {
    const orderMatch = text.match(/(?:WW[-\s]?)?(\d{3,5})/i);
    state.awaitingOrder = false;
    if (orderMatch) return orderStatusReply(orderMatch[1]);
  }

  const explicitSpecies = speciesKey ? rods[speciesKey] : null;
  const explicitProduct = findProductByName(normalized);

  const isDelivery = hasAny(normalized, [
    "dostaw", "wysyl", "kurier", "paczkomat", "paczka", "przesyl", "sledz", "tracking"
  ]) || /kiedy (dojdzie|dotrze|przyjdzie)/.test(normalized);
  const isReturn = hasAny(normalized, ["zwrot", "zwroc", "odesl", "rezygnac", "odstap", "30 dni"]);
  const isWarranty = hasAny(normalized, ["gwaranc", "reklamac", "zepsut", "uszkodz", "napraw"]);
  const isPayment = hasAny(normalized, ["platnosc", "zaplac", "blik", "karta", "kartą", "raty", "przelew", "pobran"]);
  const isHours = hasAny(normalized, ["godzin", "otwart", "telefon", "kontakt", "stacjonar", "adres", "gdzie jest sklep"]);
  const isOrderStatus = hasAny(normalized, ["gdzie paczka", "gdzie moja paczka", "status zamowienia", "status paczki", "numer zamowienia"]);
  const isStock = hasAny(normalized, ["dostepn", "na stanie", "sztuk", "stan magazyn", "jest dostepn"]);
  const isPriceQuestion = hasAny(normalized, ["ile kosztuje", "jaka cena", "cena", "kosztuje"]);
  const isRod = /\bwedk\w*/.test(normalized) || hasAny(normalized, ["spinning", "feeder", "karpiowk", "teleskop", "match"]);
  const isReel = hasAny(normalized, ["kolowrot", "mlynek"]);
  const isLine = hasAny(normalized, ["plecionk", "zylk", "linka", "linke", "linki"]);
  const isLure = hasAny(normalized, ["wobler", "guma", "gumy", "przynet", "blach", "jig", "obrotowk"]);
  const isGroundbait = hasAny(normalized, ["zanet", "kulki", "pellet"]);
  const isMethod = hasAny(normalized, ["koszyk", "method"]);
  const isMarine = hasAny(normalized, ["rekin", "marlin", "tunczyk", "tunczyka", "zarlacz"]);
  const isServiceQuestion = hasAny(normalized, ["wdrozenie", "abonament", "cena bota", "ile kosztuje bot", "twoj bot"]);
  const isBundle = hasAny(normalized, ["caly zestaw", "pelny zestaw", "wszystko naraz", "zestaw na"])
    || /\bkomplet\b/.test(normalized)
    || /\b(ile razem|ile lacznie|jaki koszt zestawu|koszt calosci)\b/.test(normalized);
  const productIntentCount = [isRod, isReel, isLine, isLure].filter(Boolean).length;

  if (state.awaitingLead) {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text.trim())) {
      state.awaitingLead = false;
      return {
        html: "Dzięki! W realnym wdrożeniu ten e-mail trafiłby do sklepu razem z pytaniem. To demo, więc nic nie wysłałem — możesz testować dalej.",
        suggestions: DEFAULT_SUGGESTIONS
      };
    }
    state.awaitingLead = false;
  }

  if (hasAny(normalized, ["wroc do pytan", "zacznij od nowa", "reset", "przykladowe pytania"])) {
    return {
      html: "Jasne, zaczynamy od nowa. Sprzęt, dostawa czy zwrot?",
      suggestions: DEFAULT_SUGGESTIONS
    };
  }

  if (hasAny(normalized, ["dzieki", "dziekuje", "super", "spoko", "do widzenia", "pa pa"]) && normalized.length < 40) {
    return {
      html: "Nie ma sprawy. Jak coś jeszcze — jestem tutaj.",
      suggestions: [
        { label: "Ile trwa dostawa?" },
        { label: "Jak wygląda zwrot?" },
        { label: "Wędka na szczupaka do 300 zł" }
      ]
    };
  }

  if (isMarine) {
    return {
      html: "Rekiny i tuńczyki zostawmy w spokoju — tego nie mamy w ofercie. W słodkiej wodzie pomogę dobrać przynęty na szczupaka, okonia albo karpia.",
      suggestions: [
        { label: "Przynęty na szczupaka" },
        { label: "Przynęty na okonia" },
        { label: "Przynęty na karpia" }
      ]
    };
  }

  if (isServiceQuestion) {
    return {
      html: "To pytanie o samo wdrożenie, a nie o produkt ze sklepu. Wdrożenie kosztuje <strong>1 490 zł</strong>, potem <strong>299 zł/mies.</strong> Szczegóły znajdziesz w sekcji <a href=\"#cennik\">Cennik</a> — wycenę robię w 24 h.",
      suggestions: [
        { label: "Ile trwa dostawa?" },
        { label: "Wędka na szczupaka do 300 zł" }
      ]
    };
  }

  if (isReturn) {
    return {
      html: "Masz <strong>30 dni</strong> na zwrot. Produkt musi być nieużywany, z metkami i w oryginalnym opakowaniu. Wystarczy formularz zwrotu na stronie — wygenerujesz etykietę za 12,99 zł, a przy wymianie jest gratis. Zwrot księgujemy do 3 dni roboczych.<span class=\"chat-meta\">Pieniądze wracają tą samą metodą płatności, którą zapłaciłeś.</span>",
      suggestions: [
        { label: "Ile trwa dostawa?" },
        { label: "Jakie są płatności?" },
        { label: "Wędka na karpia do 300 zł" }
      ]
    };
  }

  if (isWarranty) {
    return {
      html: "Sprzęt ma <strong>2 lata gwarancji</strong>. Przy usterce opisz sprawę w formularzu reklamacji — jeśli wada jest fabryczna, naprawa albo wymiana jest bezpłatna. Przynęty i gumy rozpatrujemy indywidualnie.",
      suggestions: [
        { label: "Jak wygląda zwrot?" },
        { label: "Ile trwa dostawa?" },
        { label: "Kontakt do sklepu" }
      ]
    };
  }

  if (isPayment) {
    return {
      html: "Płacisz <strong>BLIK-iem, kartą, Przelewy24</strong> albo przy odbiorze (dopłata 5 zł). Przy zamówieniach od 500 zł dostępne są raty 0%.",
      suggestions: [
        { label: "Ile trwa dostawa?" },
        { label: "Jak wygląda zwrot?" },
        { label: "Wędka na szczupaka do 300 zł" }
      ]
    };
  }

  if (isHours) {
    return {
      html: "Sklep online działa całą dobę, a ja odpowiadam od razu. Właściciel odpisuje <strong>pon.–pt. 9–18</strong> i <strong>sob. 9–14</strong>. Sklep stacjonarny: ul. Rybacka 12, Poznań.",
      suggestions: [
        { label: "Ile trwa dostawa?" },
        { label: "Jakie są płatności?" },
        { label: "Wędka na szczupaka do 300 zł" }
      ]
    };
  }

  if (isOrderStatus) {
    state.awaitingOrder = true;
    return {
      html: "Jasne. Podaj numer zamówienia — znajdziesz go w mailu potwierdzającym, np. <strong>WW-1042</strong>.",
      suggestions: [
        { label: "Ile trwa dostawa?" },
        { label: "Jak wygląda zwrot?" }
      ]
    };
  }

  const directOrderMatch = text.match(/WW[-\s]?(\d{3,5})/i);
  if (directOrderMatch) {
    return orderStatusReply(directOrderMatch[1]);
  }

  if (isBundle) {
    return bundleReply(speciesKey, budget);
  }

  if (isStock && !isRod && !isReel && !isLine && !isLure && !isGroundbait) {
    const product = explicitProduct || state.lastProduct;
    if (product) {
      state.lastProduct = product;
      return stockReply(product);
    }

    return {
      html: "Sprawdzę. Podaj nazwę albo model produktu, który Cię interesuje.",
      suggestions: [
        { label: "Wędka na szczupaka do 300 zł" },
        { label: "Kołowrotek do 200 zł" },
        { label: "Dobierz linkę" }
      ]
    };
  }

  if (explicitProduct && isPriceQuestion) {
    state.lastProduct = explicitProduct;
    return priceReply(explicitProduct);
  }

  if (isDelivery) {
    return {
      html: "Zamówienia złożone <strong>do 13:00</strong> wysyłamy tego samego dnia. Paczkomat to <strong>13,99 zł</strong>, kurier <strong>16,99 zł</strong>, a od 299 zł dostawa jest gratis. Zwykle masz paczkę u siebie w <strong>1–2 dni robocze</strong>.<span class=\"chat-meta\">Numer śledzenia dostaniesz mailem po nadaniu.</span>",
      suggestions: [
        { label: "Jak wygląda zwrot?" },
        { label: "Jakie są płatności?" },
        { label: "Wędka na szczupaka do 300 zł" }
      ]
    };
  }

  if (productIntentCount >= 2) {
    return multiReply({ key: state.species, budget: budget || state.budget, intents: { rod: isRod, reel: isReel, line: isLine, lure: isLure } });
  }

  if (isReel) {
    return reelReply(budget || state.budget);
  }

  if (isLine) {
    return lineReply();
  }

  if (isLure) {
    return lureReply(speciesKey);
  }

  if (isGroundbait) {
    return {
      html: "Na karpia polecam <strong>Method Mix 2,5 kg</strong> — 39 zł. Dobrze się wiąże i utrzymuje w koszyku, a do tego mamy pasujące kulki 15 mm w cenie 24 zł za 250 g.<span class=\"chat-meta\">Do metody potrzebujesz jeszcze koszyka — mogę dobrać.</span>",
      suggestions: [
        { label: "Dobierz koszyk method" },
        { label: "Ile trwa dostawa?" },
        { label: "Wędka na karpia do 300 zł" }
      ]
    };
  }

  if (isMethod) {
    return {
      html: "Do methody polecam <strong>koszyk Method 30 g</strong> — 19 zł. Dobrze trzyma zanętę i jest stabilny przy rzucie. Mamy też wersję 45 g do dalszego łowienia.<span class=\"chat-stock\">Dostępne: 9 szt.</span>",
      suggestions: [
        { label: "Ile trwa dostawa?" },
        { label: "Jakie są płatności?" },
        { label: "Wędka na karpia do 300 zł" }
      ]
    };
  }

  if (isRod || explicitSpecies) {
    if (!explicitSpecies) {
      state.category = "rod";
      if (budget) {
        return {
          html: `Dobiorę. Powiedz jeszcze, na jaką rybę — od tego zależy długość i ciężar wyrzutu. Budżet do ${formatPrice(budget)} zł zapamiętałem.`,
          suggestions: [
            { label: `Szczupak do ${formatPrice(budget)} zł` },
            { label: `Karp do ${formatPrice(budget)} zł` },
            { label: `Okoń do ${formatPrice(budget)} zł` }
          ]
        };
      }

      return {
        html: "Dobiorę, ale potrzebuję dwóch rzeczy: na jaką rybę i do jakiej kwoty. Np. szczupak, do 300 zł.",
        suggestions: [
          { label: "Szczupak do 300 zł" },
          { label: "Karp do 400 zł" },
          { label: "Okoń do 250 zł" }
        ]
      };
    }

    if (!budget) return rodReply(speciesKey, null);
    return rodReply(speciesKey, budget);
  }

  if (budget && state.category === "rod" && state.species) {
    return rodReply(state.species, budget);
  }

  if (budget && state.category === "reel") {
    return reelReply(budget);
  }

  if (budget && !state.category) {
    return {
      html: `Budżet do ${formatPrice(budget)} zł zapamiętany. Do czego mam dobrać sprzęt — wędka, kołowrotek czy coś drobniejszego?`,
      suggestions: [
        { label: "Wędka" },
        { label: "Kołowrotek" },
        { label: "Plecionka" }
      ]
    };
  }

  if (/^(czesc|hej|hello|witam|dzien dobry|dobry wieczor|siema|yo)\b/.test(normalized) && normalized.length < 34) {
    return {
      html: "Cześć! W czym pomóc — dobrać sprzęt, sprawdzić dostawę albo ogarnąć zwrot?",
      suggestions: DEFAULT_SUGGESTIONS
    };
  }

  state.awaitingLead = true;
  return {
    html: "Tego nie ma w przykładowej bazie. W prawdziwym sklepie nie zgaduję — ceny i dostępność sprawdzam w feedzie XML/CSV, a gdy czegoś tam brakuje, proszę o e-mail i przekazuję pytanie właścicielowi.<span class=\"chat-meta\">Możesz wpisać e-mail tutaj — to demo, więc nic nie wyślę.</span>",
    suggestions: [
      { label: "Wróć do przykładowych pytań" }
    ]
  };
}

function orderStatusReply(orderNumber) {
  const lastDigit = Number(orderNumber.slice(-1));
  const statuses = [
    "jest już w oddziale InPost w Poznaniu i czeka na kuriera. Planowana dostawa: jutro.",
    "została dziś odebrana przez kuriera. Dostawa powinna pojawić się jutro przed 18:00.",
    "przeszła sortowanie i jest w drodze do Ciebie. Według śledzenia dotrze jutro."
  ];

  return {
    html: `Zamówienie <strong>WW-${orderNumber}</strong> — paczka ${statuses[lastDigit % statuses.length]}<span class="chat-meta">Jeśli adres jest nieaktualny, odpisz tutaj jak najszybciej — spróbuję zatrzymać paczkę.</span>`,
    suggestions: [
      { label: "Ile trwa dostawa?" },
      { label: "Jak wygląda zwrot?" },
      { label: "Wróć do przykładowych pytań" }
    ]
  };
}

async function sendMessage(rawText) {
  const text = rawText.trim();
  if (!text || chatSubmit.disabled) return;

  addMessage("user", text);
  chatInput.value = "";
  setTyping(true);

  const delay = reducedMotion ? 180 : 620 + Math.min(480, text.length * 3);
  await wait(delay);

  let reply;
  try {
    reply = replyFor(text);
  } catch (error) {
    reply = {
      html: "Coś się zacieło po mojej stronie. Spróbuj zadać pytanie jeszcze raz.",
      suggestions: DEFAULT_SUGGESTIONS
    };
  }

  typingIndicator.hidden = true;
  addMessage("bot", reply.html, true);
  setSuggestions(reply.suggestions || DEFAULT_SUGGESTIONS);
  setTyping(false);
  scrollChat(true);
  state.messageCount += 1;

  if (window.innerWidth > 960) {
    chatInput.focus({ preventScroll: true });
  }
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(chatInput.value);
});

suggestionsBox.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-question]");
  if (!button) return;
  sendMessage(button.dataset.question);
});

document.getElementById("hero-demo-cta").addEventListener("click", () => {
  window.setTimeout(() => {
    if (window.innerWidth > 960) chatInput.focus({ preventScroll: true });
  }, 500);
});

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const formSubmit = contactForm.querySelector('button[type="submit"]');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function setFieldError(field, hasError) {
  if (!field) return;
  field.classList.toggle("has-error", hasError);
  field.querySelector("input, textarea")?.setAttribute("aria-invalid", String(hasError));
}

if (new URLSearchParams(window.location.search).get("wyslano") === "1") {
  formStatus.textContent = "Dzięki! Zapytanie trafiło na moją skrzynkę. Odpowiem w ciągu doby.";
  formStatus.className = "form-status success";
  const cleanUrl = new URL(window.location.href);
  cleanUrl.searchParams.delete("wyslano");
  window.history.replaceState({}, "", `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`);
}

contactForm.addEventListener("input", (event) => {
  const field = event.target.closest(".field");
  if (field) setFieldError(field, false);
  if (formStatus.classList.contains("error")) {
    formStatus.textContent = DEFAULT_FORM_STATUS;
    formStatus.className = "form-status";
  }
});

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const shopField = document.getElementById("shop");
  const messageField = document.getElementById("message");

  const name = nameField.value.trim();
  const email = emailField.value.trim();
  const shop = shopField.value.trim();
  const message = messageField.value.trim();

  const nameValid = name.length >= 2;
  const emailValid = emailPattern.test(email);
  const messageValid = message.length >= 10;

  setFieldError(nameField.closest(".field"), !nameValid);
  setFieldError(emailField.closest(".field"), !emailValid);
  setFieldError(messageField.closest(".field"), !messageValid);

  if (!nameValid || !emailValid || !messageValid) {
    formStatus.textContent = "Uzupełnij imię, poprawny e-mail i kilka słów o sklepie.";
    formStatus.className = "form-status error";
    (!nameValid ? nameField : !emailValid ? emailField : messageField).focus();
    return;
  }

  const originalButton = formSubmit.innerHTML;
  formSubmit.disabled = true;
  formSubmit.textContent = "Wysyłam…";
  formStatus.textContent = "Wysyłam zapytanie…";
  formStatus.className = "form-status";

  try {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        shop: shop || "Nie podano",
        message,
        _replyto: email,
        _subject: `Zapytanie ze strony — ${shop || name}`,
        _template: "table",
        _captcha: "false",
        _honey: "",
        _url: window.location.href
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.success === "false") {
      throw new Error(data.message || "Nie udało się wysłać formularza.");
    }

    contactForm.reset();
    formStatus.textContent = "Dzięki! Zapytanie trafiło na moją skrzynkę. Odpowiem w ciągu doby.";
    formStatus.className = "form-status success";
  } catch (error) {
    formStatus.innerHTML = `Nie udało się wysłać formularza. Napisz bezpośrednio na <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.`;
    formStatus.className = "form-status error";
  } finally {
    formSubmit.disabled = false;
    formSubmit.innerHTML = originalButton;
  }
});
