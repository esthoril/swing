/**
 * Set video playback rate
 */
const setPlaybackRate = (diff) =>
{
  speed += diff;
  if(speed >= 1.2) speed = 1.2;
  if(speed <= 0.5) speed = 0.5;
  document.getElementById('value').innerHTML = `${Math.round(speed*100)}%`;
  console.log(`Playbackrate set to: ${speed.toFixed(1)}`);
  return speed;
}


function addClickHandlers()
{
  // Set video speed
  $('.faster').click(function(e) { speed = setPlaybackRate(0.1) });
  $('.slower').click(function(e) { speed = setPlaybackRate(-0.1) });
  
  // Clear video list
  $('.clear').click(function(e) { clear(); });

  // Overlay listener
  // Fade out overlay and stop video
  $('.overlay').click(function(e)
  {
    console.log("Closing video");
    $('.overlay video')
      .css({'margin-top': '60px'})
      .animate({'margin-top': '0'}, 320);
    
    $(this).fadeOut(320);

    setTimeout(() => {
      $vid = document.getElementById("vid");
      $vid.pause();
    }, 100);
  });

  // Add checkbox listeners
  const categories = ["lesson", "move", "aerials", "performance"];
  for(let category of categories)
  {
    $(`.menu .${category}`).click(function(e) {
      toggleItems($(this), `.rowitem.${category}`);
    });
  }

  // Video list listeners
  $('.media.list').on('click', '.rowitem', function()
  {
    let href = $(this).attr("href");
    let type = $(this).data('type'); // data-* attribute
    setOverlay(href, type);
  });

  // Add videos from parameters
  $('.videos .search').click(function(e)
  {
    console.log("Video button clicked");
    $('.wrapper .media').empty();

    const result = findVideosByParameters();
    if(result.length < 1)
      $('.wrapper .media.list').html("<h1>No videos found :(</h1>");
    else
      addVideos(result);
  });
}