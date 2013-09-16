tableRowset
===========

JQuery plugin for setting table row and column number, like in google docs

version 0.1

=======
[sample page](http://alex-volkov.github.io/tableRowset/)

Parameters
===========
maxCols - max height of table in cells

maxRows - max width of table in cells

defaultRows - default height of table in cells

defaultRows - default width of table in cells

Callbacks
===========
onSet - receive an object of cols and rows


Methods
===========
changeSettings - allow to change initial plugin settings, parameters pass in object

$(selector).tableRowset('changeSettings', {maxCols: 15, defaultRows: 7});


