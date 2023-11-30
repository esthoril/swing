'''
Check which files are not present on the system
'''

import execjs
import json

js_code = """
const VIDEOS = [
  {id: 1, file: "cross-overs-2017/lesson1.mp4", type: 1, tags: ["charleston", "airplane"], desc: "Switching sides in airplane tandem charleston", origin: "Cross Overs 2017", teachers: ["Ari", "Simon"]},
  {id: 2, file: "cross-overs-2017/lesson2.mp4", type: 1, tags: ["tandem", "charleston", "intro"], desc: "Variation to get into tandem charleston, follow runs into her arm", origin: "Cross Overs 2017", teachers: ["Ari", "Simon"]},
  {id: 3, file: "cross-overs-2017/lesson3.mp4", type: 1, tags: ["swingout", "backwards", "follow"], desc: "Follow goes straight then moves backwards", origin: "Cross Overs 2017", teachers: ["Ari", "Simon"]},
  {id: 4, file: "cross-overs-2017/lesson4.mp4", type: 1, tags: ["swingout", "footwork", "variation"], desc: "Fun swingout footwork variation", origin: "Cross Overs 2017", teachers: ["Ari", "Simon"]}
];

VIDEOS;
"""

# Use execjs to execute JavaScript code
ctx = execjs.compile(js_code)
videos = ctx.eval("VIDEOS")

# Convert to JSON string and then parse it in Python
videos_json_string = json.dumps(videos)
videos_parsed = json.loads(videos_json_string)

print(videos_parsed)
