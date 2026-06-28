// js/photo-circle-crop.js – auto‑crop uploaded photo into a circle
(function () {
  function cropToCircle(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function () {
        const img = new Image();
        img.onload = function () {
          const size = Math.min(img.width, img.height);
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(
            img,
            (img.width - size) / 2,
            (img.height - size) / 2,
            size, size,
            0, 0,
            size, size
          );
          resolve(canvas.toDataURL('image/png', 1.0));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Wait for the form to be ready, then attach the cropper
  document.addEventListener('DOMContentLoaded', function () {
    const photoInput = document.getElementById('photoInput');
    if (!photoInput) return;

    photoInput.addEventListener('change', async function (e) {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const circleData = await cropToCircle(file);
        const preview = document.getElementById('photoPreview');
        if (preview) {
          preview.src = circleData;
          preview.style.display = 'block';
          const placeholder = document.querySelector('.upload-placeholder');
          if (placeholder) placeholder.style.display = 'none';
        }
      } catch (err) {
        console.error('Photo circle crop failed', err);
      }
    });
  });
})();
