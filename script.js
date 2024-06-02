document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-image');
    const captionText = document.getElementById('caption');
    const closeBtn = document.getElementsByClassName('close')[0];
    const prevBtn = document.getElementsByClassName('prev')[0];
    const nextBtn = document.getElementsByClassName('next')[0];
    const fileInput = document.getElementById('file-input');
    const submitButton = document.getElementById('submit-button');
    const gallery = document.getElementById('gallery');

    let selectedFiles = [];
    let images = Array.from(document.querySelectorAll('.gallery-image'));
    let currentIndex = 0;

    // Load images from local storage on page load
    loadImagesFromLocalStorage();

    images.forEach((image, index) => {
        image.addEventListener('click', () => {
            currentIndex = index;
            openModal(image);
        });
    });

    fileInput.addEventListener('change', (event) => {
        selectedFiles = event.target.files;
    });

    submitButton.addEventListener('click', () => {
        for (const file of selectedFiles) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = file.name;
                img.classList.add('gallery-image');
                const galleryItem = createGalleryItem(img);
                gallery.appendChild(galleryItem);

                img.addEventListener('click', () => {
                    currentIndex = images.length;
                    openModal(img);
                });

                images.push(img);
                saveImageToLocalStorage(img.src, img.alt);
            };
            reader.readAsDataURL(file);
        }
        
        fileInput.value = '';
        function showMessage() {
            Swal.fire({
              title: "The Internet?",
              text: "That thing is still around?",
              icon: "success"
            });
          }
          
          setInterval(showMessage, 5000);
          
    });

    function createGalleryItem(img) {
        const galleryItem = document.createElement('div');
        galleryItem.classList.add('gallery-item');
        galleryItem.appendChild(img);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();  // Prevent the click event from propagating to the image
            deleteImage(galleryItem, img.src);
        });

        galleryItem.appendChild(deleteButton);
        return galleryItem;
    }

    function openModal(image) {
        modal.style.display = 'block';
        modalImg.src = image.src;
        captionText.innerHTML = image.alt;
    }

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
        openModal(images[currentIndex]);
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
        openModal(images[currentIndex]);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    function saveImageToLocalStorage(src, alt) {
        const images = JSON.parse(localStorage.getItem('images')) || [];
        images.push({ src, alt });
        localStorage.setItem('images', JSON.stringify(images));
    }

    function loadImagesFromLocalStorage() {
        const storedImages = JSON.parse(localStorage.getItem('images')) || [];
        storedImages.forEach((imageData) => {
            const img = document.createElement('img');
            img.src = imageData.src;
            img.alt = imageData.alt;
            img.classList.add('gallery-image');
            const galleryItem = createGalleryItem(img);
            gallery.appendChild(galleryItem);

            img.addEventListener('click', () => {
                currentIndex = images.length;
                openModal(img);
            });

            images.push(img);
        });
    }

    function deleteImage(galleryItem, src) {
        galleryItem.remove();
        images = images.filter(img => img.src !== src);
        const storedImages = JSON.parse(localStorage.getItem('images')) || [];
        const updatedImages = storedImages.filter(image => image.src !== src);
        localStorage.setItem('images', JSON.stringify(updatedImages));
    }
});
