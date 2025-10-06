Adds a macro like `{{idle_duration}}` but adds a parameter of how many messages to skip. 

`{{idle_duration_skip:<count>}}` where count is between 1 and 4.

Only possible values are `1`, `2`, `3`, or `4`. This is due to the current limitations of the ST api (it doesn't expose macro parameters to macros), so the possible values have been hard-coded.

Example: get the time since the last user message.

`{{idle_duration_skip:1}}`

Example: get the time since the user message before that.

`{{idle_duration_skip:2}}`

Motivation to develop this extension:

I wanted to give the character how long it has been since our last chat (in Worldbook entry or author note, or wherever).

This is my first SillyTavern extension. Please don't ask for help with it. I offer no support.