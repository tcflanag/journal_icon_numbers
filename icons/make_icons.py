#!/usr/bin/python3
import string
import os

letters = [""] + list(string.ascii_letters)


numbers = []
for i in range(1,100):
    numbers.append(f"{i:02}")
for i in range(1,10):
    numbers.append(f"{i}")

for n in numbers:
    for a in letters :
        #print(a)
        for name in [n+a,a+n ]:
            svg_data = f"""
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
            viewBox="0 0 512 512" width="512" height="512">
              <g>
                <circle style="fill:#ffffff;stroke:#010101;stroke-width:30;stroke-miterlimit:10;" cx="250" cy="250" r="220">
                </circle>
                <text font-family='-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' font-size="200" font-weight="400" fill="black" x="50%" y="52%" text-anchor="middle" stroke="#000000" dy=".3em">{name}</text>
              </g>
            </svg>
            """
            #print (name)
            u_l = "lower" if a.lower() == True else "upper"
            with open(f"{u_l}/{name}.svg", "w", newline='\n') as f:
                f.write(svg_data)
