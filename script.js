"use strict";
//////////////////////////////////////////////////////

//Selection
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

const nav = document.querySelector(".nav");

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//-----------------------Button Scrolling-----------------
btnScrollTo.addEventListener("click", function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log("Current Scroll X/Y : ", window.pageXOffset, window.pageYOffset);

  console.log(
    "height/width viewport,",
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  //Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  //Smooth scroll [Old way]
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: "smooth",
  // });

  //Smooth scroll [Modern way]
  section1.scrollIntoView({ behavior: "smooth" });
});

//---------------------Page Navigation----------------------

// document.querySelectorAll(".nav__link").forEach(function (el) {
//   el.addEventListener("click", function (e) {
//     e.preventDefault();
//     const id = el.getAttribute("href");
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   });
// });

//Using EventDelegation for page navigation
//1. Add event listener to common parent
//2. Determine what element originated the event

document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  //Matching Strategy
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

//--------------------------------TABBED COMPONENT-------------------------
tabsContainer.addEventListener("click", function (e) {
  const curTab = e.target.closest(".operations__tab");
  if (!curTab) return;

  //Tab selection
  tabs.forEach((el) => el.classList.remove("operations__tab--active"));
  curTab.classList.add("operations__tab--active");

  //Content Selection
  tabsContent.forEach((el) => {
    el.classList.remove("operations__content--active");
    if (el.classList.contains(`operations__content--${curTab.dataset.tab}`)) {
      el.classList.add("operations__content--active");
    }
  });
});

//--------------------------MENU FADE ANIMATIONS-----------------------------

const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//Passing "arguments" into handler
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

//-----------------------STICKY NAVIGATION-----------------------------
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);

// window.addEventListener("scroll", function () {
//   if (this.window.scrollY > initialCoords.top) nav.classList.add("sticky");
//   else nav.classList.remove("sticky");
// });

//-------------STICKY NAVIGATION:THE INTERSECTION OBSERVER API----------
// const obsCallBack = function (entries, observer) {
//   entries.forEach((entry) => console.log(entry));
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallBack, obsOptions);
// observer.observe(section1);

const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  //console.log(entry);
  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//-------------------REVEAL SECTIONS-------------------------
const allSections = document.querySelectorAll(".section");
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach((section) => {
  sectionObserver.observe(section);
  // section.classList.add("section--hidden");
});

//-------------------LAZY LOADING IMAGES----------------------------
const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  //Once the img is replaced, JS will load it again,
  //At that time you should remove the lazy-img class which is for blur
  entry.target.addEventListener("load", () =>
    entry.target.classList.remove("lazy-img")
  );

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach((img) => imgObserver.observe(img));

//----------------------SLIDER---------------------------------
function slider() {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");
  let curSlide = 0;
  const maxSlide = slides.length;

  //Functions
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
    );
    activateDot(slide);
  };

  //Next slide
  const nextSlide = function (e) {
    curSlide = curSlide === maxSlide - 1 ? 0 : curSlide + 1;
    goToSlide(curSlide);
  };

  //Previous slide
  const prevSlide = function (e) {
    curSlide = curSlide === 0 ? maxSlide - 1 : curSlide - 1;
    goToSlide(curSlide);
  };

  //Calling Functions
  createDots();
  goToSlide(0);

  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  //keyboard event
  document.addEventListener("keydown", function (e) {
    e.key === "ArrowRight" && nextSlide();
    e.key === "ArrowLeft" && prevSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      curSlide = +e.target.dataset.slide;
      goToSlide(curSlide);
    }
  });
}
slider();

/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////                                           /////////
/////////                                           /////////
/////////                                           /////////
/////////                                           /////////
/////////          REFERENCE  LECTURES              /////////
/////////                                           /////////
/////////                                           /////////
/////////                                           /////////
/////////                                           /////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////

//--------Implementing a Cookie-----------------------------

/*
const header = document.querySelector(".header");

const message = document.createElement("div");
message.classList.add("cookie-message");
message.textContent = "We use cookies for goodstuff";
message.innerHTML =
  'We use cookies for goodstuff <button class="btn btn--close-cookie"> Got it!</button>';

// header.prepend(message);
header.append(message);

//Deleting elements
document
  .querySelector(".btn--close-cookie")
  .addEventListener("click", () => message.parentElement.removeChild(message));

//--------------------------STYLES-------------------------------------------
message.style.backgroundColor = "#37383d";
message.style.width = "104%";
// The style that we added here is added as inline style.

//console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 10 + "px";

//changing CSS variables using JS
//document.documentElement.style.setProperty("--color-primary", "orangered");

//--------------------------ATTRIBUTES-------------------------------------------
const logo = document.querySelector(".nav__logo");
//standard attributes
//console.log(logo.alt);
//console.log(logo.className);

//non-standard attributes
//console.log(logo.getAttribute("designer"));
logo.setAttribute("company", "Bankist");

//Data attributes
//console.log(logo.dataset.versionNumber);

//classes
logo.classList.add("c", "d");
logo.classList.remove("c");
logo.classList.toggle("d");
logo.classList.contains("d");
*/

//-----------CONCEPT: Event Propagation-------
/*
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector(".nav__link").addEventListener("click", function (e) {
  console.log(randomColor());
  this.style.backgroundColor = randomColor();
  console.log("Link", e.target, e.currentTarget);

  //STOP Propagation
  //e.stopPropagation();
});

document.querySelector(".nav__links").addEventListener("click", function (e) {
  this.style.backgroundColor = randomColor();
  console.log("Link", e.target, e.currentTarget);
});

document.querySelector(".nav").addEventListener("click", function (e) {
  this.style.backgroundColor = randomColor();
  console.log("Link", e.target, e.currentTarget);
});
*/

//---------------------------DOM TRAVERSING----------------------
/*
const h1 = document.querySelector("h1");

//Going downwards : childs
console.log(h1.querySelectorAll(".highlight"));
console.log(h1.childNodes);
console.log(h1.children);

h1.firstElementChild.style.color = "white";
h1.lastElementChild.style.color = "orangered";

//Going upwards : parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest(".header").style.background = "var(--gradient-secondary)";
h1.closest("h1").style.background = "var(--gradient-primary) ";

//Going sideways : siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = "scale(0.5) ";
});
*/
