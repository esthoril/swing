const ROOT = "videos";

const DELAY = 16;
let speed = 1.0;

$(document).ready(function()
{
  $('.media.list').fadeIn(100);
  clear();

  // Clear lists
  $('.clear').click(function(e) { clear(); });

  // Add checkbox listeners
  const categories = ["lesson", "move", "aerials", "performance", "google"];
  for(let c of categories) {
    addListener(c);
  }

  // Populate dropdowns
  populateClasses();
  populateTeachers();

  // Overlay listener
  // Fade out overlay and stop video
  $('.overlay').click(function(e)
  {
    console.log("Closing video");
    $('.overlay video').css({'margin-top': '60px'}).animate({'margin-top': '0'}, 320);
    $(this).fadeOut(320);

    setTimeout(() => {
      $vid = document.getElementById("vid");
      $vid.pause();
      //$('video').each(function () { this.pause(); });
    }, 100);
  });

  // Video list listeners
  $('.media.list').on('click', '.rowitem', function()
  {
    let href = $(this).attr("href");
    let type = $(this).attr('class').split(" ")[1];

    console.log(`Setting video ${href}, ${type}`);
    setOverlay(href, type);
  });

  // Add videos from parameters
  $('.videos .search').click(function(e)
  {
    console.log("Video button clicked");
    $('.wrapper .media').empty();
    if(!findVideosByParameters())
      $('.wrapper .media.list').html("<h1>No videos found :(</h1>");
  });

  // Set video speed
  $('.faster').click(function(e) { speed = setPlaybackRate(0.1) });
  $('.slower').click(function(e) { speed = setPlaybackRate(-0.1) });
});

/**
 * Add category checkbox listeners
 */
function addListener(category)
{
  $(`.menu .${category}`).click(function(e) {
    toggleItems($(this), `.rowitem.${category}`);
  });
}

/**
 * Set video overlay
 */
function setOverlay(file, type)
{
  if(type === "google") {
    $('.overlay.google').delay(100).fadeIn(320);
    setTimeout(() => {
      $('.overlay iframe').attr("src", file);
    }, 160);
  }
  else {
    $('.overlay.local').delay(100).fadeIn(320);
    $('.overlay video').css({'margin-top': '0'}).delay(100).animate({'margin-top': '60px'}, 320);

    setTimeout(() => {
      $('.overlay source').attr("src", `${ROOT}/${file}`);
      $vid = document.getElementById("vid");
      
      $vid.oncanplay = function ()
      {
        this.playbackRate = speed;
        this.onended = function () { // Ensure video loops
          console.log("Restarting video!");
          this.currentTime = 0;
          this.load();
          this.play();
        };
        this.play();
      };

      $vid.load();
    }, 60);
  }
}

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

/**
 * Set video playback rate
 */
function setPlaybackRate(diff)
{
  speed += diff;
  if(speed >= 1.2) speed = 1.2;
  if(speed <= 0.5) speed = 0.5;
  document.getElementById('value').innerHTML = `${Math.round(speed*100)}%`;
  console.log(`Playbackrate set to: ${speed.toFixed(1)}`);
  return speed;
}

function toggleItems($source, type)
{
  console.log(`Toggling: ${type}`)
  $source.toggleClass('active');
  $(type).toggle();
}

/**
 * Populate class dropdown menu
 */
function populateClasses()
{
  let list = [];
  let output = ['<option value="0">Select class</option>'];
  for(let i=0; i<VIDEOS.length; i++) {
    let cls = VIDEOS[i].origin
    if(cls.length >= 3)
    {
      if(!list.includes(cls))
        list.push(cls);
    }
  }
  list.sort();  // Sort alphabetically
  for(let i=0; i<list.length; i++) {
    output.push(`<option value="${(i+1)}">${list[i]}</option>`);
  }
  $('#classes').html(output.join(''));
}

/**
 * Populate teacher dropdown menu
 */
function populateTeachers()
{
  let list = [];
  let output = ['<option value="0">Select teacher</option>'];
  for(let i=0; i<VIDEOS.length; i++) {
    let ts = VIDEOS[i].teachers
    for(let t=0; t<ts.length; t++) {
      if(ts[t].length >= 1)
      {
        if(!list.includes(ts[t]))
          list.push(ts[t]);
      }
    }
  }
  list.sort();  // Sort alphabetically
  for(let i=0; i<list.length; i++) {
    output.push(`<option value="${(i+1)}">${list[i]}</option>`);
  }
  $('#teachers').html(output.join(''));
}

/**
 * Search for videos with keywords or sessions
 */
