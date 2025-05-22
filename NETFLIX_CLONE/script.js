document.addEventListener('DOMContentLoaded', function () {

    const rows = document.querySelectorAll('.row');


    rows.forEach(row => {
        const thumbnails = row.querySelector('.thumbnails');
        const thumbnailsCount = thumbnails.children.length;
        let isDown = false;
        let startX;
        let scrollLeft;


        thumbnails.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - thumbnails.offsetLeft;
            scrollLeft = thumbnails.scrollLeft;
            thumbnails.style.cursor = 'grabbing';
        });


        thumbnails.addEventListener('mouseleave', () => {
            isDown = false;
            thumbnails.style.cursor = 'grab';
        });


        thumbnails.addEventListener('mouseup', () => {
            isDown = false;
            thumbnails.style.cursor = 'grab';
        });


        thumbnails.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - thumbnails.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed
            thumbnails.scrollLeft = scrollLeft - walk;
        });


        thumbnails.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - thumbnails.offsetLeft;
            scrollLeft = thumbnails.scrollLeft;
        });

        thumbnails.addEventListener('touchend', () => {
            isDown = false;
        });

        thumbnails.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.touches[0].pageX - thumbnails.offsetLeft;
            const walk = (x - startX) * 2;
            thumbnails.scrollLeft = scrollLeft - walk;
        });
    });


    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('mouseenter', () => {
            thumbnail.style.transform = 'scale(1.1)';
            thumbnail.style.zIndex = '1';
        });

        thumbnail.addEventListener('mouseleave', () => {
            thumbnail.style.transform = 'scale(1)';
            thumbnail.style.zIndex = '0';
        });
    });


    const signUpButton = document.querySelector('.hero button');
    signUpButton.addEventListener('mousedown', () => {
        signUpButton.style.transform = 'scale(0.95)';
    });

    signUpButton.addEventListener('mouseup', () => {
        signUpButton.style.transform = 'scale(1)';
    });

    signUpButton.addEventListener('mouseleave', () => {
        signUpButton.style.transform = 'scale(1)';
    });
});

// Function to get dominant color from an image element
function getDominantColor(img) {
    try {
        // Create a temporary canvas to analyze the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions (smaller size for faster processing)
        canvas.width = 50;
        canvas.height = 50;

        // Draw the image on canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        // Calculate average color
        let r = 0, g = 0, b = 0;
        const pixelCount = canvas.width * canvas.height;

        for (let i = 0; i < imageData.length; i += 4) {
            r += imageData[i];
            g += imageData[i + 1];
            b += imageData[i + 2];
        }

        const avgColor = {
            r: Math.round(r / pixelCount),
            g: Math.round(g / pixelCount),
            b: Math.round(b / pixelCount)
        };

        console.log(`Calculated color for ${img.src}: rgb(${avgColor.r}, ${avgColor.g}, ${avgColor.b})`);
        return avgColor;
    } catch (error) {
        console.error(`Error processing image ${img.src}:`, error);
        return null; // Return null if color extraction fails
    }
}

// Apply glow effects to all thumbnails
function applyGlowEffects() {
    console.log('Applying glow effects...');
    const thumbnails = document.querySelectorAll('.thumbnail');

    thumbnails.forEach(thumbnail => {
        const img = thumbnail.querySelector('img');

        if (img) {
            // Set crossOrigin for CORS handling
            img.crossOrigin = 'Anonymous';

            // Wait for image to load
            if (img.complete) {
                console.log(`Image already complete: ${img.src}`);
                setGlowEffect(thumbnail, img);
            } else {
                console.log(`Adding load listener for: ${img.src}`);
                img.addEventListener('load', () => setGlowEffect(thumbnail, img));
                img.addEventListener('error', (e) => console.error(`Error loading image ${img.src}:`, e));
            }
        } else {
            console.warn('Thumbnail element found without an image:', thumbnail);
        }
    });
}

// Set the glow effect based on image color
function setGlowEffect(thumbnail, img) {
    const color = getDominantColor(img);
    if (color) {
        const glowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`;

        // Store the glow color as a CSS variable
        thumbnail.style.setProperty('--glow-color', glowColor);
        console.log(`Set --glow-color for thumbnail with image ${img.src} to ${glowColor}`);
    } else {
        console.log(`Could not set glow color for ${img.src}, using default.`);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    applyGlowEffects();
});
