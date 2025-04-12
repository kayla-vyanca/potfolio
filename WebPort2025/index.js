//* Variables
let header = document.querySelector(".header");
let page_links = document.querySelectorAll(".nav a");
let skill_progress = document.querySelector(".about .skill-progress");
let skills_obj = [
    {
        img: "image/figma.svg",
        name: "figma",
        percent: 100,
    },
    {
        img: "image/adobe-xd.svg",
        name: "adobe XD",
        percent: 100,
    },
    {
        img: "image/photoshop.svg",
        name: "adobe photoshop",
        percent: 85,
    },
    {
        img: "image/illustrator.svg",
        name: "adobe illustrator",
        percent: 60,
    },
    {
        img: "image/adobe-premiere.svg",
        name: "adobe premiere",
        percent: 70,
    }
];

let select_services = document.querySelector(".contact .select-services");
let arrow_up = document.querySelector(".arrow-up");
window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
        header.classList.add("scrolling");
        arrow_up.classList.add("show");
    } else {
        header.classList.remove("scrolling");
        arrow_up.classList.remove("show");
    }
});

skills_obj.forEach((skill) => {
    const skill_dom = document.createElement("div");
    skill_dom.className =
        "skill d-flex flex-column justify-content-center align-items-center gap-3";

    const progress = document.createElement("div");
    progress.className =
        "progress d-flex justify-content-center align-items-center position-relative rounded-circle";
    progress.style.background = `conic-gradient(
        rgb(217 217 217 / 20%) 0% ${100 - skill.percent}%,
        var(--txt-primary) 0% 100%
    )`;

    const skill_img = document.createElement("img");
    skill_img.src = skill.img;
    skill_img.alt = skill.name;
    progress.appendChild(skill_img);

    const percent = document.createElement("span");
    percent.className = "percent";
    percent.textContent = `${skill.percent}%`;

    const skill_name = document.createElement("span");
    skill_name.className = "txt text-capitalize fw-bold";
    skill_name.textContent = skill.name;

    skill_dom.appendChild(progress);
    skill_dom.appendChild(percent);
    skill_dom.appendChild(skill_name);

    skill_progress.appendChild(skill_dom);  
});



select_services.addEventListener("click", function () {
    this.classList.toggle("open");
});

page_links.forEach((link) => {
    link.addEventListener("click", function () {
        page_links.forEach((link) => {
            if (this.textContent !== link.textContent) {
                link.classList.remove("active");
            } else {
                link.classList.add("active");
            }
        });
        this.classList.add("active");
    });
});

arrow_up.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});


function downloadCV() {
    const link = document.createElement('a');
    link.href = 'asset/CV Kayla Vyanca 2025.pdf'; // path ke file PDF kamu
    link.download = 'CV Kayla Vyanca 2025.pdf'; // nama file saat diunduh
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

function hireMe() {
    window.open('https://www.linkedin.com/in/kaylavyanca', '_blank');
};


const filterButtons = document.querySelectorAll(".filtering-btns .new-btn");
const portfolioCards = document.querySelectorAll(".portfolio-card .card");

// Set untuk menyimpan filter yang sedang aktif
let activeFilters = new Set();

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filterValue = button.getAttribute("data-filter");

    // Toggle aktif/non-aktif
    if (filterValue === "all") {
      // Jika "all" diklik, reset semua filter
      activeFilters.clear();
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
    } else {
      // Hapus "all" dari aktif jika ada
      document.querySelector('[data-filter="all"]').classList.remove("active");

      // Toggle filter dari set
      if (activeFilters.has(filterValue)) {
        activeFilters.delete(filterValue);
        button.classList.remove("active");
      } else {
        activeFilters.add(filterValue);
        button.classList.add("active");
      }

      // Jika tidak ada filter yang aktif, tampilkan semua dan aktifkan "all"
      if (activeFilters.size === 0) {
        document.querySelector('[data-filter="all"]').classList.add("active");
      }
    }

    // Tampilkan kartu sesuai filter aktif
    portfolioCards.forEach(card => {
      const cardFilter = card.getAttribute("data-filter");

      if (
        activeFilters.size === 0 || // Jika tidak ada filter aktif, tampilkan semua
        activeFilters.has(cardFilter) // Atau cocok dengan filter aktif
      ) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

const form = document.getElementById("contactForm");
  const serviceOptions = document.querySelectorAll(".select-services .options li");
  const selectedServiceSpan = document.querySelector(".select-services .select-value .txt");

  let selectedService = "";

  // Handle klik pada opsi service
  serviceOptions.forEach(option => {
    option.addEventListener("click", () => {
      selectedService = option.textContent;
      selectedServiceSpan.textContent = selectedService;
    });
  });

  // Simulasi submit karena tidak pakai <form>
  const submitBtn = form.querySelector('input[type="submit"]');
  submitBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // Ambil data input
    const name = form.querySelector('input[name="name"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();
    const phone = form.querySelector('input[name="phone"]').value.trim();
    const timeline = form.querySelector('input[name="timeline"]').value.trim();
    const projectDetails = form.querySelector('textarea[name="project details"]').value.trim();

    // Validasi sederhana (opsional)
    if (!name || !email || !phone || !selectedService || !timeline || !projectDetails) {
      alert("Harap lengkapi semua field!");
      return;
    }

    // Kirim ke Google Sheets
    fetch("https://script.google.com/macros/s/AKfycbzEKYnIk4zNdo3_52LqeucpZp1ym2YdpJgZsnH__5f5D5zWpKHdyOtwwm1naxvhRmo4/exec", {
      method: "POST",
      body: JSON.stringify({
        name: name,
        email: email,
        phone: phone,
        services: selectedService,
        timeline: timeline,
        project_details: projectDetails
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.result === "success") {
          alert("Form berhasil dikirim!");
          form.reset();
          selectedServiceSpan.textContent = "Services"; // Reset pilihan
          selectedService = "";
        } else {
          alert("Gagal mengirim form.");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Terjadi kesalahan saat mengirim form.");
      });
  });
