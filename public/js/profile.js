// --------------------------------Profile Card ---------------------------------------------------------//
const header = document.getElementById('header');

window.addEventListener('wheel', (event) => {
    let delta = (event.deltaY + 3) * -1;
    animate(delta > 0, delta);
});

const animate = (check, delta) => {
  const MIN_HEIGHT = 80;
  const HEIGHT = 150;
  const MAX_ZOOM = 3;
  const MAX_BLUR = 3;

    if (check) {
        let blur = 1 + delta / 150 < MAX_BLUR ? Math.ceil(1 + delta / 150) : MAX_BLUR;
        let height = HEIGHT - delta / 10 > MIN_HEIGHT ? Math.ceil(HEIGHT - delta / 10) : MIN_HEIGHT;
        let zoom = 1 + delta / 200 <= MAX_ZOOM ? 1 + delta / 200 : MAX_ZOOM;
        requestAnimationFrame(() => transform(header, blur, height, zoom));
    } else {
        requestAnimationFrame(() => transform(header, 0, 150, 1));
    }
};

const transform = (element, blur, height, zoom) => {
    element.style.filter = `blur(${blur}px)`;
    element.style.height = `${height}px`;
    element.style.transform = `scale(${zoom}, ${zoom})`;
};


// ===================================like button models =====================================//
// Function to handle the "Like" button click and form submission
function likeRecipe(recipeId) {
    const form = document.getElementById(`like-form-${recipeId}`);
    
    if (!form) {
        Swal.fire({
            title: 'Error',
            text: 'Form not found.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    // Send the request using the action URL (which includes ?_method=PUT)
    fetch(form.action, {
        method: 'POST', // Use POST because method-override will convert it to PUT
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ recipeId }) // Send any additional data you may need
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to like recipe');
        }
        return response.json();
    })
    .then(data => {
        Swal.fire({
            title: 'Success!',
            text: data.message || 'Recipe liked successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'There was an error liking this recipe. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    });
}




// Function to handle the "Favorite" button click and form submission
function favoriteRecipe(recipeId) {
    const button = document.querySelector(`#favorite-form-${recipeId} button`);
    const icon = button.querySelector('i');

    // Disable button to prevent multiple clicks
    button.disabled = true;

    fetch(`/recipe/favoriteRecipe/${recipeId}`, {
        method: 'POST',
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                Swal.fire({
                    title: 'Success!',
                    text: data.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                // Update the icon to show it's favorited (gold star)
                icon.classList.remove('fa-star');           // regular star
                icon.classList.add('fa-star', 'text-warning'); // filled star with gold/yellow color
            } else {
                // Re-enable the button if something went wrong
                button.disabled = false;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'There was an error adding this recipe to your favorites. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });

            // Re-enable the button so user can try again
            button.disabled = false;
        });
}

// =================================triva button====================//

document.getElementById('next-trivia').addEventListener('click', async function() {
    try {
        const response = await fetch('/trivia/random');

        
        // If the response is not OK (i.e., status code is not 2xx), throw an error
        if (!response.ok) {
            throw new Error(`Failed to fetch trivia: ${response.statusText}`);
        }
        
        const data = await response.json();
        document.querySelector('.trivia-question').textContent = data.trivia;
    } catch (error) {
        console.error('Error fetching trivia:', error);
        document.querySelector('.trivia-question').textContent = 'Oops! Something went wrong. Please try again.';
    }
});

//============================JS for previewing the image ====================//
// Define the previewImage function here
function previewImage(event) {
    const file = event.target.files[0];
  
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imagePreview = document.getElementById('profile-image-display');
        imagePreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  // add event listeners to the input element
  document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById('profile-image-upload');
    if (fileInput) {
      fileInput.addEventListener('change', previewImage);
    }
  });
