/**
 * Populate class dropdown menu
 */
function buildClasses(videos)
{
  let list = [...new Set(videos
    .flatMap(video => video.origin)
    .filter(origin => origin)  // Removes falsy values (e.g., null, undefined, '')
    .sort())];
  
  let output = ['<option value="0">Select class</option>'];
  list.forEach((val, index) => {
    output.push(`<option value="${index + 1}">${val}</option>`);
  });
  $('#classes').html(output.join(''));
}

/**
 * Populate teacher dropdown menu
 */
function buildTeachers(videos)
{
  let list = [...new Set(videos
      .flatMap(video => video.teachers) // Flatten all teacher arrays
      .filter(teacher => teacher)       // Remove invalid values (null, undefined, empty strings)
      .sort())];
 
  let output = ['<option value="0">Select teacher</option>'];
  list.forEach((val, index) => {
    output.push(`<option value="${index + 1}">${val}</option>`);
  });
  $('#teachers').html(output.join(''));
}