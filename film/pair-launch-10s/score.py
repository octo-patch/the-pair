#!/usr/bin/env python3
"""the-pair launch 10s · sound score.

One room, five materials, placed from the film's own beats (not per-event blips):
the chain reaction reads as a sequence of contacts — pop, knock, whoosh — with two
rests so the still frames stay silent, and a low resolve under the wordmark.
"""
import sys, os

SK = "/Users/wuhaotian/.agents/skills/onetake"
sys.path.insert(0, os.path.join(SK, "scripts"))
from sfx_palette import Score, air, glass, wood, sub, bubble

s = Score(dur=10.0, T60=1.0)

# hook words land — two soft rounded pops, panned apart like the two agents
s.place(bubble(520, 0.20), 0.06, 0.30, pan=-0.35, send=0.35)
s.place(bubble(660, 0.20), 0.42, 0.30, pan=0.35, send=0.35)
s.place(bubble(494, 0.22), 0.78, 0.26, pan=-0.15, send=0.35)
s.place(bubble(588, 0.26), 1.12, 0.30, pan=0.15, send=0.4)

# hub card pops in — a wooden knock, then the typing's soft ticks (three, quiet)
s.place(wood(190, 0.14), 2.00, 0.34, send=0.3)
for i, t in enumerate([2.36, 2.52, 2.68]):
    s.place(wood(300 + i * 30, 0.05), t, 0.12, pan=0.1, send=0.15)

# send click → mission morph — the collision that starts the next beat
s.place(wood(240, 0.10), 2.80, 0.42, pan=0.2, send=0.4)
s.place(air(0.45, 240, 2200), 2.88, 0.34, pan=0.2, send=0.5, pan_to=-0.1)

# plan ticks — three glass pings (the mentor thinking)
for i, t in enumerate([3.45, 3.87, 4.29]):
    s.place(glass([784, 880, 988][i], 0.55, 0.7), t, 0.20, pan=-0.2, send=0.45)

# hand presses approve — the loudest contact in the film; a hit + a low body
s.place(wood(150, 0.18), 5.25, 0.55, pan=0.25, send=0.5)
s.place(sub(74, 0.55), 5.27, 0.34, pan=0.2, send=0.35)

# executor rows stamp — four tighter pings, accelerating into the seal
for i, t in enumerate([5.95, 6.25, 6.55, 6.85]):
    s.place(glass(1046 + i * 44, 0.36, 0.55), t, 0.16, pan=0.05 + i * 0.05, send=0.4)
s.place(bubble(880, 0.24), 7.15, 0.34, pan=0.15, send=0.45)

# commit chip flies off — an airy pass from left to right, resolving on the branch
s.place(air(0.70, 300, 1900, 1.5), 7.42, 0.30, pan=-0.5, send=0.5, pan_to=0.45)
s.place(wood(210, 0.12), 8.16, 0.30, pan=0.45, send=0.4)

# wordmark — the resolve: a low sub, then a struck tone on the last letter
s.place(sub(58, 1.10), 9.20, 0.40, send=0.5)
s.place(glass(523, 1.20, 0.8), 9.86, 0.24, pan=0.0, send=0.6)

s.write(sys.argv[1] if len(sys.argv) > 1 else "sfx.wav")