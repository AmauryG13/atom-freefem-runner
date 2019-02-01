# FreeFem++ Runner
This package is a small plugin for running FreeFem++ file (.edp) from Atom editor.

## Configuration
By default, the FreeFem++ software needs to be install on your computer.
It also needs to be in your PATH.

If not:
> Register the path of the FreeFem++ executable in the package config

## Runnin a .edp file
FreeFem ++ Runner only launches .edp file.

This is 3 different ways to run the compilation :
* In the package list dropdown !
> In FreeFem++ Runner tab, "Launch compilation" tag is available

* On the text editor directly
> Right click on your code tab, in the menu a "Launch compilation for this file" tag is clickable

* Using keybindings
> For Windows/Linux users, press "ctrl+al+f".
> For Mac users, press "cmd+alt+f"

## Limitations
While running, stdin output from the command line is displayed on the bottom dock.
However, all output may not be totaly sync with the running.
Indeed, window displaying from the sotfware (medit or plot) is stoping output displaying in the bottom viewer.

> If any of you have a solution to this bug, I look forward to discuss this problem with you.

### Issues and Contributions
If anything is going wrong, don't hesitate to open a new issue.

If you're willing to contribute, feel free.
> I just ask you to create a new branch called something like feature/<your-feature>

*Hope you enjoy using this package*
*Cheers*
Amaury
