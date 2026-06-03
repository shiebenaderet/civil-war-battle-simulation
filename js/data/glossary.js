// Vocabulary glossary for click-to-define tooltips (v3.19).
// Terms the teacher covers in this unit. The auto-linker (applyGlossary in ui.js)
// scans rendered game text and wraps matches in clickable .vocab-term spans.
//
// tier:
//   'common'      -> link the FIRST occurrence per screen only, whole-word.
//                    (high-frequency words that would otherwise become link-soup)
//   'distinctive' -> link EVERY occurrence (rare enough that it won't clutter)
//
// matchCase:
//   true  -> case-SENSITIVE whole match (e.g. USCT must be uppercase, not "usct")
//   (default false) -> case-insensitive
//
// aliases: extra strings that should also match this term (e.g. "Lincoln" for
//   "Abraham Lincoln"). Each alias inherits the term's tier unless noted.
//
// Longer terms are matched BEFORE shorter ones so "Battle of Gettysburg" wins
// over "Gettysburg" — the linker sorts by length descending.

var glossary = [
    { term: "Fort Sumter", tier: "distinctive",
      definition: "A federal fort in Charleston Harbor that Confederate forces fired on in April 1861, beginning the Civil War." },

    { term: "Battle of Antietam", tier: "distinctive", aliases: ["Antietam"],
      definition: "A September 1862 battle in Maryland that stopped Lee's first invasion of the North and remains the bloodiest single day in American history." },

    { term: "Siege of Vicksburg", tier: "distinctive", aliases: ["Vicksburg"],
      definition: "A 47 day Union siege of the Confederate stronghold at Vicksburg, Mississippi, ending July 4, 1863, that gave the Union control of the Mississippi River." },

    { term: "Battle of Gettysburg", tier: "distinctive", aliases: ["Gettysburg"],
      definition: "A three day July 1863 battle in Pennsylvania that turned back Lee's second invasion of the North; the largest battle ever fought on American soil." },

    { term: "Appomattox", tier: "distinctive",
      definition: "The Virginia courthouse where Confederate General Robert E. Lee surrendered to Union General Ulysses S. Grant on April 9, 1865, ending the Civil War." },

    { term: "Abraham Lincoln", tier: "common", aliases: ["Lincoln"],
      definition: "The 16th president of the United States, who led the Union through the Civil War and was assassinated five days after Lee's surrender." },

    { term: "Jefferson Davis", tier: "common", aliases: ["Davis"],
      definition: "The president of the Confederate States of America for the entire Civil War." },

    { term: "Robert E. Lee", tier: "common", aliases: ["Lee"],
      definition: "The most famous Confederate general, who commanded the Army of Northern Virginia and surrendered to Grant at Appomattox in April 1865." },

    { term: "Ulysses S. Grant", tier: "common", aliases: ["Grant"],
      definition: "The Union general who led the United States to victory in the Civil War, accepted Lee's surrender at Appomattox, and later became the 18th president." },

    { term: "William T. Sherman", tier: "common", aliases: ["Sherman"],
      definition: "A Union general whose March to the Sea through Georgia in 1864 destroyed the South's ability to keep fighting; pioneer of total war." },

    { term: "Emancipation Proclamation", tier: "distinctive",
      definition: "An executive order issued by Lincoln on January 1, 1863, that declared all enslaved people in Confederate states to be free." },

    { term: "Gettysburg Address", tier: "distinctive",
      definition: "A short speech Lincoln gave on November 19, 1863, that redefined the war as a fight for human equality and democracy." },

    { term: "total war", tier: "distinctive",
      definition: "A military strategy that attacks not just enemy soldiers but also the resources, supplies, and infrastructure that armies need to fight." },

    { term: "54th Massachusetts", tier: "distinctive",
      definition: "One of the first official Black regiments in the Union Army, famous for its 1863 assault on Fort Wagner in South Carolina." },

    { term: "13th Amendment", tier: "distinctive",
      definition: "An amendment to the United States Constitution, ratified in December 1865, that abolished slavery throughout the entire country." },

    { term: "Stonewall Jackson", tier: "distinctive", aliases: ["Jackson"],
      definition: "A famous Confederate general under Lee, who earned his nickname for standing firm under fire at the First Battle of Bull Run." },

    { term: "Clara Barton", tier: "distinctive",
      definition: "A volunteer nurse who treated wounded soldiers on Civil War battlefields and later founded the American Red Cross." },

    { term: "Minie ball", tier: "distinctive", aliases: ["Minié ball", "Minie balls", "Minié balls"],
      definition: "A new type of Civil War bullet that expanded when fired and could hit a target accurately from 500 yards away." },

    { term: "USCT", tier: "distinctive", matchCase: true,
      definition: "United States Colored Troops, the official designation for regiments of Black soldiers in the Union Army." },

    { term: "Copperheads", tier: "distinctive", aliases: ["Copperhead"],
      definition: "Northern Democrats who opposed the Civil War and called for an immediate peace settlement with the Confederacy." },

    { term: "Anaconda Plan", tier: "distinctive",
      definition: "The Union's overall war strategy of blockading Southern ports, splitting the Confederacy at the Mississippi, and slowly squeezing the South into surrender." },

    { term: "Union", tier: "common",
      definition: "The United States as one nation, often used during the Civil War to mean the North and the federal government." },

    { term: "Confederacy", tier: "common",
      definition: "The Confederate States of America, the eleven Southern states that seceded from the Union and formed their own nation in 1861." },

    { term: "Bull Run", tier: "common",
      definition: "The first major battle of the Civil War, fought in July 1861 in Virginia and won by the Confederacy." },

    { term: "habeas corpus", tier: "distinctive",
      definition: "The right of an arrested person to appear before a judge to determine whether their imprisonment is lawful." },

    { term: "Shiloh", tier: "distinctive", aliases: ["Battle of Shiloh"],
      definition: "An April 1862 battle in Tennessee with about 23,000 casualties in two days, shocking the nation with how bloody the war would be." },

    { term: "Chancellorsville", tier: "distinctive", aliases: ["Battle of Chancellorsville"],
      definition: "An 1863 Virginia battle that was Lee's greatest victory, but where his best general, Stonewall Jackson, was mortally wounded by his own men." },

    { term: "Chickamauga", tier: "distinctive", aliases: ["Battle of Chickamauga"],
      definition: "An 1863 battle in Georgia where a mixed-up Union order opened a gap in the line, giving the Confederacy one of its last major victories." },

    { term: "Atlanta", tier: "distinctive", aliases: ["Battle of Atlanta", "fall of Atlanta"],
      definition: "A key Southern city captured by Sherman in 1864; its fall boosted Northern morale and helped Lincoln win re-election." },

    { term: "Pyrrhic victory", tier: "distinctive",
      definition: "A victory that costs the winner so much that it almost feels like a defeat. Named after King Pyrrhus, who won battles but lost so many soldiers he could not keep fighting." },

    { term: "complete conquest", tier: "distinctive",
      definition: "Completely defeating the enemy by destroying its army and its ability to keep fighting, rather than just winning one battle." },

    { term: "Clausewitz", tier: "distinctive",
      definition: "Carl von Clausewitz, a famous Prussian military thinker who wrote about how chaos and chance shape real wars." },

    { term: "friction", tier: "distinctive",
      definition: "A military idea from the thinker Clausewitz: real war is full of small accidents, confusion, and mistakes that no plan can fully control." },

    { term: "Reconstruction", tier: "distinctive",
      definition: "The period after the Civil War (1865 to 1877) when the United States tried to rebuild the South and decide the rights of newly freed people." },

    { term: "reconciliation", tier: "distinctive",
      definition: "Bringing two sides back together peacefully after a conflict, instead of punishing the losing side." },

    { term: "tactical", tier: "distinctive",
      definition: "Having to do with winning a single battle: the moves and decisions made on the battlefield itself." },

    { term: "strategic", tier: "distinctive",
      definition: "Having to do with winning the whole war: the big-picture plan, not just one battle." },

    { term: "morale", tier: "distinctive",
      definition: "How confident and hopeful a group of people feels. High morale makes soldiers fight harder; low morale makes them want to give up." },

    { term: "momentum", tier: "distinctive",
      definition: "The sense that one side is winning and gaining strength, which can make it harder for the other side to recover." },

    { term: "offensive", tier: "distinctive",
      definition: "An attack: when an army moves forward to strike the enemy, instead of defending." },

    { term: "Andrew Johnson", tier: "distinctive",
      definition: "The vice president who became president after Lincoln's assassination. He was far less willing to protect the rights of freed people." },

    { term: "Radical Republicans", tier: "distinctive",
      definition: "Members of Congress after the war who pushed hardest for equal rights and protections for newly freed Black Americans." },

    { term: "peace candidate", tier: "distinctive",
      definition: "A politician who ran for office promising to end the war by making a deal with the South, instead of fighting on to victory." },

    { term: "counterfactual", tier: "distinctive",
      definition: "A 'what if' question that imagines how history might have gone differently if one thing had changed." },

    { term: "apartheid", tier: "distinctive",
      definition: "A system of harsh, legally enforced racial separation in South Africa that lasted until the early 1990s." },

    { term: "Truth and Reconciliation Commission", tier: "distinctive",
      definition: "A group set up in South Africa after apartheid to uncover past wrongs and help the country heal instead of seeking revenge." },

    { term: "post-conflict", tier: "distinctive",
      definition: "Describing a society in the period right after a war or major conflict has ended, when it must rebuild and decide how to treat former enemies." },

    { term: "masterpiece", tier: "distinctive",
      definition: "In a military sense, a battle plan carried out so skillfully that experts study it as a model of how to win." },

    { term: "postwar Germany", tier: "distinctive",
      definition: "Germany in the years after World War II, when it rebuilt and confronted the wrongs of the Nazi era - often studied as an example of a society facing its past." }

];

if (typeof module !== 'undefined' && module.exports) { module.exports = glossary; }
