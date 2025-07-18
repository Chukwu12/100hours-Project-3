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
//=======================================================delete favorite button ===================================================================//
 document.querySelectorAll('.remove-fav-btn').forEach(button => {
    button.addEventListener('click', async () => {
      const id = button.dataset.id;

      const confirmed = await Swal.fire({
        title: 'Are you sure?',
        text: 'Remove this recipe from favorites?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'Cancel',
      });

      if (confirmed.isConfirmed) {
        try {
          const response = await fetch(`/profile/recipe/favoriteRecipe/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          });

          if (response.ok) {
            Swal.fire('Removed!', 'Recipe has been removed from your favorites.', 'success')
              .then(() => window.location.reload());
          } else {
            throw new Error('Delete failed');
          }
        } catch (error) {
          Swal.fire('Error', 'Failed to remove the recipe.', 'error');
        }
      }
    });
  });
  // --------------------------------------------------------View recipe btn---------------------------------------------------//

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.view-recipe-btn').forEach(button => {
      button.addEventListener('click', () => {
        const recipe = JSON.parse(button.getAttribute('data-recipe'));
  
        Swal.fire({
          title: recipe.title,
          html: `
            <img src="${recipe.image}" alt="${recipe.title}" style="width: 100%; border-radius: 8px; margin-bottom: 10px;">
            <p><strong>Servings:</strong> ${recipe.servings}</p>
            <p><strong>Ready in:</strong> ${recipe.readyInMinutes} minutes</p>
            <p><strong>Ingredients:</strong></p>
            <ul style="text-align: left; max-height: 150px; overflow-y: auto;">
              ${recipe.ingredients.map(ing => `
                <li>${ing.amount || ''} ${ing.unit || ''} ${ing.name || ing}</li>
              `).join('')}
            </ul>
            <p><strong>Instructions:</strong> ${recipe.instructions || 'No instructions available.'}</p>
          `,
          width: 600,
          confirmButtonText: 'Close',
          showCloseButton: true
        });
      });
    });
  });
  
// ==============================================================favoriteGlife===================================================//
// Include Glide.js library
  // Initialize Glide
    document.addEventListener('DOMContentLoaded', function () {
      const favoriteSlides = document.querySelectorAll('.favorite-glide .glide__slide');
      if (favoriteSlides.length > 0) {
        new Glide('.favorite-glide', {
          type: 'carousel',
          startAt: 0,
          perView: 2,
          autoplay: 3000,
          hoverpause: true,
          breakpoints: {
            992: {
              perView: 1 // For tablets and small laptops
            },
            768: {
              perView: 1 // For mobile and small tablets
            }
          }
        }).mount();
      }
    });

