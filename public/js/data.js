var INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand",
  "Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"
].sort();

var EXPERIENCE_RANGES = [
  "Less than 1 year","1–3 years","4–7 years",
  "8–15 years","16–25 years","More than 25 years"
];

var RELATIONSHIP_OPTIONS = [
  { label: "Homebuyer / Resident", citizen: true },
  { label: "Architect or Engineer", citizen: false },
  { label: "Sustainability Practitioner", citizen: false },
  { label: "Real Estate Developer or Agent", citizen: false },
  { label: "Urban Planner", citizen: false },
  { label: "Researcher or Academic", citizen: false },
  { label: "Policy or Government", citizen: false },
  { label: "Other", citizen: true },
];

var CATEGORIES = [
  { id: "energy", name: "Energy & Climate", color: "#D97706",
    desc: "Energy efficiency, renewable energy adoption, carbon footprint" },
  { id: "water", name: "Water Management", color: "#2563EB",
    desc: "Water conservation, rainwater harvesting, wastewater treatment" },
  { id: "materials", name: "Materials & Construction", color: "#92400E",
    desc: "Sustainable materials, embodied carbon, construction waste" },
  { id: "site", name: "Site & Ecology", color: "#059669",
    desc: "Land use, biodiversity, green cover, stormwater management" },
  { id: "indoor", name: "Indoor Environment", color: "#7C3AED",
    desc: "Air quality, thermal comfort, natural lighting, acoustics" },
  { id: "operations", name: "Operations & Governance", color: "#475569",
    desc: "Maintenance planning, resident engagement, reporting transparency" },
];

var PAIRS = [];
for (var i = 0; i < CATEGORIES.length; i++) {
  for (var j = i + 1; j < CATEGORIES.length; j++) {
    PAIRS.push([i, j]);
  }
}

var SAATY_LABELS = {
  1: "Equal", 3: "Moderate", 5: "Strong", 7: "Very strong", 9: "Extreme",
  2: "Weak–Moderate", 4: "Moderate–Strong", 6: "Strong–Very strong", 8: "Very strong–Extreme"
};

var INTENSITY_LABELS = {
  1: { short: "Equal", long: "Equal importance" },
  3: { short: "Moderate", long: "Moderately more important" },
  5: { short: "Strong", long: "Strongly more important" },
  7: { short: "V. Strong", long: "Very strongly more important" },
  9: { short: "Extreme", long: "Extremely more important" },
};
