GeoWizard
System Analysis
Executive Summary
GeoWizard is an innovative web application designed for map enthusiasts to create, share, and edit maps using real-world data. It offers a platform where users can explore various types of maps and engage in discussions around them. If users are inspired by or have a different interpretation of existing maps, they can edit and publish their own forked versions, allowing them to showcase their creativity to the community.

While other map-editing tools like mapshaper exist, they are often unintuitive and lack user-friendliness. GeoWizard aims to provide a more accessible experience for users from all backgrounds, combining powerful map editing with community interactions, similar to forums like Reddit. Our platform is built for both map hobbyists and those interested in map exploration.

Objectives
File Importing: Support for GeoJSON, KML, and Shapefiles.
File Exporting: Export maps as PNG, JPG, and a custom JSON format.
Community Features:
Keyword search for viewing and downloading maps.
Commenting and upvoting/downvoting on maps.
Option to make maps public or private.
Map Classification and Search:
Tagging for easy map search.
Titles and descriptions for maps.
User Authentication:
Sign up and login with email, username, password, and security questions.
Password recovery via email or security question.
Map Editing:
Choose from 5 pre-defined map templates.
Select and edit specific regions (e.g., World, North America, New York).
Name regions and attach custom data (strings, numbers, colors, etc.).
Undo/redo functionality.
Strategies and Philosophies
GeoWizard will follow the Model-View-Controller (MVC) design pattern to separate the frontend from the backend, ensuring clean, modular code. This pattern also allows easy adjustments to individual components without needing to overhaul the entire system.

Development will take place on GitHub, with each feature developed on separate branches. Once a feature is complete and approved by other team members, it will be merged into the main branch.

Constraints: 5 Map Templates
Heatmap: Displays a continuous color spectrum to represent data rather than distinct boundaries.
Point/Locator Map: Represents data as points on the map.
Symbol Map: Similar to a point map, but using shapes or colors to represent data points.
Choropleth Map: Maps areas by geographic or political boundaries, filling them with colors based on data.
Flow Map: Uses lines or arrows to show the direction and volume of flows, highlighting patterns in data.
Actors
Registered Users:
Access basic map editing tools and features.
Upload and save maps, with visibility set to public or private.
Participate in the community hub by viewing, forking, and commenting on maps.
Export maps as GeoWizard’s custom JSON format for future editing.
Guests:
Access the community hub for viewing and searching maps.
Cannot comment, fork maps, or create their own maps.
Services
Account Creation and Management: Users can create an account, log in, recover passwords, and sign in with Google.

Map Graphic Creation: After logging in, users can upload SHP/DBF, GeoJSON, KML, or other map files. Sample files are also provided for testing.

Map Graphic Editing: Depending on the map type, users can edit maps by:

Assigning colors to regions (heatmap).
Using a hex color picker to customize region colors (choropleth map).
Selecting shapes to represent areas (symbol map).
Placing points on maps (point/locator map).
Drawing arrows to represent flows (flow map).
Map Graphics Exporting: Users can export maps as PNG, JPG, or GeoWizard’s custom JSON format from the export dropdown.

Map Classification and Search: Users can sort maps by likes, comments, etc. and search for maps using titles and descriptions.

Community Interactions: Each map has a comment section where users can leave feedback. Users can also like or dislike maps and individual comments.
