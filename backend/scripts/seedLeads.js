const DEFAULT_BASE_URL = "http://localhost:5000";
const DEFAULT_COUNT = 25;
const DEFAULT_DELAY_MS = 0;

const NAME_POOL = [
  "James Mwangi",
  "Sarah Achieng",
  "Daniel Kimani",
  "Amina Otieno",
  "Grace Wanjiku",
  "Brian Ouma",
  "Lydia Chebet",
  "Peter Kariuki",
  "Monica Njeri",
  "Samuel Kiptoo",
  "Faith Nduta",
  "Kevin Kamau",
  "Mercy Gitau",
  "Dennis Obiero",
  "Irene Wafula"
];

const INTENTS = [
  "General Inquiry",
  "Pricing Question",
  "Product/Service Request",
  "Demo Request",
  "Partnership",
  "Support"
];

const INTENT_CONTEXTS = {
  "General Inquiry": [
    "I would like to know more about your services.",
    "Could you share more information about what you offer?",
    "I am exploring options and would like some details."
  ],
  "Pricing Question": [
    "Can I get pricing for bulk orders?",
    "What is the cost for your standard package?",
    "Do you offer a quote for enterprise pricing?"
  ],
  "Product/Service Request": [
    "I need a solution tailored to my business.",
    "We are interested in your product for our team.",
    "Please share details about your service options."
  ],
  "Demo Request": [
    "Interested in scheduling a demo.",
    "Can we arrange a walkthrough of the platform?",
    "I would like a trial or demo this week."
  ],
  "Partnership": [
    "We are interested in collaboration opportunities.",
    "Can we discuss a potential integration partnership?",
    "Looking to explore a partnership with your team."
  ],
  "Support": [
    "I need help with an issue on my account.",
    "Support needed for a recent order.",
    "I am experiencing a problem and need assistance."
  ]
};

const INTENT_PRIORITY = {
  "General Inquiry": "Low",
  "Pricing Question": "Medium",
  "Product/Service Request": "Medium",
  "Demo Request": "High",
  "Partnership": "Medium",
  "Support": "High"
};

const EMAIL_DOMAINS = ["gmail.com", "yahoo.com", "outlook.com", "company.co.ke", "example.com"];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const pickOne = (items) => items[Math.floor(Math.random() * items.length)];

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .trim()
    .replace(/\s+/g, ".");

const buildEmail = (name) => {
  const base = slugify(name);
  const domain = pickOne(EMAIL_DOMAINS);
  const suffix = Math.random() < 0.3 ? String(Math.floor(10 + Math.random() * 90)) : "";
  return `${base}${suffix}@${domain}`;
};

const buildLeadPayload = () => {
  const name = pickOne(NAME_POOL);
  const email = buildEmail(name);
  const intent = pickOne(INTENTS);
  const context = pickOne(INTENT_CONTEXTS[intent]);
  const priority = INTENT_PRIORITY[intent];

  const message = `${context} (Intent: ${intent}; Priority: ${priority})`;

  return {
    name,
    email,
    message,
    source: "seed_script"
  };
};

const parseArgs = () => {
  const args = process.argv.slice(2);
  const parsed = {
    baseUrl: DEFAULT_BASE_URL,
    count: DEFAULT_COUNT,
    delayMs: DEFAULT_DELAY_MS
  };

  args.forEach((arg) => {
    if (arg.startsWith("--baseUrl=")) {
      parsed.baseUrl = arg.split("=")[1];
    }

    if (arg.startsWith("--count=")) {
      parsed.count = Number(arg.split("=")[1]);
    }

    if (arg.startsWith("--delay=")) {
      parsed.delayMs = Number(arg.split("=")[1]);
    }
  });

  return parsed;
};

const postLead = async (baseUrl, payload) => {
  const response = await fetch(`${baseUrl}/api/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`POST /api/leads failed: ${response.status} ${errorText}`);
  }

  return response.json();
};

const run = async () => {
  const { baseUrl, count, delayMs } = parseArgs();

  if (!Number.isFinite(count) || count <= 0) {
    throw new Error("--count must be a positive number");
  }

  console.log(`Seeding ${count} leads to ${baseUrl}/api/leads`);

  for (let index = 0; index < count; index += 1) {
    const payload = buildLeadPayload();
    const created = await postLead(baseUrl, payload);
    console.log(`Created lead ${index + 1}/${count}: ${created.name} (${created.email})`);

    if (delayMs > 0 && index < count - 1) {
      await sleep(delayMs);
    }
  }

  console.log("Done.");
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
