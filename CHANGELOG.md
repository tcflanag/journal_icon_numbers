# 1.0.6
 * Fix second error on clients from makedir.  This would cause error messages to appear in the console

# 1.0.5
* Add Square and Diamond shapes.  Also seperated color selection from shape.
* Fix error on clients from v1.0.4 auto upgrade code. This would cause clients to get spammed on scene changes
* Make settings on world level, not client level

# 1.0.4
* Add auto-migrate code to move all notes using pre-built icons to dynamically generated ones.
  * Removed the prebuilt icons to drastically improve install speed.
* Possible fix for #1 (or at least better debug messages), and hopefully work with The Forge's asset library correctly

# 1.0.3
* Icons are now generated dynamically and stored in uploads/journal-icon-numbers.**It is advised the users of previous versions go through and edit all their icons to migrate to the new location.**
* Once I have proper migration tools in place, the old icons will be deleted since they slow down installs.

# 1.0.2
* Add fix for conflict with Pin Cushion.

# 1.0.1
* Split upper and lower case into separate folders to work around hosting on case-insensitive OSes.

# 1.0.0
Initial release
