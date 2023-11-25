const fetchCountries = async () => {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
};

//filter countries by region
const filterByRegion = (selectedRegion) => {
    console.log('Selected Region:', selectedRegion);
    document.getElementById('dropdownMenuButton').dataset.selectedRegion = selectedRegion;

    if (selectedRegion === 'All') {
        renderCountries(allCountries);
    } else {
        const filterResult = allCountries.filter(country => country.region === selectedRegion);
        console.log('Filtered Countries:', filterResult);
        renderCountries(filterResult);
    }
};


const searchByNameAndRegion = (query, selectedRegion) => {
    const searchedCountries = allCountries.filter(country => {
        const countryname = country.name.common.toLowerCase().includes(query.toLowerCase());
        const countryregion = selectedRegion === 'All' || country.region === selectedRegion;
        return countryname && countryregion;
    });

    renderCountries(searchedCountries);

    localStorage.setItem('lastSearchQuery', query);
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

//toggle dark mode
const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
};

let allCountries = [];

const lastSearchQuery = localStorage.getItem('lastSearchQuery');

fetchCountries()
    .then(countries => {
        allCountries = countries;
        renderCountries(countries);

        if (lastSearchQuery) {
            document.getElementById('searchInput').value = lastSearchQuery;
            const selectedRegion = document.getElementById('dropdownMenuButton').dataset.selectedRegion || 'All';
            searchByNameAndRegion(lastSearchQuery, selectedRegion);
        }
    })
    .catch(error => console.error('Error fetching countries:', error));
