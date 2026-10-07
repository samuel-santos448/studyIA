# StudyIA teacher assets

The human base is derived from the MPFB avatar by met4citizen, made in Blender
with MakeHuman/MPFB and released under CC0. Source:
https://github.com/met4citizen/TalkingHead/blob/b3e277b3b46f88e557bf28a2c5612a5b04e075c3/avatars/mpfb.glb
The source README identifies this particular model as CC0:
https://github.com/met4citizen/TalkingHead/blob/b3e277b3b46f88e557bf28a2c5612a5b04e075c3/README.md
CC0: https://creativecommons.org/publicdomain/zero/1.0/

StudyIA reduces texture resolution and keeps facial shape keys needed for
animation. `scripts/prepare-teacher-model.mjs` reproduces that optimization.
The two character variants, haircut, colours, lighting and animation are
configured in teacher-avatar.mjs. Both share the same neutral base rig.
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
