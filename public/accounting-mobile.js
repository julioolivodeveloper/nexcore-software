function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('open');
  document.getElementById('mobOverlay').classList.toggle('show');
}
function closeSidebar() {
  document.querySelector('.sidebar').classList.remove('open');
  document.getElementById('mobOverlay').classList.remove('show');
}
// Close sidebar on nav link click (mobile)
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.nav-link').forEach(function(a) {
    a.addEventListener('click', function() {
      if (window.innerWidth <= 768) closeSidebar();
    });
  });
});
