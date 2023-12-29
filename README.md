# Commandomizer
Magic the Gathering's latest format, random commander.

# How to
Download and run `npm start -- --fetch --rebuild`, this builds all the jsons required to make this quick and easy
Then, run `npm start`. This will create a random deck in the `cockatrice.txt` and `archidekt.txt` files

# Known issues
Duplication can still occur because of the dual-sided cards. They are named like `"Card Name // Card Name"`. This can cause the cards with the same card on two sides to be added in their normal and double-sided format and the lands generator to add the `"spell // land"` cards, even if they've already been added during the deck generation step.