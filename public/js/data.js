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

var CITIES_BY_STATE = {
  "Andaman and Nicobar Islands": ["Port Blair"],
  "Andhra Pradesh": ["Adoni","Amalapuram","Anakapalle","Anantapur","Bapatla","Bhimavaram","Bobbili","Chilakaluripet","Chirala","Chittoor","Dharmavaram","Eluru","Gudivada","Gudur","Guntakal","Guntur","Hindupur","Kadapa","Kadiri","Kakinada","Kandukur","Kavali","Kurnool","Machilipatnam","Madanapalle","Mandapeta","Markapur","Nandyal","Narasaraopet","Nellore","Ongole","Proddatur","Puttur","Rajahmundry","Rajampet","Srikakulam","Srikalahasti","Tadepalligudem","Tadpatri","Tenali","Tirupati","Vijayawada","Visakhapatnam","Vizianagaram"],
  "Arunachal Pradesh": ["Itanagar","Naharlagun","Pasighat","Tawang"],
  "Assam": ["Barpeta","Dibrugarh","Dispur","Goalpara","Guwahati","Jorhat","Karimganj","Nagaon","Nalbari","North Lakhimpur","Sibsagar","Silchar","Tezpur","Tinsukia"],
  "Bihar": ["Arrah","Aurangabad","Begusarai","Bhagalpur","Buxar","Chhapra","Darbhanga","Gaya","Gopalganj","Hajipur","Katihar","Kishanganj","Madhubani","Motihari","Munger","Muzaffarpur","Nawada","Patna","Purnia","Saharsa","Samastipur","Sasaram","Sitamarhi","Siwan"],
  "Chandigarh": ["Chandigarh"],
  "Chhattisgarh": ["Ambikapur","Bhilai Nagar","Bilaspur","Dhamtari","Durg","Jagdalpur","Korba","Mahasamund","Raigarh","Raipur","Rajnandgaon"],
  "Dadra and Nagar Haveli": ["Silvassa"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman","Diu","Silvassa"],
  "Delhi": ["Delhi","New Delhi"],
  "Goa": ["Mapusa","Margao","Panaji","Vasco da Gama"],
  "Gujarat": ["Ahmedabad","Amreli","Anand","Ankleshwar","Bharuch","Bhavnagar","Bhuj","Deesa","Gandhinagar","Godhra","Jamnagar","Junagadh","Khambhat","Mahesana","Morvi","Nadiad","Navsari","Palanpur","Patan","Porbandar","Rajkot","Surat","Vadodara","Valsad","Vapi","Veraval"],
  "Haryana": ["Bahadurgarh","Bhiwani","Faridabad","Fatehabad","Gurgaon","Hisar","Jind","Kaithal","Karnal","Mahendragarh","Palwal","Panchkula","Panipat","Rewari","Rohtak","Sirsa","Sonipat","Yamunanagar"],
  "Himachal Pradesh": ["Dharamshala","Kullu","Manali","Mandi","Nahan","Palampur","Shimla","Solan","Sundarnagar"],
  "Jammu and Kashmir": ["Anantnag","Baramula","Jammu","Kathua","Punch","Rajauri","Sopore","Srinagar","Udhampur"],
  "Jharkhand": ["Bokaro Steel City","Chaibasa","Deoghar","Dhanbad","Dumka","Giridih","Hazaribag","Jamshedpur","Lohardaga","Ranchi","Sahibganj"],
  "Karnataka": ["Ballari","Belagavi","Bengaluru","Chikkamagaluru","Davanagere","Hubli-Dharwad","Karwar","Kolar","Madikeri","Mandya","Mangaluru","Mysore","Ramanagaram","Shivamogga","Tumkur","Udupi","Vijayapura","Yadgir"],
  "Kerala": ["Alappuzha","Guruvayoor","Kannur","Kasaragod","Kochi","Kodungallur","Kollam","Kottayam","Kozhikode","Malappuram","Palakkad","Pathanamthitta","Thiruvananthapuram","Thrissur","Tirur","Varkala"],
  "Ladakh": ["Kargil","Leh"],
  "Lakshadweep": ["Kavaratti"],
  "Madhya Pradesh": ["Balaghat","Bhopal","Gwalior","Indore","Itarsi","Jabalpur","Mandsaur","Morena","Neemuch","Ratlam","Rewa","Sagar","Satna","Sehore","Seoni","Shahdol","Shivpuri","Singrauli","Ujjain","Vidisha"],
  "Maharashtra": ["Ahmednagar","Akola","Amravati","Aurangabad","Bhiwandi","Dhule","Ichalkaranji","Kalyan-Dombivali","Kolhapur","Latur","Malegaon","Mira-Bhayandar","Mumbai","Nagpur","Nanded-Waghala","Nandurbar","Nashik","Osmanabad","Palghar","Panvel","Parbhani","Pune","Ratnagiri","Sangli","Satara","Solapur","Thane","Vasai-Virar","Wardha","Yavatmal"],
  "Manipur": ["Imphal","Thoubal"],
  "Meghalaya": ["Nongstoin","Shillong","Tura"],
  "Mizoram": ["Aizawl","Lunglei","Saiha"],
  "Nagaland": ["Dimapur","Kohima","Mokokchung","Tuensang","Wokha","Zunheboto"],
  "Odisha": ["Balangir","Baleshwar","Bhadrak","Bhubaneswar","Brahmapur","Cuttack","Jharsuguda","Kendrapara","Puri","Raurkela","Sambalpur","Sundargarh"],
  "Puducherry": ["Karaikal","Mahe","Pondicherry","Yanam"],
  "Punjab": ["Amritsar","Barnala","Batala","Bathinda","Faridkot","Firozpur","Gurdaspur","Hoshiarpur","Jalandhar","Kapurthala","Khanna","Ludhiana","Mansa","Moga","Mohali","Muktsar","Nabha","Nawanshahr","Pathankot","Patiala","Phagwara","Rajpura","Rupnagar","Sangrur","Zirakpur"],
  "Rajasthan": ["Ajmer","Alwar","Barmer","Bharatpur","Bhilwara","Bikaner","Jaipur","Jaisalmer","Jodhpur","Kota","Nagaur","Pali","Sawai Madhopur","Sikar","Sirohi","Sri Ganganagar","Tonk","Udaipur"],
  "Sikkim": ["Gangtok","Mangan","Namchi","Pelling"],
  "Tamil Nadu": ["Chennai","Coimbatore","Erode","Kancheepuram","Karur","Madurai","Nagapattinam","Namakkal","Pollachi","Pudukkottai","Ramanathapuram","Salem","Sivakasi","Thanjavur","Tiruchirappalli","Tirunelveli","Tiruppur","Tiruvannamalai","Udhagamandalam","Vellore","Viluppuram","Virudhunagar"],
  "Telangana": ["Adilabad","Hyderabad","Karimnagar","Khammam","Mahbubnagar","Mancherial","Medak","Miryalaguda","Nizamabad","Ramagundam","Sangareddy","Siddipet","Warangal"],
  "Tripura": ["Agartala","Belonia","Dharmanagar","Kailasahar","Khowai","Udaipur"],
  "Uttar Pradesh": ["Agra","Aligarh","Allahabad","Amroha","Azamgarh","Bahraich","Bareilly","Budaun","Etawah","Faizabad","Firozabad","Ghaziabad","Gorakhpur","Hapur","Jhansi","Kanpur","Lakhimpur","Lucknow","Mathura","Meerut","Mirzapur","Moradabad","Muzaffarnagar","Noida","Orai","Pilibhit","Rae Bareli","Rampur","Saharanpur","Sambhal","Shahjahanpur","Sitapur","Sultanpur","Unnao","Varanasi"],
  "Uttarakhand": ["Dehradun","Haldwani","Hardwar","Kashipur","Mussoorie","Nainital","Pithoragarh","Rishikesh","Roorkee","Rudrapur"],
  "West Bengal": ["Asansol","Baharampur","Balurghat","Bankura","Darjiling","Habra","Hugli-Chinsurah","Jalpaiguri","Kharagpur","Kolkata","Malda","Medinipur","Purulia","Raiganj","Ranaghat","Siliguri"],
};

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
