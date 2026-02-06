// Battle data for Civil War Battle Simulation
// Each battle contains historical context, strategies, and outcomes for both sides

const battles = [
    {
        name: "First Battle of Bull Run",
        date: "July 21, 1861",
        imageUrl: "images/battle_of_bull_run.jpg",
        imageCredit: "Kurz & Allison, 1889",
        context: "🎪 <strong>The Battle That Shocked America!</strong><br><br>This was the first major battle of the Civil War, and nobody knew what to expect. Both armies were mostly volunteers who had never seen real combat. Incredibly, hundreds of people from Washington D.C. packed picnic baskets and came out to watch like it was a sporting event!<br><br>The battle took place near a small creek called Bull Run in Virginia, just 30 miles from the nation's capital. Everyone thought one big fight would end the war quickly. They were very, very wrong. The reality of war hit hard when inexperienced soldiers on both sides panicked and ran. This wake-up call showed Americans that the Civil War would be long, bloody, and devastating.",
        strategies: [
            {
                name: "Direct Attack",
                description: "Order your troops to march straight at the enemy and attack their main force",
                explanation: "This is the most straightforward approach - no fancy moves, just advance and fight. It can work if you have more soldiers or better equipment.",
                pros: ["Simple to understand and execute", "Can overwhelm a weaker enemy", "Shows courage and determination"],
                cons: ["Enemy can see you coming", "You might take heavy casualties", "No element of surprise"],
                union: { win: false, soldierLoss: 2900, scoreGain: 100 },
                confederacy: { win: true, soldierLoss: 2000, scoreGain: 400 }
            },
            {
                name: "Defensive Position",
                description: "Have your army dig in and wait for the enemy to attack you",
                explanation: "Defense means letting the enemy come to you while you're in a strong position. Soldiers behind <span class='vocab-term'>fortifications<span class='vocab-tooltip'><div class='vocab-definition'>Structures built to defend against attack</div></span></span> are much harder to defeat.",
                pros: ["Harder for enemy to hurt you", "You can choose the best ground", "Saves energy and supplies"],
                cons: ["You give up the initiative", "Enemy might go around you", "Doesn't win territory"],
                union: { win: false, soldierLoss: 2500, scoreGain: 200 },
                confederacy: { win: true, soldierLoss: 1500, scoreGain: 300 }
            },
            {
                name: "Flanking Movement",
                description: "Try to march around the enemy's side and attack them from an unexpected direction",
                explanation: "A <span class='vocab-term'>flanking<span class='vocab-tooltip'><div class='vocab-definition'>A military tactic of attacking the sides of an enemy formation</div></span></span> attack can surprise the enemy and force them to fight in two directions at once. It's risky because it splits your forces.",
                pros: ["Element of surprise", "Can confuse the enemy", "Might cause enemy to retreat quickly"],
                cons: ["Complex to coordinate", "Takes more time", "If it fails, you're in trouble"],
                union: { win: false, soldierLoss: 2700, scoreGain: 150 },
                confederacy: { win: true, soldierLoss: 1900, scoreGain: 350 }
            }
        ],
        results: {
            union_loss: "The Union army was defeated in their first major battle. Many soldiers panicked and ran back toward Washington D.C., mixing with the civilians who had come to watch. This showed both sides that the war would not be over quickly.",
            confederacy_victory: "The Confederate forces successfully defended Virginia and gained confidence that they could defeat the larger Union army. However, they were too disorganized to pursue the retreating Union forces back to Washington."
        },
        historical_notes: {
            general: "This battle convinced both North and South that the war would last longer than expected. It led to both sides recruiting larger, better-trained armies."
        }
    },
    {
        name: "Battle of Shiloh",
        date: "April 6-7, 1862",
        imageUrl: "images/battle_of_shiloh.jpg",
        imageCredit: "Thure de Thulstrup, 1888",
        context: "General Ulysses S. Grant's Union army was camping near Shiloh Church in Tennessee when Confederate forces launched a surprise dawn attack. The Confederates hoped to destroy Grant's army before <span class='vocab-term'>reinforcements<span class='vocab-tooltip'><div class='vocab-definition'>Additional troops sent to strengthen a military force</div></span></span> could arrive. This was one of the bloodiest battles so far in the war.",
        strategies: [
            {
                name: "Immediate Counterattack",
                description: "Rally your surprised troops and attack back as quickly as possible",
                explanation: "When you're surprised, sometimes the best defense is a quick offense. This can stop the enemy's momentum and show your soldiers you're still in control.",
                pros: ["Stops enemy momentum", "Shows leadership", "Can turn surprise into opportunity"],
                cons: ["Troops might be confused", "Haven't had time to plan", "Could lead to heavy losses"],
                union: { win: true, soldierLoss: 40000, scoreGain: 400 },
                confederacy: { win: false, soldierLoss: 55000, scoreGain: 150 }
            },
            {
                name: "Form Defensive Lines",
                description: "Organize your scattered forces into strong defensive positions",
                explanation: "Getting organized and forming a solid line can stop a surprise attack. This gives you time to figure out what's happening and plan your next move.",
                pros: ["Stops the panic", "Creates organized resistance", "Gives time to think"],
                cons: ["Takes time you might not have", "Gives enemy more initiative", "Might seem like retreating"],
                union: { win: true, soldierLoss: 35000, scoreGain: 350 },
                confederacy: { win: false, soldierLoss: 45000, scoreGain: 200 }
            },
            {
                name: "Strategic Retreat",
                description: "Pull back to a better position and regroup your forces",
                explanation: "Sometimes <span class='vocab-term'>retreating<span class='vocab-tooltip'><div class='vocab-definition'>Moving forces away from battle to a safer position</div></span></span> to better ground is the smart choice. It can save lives and let you fight on your terms.",
                pros: ["Saves soldier's lives", "Gets you to better ground", "Gives time to plan"],
                cons: ["Looks like giving up", "Enemy gains territory", "Hard to stop once started"],
                union: { win: false, soldierLoss: 30000, scoreGain: 150 },
                confederacy: { win: true, soldierLoss: 25000, scoreGain: 400 }
            }
        ],
        results: {
            union_victory: "Despite being surprised, Union forces managed to hold their ground and eventually push back the Confederate attack when reinforcements arrived the next day.",
            confederacy_defeat: "The Confederate surprise attack initially succeeded, but they couldn't finish off Grant's army before Union reinforcements arrived, turning victory into defeat."
        },
        historical_notes: {
            general: "This battle showed the importance of communication and coordination. It also demonstrated that the war was becoming more deadly - over 23,000 total casualties shocked both sides."
        }
    },
    {
        name: "Battle of Antietam",
        date: "September 17, 1862",
        imageUrl: "images/battle_of_antietam.jpg",
        imageCredit: "Kurz & Allison, 1888",
        context: "Robert E. Lee's Confederate army invaded Maryland, hoping to bring the war to Union territory and maybe convince European countries to help the South. But Union forces found Lee's battle plans wrapped around some cigars! Now General McClellan knows exactly where Lee's forces are positioned. This could be the chance to end the rebellion.",
        strategies: [
            {
                name: "Coordinated Assault",
                description: "Use your knowledge of enemy positions to attack multiple points at once",
                explanation: "Since you know where the enemy is, you can hit them everywhere at the same time. This prevents them from moving troops to help each other.",
                pros: ["Enemy can't reinforce weak spots", "Uses your intelligence advantage", "Could end the war quickly"],
                cons: ["Complex coordination required", "If one attack fails, all might fail", "Spreads your forces thin"],
                union: { win: true, soldierLoss: 50000, scoreGain: 500 },
                confederacy: { win: false, soldierLoss: 45000, scoreGain: 150 }
            },
            {
                name: "Cautious Advance",
                description: "Move slowly and carefully, making sure each position is secure",
                explanation: "Even with enemy plans, battles are dangerous. Moving carefully ensures you don't fall into any traps and can retreat if needed.",
                pros: ["Reduces risk of disaster", "Keeps army intact", "Maintains steady pressure"],
                cons: ["Gives enemy time to react", "Might miss opportunities", "Could drag out the battle"],
                union: { win: true, soldierLoss: 35000, scoreGain: 300 },
                confederacy: { win: false, soldierLoss: 35000, scoreGain: 200 }
            },
            {
                name: "Focus on Escape Routes",
                description: "Try to cut off the Confederate army's retreat back to Virginia",
                explanation: "Instead of just winning the battle, try to trap Lee's entire army. This could capture thousands of Confederate soldiers and end the war.",
                pros: ["Could capture entire enemy army", "Would end the war quickly", "Prevents enemy from escaping"],
                cons: ["Very difficult to execute", "Enemy might fight harder when trapped", "Risky if it fails"],
                union: { win: true, soldierLoss: 60000, scoreGain: 600 },
                confederacy: { win: false, soldierLoss: 55000, scoreGain: 100 }
            }
        ],
        results: {
            union_victory: "The Union army successfully used their intelligence advantage to defeat Lee's invasion. The Confederate army was forced to retreat back to Virginia.",
            confederacy_defeat: "Despite fighting bravely, the Confederate army was outmaneuvered and forced to abandon their invasion of the North."
        },
        historical_notes: {
            general: "This was the bloodiest single day in American military history, with over 22,000 casualties. The Union victory convinced European countries not to recognize the Confederacy."
        }
    },
    {
        name: "Battle of Gettysburg",
        date: "July 1-3, 1863",
        imageUrl: "images/battle_of_gettysburg.jpg",
        imageCredit: "Thure de Thulstrup, 1887",
        context: "This three-day battle in Pennsylvania is often called the turning point of the Civil War. Robert E. Lee's Confederate army had invaded the North, hoping a victory on Union soil would convince other countries to help the Confederacy and maybe end the war. The battle started by accident when Confederate soldiers looking for shoes encountered Union cavalry in the town of Gettysburg.",
        strategies: [
            {
                name: "Hold the High Ground",
                description: "Keep your forces on the hills and ridges around Gettysburg",
                explanation: "High ground gives you huge advantages in battle - you can see farther, your cannons shoot farther, and it's harder for enemies to attack uphill. Cemetery Ridge and Little Round Top were key positions.",
                pros: ["Artillery advantage", "Better visibility", "Harder to attack uphill"],
                cons: ["Enemy might go around you", "Limited to defensive actions", "Harder to get supplies uphill"],
                union: { win: true, soldierLoss: 35000, scoreGain: 600 },
                confederacy: { win: false, soldierLoss: 50000, scoreGain: 150 }
            },
            {
                name: "Attack the Center",
                description: "Launch a massive assault on the enemy's main battle line",
                explanation: "Sometimes a bold attack right at the enemy's strongest point can work - if you break through the center, you split their army in half. This is what 'Pickett's Charge' attempted to do.",
                pros: ["If successful, splits enemy army", "Shows maximum courage", "Quick decision"],
                cons: ["Attacking uphill is very difficult", "Heavy casualties expected", "Enemy can concentrate fire"],
                union: { win: true, soldierLoss: 40000, scoreGain: 500 },
                confederacy: { win: false, soldierLoss: 60000, scoreGain: 100 }
            },
            {
                name: "Flanking Maneuver",
                description: "Try to attack around the enemy's sides or behind them",
                explanation: "Instead of attacking where the enemy expects, try to get around to their flanks or rear. This worked well for Lee in earlier battles, but the terrain at Gettysburg made it harder.",
                pros: ["Avoids strongest defenses", "Can cause panic", "Element of surprise"],
                cons: ["Takes time and coordination", "Terrain might not allow it", "Leaves your own flanks exposed"],
                union: { win: true, soldierLoss: 30000, scoreGain: 550 },
                confederacy: { win: false, soldierLoss: 45000, scoreGain: 200 }
            }
        ],
        results: {
            union_victory: "The Union army successfully defended their positions over three days. The famous 'Pickett's Charge' on the final day was repulsed with heavy Confederate losses, forcing Lee to retreat back to Virginia.",
            confederacy_defeat: "Lee's invasion of the North failed. The Confederate army suffered over 25,000 casualties and was forced to retreat. This marked the beginning of the end for Confederate hopes of victory."
        },
        historical_notes: {
            general: "Gettysburg is often called the turning point of the Civil War. After this defeat, the Confederacy would mostly fight defensive battles. President Lincoln later gave his famous Gettysburg Address at the dedication of the battlefield cemetery."
        }
    },
    {
        name: "Battle of Fredericksburg",
        date: "December 13, 1862",
        imageUrl: "images/battle_of_fredericksburg.jpg",
        imageCredit: "Kurz & Allison, 1888",
        context: "General Burnside's Union army must cross the Rappahannock River and attack Confederate positions on Marye's Heights. Lee has had weeks to prepare his defenses, including a stone wall that creates a perfect <span class='vocab-term'>fortification<span class='vocab-tooltip'><div class='vocab-definition'>A structure built to defend against attack</div></span></span>. The Confederates have the high ground and are well-prepared.",
        strategies: [
            {
                name: "Direct Assault",
                description: "Attack the Confederate positions on Marye's Heights head-on",
                explanation: "Sometimes courage and determination can overcome defensive advantages. A direct attack shows your soldiers you're committed to victory.",
                pros: ["Shows determination", "Simple to execute", "Could overwhelm defenses"],
                cons: ["Attacking uphill against fortifications", "Enemy has had time to prepare", "Likely to cause heavy casualties"],
                union: { win: false, soldierLoss: 70000, scoreGain: 50 },
                confederacy: { win: true, soldierLoss: 10000, scoreGain: 500 }
            },
            {
                name: "Artillery Bombardment First",
                description: "Use your cannons to soften enemy defenses before attacking",
                explanation: "Cannon fire can damage enemy fortifications and force defenders to keep their heads down. This might make an assault more successful.",
                pros: ["Weakens enemy defenses", "Provides cover for advancing troops", "Uses your artillery advantage"],
                cons: ["Gives enemy warning", "Might not be effective against stone walls", "Uses up ammunition"],
                union: { win: false, soldierLoss: 55000, scoreGain: 100 },
                confederacy: { win: true, soldierLoss: 15000, scoreGain: 400 }
            },
            {
                name: "Find Alternative Crossing",
                description: "Look for another way to cross the river and avoid the prepared defenses",
                explanation: "Instead of attacking where the enemy expects, try to find a different route. This takes time but might avoid the strongest defenses.",
                pros: ["Avoids strongest enemy positions", "Element of surprise", "Could get behind enemy lines"],
                cons: ["Takes more time", "Other crossings might be defended too", "Difficult in winter weather"],
                union: { win: false, soldierLoss: 40000, scoreGain: 200 },
                confederacy: { win: true, soldierLoss: 20000, scoreGain: 350 }
            }
        ],
        results: {
            union_loss: "The Union attacks failed with terrible losses. Wave after wave of brave soldiers fell before the Confederate defenses. Burnside was soon replaced as commander.",
            confederacy_victory: "Confederate forces held their strong defensive positions and inflicted heavy casualties on the attacking Union forces. The stone wall at Marye's Heights proved nearly impregnable."
        },
        historical_notes: {
            general: "This battle showed the deadly effectiveness of defensive positions in the Civil War. The improved weapons of the 1860s made frontal assaults extremely costly."
        }
    },
    {
        name: "Battle of Chancellorsville",
        date: "May 2-4, 1863",
        imageUrl: "images/battle_of_chancellorsville.jpg",
        imageCredit: "Kurz & Allison, 1888",
        context: "General Hooker's large Union army faces Lee in the tangled wilderness of Virginia. Despite being outnumbered 2-to-1, Lee plans his most daring move yet: splitting his already smaller army to send Stonewall Jackson on a <span class='vocab-term'>flanking<span class='vocab-tooltip'><div class='vocab-definition'>An attack on the side of an enemy formation</div></span></span> march around the Union right flank. It's incredibly risky, but it might be the only way to win.",
        strategies: [
            {
                name: "Hold Defensive Positions",
                description: "Stay in your strong positions and let the enemy come to you",
                explanation: "You have more soldiers and good defensive positions. Let Lee make the risky moves while you stay safe and strong.",
                pros: ["Uses your numerical advantage", "Reduces risk", "Forces enemy to attack you"],
                cons: ["Gives up initiative", "Enemy might outmaneuver you", "Doesn't press your advantages"],
                union: { win: false, soldierLoss: 45000, scoreGain: 200 },
                confederacy: { win: true, soldierLoss: 30000, scoreGain: 450 }
            },
            {
                name: "Attack While Enemy is Divided",
                description: "Strike hard while Lee's army is split in two",
                explanation: "Lee has taken a huge risk by dividing his smaller army. If you attack quickly, you might destroy part of his force before they can reunite.",
                pros: ["Enemy is vulnerable while divided", "Could destroy part of enemy army", "Takes advantage of enemy's risk"],
                cons: ["Difficult to coordinate in the wilderness", "Might fall into a trap", "Could be caught by Jackson's flanking force"],
                union: { win: true, soldierLoss: 40000, scoreGain: 500 },
                confederacy: { win: false, soldierLoss: 35000, scoreGain: 150 }
            },
            {
                name: "Withdraw to Open Ground",
                description: "Pull back out of the wilderness to fight in more open terrain",
                explanation: "The dense forest helps Lee's smaller army hide their movements. In open ground, your larger army would have more advantages.",
                pros: ["Better terrain for larger army", "Easier to coordinate", "Reduces Lee's advantages"],
                cons: ["Looks like retreating", "Gives up current positions", "Might encourage enemy"],
                union: { win: false, soldierLoss: 35000, scoreGain: 250 },
                confederacy: { win: true, soldierLoss: 25000, scoreGain: 400 }
            }
        ],
        results: {
            union_loss: "Jackson's surprise flank attack succeeded brilliantly, routing part of the Union army. However, Jackson was accidentally shot by his own men and died, a huge loss for the Confederacy.",
            confederacy_victory: "Lee and Jackson's bold plan worked perfectly, defeating a much larger enemy force. But the victory came at a terrible cost when Jackson was mortally wounded by friendly fire."
        },
        historical_notes: {
            general: "This battle is considered Lee's masterpiece of tactical brilliance. However, the death of Stonewall Jackson was a blow from which the Confederate army never recovered."
        }
    },
    {
        name: "Battle of Chickamauga",
        date: "September 19-20, 1863",
        imageUrl: "images/battle_of_chickamauga.jpg",
        imageCredit: "Kurz & Allison, 1890",
        context: "In the forests of northern Georgia, Confederate General Bragg's army has caught Union General Rosecrans' forces spread out and vulnerable. The thick woods make it hard to see what's happening, and both sides are confused. A mistake in Union orders has created a gap in their battle line - but will the Confederates be able to exploit it?",
        strategies: [
            {
                name: "Exploit the Gap",
                description: "Pour troops through the opening in the enemy line",
                explanation: "A gap in the enemy line is like an open door - if you can get troops through it quickly, you can attack the enemy from behind and cause panic.",
                pros: ["Could cause enemy collapse", "Attacks enemy from behind", "Creates confusion in enemy ranks"],
                cons: ["Gap might be a trap", "Could get isolated", "Difficult to coordinate in thick forest"],
                union: { win: false, soldierLoss: 55000, scoreGain: 100 },
                confederacy: { win: true, soldierLoss: 35000, scoreGain: 500 }
            },
            {
                name: "Steady Pressure",
                description: "Attack all along the enemy line with coordinated pressure",
                explanation: "Instead of gambling everything on one attack, apply pressure everywhere. This is safer and might find other weak points.",
                pros: ["Reduces risk", "Tests entire enemy line", "Harder for enemy to concentrate defense"],
                cons: ["Doesn't exploit specific advantages", "Might not achieve breakthrough", "Could lead to stalemate"],
                union: { win: false, soldierLoss: 40000, scoreGain: 200 },
                confederacy: { win: true, soldierLoss: 30000, scoreGain: 400 }
            },
            {
                name: "Defensive Stand",
                description: "Form strong defensive positions and let the enemy attack you",
                explanation: "The confusion in the forest affects both sides. Sometimes the best move is to get organized and make the enemy come to you.",
                pros: ["Reduces confusion", "Uses defensive advantages", "Conserves strength"],
                cons: ["Gives up initiative", "Might miss opportunities", "Could allow enemy to escape"],
                union: { win: false, soldierLoss: 35000, scoreGain: 250 },
                confederacy: { win: true, soldierLoss: 25000, scoreGain: 350 }
            }
        ],
        results: {
            union_loss: "The Confederate breakthrough shattered part of the Union army, forcing them to retreat toward Chattanooga. Only General Thomas's heroic stand prevented complete disaster.",
            confederacy_victory: "Longstreet's corps smashed through the gap in Union lines, achieving one of the Confederacy's greatest tactical victories. However, they couldn't pursue effectively due to the difficult terrain."
        },
        historical_notes: {
            general: "This was one of the Confederacy's last major victories, but they failed to destroy the Union army completely. The Union retreat to Chattanooga led to a siege that would eventually favor the North."
        }
    },
    {
        name: "Battle of the Wilderness",
        date: "May 5-6, 1864",
        imageUrl: "images/battle_of_the_wilderness.jpg",
        imageCredit: "Kurz & Allison",
        context: "General Grant begins his campaign to end the war by fighting Lee continuously. The battle takes place in the same tangled Virginia wilderness where Hooker was defeated a year earlier. The thick undergrowth makes it almost impossible to see, and forest fires threaten to burn wounded soldiers alive. Grant is determined to keep fighting unlike previous Union commanders.",
        strategies: [
            {
                name: "Push Through Despite Losses",
                description: "Keep attacking regardless of casualties to maintain pressure",
                explanation: "Grant's strategy is to use the Union's advantage in numbers and supplies. Keep fighting and don't give Lee time to rest or maneuver.",
                pros: ["Maintains constant pressure", "Uses numerical advantage", "Prevents enemy maneuvers"],
                cons: ["Heavy casualties expected", "Forest fires create danger", "Difficult to coordinate in thick woods"],
                union: { win: true, soldierLoss: 55000, scoreGain: 400 },
                confederacy: { win: false, soldierLoss: 35000, scoreGain: 200 }
            },
            {
                name: "Try to Outmaneuver",
                description: "Move around the Confederate flanks instead of direct assault",
                explanation: "Even in the wilderness, there might be ways to get around the enemy instead of fighting through them head-on.",
                pros: ["Avoids strongest defenses", "Could get behind enemy", "Saves casualties"],
                cons: ["Difficult in thick terrain", "Lee is expert at this kind of fighting", "Takes more time"],
                union: { win: false, soldierLoss: 45000, scoreGain: 250 },
                confederacy: { win: true, soldierLoss: 30000, scoreGain: 450 }
            },
            {
                name: "Wait for Better Terrain",
                description: "Try to draw Lee out of the wilderness to more favorable ground",
                explanation: "The wilderness helps Lee's smaller army. If you can get him to fight in open ground, your advantages in numbers and artillery would be greater.",
                pros: ["Better terrain for larger army", "Reduces Lee's advantages", "Safer for your forces"],
                cons: ["Gives Lee initiative", "Might look like retreating", "Lee might not cooperate"],
                union: { win: false, soldierLoss: 35000, scoreGain: 200 },
                confederacy: { win: true, soldierLoss: 25000, scoreGain: 400 }
            }
        ],
        results: {
            union_victory: "Despite heavy losses, Grant achieved his goal of keeping Lee's army engaged. Unlike previous Union commanders, Grant continued south instead of retreating.",
            confederacy_defeat: "Lee fought brilliantly in familiar terrain, but couldn't stop Grant's relentless advance. For the first time, a Union commander wouldn't be stopped by tactical defeats."
        },
        historical_notes: {
            general: "This battle marked a new phase of the war. Grant's strategy of continuous fighting, regardless of individual battle outcomes, began the final grinding down of Confederate resistance."
        }
    },
    {
        name: "Battle of Atlanta",
        date: "July 22, 1864",
        imageUrl: "images/battle_of_atlanta.jpg",
        imageCredit: "Kurz & Allison, 1888",
        context: "General Sherman's Union army threatens Atlanta, the industrial heart of the Confederacy. The city's factories produce weapons and supplies for Confederate armies, and its railroads connect the eastern and western parts of the South. Confederate General Hood has replaced the cautious Johnston and wants to attack Sherman's forces before they can capture the city.",
        strategies: [
            {
                name: "Defend the City",
                description: "Fortify Atlanta and make Sherman attack your prepared positions",
                explanation: "Cities provide natural fortifications, and Atlanta's buildings and streets could help defenders. Make Sherman pay heavily for every block.",
                pros: ["Uses urban defenses", "Protects vital industry", "Forces enemy to attack"],
                cons: ["Could damage the city", "Civilians in danger", "If you lose, you lose everything"],
                union: { win: true, soldierLoss: 30000, scoreGain: 550 },
                confederacy: { win: false, soldierLoss: 45000, scoreGain: 150 }
            },
            {
                name: "Attack Sherman's Supply Lines",
                description: "Strike at the railroad lines bringing Sherman supplies",
                explanation: "Armies need constant supplies of food and ammunition. If you can cut Sherman's supply lines, he might have to retreat.",
                pros: ["Attacks enemy weakness", "Could force retreat", "Preserves your army"],
                cons: ["Leaves Atlanta less defended", "Sherman might have enough supplies", "Cavalry raids are risky"],
                union: { win: true, soldierLoss: 25000, scoreGain: 500 },
                confederacy: { win: false, soldierLoss: 35000, scoreGain: 200 }
            },
            {
                name: "Aggressive Field Battle",
                description: "Attack Sherman's army in open battle before they reach Atlanta",
                explanation: "Instead of waiting for a siege, attack Sherman while his army is spread out marching. This could catch them unprepared.",
                pros: ["Takes initiative", "Could catch enemy unprepared", "Keeps battle away from city"],
                cons: ["Sherman has more troops", "Risky without defensive advantages", "Could lose your army"],
                union: { win: true, soldierLoss: 35000, scoreGain: 450 },
                confederacy: { win: false, soldierLoss: 50000, scoreGain: 100 }
            }
        ],
        results: {
            union_victory: "Sherman's forces captured Atlanta after defeating Confederate attempts to stop them. The fall of this vital Confederate city was a huge blow to Southern morale.",
            confederacy_defeat: "Despite brave fighting, Confederate forces couldn't prevent the fall of Atlanta. The loss of this industrial center and railroad hub severely damaged the Confederate cause."
        },
        historical_notes: {
            general: "The Battle of Atlanta on July 22, 1864 was a major Union tactical victory, but the city didn't fall until September 2. Sherman's capture of Atlanta was crucial to Lincoln's re-election in 1864. His famous telegram 'Atlanta is ours, and fairly won' helped convince Northern voters that the war could be won."
        }
    },
    {
        name: "Battle of Appomattox Court House",
        date: "April 9, 1865",
        imageUrl: "images/surrender_appomattox.jpg",
        imageCredit: "Tom Lovell",
        context: "This is the end. Lee's Confederate army, hungry and exhausted, is surrounded near the small Virginia town of Appomattox Court House. Grant's forces have cut off their escape routes. Lee has perhaps 28,000 men left, while Grant has over 100,000. The Confederate cause is clearly lost, but some want to fight to the end while others think it's time to surrender and save lives.",
        strategies: [
            {
                name: "Fight to the End",
                description: "Continue fighting despite impossible odds",
                explanation: "Some believe that surrender would dishonor the sacrifices already made. Fighting to the last man shows ultimate commitment to the cause.",
                pros: ["Preserves honor", "Shows commitment", "Might inspire others"],
                cons: ["Pointless loss of life", "Cause is already lost", "Could make peace terms worse"],
                union: { win: true, soldierLoss: 15000, scoreGain: 600 },
                confederacy: { win: false, soldierLoss: 25000, scoreGain: 50 }
            },
            {
                name: "Attempt Breakout",
                description: "Try to punch through Union lines and escape",
                explanation: "Maybe there's still a chance to get away and continue the fight elsewhere. Even if most don't make it, some might escape to fight another day.",
                pros: ["Might save part of the army", "Could continue resistance", "Avoids surrender"],
                cons: ["Very unlikely to succeed", "Would cause more casualties", "Most would be captured anyway"],
                union: { win: true, soldierLoss: 10000, scoreGain: 550 },
                confederacy: { win: false, soldierLoss: 20000, scoreGain: 100 }
            },
            {
                name: "Honorable Surrender",
                description: "Negotiate surrender terms to save your soldiers' lives",
                explanation: "The cause is lost, but the lives of your remaining soldiers are precious. An honorable surrender might allow them to go home to rebuild the South.",
                pros: ["Saves lives", "Allows honorable end", "Soldiers can go home", "Begins healing process"],
                cons: ["Admits defeat", "Ends the Confederate cause", "Some will see it as giving up"],
                union: { win: true, soldierLoss: 0, scoreGain: 800 },
                confederacy: { win: false, soldierLoss: 0, scoreGain: 400 }
            }
        ],
        results: {
            union_victory: "Lee chose to surrender to prevent further bloodshed. Grant's generous terms allowed Confederate soldiers to keep their horses and personal weapons, helping begin the healing process.",
            confederacy_defeat: "The Army of Northern Virginia surrendered, effectively ending the Civil War. Lee's decision to surrender rather than fight a hopeless battle saved thousands of lives."
        },
        historical_notes: {
            general: "Lee's surrender at Appomattox effectively ended the Civil War. Grant's generous terms and both commanders' dignified behavior helped set a tone for reunification rather than revenge."
        }
    }
];
