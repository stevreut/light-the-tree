# light-the-tree

A small front-end only simulation of a Christmas tree light effect
implemented using JavaScript and, more specifically, the Canvas API


## Table of Contents

- [Description](#description)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Design and Implementation](#design-and-implementation)
- [License](#license)

# Description

This code supports a single-page presentation of what appears to be
a number of lights of various colors, each of them blinking on and 
off at their own randomly defined interval.  The effect is blurred
as if the lights were distributed in a three-dimensional space behind
some kind of translucent screen.

The implementation is entirely in HTML, CSS, and JavaScript (primarily
the latter), and specifically making use of the Canvas API.

The companion deployed site that this code supports can be found at [stevreut.github.io/light-the-tree](https://stevreut.github.io/light-the-tree/).

# Technologies

As noted above, this repository contains code in the following languages:

- JavaScript (including [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API))
- CSS
- HTML

# Installation

As this is deliberately a strictly front-end implementation, no installation is necessary.  However, if so desired, portions of the code can be copied (at ones own risk) from this repository and incorporated into other projects provided this is done in accordance with the terms of the license noted herein.

# Usage

This code has been deployed to site [stevreut.github.io/light-the-tree](https://stevreut.github.io/light-the-tree/) where it can be viewed and used with any up-to-date canvas-enabled web browser.

# Design and Implementation

The dynamic display aspect of the single-page display (i.e. 
the changing content of the &lt;canvas/&gt; element on that page) is 
accomplished via an object-oriented design that rests on two classes:

- *LightBulb* - a class representing a single light, which has a location
(in three dimensions), a color, and parameters which govern the rate at
which it blinks on and off.
- *LightBulbArray* - a class representing the all lights (instances of 

LightBulb) collectively.  This is the class which randomly generates the lights, turns all the lights on or off, and renders them on the 
canvas. 

# License.

https://opensource.org/license/mit/ 

(See also the [LICENSE](https://github.com/stevreut/light-the-tree/blob/main/LICENSE) file in this repository.)

# Author

Steve Reuterskiold: steve.reuterskiold@gmail.com
