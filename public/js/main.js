
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
document.addEventListener('DOMContentLoaded', function() {
    const recipeButtons = document.querySelectorAll('.view-recipe-btn');
    const recipeInfoContent = document.getElementById('recipeInfoContent');
    
    recipeButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            
            const recipeId = this.getAttribute('data-recipe-id');
            
            fetch(`/recipeInfo/${recipeId}`)
                .then(response => response.text())
                .then(data => {
                    // Assuming recipeInfoContent is a container where recipe details will be shown
                    if (recipeInfoContent) {
                        recipeInfoContent.innerHTML = data;
                    } else {
                        console.error('Element with id "recipeInfoContent" not found');
                    }
                })
                .catch(error => {
                    console.error('Error fetching recipe details:', error);
                });
        });
    });
});

// --------------------------------------  SearchBar ----------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    const inputBox = document.getElementById('input-box');
    const suggestionsBox = document.getElementById('suggestions');

    inputBox.addEventListener('input', async () => {
        const query = inputBox.value.trim();
        if (query.length < 2) {
            suggestionsBox.style.display = 'none'; // Hide suggestions if input is too short
            return;
        }

        try {
            const response = await fetch(`https://api.spoonacular.com/recipes/autocomplete?query=${query}&number=5&apiKey=15b2edef64f24d2c95b3cc72e3ad8f87`);
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
                    suggestionItem.addEventListener('click', () => {
                        inputBox.value = item.title;
                        suggestionsBox.style.display = 'none'; // Hide suggestions after selection
                    });
                    suggestionsBox.appendChild(suggestionItem);
                });
                suggestionsBox.style.display = 'block'; // Show suggestions
            } else {
                console.error('Unexpected response format:', data);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }        
    });
});
