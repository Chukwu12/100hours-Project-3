
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
const sign_in_btn = document.querySelector('#sign-in-btn');
const sign_up_btn = document.querySelector('#sign-up-btn');
const container = document.querySelector('.container');

if (sign_up_btn && sign_in_btn && container) {
sign_up_btn.addEventListener('click',() =>{
    container.classList.add('sign-up-mode');
});

sign_in_btn.addEventListener('click', ()=> {
    container.classList.remove('sign-up-mode');
});
} else {
    console.error('Required elements are not found in the DOM');
}
});



// --------------------------------------  View recipe info ----------------------------------//
// document.addEventListener('DOMContentLoaded', function() {
//     const recipeButtons = document.querySelectorAll('.view-recipe-btn');
    
//     recipeButtons.forEach(button => {
//         button.addEventListener('click', function(event) {
//             event.preventDefault();

//             const recipeId = this.getAttribute('data-recipe-id');
//             const recipeInfoContent = document.getElementById('recipeInfoContent');
            
//             if (recipeInfoContent) {
//                 // Create and show loading indicator
//                 const loadingIndicator = document.createElement('div');
//                 loadingIndicator.className = 'loading'; // Style this in your CSS
//                 loadingIndicator.textContent = 'Loading...';
//                 recipeInfoContent.innerHTML = ''; // Clear existing content
//                 recipeInfoContent.appendChild(loadingIndicator);

//                 fetch(`/recipeInfo/${recipeId}`)
//                     .then(response => {
//                         if (!response.ok) {
//                             throw new Error('Network response was not ok');
//                         }
//                         return response.json(); // Expecting JSON data
//                     })
//                     .then(data => {
//                         // Clear loading indicator
//                         recipeInfoContent.removeChild(loadingIndicator);

//                         // Ensure data is valid before rendering
//                         if (data && data.title && data.instructions && data.ingredients) {
//                             recipeInfoContent.innerHTML = `
//                                 <h2>${data.title}</h2>
//                                 <img src="${data.image}" alt="${data.title}">
//                                 <p>Servings: ${data.servings}</p>
//                                 <p>Ready in: ${data.readyInMinutes} minutes</p>
//                                 <h3>Ingredients:</h3>
//                                 <ul>
//                                     ${data.ingredients.map(ingredient => `
//                                         <li>${ingredient.amount} ${ingredient.unit} of ${ingredient.name}</li>
//                                     `).join('')}
//                                 </ul>
//                                 <h3>Instructions:</h3>
//                                 <p>${data.instructions}</p>
//                             `;
//                         } else {
//                             recipeInfoContent.innerHTML = '<p>Recipe details are not available.</p>';
//                         }
//                     })
//                     .catch(error => {
//                         console.error('Error fetching recipe details:', error);
//                         // Clear loading indicator
//                         recipeInfoContent.removeChild(loadingIndicator);
                        
//                         // Display a user-friendly message
//                         recipeInfoContent.innerHTML = '<p>Error loading recipe details. Please try again later.</p>';
//                     });
//             } else {
//                 console.error('Element with id "recipeInfoContent" not found');
//             }
//         });
//     });
// });

// --------------------------------------  SearchBar ----------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    const inputBox = document.getElementById('input-box');
    const suggestionsBox = document.getElementById('suggestions');
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
            const response = await fetch(`https://api.spoonacular.com/recipes/autocomplete?query=${encodedQuery}&number=5&apiKey=`);
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
});

