3.0.0uf
=======
Basic framework of SFEI Systems v3. Site unfinished.

3.0.0pa
=======
Pre-alpha version. Basic site structure finished.

3.0.1cfa
========
Uploaded to PaaS Cloud computing site Cloud Foundry.

Added mongodb functions.

3.0.2cfa
========
New feature: add blog.

This new feature used Ckeditor as rich text editor. This feature will store blog information in database, collection "archive". An database entry should include:

*blogtitle : the title of this blog
*abstract : the abstract of this article
*content : content of this article
*time : a Date object descripting the time of upload

3.0.3cfa
========
Removed Web Applications page. Webapps can be deployed into the archive section. Changed name "Blogs Archive" to "Archive".

Moved all router functions from app.js to /routes/index.js

3.0.4cfa
========
Added dropdown menu to show current access id.

Added access functions.

Moved add blog function to IDN. Now it requires admin clearance.

3.0.5cfa
========
Improved authentication process. Now when authentication is successful, it will render a page informing the user of the access id and access level.

Added /idn/archive to show a list of archive entries within the user's clearance.

3.0.6cfa
========
Improved access dropdown menu. Now the server will generate the full code of access sections of the dropdown.

Changed 'blogtitle' property of archive entries to 'entrytitle'.

Slightly improved access information page.

Added access information management page for ordinary users(/idn/access) and admins(/idn/access/manage).

Added render model(/models/render.js) which provides functions that take parameters and render HTML strings.

3.0.7cfa
========
Improved new archive entry page. Now it provides a dropdown menu to select access exceptions.

Now the server will store session information in databases. (aka testers will not be required to input access codes each time we restart the server. hail!)

Added editing feature. (awesome!)

3.0.8cfa
========
Now new users may send a request for an access code.

Administrators can now grant access to requests at access management page.

Known bug: the last editor of the entry becomes the author of this editor. Fixed in 3.0.12cfb.

3.0.9cfa
========
Completed access management section. Administrators can now add, modify and remove accesses from access management page.

Fixed bugs causing access.clearance.admin to be string instead of boolean.

Deprecated: /idn/access/manage/request. Now requests can be granted at access management page.

3.0.10cfb
=========
Version update: Cloudfoundry Beta.
----------------------------------

Recent low-access-level archive entries will now be displayed on the index and archive page.

3.0.11cfb
=========
Added language selection. Now the website supports Simplified Chinese and English.

known bug: if you granted an access, but changed its id during the process, the request will not be deleted. Fixed in 3.0.12cfb.

The website will now display the corresponding language of the http header.

3.0.12cfb
=========
Archive entries now support tags, exceptions, and language selection.

>New Class: Db (or Mongo?): Provides a new database interface. Call methods of db object(with a callback function) instead of using require('mongodb').connect(...)
>
>Constructor: function ()
>Methods: generate_mongo_url, generate_ObjectId, find_and_render, findOne, update, insert, remove

Many operations involving access ids are now done using the ObjectId. Fixed related bug.

New Class: Log: Create logs and store them in database collection 'log'

>Constructor: function ({'type','tag','user','desc'[,'time']})
>Methods: store, toJSON, render

3.0.13cfb
=========
Added db entry {'type': 'tags', 'tagname': [... , ...]} in collection 'archive' to store tags of previously posted archive entries.

Now users can select entries with specific tags to view at /archive, /idn/archive and /idn/log

3.0.14cfb
=========
Changed header images to North Star logo

Changed how filters can be applied in entry list pages.

Changed navbar logo, header logos to Scalable Vector Graph format.

3.1.0cfb
========
Users can now submit comments in articles.

3.1.1cfb
========
Users can now delete comments.

Admins can now delete all comments in one entry.

Fixed bugs: new access will be created when editing an existing entry.

3.1.2cfb
========
version bump: 3.1.2cfb

added several routes:

>'/idn/access/manage/existing': use ajax to get existing accesses
>
>'/idn/access/manage/new': administrators can create an access without requests
>
>'/archive/get': use ajax to get entries of specific tags

added loading text to buttons

wrapped some inputs in .control-group

3.1.3cfb
========
fixed bugs causing server shutdown when unauthenticated users try to view articles with higher access levels.

added security functions to prevent unauthorized ajax operations.

3.1.4cfb
========
finished security functions. see comments in security.js for further info

now articles are located based on their ObjectID.

replaced href="javascript:0" with href="javascript:void(0)"

3.1.5deb
========
new branch: Deep Earth

authentication now requires both access id and access code.

fixed zhcn font displays

users can now view several items at /idn, including:

>news feeds,
>
>user's articles,
>
>user's contacts

added author names in article previews. click on the name to view the author's profile thumbnail.

3.2.0deb
========
following and unfollowing function implemented.

users can view articles of the users they are following at /idn.

3.2.1deb
========
fixed bugs.

added user image selection page.

added 36 profile images.

users can now use contacts tab at /idn.

3.2.2deb
========
changed db name to deepearth.

fixed bugs.

registration page available.

default language is now zh.

updated index carousel.

users can now view 4 of the archive topics at index page.