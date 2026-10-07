# StudyIA teacher assets

The active stylized characters are original parametric geometry generated in
teacher-character.mjs. They do not use or alter the supplied visual references.
Facial control mapping and animation are in teacher-face.mjs and teacher-motion.mjs.
The uniforms use the project's original school-logo.jpg without changing its artwork.
The iris texture is generated locally. No image or model is fetched from an avatar
service. The previous human base described below is retained as a legacy reference
and is no longer requested by the current avatar renderer.

The human base is derived from the MPFB avatar by met4citizen, made in Blender
with MakeHuman/MPFB and released under CC0. Source:
https://github.com/met4citizen/TalkingHead/blob/b3e277b3b46f88e557bf28a2c5612a5b04e075c3/avatars/mpfb.glb
The source README identifies this particular model as CC0:
https://github.com/met4citizen/TalkingHead/blob/b3e277b3b46f88e557bf28a2c5612a5b04e075c3/README.md
CC0: https://creativecommons.org/publicdomain/zero/1.0/

StudyIA reduces texture resolution and keeps facial shape keys needed for
animation. `scripts/prepare-teacher-model.mjs` reproduces that optimization.
In the previous version, the two character variants, haircut, colours, lighting and animation were
configured in teacher-avatar.mjs and teacher-style.mjs. Both shared the same neutral base rig.
Skin textures are now kept at 2048 px; eye expression shape keys are retained.
The uniform logo uses the project's original school-logo.jpg without changing
its artwork. Clothing projection, glasses and refined hair are code-generated
in teacher-style.mjs; animation transitions are in teacher-motion.mjs.

HeadAudio worklet, classification model and module are bundled from
met4citizen/HeadAudio, commit d3af5f9ff86ab6b2b1913d411a4e1922ec101953.
License: MIT, included in vendor/LICENSE-HeadAudio.txt.
https://github.com/met4citizen/HeadAudio

Three.js is installed as a pinned npm dependency. Its MIT license is served
at /vendor/LICENSE-three.txt. All avatar files and dependencies are served
by StudyIA; browsers do not contact avatar services or CDNs.
