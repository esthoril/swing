const DELAY = 16; // Cumulative delay per item row


function clear()
{
  $('.wrapper .media').empty();
  $('#keywords').val("");
  $('#classes').val(0);
  $('#teachers').val(0);
}


function addVideos(list)
{
  for(var i=0; i<list.length; i++)
  {
    $item = getItem(list[i]);
    $('.wrapper .media.list').append($item);
  }

  let counter = 1;
  $('.wrapper .media.list').children('.rowitem').each(function(i) {
    // Hide inactive video types
    let type = $(this).data('type');
    if(type && !isActive(type, $(this))) {
      $(this).hide();
    }
    else {
      counter++;
      $(this)
        .css("display", "inline-block")
        .delay(counter * DELAY)
        .css('opacity', 0)
        .animate({'opacity': 1}, 320);
    }

    // Add hover listener to added video rows
    $(this).hover(function()
    {
      let href = $(this).attr("href");
      $('header .info').html(href);
    });
  });
}


function getItem(obj)
{
  const getTypeStr = (type) => {
    switch(type) {
      case 0: return "lesson";
      case 1: return "move";
      case 2: return "aerials";
      case 3: return "performance";
      //case 4: return "google";
      default: return "unknown";
    }  
  }
  
  const getArrStr = (arr, separator) => {
    if(arr.length === 0)
      return '&nbsp;';
    else
      return arr.join(separator);
  }

  var parts = obj.file.split("/");
  var filename = parts[parts.length-1];  // Get rid of folders in filename
  filename = filename.replace(/_/g, " ");  // Replace _ with spaces
  filename = filename.substring(0, filename.length-4);  // Get rid of extension

  const type     = getTypeStr(obj.type);
  const tags     = getArrStr(obj.tags, ' &middot; ');
  const teachers = getArrStr(obj.teachers, ' &amp; ');
  const origin = obj.origin ?? "<i>unknown</i>";
  
  
  var res = `<div class='rowitem ${type}' data-type='${type}' href='${obj.file}'>`;
  res += `<div class='id'>${obj.id}</div>`;
  res += "<div class='meta'>";
  res += `<div class='icon origin'>${origin}</div>`;
  res += `<div class='icon teachers'>${teachers}</div>`;
  res += `<span>${tags}</span>`;
  res += "</div>";
  res += "</div>";
  
  return res;  
}


/**
 * Set video overlay
 */
function setOverlay(file, type)
{
  const resetVideo = (video) => {
    console.log("Resetting video!");
    video.currentTime = 0;
    video.load();
    video.play();
  }
  
  const initVideo = (file) => {
    $('.overlay source').attr("src", `${ROOT}/${file}`);
    $vid = document.getElementById("vid");
      
    $vid.oncanplay = function ()
    {
      this.playbackRate = speed;
      this.onended = () => resetVideo(this); // Ensure video loops
      this.play();
    };

    $vid.load();
  }
  
  $('.overlay.local')
    .delay(100)
    .fadeIn(320);

  $('.overlay video')
    .css({'margin-top': '0'})
    .delay(100)
    .animate({'margin-top': '60px'}, 320);

  setTimeout(initVideo, 60, file); // Alternate way to write timeout
}