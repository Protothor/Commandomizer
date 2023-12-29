# Commandomizer
Magic the Gathering's latest format, random commander.

# How to
Download and run `npm start -- --fetch --rebuild`, this builds all the jsons required to make this quick and easy
Then, run `npm start`. This will create a random deck in the `cockatrice.txt` and `archidekt.txt` files

# What does this do?
The build process breaks down the cards into a handful of useful store files that allows the code to quickly load things and then generate decks. The deck is made by selecting a commander, checking its color identity and then loads a number of cards (59-63) in that color identity. Then it builds a mana base (based on Tolerian Community College Prof's suggestions) of between 36-40 cards. The format is jank, it's meant to be jank. The only thing we wanted to be consistent was the amount and type of lands. We might at some point in the future add consistent mana rocks, but so far it feels better for good artifacts to be epic when you see them.

There are some things that have not been planned for either, like when a commander has partner. They're still alone, it might be fun at some point to add partners. 

# Known issues
Duplication can still occur because of the dual-sided cards. They are named like `"Card Name // Card Name"`. This can cause the cards with the same card on two sides to be added in their normal and double-sided format and the lands generator to add the `"spell // land"` cards, even if they've already been added during the deck generation step.

The mana pools fill up with random basics and the plan is for it to eventually match to needed pips, but it hasn't caused any issues yet, so we'll see when I get around to adding it.

I'm a magic noob. I don't know a lot of stuff. I just recently learned that there are commanders that make you pick a color (has been fixed AFAIK). There's probably a lot of stuff that's not properly planned for and will cause deck building issues. Please report those as issues as you encounter them. 