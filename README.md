# Commandomizer
Magic the Gathering's latest format, random commander.

# How to
Download and run `npm start -- --fetch --rebuild`, this builds all the jsons required to make this quick and easy
Then, run `npm start`. This will create a random deck in the `cockatrice.txt` and `archidekt.txt` files

# What does this do?
The build process breaks down the cards into a handful of useful store files that allows the code to quickly load things and then generate decks. The deck is made by selecting a commander, checking its color identity and then loads a number of cards (59-63) in that color identity. Then it builds a mana base (based on Tolerian Community College Prof's suggestions) of between 36-40 cards. The format is jank, it's meant to be jank. The only thing we wanted to be consistent was the amount and type of lands. We might at some point in the future add consistent mana rocks, but so far it feels better for good artifacts to be random and epic when you see them.

There are some things that have not been planned for either, like when a commander has partner. They're still alone, it might be fun at some point to add partners.

# Known issues
1. There is TRUE randomness in the deck building portion. It might be completely unplayable. The mana fixes itself as best it can with basics, but it's not checking color balancing in your cards. It's Jank. Check the deck with the archidekt list to just ensure that it's not completely unplayable before running headlong into a boring game where you never get to play any cards because the mana base is tricolor and your deck is fully out of whack.
2. Unsets are generally ignored, because this is still commander the cards that aren't legal in commander are removed, but there are some legal unfinity cards. I know that they add extra mechanics and require the use of an attractions deck. I'll solve for that later, or maybe one of you wonderful people know enough to solve for that.
3. Sideboards... there's a handful of "from outside the game" cards as well as the learn/lession mechanics... I know. I'm going to figure it out or maybe not. If there's enough pain around it, I'll solve it, or if someone has any suggestion I might tackle it.
4. I'm a magic noob. I don't know a lot of stuff. I just recently learned that there are commanders that make you pick a color (has been fixed AFAIK). There's probably a lot of stuff that's not properly planned for and will cause deck building issues. Please report those as issues as you encounter them. 