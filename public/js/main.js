
const deleteBtn = document.querySelectorAll('.del')
const todoItem = document.querySelectorAll('span.not')
const todoComplete = document.querySelectorAll('span.completed')


Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', markIncomplete)
})

async function deleteTodo(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/deleteTodo', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/markComplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markIncomplete(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/markIncomplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

// --------------------------Sign-in Form------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    // Cache the buttons and container
    const sign_in_btn = document.querySelector('#sign-in-btn');
    const sign_up_btn = document.querySelector('#sign-up-btn');
    const container = document.querySelector('.container');
    const sign_in_btn2 = document.querySelector('#sign-in-btn2');
    const sign_up_btn2 = document.querySelector('#sign-up-btn2');
  
    // Check if all required elements are present
    if (sign_up_btn && sign_in_btn && container) {
      // Add event listener for the "Sign up" button
      sign_up_btn.addEventListener('click', () => {
        container.classList.add('sign-up-mode');
        container.classList.remove('sign-up-mode2'); // Remove the second mode if it's active
      });
  
      // Add event listener for the "Sign in" button
      sign_in_btn.addEventListener('click', () => {
        container.classList.remove('sign-up-mode');
        container.classList.remove('sign-up-mode2');
      });
  
      // Add event listener for the second "Sign up" button (from another form)
      sign_up_btn2.addEventListener('click', () => {
        container.classList.add('sign-up-mode2');
        container.classList.remove('sign-up-mode'); // Remove the first mode if it's active
      });
  
      // Add event listener for the second "Sign in" button (from another form)
      sign_in_btn2.addEventListener('click', () => {
        container.classList.remove('sign-up-mode2');
        container.classList.remove('sign-up-mode');
      });
  
    } else {
      console.error('Required elements are not found in the DOM');
    }
  });
  

// --------------------------------------  SearchBar ----------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    const inputBox = document.getElementById('input-box');
    const suggestionsBox = document.getElementById('suggestions');
    const searchButton = document.getElementById('search-button');
    let timeoutId;




    // Debounce function to limit the number of API calls
    function debounce(func, delay) {
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Function to fetch and display suggestions
    const fetchSuggestions = async () => {
        const query = inputBox.value.trim();
        if (query.length < 2) {
            suggestionsBox.style.display = 'none'; // Hide suggestions if input is too short
            return;
        }

        try {
            const encodedQuery = encodeURIComponent(query);
            const response = await fetch(`https://api.spoonacular.com/recipes/autocomplete?query=${encodedQuery}&number=5&apiKey=${apiKey}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            // Clear previous suggestions
            suggestionsBox.innerHTML = '';

            // Populate new suggestions
            if (Array.isArray(data)) {
                data.forEach(item => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.className = 'suggestion-item';
                    suggestionItem.textContent = item.title;
                    suggestionItem.tabIndex = 0; // Make items focusable
                    suggestionItem.addEventListener('click', () => {
                        inputBox.value = item.title;
                        suggestionsBox.style.display = 'none'; // Hide suggestions after selection
                    });
                    suggestionItem.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            inputBox.value = item.title;
                            suggestionsBox.style.display = 'none'; // Hide suggestions after selection
                        }
                    });
                    suggestionsBox.appendChild(suggestionItem);
                });
                suggestionsBox.style.display = 'block'; // Show suggestions
            } else {
                console.error('Unexpected response format:', data);
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
});

