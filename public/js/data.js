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

var EDUCATION_LEVELS = [
  "High School / 12th Standard",
  "Diploma",
  "Bachelor's",
  "Master's",
  "Ph.D. / Doctoral"
];

var EXPERIENCE_RANGES = [
  "Less than 1 year","1–3 years","4–7 years",
  "8–15 years","16–25 years","More than 25 years"
];

var RELATIONSHIP_OPTIONS = [
  { label: "Homebuyer, Owner, or Renter", citizen: true },
  { label: "Architect, Engineer, or Designer", citizen: false },
  { label: "Real Estate or Construction Professional", citizen: false },
  { label: "Urban Planning, Policy, or Government", citizen: false },
  { label: "Researcher or Academic", citizen: false },
  { label: "Other", citizen: true },
];

var FAMILIARITY_LEVELS = [
  "Not at all", "Slightly", "Moderately", "Very", "Expert-level"
];

var FAMILIARITY_LEVELS_CITIZEN = [
  "Not at all", "A little", "Somewhat", "Quite a bit", "A lot"
];

var CATEGORIES = [
  { id: "energy", name: "Energy & Climate", color: "#D97706",
    desc: "Think energy-efficient design, solar adoption, low carbon emissions" },
  { id: "water", name: "Water Management", color: "#2563EB",
    desc: "Think rainwater harvesting, water recycling, efficient fixtures" },
  { id: "materials", name: "Materials & Construction", color: "#92400E",
    desc: "Think eco-friendly materials, low VOC, low embodied carbon" },
  { id: "site", name: "Site & Ecology", color: "#059669",
    desc: "Think green spaces, biodiversity, stormwater management" },
  { id: "indoor", name: "Indoor Environment", color: "#7C3AED",
    desc: "Think air quality (AQI), natural daylight, thermal comfort" },
  { id: "operations", name: "Operations & Governance", color: "#475569",
    desc: "Think waste management, maintenance planning, performance monitoring" },
];

// Flat alphabetical city list (all cities from every state, deduped) + "Other" at the end
var ALL_CITIES = (function() {
  var seen = {}, list = [];
  Object.keys(CITIES_BY_STATE).forEach(function(state) {
    CITIES_BY_STATE[state].forEach(function(city) {
      if (!seen[city]) { seen[city] = true; list.push(city); }
    });
  });
  list.sort();
  list.push('Other');
  return list;
})();

// Reverse lookup: city → state (used to auto-populate state from city selection)
var STATE_BY_CITY = (function() {
  var map = {};
  Object.keys(CITIES_BY_STATE).forEach(function(state) {
    CITIES_BY_STATE[state].forEach(function(city) { map[city] = state; });
  });
  return map;
})();

var PAIRS = [];
for (var i = 0; i < CATEGORIES.length; i++) {
  for (var j = i + 1; j < CATEGORIES.length; j++) {
    PAIRS.push([i, j]);
  }
}

