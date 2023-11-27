const loadingIndicator = document.getElementById('loadingIndicator');

const fetchCountries = async () => {
    try {
        loadingIndicator.style.display = 'block';

        //2-second delay using setTimeout
        await new Promise(resolve => setTimeout(resolve, 2000));

        const response = await fetch('https://restcountries.com/v3.1/all');

        if (!response.ok) {
            throw new Error(`Error fetching countries: ${response.statusText}`);
        }

        const data = await response.json();

        loadingIndicator.style.display = 'none';

        return data;
    } catch (error) {
        console.error(error.message);

        // Display an error message on the page
        const errorMessageElement = document.getElementById('errorMessage');
        if (errorMessageElement) {
            errorMessageElement.textContent = 'Error fetching countries. Please try again later.';
        }

        loadingIndicator.style.display = 'none';
    }
};


const filterByRegion = (selectedRegion) => {
    console.log('Selected Region:', selectedRegion);
    document.getElementById('dropdownMenuButton').dataset.selectedRegion = selectedRegion;

    let filteredCountries = [];

    if (selectedRegion === 'All') {
        filteredCountries = allCountries;
    } else {
        filteredCountries = allCountries.filter(country => country.region === selectedRegion);
    }
    const searchQuery = document.getElementById('searchInput').value;
    searchByNameAndRegion(searchQuery, selectedRegion);

    //"No results found" if no match countries
    if (filteredCountries.length === 0) {
        const countriesContainer = document.getElementById('countriesContainer');
        const noresult = document.createElement('p');
        noresult.textContent = 'No results found';
        countriesContainer.appendChild(noresult);
    }

    //dropdown button text
    const dropdownButton = document.getElementById('dropdownMenuButton');
    dropdownButton.textContent = `${selectedRegion}`;
};


//countries by name
const searchCountriesByName = async (name) => {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${name}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error searching countries by name:', error);
        throw error;
    }
};


const searchByNameAndRegion = async (query, selectedRegion) => {
    try {
        let searchedCountries = [];

        if (query.trim() !== '') {
            //search by country name
            searchedCountries = await searchCountriesByName(query);

            //selected region
            searchedCountries = searchedCountries.filter(country => {
                const countryregion = selectedRegion === 'All' || country.region === selectedRegion;
                return countryregion;
            });
        } else {
            //if the search query is empty use all countries
            searchedCountries = allCountries;

            //filter by selected region
            searchedCountries = searchedCountries.filter(country => {
                const countryregion = selectedRegion === 'All' || country.region === selectedRegion;
                return countryregion;
            });
        }

        renderCountries(searchedCountries);

        //set"No results found" if no matching countries
        if (searchedCountries.length === 0) {
            const countriesContainer = document.getElementById('countriesContainer');
            const noresult = document.createElement('p');
            // noresult.textContent = 'No results found';
            // countriesContainer.appendChild(noresult);
        }

        localStorage.setItem('lastSearchQuery', query);
    } catch (error) {
        console.error('Error in searchByNameAndRegion:', error);
    }
};


const renderCountries = (countries) => {
    const countriesContainer = document.getElementById('countriesContainer');
    countriesContainer.innerHTML = '';

    if (countries.length === 0) {
        const noresult = document.createElement('p');
        noresult.textContent = 'No results found';
        countriesContainer.appendChild(noresult);
    } else {
        countries.forEach(country => {
            const { name, flags, population, region, capital } = country;
            const UrlFlag = flags.svg;

            const card = document.createElement('div');
            card.classList.add('col-lg-3');
            card.innerHTML = `
                <div class="card">
                    <img src="${UrlFlag}" class="card-img-top" style="height: 50%; object-fit: cover;" alt="...">
                    <div class="card-body">
                        <h2 class="card-title text-truncate">${name.common}</h2>
                        <p class="card-text text-truncate"><span class="bold">Population:</span> ${population}</p>
                        <p class="card-text text-truncate"><span class="bold">Region:</span> ${region}</p>
                        <p class="card-text text-truncate"><span class="bold">Capital:</span> ${capital}</p>
                    </div>
                </div>
            `;
            countriesContainer.appendChild(card);
        });
    }
};


//Event listener for search input
document.getElementById('searchInput').addEventListener('keyup', function () {
    const searchQuery = this.value;
    const selectedRegion = document.getElementById('dropdownMenuButton').dataset.selectedRegion || 'All';
    searchByNameAndRegion(searchQuery, selectedRegion);
});


// Function to toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    const isDarkMode = body.classList.toggle('dark-mode');
    const modeText = isDarkMode ? 'Light mode' : 'Dark mode';
    localStorage.setItem('darkMode', isDarkMode);
    setModeText(modeText);
}


//set mode text
function setModeText(text) {
    const modeTextElement = document.getElementById('modeText');
    if (modeTextElement) {
        modeTextElement.textContent = text;
    }
}


// Check if dark mode is enabled and set it
const darkMode = localStorage.getItem('darkMode') === 'true';
if (darkMode) {
    document.body.classList.add('dark-mode');
    setModeText('Light mode');
} else {
    setModeText('Dark mode');
}


let allCountries = [];


fetchCountries()
    .then(countries => {
        allCountries = countries;
        renderCountries(countries);
    })
    .catch(error => console.error('Error fetching countries:', error));