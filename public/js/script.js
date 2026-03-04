// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
        }

        form.classList.add('was-validated')
        }, false)
    })
})()

// Tax Switch
let taxSwitch = document.getElementById("switchCheckDefault");
taxSwitch.addEventListener("click", () => {
    let taxInfo = document.getElementsByClassName("tax-info");
    for (info of taxInfo){
        if (info.style.display != 'inline') {
            info.style.display = 'inline';
        } else {
            info.style.display = 'none';
        }
    }
});

// Filter Scroll Btn
const container = document.getElementById("filterContainer");
const leftBtn = document.querySelector(".left-btn");
const rightBtn = document.querySelector(".right-btn");

rightBtn.addEventListener("click", () => {
    container.scrollLeft += 300;
});

leftBtn.addEventListener("click", () => {
    container.scrollLeft -= 300;
});

// Multi-Filter
document.querySelectorAll(".filter a").forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();

        const url = new URL(window.location);
        const clickedUrl = new URL(this.href);
        const value = clickedUrl.searchParams.get("amenities");

        let selected = url.searchParams.getAll("amenities");

        if (selected.includes(value)) {
            // Remove if already selected
            selected = selected.filter(a => a !== value);
            url.searchParams.delete("amenities");
            selected.forEach(a => url.searchParams.append("amenities", a));
        } else {
            url.searchParams.append("amenities", value);
        }

        window.location.href = url.toString();
    });
});