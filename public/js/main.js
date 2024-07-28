
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
const sign_in_btn = document.querySelector('#sign-in-btn');
const sign_up_btn = document.querySelector('#sign-up-btn');
const container = document.querySelector('.container');

sign_up_btn.addEventListener('click',() =>{
    container.classList.add('sign-up-mode');
});

sign_in_btn.addEventListener('click', ()=> {
    container.classList.remove('sign-up-mode')
});


// --------------------------------------  View recipe info ----------------------------------//
document.addEventListener('DOMContentLoaded', function() {
    const recipeButtons = document.querySelectorAll('.view-recipe-btn');
    
    recipeButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            
            const recipeId = this.getAttribute('data-recipe-id');
            
            fetch(`/recipeInfo/${recipeId}`)
                .then(response => response.text())
                .then(data => {
                    // Assuming recipeInfoContent is a container where recipe details will be shown
                    document.getElementById('recipeInfoContent').innerHTML = data;
                })
                .catch(error => {
                    console.error('Error fetching recipe details:', error);
                });
        });
    });
});

// --------------------------------------  Cuisine button ----------------------------------//
