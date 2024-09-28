document.addEventListener('DOMContentLoaded', function() {
    const socket = io('http://localhost:3000'); // Connect to the Socket.IO server
    const imageUpload = document.getElementById('image-upload');
    const previewImage = document.getElementById('preview-image');
    const captionResult = document.getElementById('caption-result');
    const uploadForm = document.querySelector('#upload-form'); // Reference to the upload form

    console.log('Document ready, trying to get image upload element...');
    console.log('Image Upload Element:', imageUpload);

    // Ensure the imageUpload is not null
    if (!imageUpload) {
        console.error('Image upload element not found!');
        return; // Exit if the element is not found
    }

    // Listen for the captionSaved event from the server
    socket.on('captionSaved', (data) => {
        // Display the generated caption
        captionResult.textContent = data.caption;

        // Create a new image element for the uploaded image
        const imageElement = document.createElement('img');
        imageElement.src = data.imageUrl;
        imageElement.style.maxWidth = '100%';
        imageElement.alt = 'Generated Caption Image';

        // Clear any existing images and append the new one
        const existingImage = document.getElementById('generated-image');
        if (existingImage) {
            existingImage.remove();
        }
        imageElement.id = 'generated-image'; // Set ID for the new image
        document.getElementById('caption').appendChild(imageElement); // Append to the caption section
    });

    // Preview the selected image and send it to the server for caption generation
    imageUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Preview the selected image
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            console.log('No file selected.');
        }
    });

    // Handle form submission for image upload and caption generation
    uploadForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent the form from submitting in the default way

        const formData = new FormData();
        const imageFile = document.getElementById('image-upload').files[0]; // Image input reference
        formData.append('image', imageFile); // Append the selected file to formData

        try {
            // Send the image to the server for processing
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            // Check for errors in the response
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Parse the JSON response
            const data = await response.json();
            console.log('Caption generated:', data.caption);

            // Emit the new caption to the server for real-time updates
            socket.emit('newCaption', {
                caption: data.caption,
                imageUrl: data.imageUrl // Pass the image URL for display
            });

        } catch (error) {
            console.error('Error generating caption:', error);
        }
    });
});
