// --------------------------------------  SearchBar ----------------------------------//

document.addEventListener('DOMContentLoaded', () => {
    const inputBox = document.getElementById('input-box');
    const suggestionsBox = document.getElementById('suggestions');
    const searchButton = document.getElementById('search-button');
    let timeoutId;
    let API_KEY = '';



    // Fetch API key from server
async function loadApiKey() {
  try {
    console.log('🌐 Requesting API key...');
    const response = await axios.get('/recipe/api-key');
    API_KEY = response.data.apiKey;
    console.log('✅ API Key loaded:', API_KEY);
  } catch (error) {
    console.error('🚫 Error loading API Key:', error);
  }
}

    // Debounce function to limit the number of API calls
    function debounce(func, delay) {
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Function to fetch and display suggestions using axios
    const fetchSuggestions = async () => {
        const query = inputBox.value.trim();
        if (query.length < 2) {
            suggestionsBox.style.display = 'none'; // Hide suggestions if input is too short
            return;
        }

        try {
      const response = await axios.get('https://api.spoonacular.com/recipes/autocomplete', {
        params: {
          query: query,
          number: 5,
          apiKey: API_KEY
        }
            });

            const data = response.data;

            // Clear previous suggestions
            suggestionsBox.innerHTML = '';

            // Populate new suggestions
            if (Array.isArray(data) && data.length > 0) {
                data.forEach(item => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.className = 'suggestion-item';
                    suggestionItem.textContent = item.title;
                    suggestionItem.tabIndex = 0; // Make items focusable
                    suggestionItem.addEventListener('click', () => {
                          window.location.href = `/recipes/${item.id}/information`;
                    });
                    suggestionItem.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                             window.location.href = `/recipes/${item.id}/information`;
                        }
                    });
                    suggestionsBox.appendChild(suggestionItem);
                });
                suggestionsBox.style.display = 'block'; // Show suggestions
            } else {
                suggestionsBox.innerHTML = '<div class="error-message">No suggestions found</div>';
                suggestionsBox.style.display = 'block';
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            suggestionsBox.innerHTML = '<div class="error-message">Failed to load suggestions.</div>';
            suggestionsBox.style.display = 'block'; // Show error message
        }
    };

    // Apply debounce to input event
    inputBox.addEventListener('input', debounce(fetchSuggestions, 300));

    // Fetch suggestions when the search button is clicked
    searchButton.addEventListener('click', fetchSuggestions);

    // Hide suggestions when the input loses focus
    inputBox.addEventListener('blur', () => {
        setTimeout(() => { // Timeout allows clicks on suggestion items
            suggestionsBox.style.display = 'none';
        }, 200);
    });

   // Load the API key before using it
    loadApiKey().then(() => {
        console.log('🔐 API key fetch attempt complete.');
    });
});
