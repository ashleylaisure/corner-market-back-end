# Minesweeper

#### Minesweeper is a logic-based game where the goal is to reveal all the squares on the board without triggering any hidden mines.

<!-- images of app (inc. logo  homepage etc.)-->


## Description
Minesweeper is a game where mines are hidden in a grid of squares. The object of the game is to clear the board without selecting a mine. Each square is designated a number that represents the amount of mines located in the 8 squares surrounding it. Using this information the user must navigate around the board placing down flags (with a right-click) where they think mines are located. The user wins when all squares have either been flagged or opened. 

## Table of Contents
* [Technologies Used](#technologiesused)
* [Features](#features)
* [Design](#design)
* [Project Next Steps](#nextsteps)
* [Deployed App](#deployment)
* [About the Author](#author)

## <a name="technologiesused"></a>Technologies Used
* JavaScript
* HTML5
* CSS3


## Features
* Mines counter - reflects the number of mines hidden on the board, reduces as the mines have been flagged 
* Emoji - reset button 
* Timer - counting time spent on the game
* Right Click - placing a flag on the square
* Left Click - revealing the square 


## Wireframe Images
<img src="https://i.ibb.co/sgrXXhF/Screenshot-2024-12-09-195540.png">

## Notion Planning
* https://www.notion.so/Minesweeper-158133426c96816a9f9cf23fb9071e41?pvs=4

## <a name="design"></a>Design
* For the design of my Minesweeper, I decided to divert from the traditional gray colorway and went with a blue/green look.


## <a name="nextsteps"></a>Project Next Steps
#### List of Future Features
* Allow the user to select the difficulty level - changing the board size and amount of mines 
* Create a leaderboard to record the time the game was completed

## <a name="deployment"></a>Deployed Link
[Github Pages](https://ashleylaisure.github.io/Minesweeper/)

* You can view the repository:
[Github.com](https://github.com/ashleylaisure/Minesweeper)
* If unable to view please go live locally through VS Code

## <a name="author"></a>About The Author
After countless hours mastering Minesweeper as a teenager, I discovered my passion for problem-solving and creativity. This led me to the exciting challenge of developing my own version of the classic game. Whether I’m diving into code or exploring new ideas, I’m driven by a love for innovation and the joy of creating experiences that others can enjoy.
    
## Works Cited:
Minesweeper includes a flood feature: when a square with zero bombs around it is revealed, the flood mechanism is triggered. This causes the program to recursively call itself, revealing the surrounding squares. The process continues until it reaches a boundary of numbered squares surrounding the initial square.

Additional research was done to understand how to write a recursive function.

* https://developer.mozilla.org/en-US/docs/Glossary/Recursion
* https://www.freecodecamp.org/news/recursion-in-javascript/


Emoji's used were copied and pasted from the Unicode site.

* https://unicode.org/emoji/charts/full-emoji-list.html


While making the timer function I referenced these websites.

* https://www.freecodecamp.org/news/javascript-settimeout-how-to-set-a-timer-in-javascript-or-sleep-for-n-seconds/
* https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval
* https://www.google.com/search?q=interval+timer+in+javascript&sca_esv=59d83465afa8625f&sxsrf=ADLYWILHo3AG_2Ti4M81b_keZUm22PeT-g%3A1734394247417&ei=h8FgZ8-OGaCe5NoPtO622QE&oq=interval+timer+in+jav&gs_lp=Egxnd3Mtd2l6LXNlcnAiFWludGVydmFsIHRpbWVyIGluIGphdioCCAAyBhAAGBYYHjIGEAAYFhgeMgYQABgWGB4yBhAAGBYYHjIGEAAYFhgeMgYQABgWGB4yBhAAGBYYHjIGEAAYFhgeMgYQABgWGB4yBhAAGBYYHkjWGlDJAVjdDXABeAGQAQCYAVOgAZIEqgEBN7gBAcgBAPgBAZgCCKACrQTCAgoQABiwAxjWBBhHwgINEAAYgAQYsAMYQxiKBcICChAAGIAEGEMYigXCAgUQABiABMICChAAGIAEGBQYhwLCAgcQABiABBgKmAMAiAYBkAYKkgcBOKAH5TA&sclient=gws-wiz-serp 

I wanted to add a popup modal to the navigation of the game so that users could read instructions to play the game. This YouTube video was extremely helpful in understanding how to hide elements that become available with an event listener. 

-   https://www.youtube.com/watch?v=gLWIYk0Sd38