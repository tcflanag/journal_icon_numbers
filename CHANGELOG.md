# 1.9.1
* Add support for linking directly to journal headings.  This works well with mods like 'Journal Anchor Links' (https://foundryvtt.com/packages/jal), and 'DDB-Importer'( https://foundryvtt.com/packages/ddb-importer) which support creating map notes to headings (#40)

# 1.9.0
* (v11) Fix issue where icons weren't being created on new installs
* Add support for `42.` (number followed by period) parsing format. (Disabled by default in settings)

# 1.8.2
* Add support for players with "Create Map Notes" permissions. (#36)  
  * If the user doesn't also have Upload & Browse permissions, they can only use this feature when the GM is connected (or someone else who has the Upload perms)
* Fix bug with Firefox rendering some fonts weirdly. (#34)

# 1.8.1
 * (v10) Add support for pulling from journal image page (#33)
 * (v10) Fix depreciation checker (#32)

# 1.8.0
 * Cleanup of a bunch of weird corner cases
 * Rebuild now shows a progress bar instead of silence!
 * Fix to proper use of flags api to address some possible compatibility issues. 
 * v10 - Icon names can now be based on pages too
   * Just drag the page from inside the journal window, and they will get the correct icon.
 * v10 - Fix breaking issue `not read properties of undefined (reading 'checked')` that appeared after the official v10 release 
 
# 1.7.3 
* v10 support 

# 1.7.2
* Added Japanese localization. Thanks to @besardida

# 1.7.1
* Fix issue with icon rebuilder.  Thanks to @xdy

# 1.7.0
* Add Quick Add Mode for users who have lots of icons to add

# 1.6.0
* Add the ability to change the font size of an icon.

# 1.5.3
* Fixed issue in default global settings.

# 1.5.2
* Fixed global settings not working on new worlds
* Fixed bad localization on Save button
* Re-enabled bug-reporter support

# 1.5.1
* Fixed issue with default fontsize/icon-size applying when it shouldn't.

# 1.5.0
* Add ability to control the border width
* Add ability to control bold/italics on fonts
* Reworked the global settings page to give a preview icon
* Fixed default icon based on folder name feature

# 1.4.1
* Drop the trailing '.' and ' ' from the new matching patterns
* Expand custom regex support (see readme for details)

# 1.4.0
* Add several new matching patterns, along with user defined (regex) based matching.

# 1.3.3
* Fix error introduced in 1.3.2 per #21

# 1.3.2
* Fixed issue with users of the Forge getting upload toasts anytime they even move an icon. This might have also appeared as "Quota Exceeded" per #20

# 1.3.1
* Fixed 'may not overwrite non-media files' error when 'Upload Path' ended with '/'

# 1.3.0
* Support for 0.8.x (not backwards compatible)

# 1.2.4
* Add ability do set default font size for the standard hover text.
* Fix issue where window started partly off-screen.

# 1.2.2
* Add support for Bug Reporter

# 1.2.1
* Fixed the auto folder naming so that you can change it later

# 1.2.0
* Add ability to automatically set the icon based on the folder name
  * For example, a folder named "Village" would have default icons of "Village"
  * Only works the icons visible in the dropdown
  * Can be disabled via settings
* Updated automatic icon matching to support 3 and 4 digit numbers for those really big maps

# 1.1.6
* Fix simple bug that completely broke the module.

# 1.1.5
* Update to 0.7.9
* Fix issue with editing notes while non-gm accounts are connected.

# 1.1.4
* Update to 0.7.7

# 1.1.3
* Update to 0.7.6
* Bug Fix
  * Add better eror message lib-colorsettings not being activated for #11

# 1.1.2
* New Feature
  * Enhanced rebuild feature to use either the existing settings for a token, or the global defaults
* Bug Fix
  * Fix issue where global fonts weren't working #10


# 1.1.1
* Portuguese translation provided by  @renato.innocenti 

# 1.1.0
* New Features 
  * Font selection - Now allows access to over 1000 different fonts
  * Hexagon icons - Both orientations, to match your hex maps. (Grid snapping is wonky with hex grids, but that is a core issue)
  * Icons now fully fill grid at 100% 
  * Thinner borders on icons - The default border was a bit chunky, so I slimmed it down.
  * Live preview - You can now see the icon as you change settings. Great for font browsing.
  * Rebuild all icons - Accidentally deleted your icons folder?  Just go click the rebuild button in settings, and all your icons will be regenerated. 
* Bug Fixes
  * Cleaned up more corner cases with directory creation

# 1.0.14
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
