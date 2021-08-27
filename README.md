# Automatic Journal Icon Numbers


This module will automatically apply numbered icons (map pins) to journal entries that start with a number.  It supports the following numbering formats automatically, with both upper and lower cases.

* [0-9999]
* [A-Z][0-999]
* [0-999][A-Z]
* [A-Z].
* [A-Z] (space)
* Custom regex matching

The last three are disabled by default, and they all can be enable/disable in the settings menu

![Example of assorted pins on a map](example.png)

It is also now possible to manually specify arbitrary text in an icon; though a max of 3 characters is recommended for legibility, but 4 may work in some cases. You can also disable the mod on specific pins if you wish to use the stock icons (or anything via Pin Cushion).

Additionally, you can set a default stock icon for a group of journal entries by putting them in a folder named like one of the default icons like "Village", "Temple", "Book".

To use, just drag correctly named journals to your map. The icon will be automatically selected to match the name. Alternatively, you can manually enter the icon text in the Map Note Configuration window.


You can select a default global style of shape, color and font in the settings menu, and also override all of thm on a per-pin basis.

The above screenshot uses the [Backgroundless Pins](https://foundryvtt.com/packages/backgroundless-pins/) mod which is highly recommended.

## Matching and RegEx details
* All matching is done in the order seen in the settings page
* Built in regexs
    * `/^\d{1,3}[a-zA-Z]/`
    * `/^[a-zA-Z]\d{1,3}/`
    * `/^\d{1,4}/`
    * `/^([a-zA-Z]) /`
    * `/^([a-zA-Z])\./`
* Custom Regex
    * No need for leading or trailing /. 
    * You should start with ^ to match off the first character of the jounal title 
    * The last matchgroup used will be returned
    * Multiple values can be separated | separated. 
        * e.g. `^\d:\d|^[a-zA-Z]\.\d{1,2}`
    * Use `CONFIG.debug.journal_icon_numbers = true` in the console for debugging


## Questions
Feel free to contact me on Discord @ChrisF#4895, by filing an issue on GitLab, or using the [Bug Reporter Module](https://foundryvtt.com/packages/bug-reporter/).
