document.addEventListener('DOMContentLoaded', function() {
    const socket = io(); // Connect to the Socket.IO server
    const imageUpload = document.getElementById('image-upload');
    const previewImage = document.getElementById('preview-image');
    const captionResult = document.getElementById('caption-result'); 

    // Listen for the captionSaved event from the server
    socket.on('captionSaved', (data) => {
        
        captionResult.textContent = data.caption;
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

    imageUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;

                const formData = new FormData();
                formData.append('image', file);
                
                fetch('/api/generate-caption', {
                    method: 'POST',
                    body: formData,
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('HTTP error! status: ' + response.status);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Caption generated:', data.caption);

                    // Emit the new caption to the server
                    socket.emit('newCaption', {
                        caption: data.caption,
                        imageUrl: data.imageUrl // Pass the image URL 
                    });
                })
                .catch(error => {
                    console.error('Error generating caption:', error);
                });
            };
            reader.readAsDataURL(file);
        } else {
            console.log('No file selected.');
        }
    });
});
