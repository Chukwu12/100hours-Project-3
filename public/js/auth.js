// --------------------------Sign-in Form------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    // Cache the buttons and container
    const sign_in_btn = document.querySelector('#sign-in-btn');
    const sign_up_btn = document.querySelector('#sign-up-btn');
    const container = document.querySelector('.container');
    const sign_up_btn2 = document.querySelector('#sign_up_btn2');
    const sign_in_btn2 = document.querySelector('#sign-in-btn2');

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