function findVideosByParameters()
{
  console.log('Checking classes: ' + $('#classes option:selected').val());
  console.log('Checking teachers: ' + $('#teachers option:selected').val());

  var list = [];
  for(var i=0; i<VIDEOS.length; i++)
  {
    if(checkParameters(VIDEOS[i]))
      list.push(VIDEOS[i]);
  }
  addVideos(list);
  return list.length>=1 ? true : false;
}

/**
 * Check keywords, classes and teacher parameters
 */
function checkParameters(item)
{
  // Check for video file
  //console.log("Checking file: " + item.file);
  if(item.file.length <= 3) return false;

  // Check class parameter
  var cls = $('#classes option:selected').text();
  if(item.origin != cls && $('#classes option:selected').val() > 0) return false;

  // Check teachers parameter
  var teacher = $('#teachers option:selected').text();
  var teachers = item.teachers;
  if(!teachers.includes(teacher) && $('#teachers option:selected').val() > 0) return false;

  // Check keywords
  var keyword = document.getElementById("keywords").value;
  if(keyword == "")  // Add any video if no keyword is set
    return true;
  else
  {
    var tags = item.tags;
    var keywords = (document.getElementById("keywords").value).split(" ");
    for(var j=0; j<keywords.length; j++) {
      if(tags.includes(keywords[j])) {
        console.log("Creating video block: " + item.desc)
        return true;
      }
    }
  }
  return false;
}

/**
 * Clear html
 */
function clear()
{
  $('.wrapper .media').empty();
  $('#keywords').val("");
  $('#classes').val(0);
  $('#teachers').val(0);
}

function isActive(type, $item) {
  return ($('.menu div.' + type).hasClass('active') && $item.hasClass(type));
}

/**
 *
 */
function addVideos(list)
{
  for(var i=0; i<list.length; i++)
  {
    $item = getItemRow(list[i]);
    $('.wrapper .media.list').append($item);
  }

  let counter = 1;
  $('.wrapper .media.list').children('.rowitem').each(function(i) {
    // Hide inactive video types
    let type = $(this).attr('class').split(" ")[1];
    if(type && !isActive(type, $(this))) {  // if we have a specific type and it is not active, don't show
      $(this).hide();
    }
    else {
      counter++;
      $(this).css("display", "inline-block");
      $(this).delay(counter * DELAY).css('opacity', 0).animate({'opacity': 1}, 320);
    }

    $(this).hover(function() {
      let desc = $(this).find('.desc').text();
      $('header .info').html("&nbsp;" + desc);
    })
  });
}

/**
 * Convert json object into html tile
 */
const getTypeStr = (type) => {
  switch(type) {
    case 0: return "lesson";
    case 1: return "move";
    case 2: return "aerials";
    case 3: return "performance";
    case 4: return "google";
    default: return "unknown";
  }  
}

const getArrStr = (arr, separator) => {
  if(arr.length === 0)
    return '&nbsp;';
  else
    return arr.join(separator);
}
 
function getItemTile(obj)
{
  var parts = obj.file.split("/");
  var filename = parts[parts.length-1];  // Get rid of folders in filename
  filename = filename.replace(/_/g, " ");  // Replace _ with spaces
  filename = filename.substring(0, filename.length-4);  // Get rid of extension

  const type = getTypeStr(obj.type);
  const tags = getArrStr(obj.tags, ' &middot; ');
  const teachers = getArrStr(obj.teachers, ' &amp; ');

  var res = `<div class='item ${type}' href='${obj.file}'>`;
  res += `<div class='id'>${obj.id}</div>`;
  res += "<div class='meta'>";
  res += `<div class='icon origin'>${obj.origin}</div><br/>`;
  res += `<div class='icon teachers'>${teachers}</div><br/>`;
  res += `<span>${tags}</span>`;
  res += `<div class='desc'>${obj.desc}</div>`;
  res += "</div>";
  res += "</div>";

  return res;
}

function getItemRow(obj)
{
  var parts = obj.file.split("/");
  var filename = parts[parts.length-1];  // Get rid of folders in filename
  filename = filename.replace(/_/g, " ");  // Replace _ with spaces
  filename = filename.substring(0, filename.length-4);  // Get rid of extension

  const type = getTypeStr(obj.type);
  const tags = getArrStr(obj.tags, ' &middot; ');
  const teachers = getArrStr(obj.teachers, ' &amp; ');
  
  var res = `<div class='rowitem ${type}' href='${obj.file}'>`;
  res += `<div class='id'>${obj.id}</div>`;
  res += "<div class='meta'>";
  res += `<div class='icon origin'>${obj.origin}</div>`;
  res += `<div class='icon teachers'>${teachers}</div>`;
  res += `<span>${tags}</span>`;
  res += "</div>";
  res += "</div>";
  
  return res;  
}
