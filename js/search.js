function findVideosByParameters()
{
  console.log('Checking classes: ' + $('#classes option:selected').val());
  console.log('Checking teachers: ' + $('#teachers option:selected').val());

  var list = VIDEOS.filter(checkParameters);
  return list;
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
  const cls = $('#classes option:selected').text();
  if(item.origin != cls && $('#classes option:selected').val() > 0) return false;

  // Check teachers parameter
  const teacher = $('#teachers option:selected').text();
  if(!item.teachers.includes(teacher) && $('#teachers option:selected').val() > 0) return false;

  // Check keywords
  const keywords = (document.getElementById("keywords").value).split(" ");
  if(keywords[0] === "")  // Add any video if no keyword is set
    return true;
  else
  {
    for(var j=0; j<keywords.length; j++) {
      if(item.tags.includes(keywords[j]))
        return true;
    }
  }
  return false;
}