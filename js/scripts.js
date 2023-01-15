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
	// Stop video and fade out overlay
	$('.overlay').click(function(e)
  {
		let type = e.target.getAttribute('class').split(" ")[1];

		if(type === "local") {
			let $video = document.getElementById("vid");
			$video.pause();
			$video.currentTime = 0;
		}

		if(type === "google") {
			$('.overlay.google iframe').attr("src", "");
		}

		$(this).fadeOut(100);
	});

	// Video list listeners
	$('.media.list').on('click', '.item', function()
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
	$('.faster').click(function(e) { speed = setPlaybackRate(.1) });
	$('.slower').click(function(e) { speed = setPlaybackRate(-.1) });
});

/**
 * Add category checkbox listeners
 */
function addListener(category)
{
  $(`.menu .${category}`).click(function(e) {
    toggleItems($(this), `.item.${category}`);
  });
}

/**
 * Set video overlay
 */
function setOverlay(file, type)
{
	if(type === "google") {
		$('.overlay.google').delay(100).fadeIn(100);
		setTimeout(function() {
			$('.overlay iframe').attr("src", file);
		}, 160);
	}
	else {
		$('.overlay.local').delay(100).fadeIn(100);
		setTimeout(function() {
			$('.overlay source').attr("src", `${ROOT}/${file}`);
			$vid = document.getElementById("vid");
			$vid.load();
			$vid.playbackRate = speed;
			$vid.play();
		}, 160);
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
	console.log(`Playbackrate set to: ${speed}`);
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
		$item = getItemTile(list[i]);
		$('.wrapper .media.list').append($item);
	}

  let counter = 1;
	$('.wrapper .media.list').children('.item').each(function(i) {
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
function getItemTile(item)
{
	var parts = item.file.split("/");
	var filename = parts[parts.length-1];  // Get rid of folders in filename
	filename = filename.replace(/_/g, " ");  // Replace _ with spaces
	filename = filename.substring(0, filename.length-4);  // Get rid of extension
	//console.log("Adding " + filename);

	var teachers = "";
	if(item.teachers.length >= 1)
	teachers += item.teachers[0]
	for(var i=1; i<item.teachers.length; i++) {
		teachers += " &amp; " + item.teachers[i];
	}

	let type = "";
	switch(item.type) {
		case 0: type = "lesson"; break;
		case 1: type = "move"; break;
		case 2: type = "aerials"; break;
		case 3: type = "performance"; break;
		case 4: type = "google"; break;
	}


	var tags = item.tags.length == 0 ? '&nbsp;' : item.tags[0];
	for(var i=1; i<item.tags.length; i++) {
		tags += " | " + item.tags[i];
	}
	var $item = `<div class='item ${type}' href='${item.file}'>` +
		`<div class='id'>${item.id}</div>` +
		"<div class='meta'>" +
		`<div class='icon origin'>${item.origin}</div><br/>` +
		`<div class='icon teachers'>${teachers}</div><br/>` +
		`<span>${tags}</span>` +
		`<div class='desc'>${item.desc}</div>` +
		"</div>" +
		"</div>"

	return $item;
}
