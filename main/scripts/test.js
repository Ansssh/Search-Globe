let isDarkMode = false;
const changeDisplay = document.getElementById("display-mode");
const displayModeSvg = document.getElementById("display-mode-svg");
const displayModeText = document.getElementById("display-mode-text");
const box = document.getElementById("countries-box");
const searchAndSortContainer = document.getElementById("search-and-sort-container");
const singleCountry = document.getElementById("country-solo");
const backBtn = document.getElementById("back");
const loadBtn = document.getElementById("load-more");
const searchInput = document.getElementById("search-bar");
const filterSelect = document.getElementById("countries-sort");

let allCountries = [];

// let currentIndex = 0;
// const batchSize = 12;

// Toggle Dark & Light Mode
changeDisplay.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    isDarkMode = !isDarkMode;
    displayModeText.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
});

// Fetch country data once and store it
async function fetchCountries() {
    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        if (!response.ok) throw new Error("Failed to fetch country data");
        allCountries = await response.json();
        displayCountries();
    } catch (error) {
        console.error(error);
        box.textContent = "Failed to load country data.";
    }
}

// Display a batch of countries
function displayCountries(filter = "", searchQuery = "") {
    box.innerHTML = "";
    let filteredCountries = allCountries;
    if (filter) filteredCountries = filteredCountries.filter(c => c.region.toLowerCase() === filter);
    if (searchQuery) filteredCountries = filteredCountries.filter(c => c.name.common.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // const countriesToShow = filteredCountries.slice(0, currentIndex + batchSize);
    // currentIndex += batchSize;

    filteredCountries.forEach(country => {
        const countryDiv = document.createElement("div");
        countryDiv.className = "country";
        countryDiv.dataset.name = country.name.common;
        countryDiv.innerHTML = `
            <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" class="country-flag">
            <h4 class="country-name">${country.name.common}</h4>
            <div class="little-data">
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Region:</strong> ${country.region}</p>
                <p><strong>Capital:</strong> ${country.capital?.join(", ") || "N/A"}</p>
            </div>
        `;
        box.appendChild(countryDiv);
    });
}

// Show country details
function showCountryDetails(countryName) {
    const country = allCountries.find(c => c.name.common === countryName);
    if (!country){
        console.log("SHIIIIIIIIIIIIIT");
        return;
    };
    
    singleCountry.innerHTML = `
        <img src="${country.flags.svg}" alt="flag" id="single-country-flag">
        <div id="single-country-data">
            <h2 id="single-country-name">${country.name.common}</h2>
            <div id="single-country-advanced-data">
                <p id="s-native-name"><strong>Native Name: </strong>${Object.values(country.name.nativeName)[0].common}</p>
                <p id="s-population"><strong>Population: </strong>${country.population.toLocaleString()}</p>
                <p id="s-region"><strong>Region: </strong>${country.region}</p>
                <p id="s-sub-region"><strong>Sub Region: </strong>${country?.subregion || "N/A"}</p>
                <p id="s-capital"><strong>Capital(s): </strong>${country.capital?.join(", ") || "N/A"}</p>
                <p id="s-domain"><strong>Top Level Domain: </strong>${country?.tld.join(", ")|| "N/A"}</p>
                <p id="s-currencies"><strong>Currencies: </strong>${Object.values(country.currencies)[0].name} (${Object.values(country.currencies)[0].symbol})</p>
                <p id="s-languages"><strong>Languages: </strong>${Object.values(country.languages).join(", ")}</p>
            </div>
            <div id="single-country-borders">
                <p id="borders-title"><strong>Border Countries:</strong></p>
                ${country.borders ? country.borders.map((neighbor) => `<button id="button-country">${neighbor}</button>`).join("") : "<button id='button-country' style='cursor:not-allowed'>None</span>"}

            </div>
        </div>
    `;

    
    
    box.classList.add("hidden");
    searchAndSortContainer.classList.add("hidden");
    loadBtn.classList.add("hidden");
    backBtn.classList.remove("hidden");
    singleCountry.classList.remove("hidden");
}

// Event delegation for country clicks
box.addEventListener("click", (e) => {
    const countryDiv = e.target.closest(".country");
    if (countryDiv) showCountryDetails(countryDiv.dataset.name);
});

// Back button functionality
backBtn.addEventListener("click", () => {
    box.classList.remove("hidden");
    searchAndSortContainer.classList.remove("hidden");
    loadBtn.classList.remove("hidden");
    backBtn.classList.add("hidden");
    singleCountry.classList.add("hidden");
});

// Load more button
loadBtn.addEventListener("click", () => {
    displayCountries();
    document.documentElement.scrollIntoView({ behavior: "smooth" });
});

// Search functionality
searchInput.addEventListener("input", () => {
    // currentIndex = 0;
    displayCountries(filterSelect.value, searchInput.value);
});

// Filter functionality
filterSelect.addEventListener("change", () => {
    // currentIndex = 0;
    displayCountries(filterSelect.value, searchInput.value);
});

// Initialize
fetchCountries();
