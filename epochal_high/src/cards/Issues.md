# Issues

## Templates

+ Icon paths are set in the templates. This is really annoying, when implementing again, because it must be changed at several positions. It would be more straightforward, if the icons are updated inside the templates via code.

## Visual

+ Icons of submaps are not hidden. if near the top, they are already visible on the CardBack.

## Code

+ assetsPath is not accessible. Severin transformed it to a getter to override it in the subclass (Not a clean solution). 

## Behaviour

+ Size of backside does not matter: When turning front to back, the backside always has the same size. Turning from back to front, the frontside returns to it's scaled size (Severin thinks this is the desired behaviour)
		- The flipping should be consistent, that at least the backside also is scaled to it's previous size
		- Another approach would be to force the sizes of front and backside to be the same (at least height), which would support the card analogy better.
+ Scaling while turning is visualized but not ignored. The user can scale the flippable while flipping, resulting in a sudden change in size when the animation is completed.
		- Easiest solution is, that the scaling is prevented while flipping. Severin believes that it would not harm the user experience, as it's only a very short duration.
		- On the other hand the scaling could be applied to the opposite side, making the behaviour more fluently. 
