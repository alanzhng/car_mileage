# Messaging

Given the effects of climate change, it's become increasingly vital for people to become aware of their vehicle efficiency. While mileage per gallon is only one aspect of this efficiency, it is undoubtedly an important one. Using the cars2017 dataset, this visualization explores the relationships between different factors and their impact on mileage. By presenting the data in an interactive way, users can gain an understanding of these relationships and possibly make decisions to increase their vehicle efficiency.

# Narrative Structure

The narrative visualization follows an interactive slide show structure, allowing users to explore each scene while offering opportunities to discover more information. The scenes are presented in the order of relevance regarding aspects on vehicle mileage, starting broad and ending specific. Each scene simply asks a question; the user is the one who explores the data and uncovers the answer.

# Visual Structure

The visual structure of the narrative visualization is the familiar slide show structure. Visual consistency is maintained through a uniform styling of text, spacing, and overall layout. Users can only interact with one slide at once, leaving no room for confusion. The visualization at the center of each scene draws attention and highlights the important data which the user interacts with to uncover the answer to the question posed by the scene. Arrow buttons mark the clear transition to the next or previous slides.

# Scenes

There are 3 scenes: an comparison of car makes and their mileage, a distribution of fuel types and their average highway MPG, and an exploration of the relationship between engine cylinders and city MPG. The scenes are ordered in order of relevance, starting with the broad aspect of car makes and ending with the specific aspect of engine cylinder count.

# Annotations

Annotations in the narrative visualization all provide vital information, with data labels that provide concise information when hovering over elements. Annotations change within each scene to always provide further context to data points a user is examining.

# Parameters

The main parameters in the narrative visualization are the state variables that control which scene is currently displayed. This was done in JavaScript and various functions such as showSlide, nextSlide, and previousSlide. Each slide calls a specific function that renders the appropriate scene.

# Triggers

User events and callbacks such as mouse hovering, clicking, or button presses are used to implement triggers. When received accordingly, these triggers change the visualization based on the specified action. One example of this is moving to the next slide when the user presses the right arrow key.

