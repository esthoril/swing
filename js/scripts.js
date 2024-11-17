const ROOT = "videos";
let speed = 1.0;

$(document).ready(function()
{
  $('.media.list').fadeIn(100);
  clear();

  // Populate dropdowns
  buildClasses(VIDEOS);
  buildTeachers(VIDEOS);

  //
  addClickHandlers();
});


function resizeVideo(videoElement)
{
  // Get video dimensions after loading
  const videoWidth = videoElement.videoWidth;
  const videoHeight = videoElement.videoHeight;

  var maxWidth = 1280;
  var maxHeight = 800;
  var newHeight = (maxWidth / videoWidth) * videoHeight;
  
  videoElement.width = maxWidth;
  videoElement.height = newHeight;

  // Recalculate if we exceeded max height
  if(newHeight > maxHeight)
  {
    const scaleFactor = maxHeight / videoHeight;
    videoElement.width = videoWidth * scaleFactor;
    videoElement.height = maxHeight;
  }
}


function toggleItems($source, type)
{
  console.log(`Toggling: ${type}`)
  $source.toggleClass('active');
  $(type).toggle();
}


function isActive(type, $item) {
  return ($('.menu div.' + type).hasClass('active') && $item.hasClass(type));
}
