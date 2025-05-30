// Mobile menu function
function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('active');
    document.body.style.overflow = document.getElementById('mobileMenu').classList.contains('active') ? 'hidden' : 'auto';
    document.getElementById('mobileMenu').style.display = document.getElementById('mobileMenu').classList.contains('active') ? 'block' : 'none';
}
