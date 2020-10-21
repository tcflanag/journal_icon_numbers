# 1.0.13
* Update manifest to 0.7.5

# 1.0.13
* Fix odd issue with non-functionality on The Forge 

# 1.0.12
* Fix issue with makeDir on initial install

# 1.0.11
* Fix module breaking typo
* Update manifest to fix upgrading issue.

# 1.0.10
 * Fix infinite looping on 0.7.4 when adding already existing icons.  This also removes the annoying popup about file overwriting on earlier versions.
 * Fix iconSize setting defaulting to NaN on 0.7.4

# 1.0.9
 * Move all localization and settings to module namespace to prevent potential conflicts
 * Added upload path settings value
 * Fix issue where user selected icon scale was getting for all icons every time. Now the mod just sets a default value for matching notes the first time it is opened
 * Added default scale settings value
 * Cleanup icons to better match the scale value (100% will now take up the whole map cell)
 * Change note config dialog to auto-resize when color picker is opened
 * Update file naming to eliminate case insensitivy issues on Windows hosted games.


# 1.0.8
 * Added partial spanish language support. Thanks to @lozalojo
 * Finished pulling out all strings to en.json, to support future i18n contributions
 * Fixed multiple calls to renderSceneNavigation, and possible infinite loop scenario. Thanks to @BlitzKraig 

# 1.0.7
 * Manual specifying of colors as requested in #4. Support for both global defaults, and per-icon values. Using 'lib - Color Settings module', which allows you to specify transparent colors.
 * Per-icon overiding of default shape.
 * Overide icon text to any value (max of 3 char recommended, 4 if using 'none' background)
 * Per-icon enable/disable of the custom icon. If you really don't want a numbered icon, or you want to enable a custom text icon for ANY journal. This should address the use case in #2
 
# 1.0.6
 * Fix second error on clients from makedir.  This would cause error messages to appear in the console

# 1.0.5
* Add Square and Diamond shapes.  Also seperated color selection from shape.
* Fix error on clients from v1.0.4 auto upgrade code. This would cause clients to get spammed on scene changes
* Make settings on world level, not client level

# 1.0.4
* Add auto-migrate code to move all notes using pre-built icons to dynamically generated ones.
  * Removed the prebuilt icons to drastically improve install speed.
* Fix for #1 (or at least better debug messages), and hopefully work with The Forge's asset library correctly

# 1.0.3
* Icons are now generated dynamically and stored in uploads/journal-icon-numbers.**It is advised the users of previous versions go through and edit all their icons to migrate to the new location.**
* Once I have proper migration tools in place, the old icons will be deleted since they slow down installs.

# 1.0.2
* Add fix for conflict with Pin Cushion.

# 1.0.1
* Split upper and lower case into separate folders to work around hosting on case-insensitive OSes.

# 1.0.0
Initial release
