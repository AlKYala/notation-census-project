document.addEventListener('DOMContentLoaded', (event) => {
    const form = document.querySelector('form[name="notation-submission"]');
    if (form) {
      form.addEventListener('submit', (event) => {
        let isValid = true;
        
        // Validate required fields
        form.querySelectorAll('[required]').forEach(field => {
          if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
          } else {
            field.classList.remove('error');
          }
        });
  
        // Validate tags (must be comma-separated)
        const tagsField = form.querySelector('[name="tags"]');
        if (tagsField && !tagsField.value.includes(',')) {
          isValid = false;
          tagsField.classList.add('error');
        }
  
        if (!isValid) {
          event.preventDefault();
          alert('Please fill in all required fields correctly.');
        }
      });
    }
  });