$(document).ready(function(){
  $("#present").addClass("animated bounceInDown");
  $("#present").hover(function(){
      $("#present #top").addClass("animated bounce");
  }, function(){
      $("#present #top").removeClass("animated bounce");
  });
   
  $("#present").on("click", function(){
    if (window.parent !== window) {
                    window.parent.postMessage({ type: 'catClicked' }, '*');
                }
    
    $("#present #top").removeClass("animated bounce");
    $("#present #top").addClass("animated bounceOutUp");
    $(this).unbind("click");
    $(this).unbind("mouseleave");
   
    setTimeout(function(){
      $("#present #cat").css("top", "-160px");
    }, 1000);
    $("#wish").children("div").each(function(index){
      setTimeout(bounceIn.bind(null, $(this)), 2500+index*100)
    });
  });
  function bounceIn(el){
    el.addClass("animated bounceInDown swing");
    setTimeout(function(){
      el.removeClass("bounceInDown").addClass("swing")
    }, 1000);
  }
});

// Event listener untuk navigasi otomatis (backup jika dibutuhkan)
document.getElementById('cat') && document.getElementById('cat').addEventListener('click', function() {
    setTimeout(function() {
        if (window.parent !== window) {
            window.parent.postMessage({ type: 'navigateTo', page: 'card' }, '*');
        } else {
            window.location.hash = 'card';
        }
    }, 3000);
});