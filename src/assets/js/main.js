const backToTopButton = document.querySelector('.backToTop');

function checkPosition() {
  let windowY = window.scrollY;

  if (windowY <= 600) {
    backToTopButton.classList.add('hidden');
  } else {
    backToTopButton.classList.remove('hidden');
    backToTopButton.addEventListener('click', function () {
      document.documentElement.scrollTop = 0;
    });
  }
}

window.addEventListener('scroll', checkPosition);
