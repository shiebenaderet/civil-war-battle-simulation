// Battle data for Civil War Battle Simulation v3.1
// 13 battles in chronological order with Historical Mode and Free-play Mode content

const battles = [
    {
        id: "fort_sumter",
        name: "Battle of Fort Sumter",
        date: "April 12-13, 1861",
        year: 1861,
        location: "Charleston Harbor, South Carolina",
        image: "images/battle_of_fort_sumter.jpg",
        imageCredit: "Currier & Ives, 1861",

        historical: {
            situation: {
                union: {
                    beginner: "You're in charge of Fort Sumter, a small fort on an island in Charleston Harbor, South Carolina. The South has left the United States, and enemy cannons surround you. You're running out of food, and a supply ship is on its way.",
                    intermediate: "You command Fort Sumter, a small federal fort sitting on an island in Charleston Harbor. South Carolina seceded months ago, and now Confederate batteries surround you. Your supplies are running out, and President Lincoln is sending a relief ship.",
                    advanced: "You command the federal garrison at Fort Sumter, an island fortress in Charleston Harbor that has become the focal point of the secession crisis. South Carolina left the Union in December 1860, and Confederate batteries now encircle your position. With provisions dwindling, Lincoln has dispatched a relief expedition \u2014 a decision that forces the Confederacy to choose between allowing resupply or firing the first shot."
                },
                confederacy: {
                    beginner: "South Carolina has left the United States, and your new Confederate government wants all U.S. forts handed over. Fort Sumter sits in the middle of Charleston Harbor. A Union supply ship is coming. If you let it through, you look weak. If you shoot, you start a war.",
                    intermediate: "South Carolina has seceded and the new Confederate government demands that all federal property be turned over. Fort Sumter sits in the middle of Charleston Harbor like a splinter. If you let a Union supply ship through, you look weak. If you fire, you start a war.",
                    advanced: "South Carolina's secession has created an intractable dilemma: Fort Sumter remains under federal control in the heart of Charleston Harbor, a symbol of Union authority that the new Confederate government cannot tolerate. Lincoln's decision to resupply the garrison forces your hand \u2014 allowing the relief expedition to succeed undermines Confederate sovereignty, yet opening fire risks alienating the border states and casting the South as the aggressor."
                }
            },
            intel: {
                union: { forces: "85 soldiers", commander: "Major Robert Anderson", advantage: "Stone fortress with thick walls" },
                confederacy: { forces: "500 soldiers, 43 cannons in surrounding batteries", commander: "General P.G.T. Beauregard", advantage: "Overwhelming firepower from all sides" }
            },
            whatWouldYouDo: {
                union: {
                    prompt: {
                        beginner: "Your fort is surrounded by enemy cannons and you're almost out of food. A supply ship is coming but might not make it. What do you do?",
                        intermediate: "Your fort is surrounded by enemy cannons and you're almost out of food. A supply ship is coming but may not get through. What do you do?",
                        advanced: "Your garrison is encircled by hostile batteries with dwindling provisions. A relief expedition is en route but may be intercepted. How do you respond to this strategic dilemma?"
                    },
                    options: {
                        beginner: ["Stay in the fort and wait for the supply ship", "Give up the fort now so nobody gets hurt", "Destroy the cannons and escape by boat at night"],
                        intermediate: ["Hold the fort and wait for the supply ship", "Surrender now to avoid bloodshed", "Try to spike the cannons and evacuate by boat at night"],
                        advanced: ["Maintain the garrison and await the relief expedition, forcing the Confederacy to fire first", "Negotiate an honorable surrender to preserve your command and avoid unnecessary casualties", "Spike the guns, destroy military stores, and attempt a nighttime naval evacuation"]
                    },
                    feedback: {
                        beginner: ["Smart thinking! That's what Major Anderson did \u2014 he held on as long as he could. The supply ship tried to come, but the Confederates started shooting first.", "That takes courage to admit. Anderson thought about this too, but he decided to hold on because giving up the fort would mean giving up on the United States.", "Creative idea! Anderson actually thought about escaping, but the Confederate cannons covered the whole harbor, so there was no safe way out."],
                        intermediate: ["That's exactly what Anderson chose. He held Fort Sumter through 34 hours of bombardment, forcing the Confederacy to fire the first shot \u2014 which unified the North overnight.", "A reasonable choice to save lives, but Anderson knew that surrendering without a fight would demoralize the North. By holding out, he turned the Confederacy into the aggressor.", "Resourceful thinking! But with Confederate batteries covering every exit from the harbor, a nighttime evacuation would have been extremely risky. Anderson chose to stand his ground instead."],
                        advanced: ["Strategically astute \u2014 this mirrors Anderson's actual decision. By forcing the Confederacy to initiate hostilities, he handed Lincoln a powerful political tool: the attack united Northern public opinion and enabled Lincoln's call for 75,000 volunteers.", "While preserving the garrison would have been militarily prudent, the political calculus demanded resistance. A voluntary surrender would have legitimized secession and demoralized Unionists across the border states.", "An audacious plan, but operationally infeasible given the Confederate battery positions covering all harbor exits. Anderson recognized that the fort's strategic value lay not in its military capability but in its symbolic importance."]
                    }
                },
                confederacy: {
                    prompt: {
                        beginner: "A Union supply ship is headed to Fort Sumter. If it gets there, the fort can hold out forever. Do you act before it arrives?",
                        intermediate: "A Union supply ship is headed for Fort Sumter. If it arrives, the fort can hold out indefinitely. Do you act before it gets there?",
                        advanced: "Lincoln's relief expedition approaches Fort Sumter. If it succeeds, the garrison can hold indefinitely, undermining Confederate authority in Charleston. How do you respond to this calculated provocation?"
                    },
                    options: {
                        beginner: ["Start shooting at the fort before the supplies arrive", "Block the harbor entrance but don't shoot unless they shoot first", "Let the supplies through to avoid starting a war"],
                        intermediate: ["Open fire on the fort before supplies arrive", "Block the harbor but hold fire unless fired upon", "Allow the supplies through to avoid starting a war"],
                        advanced: ["Commence bombardment before the relief expedition arrives, accepting responsibility for the first shot", "Establish a naval blockade of the harbor mouth while maintaining defensive posture", "Permit the resupply to proceed, prioritizing diplomatic standing over immediate military objectives"]
                    },
                    feedback: {
                        beginner: ["That's what the Confederates actually did! They started firing at 4:30 in the morning. But shooting first made the North very angry and helped Lincoln get soldiers to fight.", "Good thinking about being careful! But Confederate leaders worried that if the supply ship got through, they'd look weak. So they decided to shoot first.", "That's a peaceful choice! But Confederate President Jefferson Davis felt he couldn't allow it \u2014 if the fort stayed, it would show the Confederacy couldn't control its own land."],
                        intermediate: ["That's what happened \u2014 Beauregard opened fire at 4:30 AM. But firing first had enormous political consequences: it unified the North and gave Lincoln the justification to call up troops.", "A measured approach, but Confederate leadership feared that allowing resupply would signal weakness. The political pressure to act before the ships arrived proved irresistible.", "A wise diplomatic move, but Jefferson Davis concluded that tolerating a federal fort in Confederate territory was incompatible with sovereignty. The supply mission forced his hand."],
                        advanced: ["This mirrors Beauregard's actual decision, though the political consequences proved devastating. Lincoln had deliberately engineered the crisis so that any Confederate response would cast the South as the aggressor \u2014 a masterful piece of political strategy that the bombardment validated.", "A strategically sound middle ground, but one the Confederate government rejected. Davis understood that passive containment of a federal installation undermined the fundamental premise of Southern independence.", "Arguably the most strategically sound option, as it would have denied Lincoln his casus belli. However, Davis calculated that the political cost of inaction \u2014 appearing unable to enforce sovereignty \u2014 outweighed the diplomatic risks of firing first."]
                    }
                }
            },
            whatHappened: {
                beginner: "At 4:30 in the morning on April 12, Confederate cannons started firing at Fort Sumter from all sides. The attack lasted 34 hours. Anderson's soldiers fired back, but they were badly outnumbered. With the fort on fire and almost no ammunition (bullets and cannonballs) left, Anderson gave up on April 13.",
                intermediate: "At 4:30 AM on April 12, Confederate batteries opened fire on Fort Sumter from all directions. The bombardment lasted 34 hours. Anderson's men fired back but were hopelessly outgunned. With the fort on fire and ammunition nearly gone, Anderson surrendered on April 13.",
                advanced: "At 4:30 AM on April 12, Confederate batteries commenced a converging bombardment of Fort Sumter. The 34-hour cannonade, involving over 40 guns firing from multiple positions, overwhelmed Anderson's garrison of 85 men. Despite returning fire with limited effect, the defenders faced an untenable situation: the fort's interior was ablaze, the main gate destroyed, and ammunition stocks critically depleted. Anderson negotiated surrender terms on April 13, receiving full military honors."
            },
            tech: {
                name: "Coastal Artillery",
                description: {
                    beginner: "Fort Sumter was built to stop wooden ships, but the Confederate cannons included new rifled cannons (cannons with grooves inside the barrel that make the cannonball fly straighter and farther). These new guns could hit targets much more accurately than old-style smooth cannons. Brick forts like Sumter were becoming outdated.",
                    intermediate: "Fort Sumter was designed to withstand wooden warships, but Confederate guns included new rifled cannons that were far more accurate than old smoothbore cannons. The age of brick-and-stone coastal forts was ending.",
                    advanced: "Fort Sumter's Third System design was engineered to resist wooden naval vessels, but Confederate ordnance included rifled artillery pieces capable of far greater accuracy and penetrating power than traditional smoothbore guns. The bombardment demonstrated that masonry fortifications \u2014 the backbone of coastal defense since the War of 1812 \u2014 were becoming obsolete in the face of modern rifled weaponry."
                }
            },
            voice: {
                quote: "I do not pretend to sleep. How can I? If Anderson does not accept terms at four, the orders are he shall be fired upon. I count four, St. Michael's bells chime out and I begin to hope. At half-past four the heavy booming of a cannon. I sprang out of bed, and on my knees prostrate I prayed as I never prayed before.",
                attribution: "Mary Chesnut, wife of Confederate Senator James Chesnut Jr.",
                source: "Library of Congress, Mary Chesnut's Civil War diary",
                explainer: "Mary Chesnut is saying she couldn't sleep because she knew the attack on Fort Sumter was about to begin. When she heard the cannons fire, she got on her knees and prayed."
            },
            biggerPicture: {
                beginner: "The attack on Fort Sumter changed everything overnight. The North came together, and Lincoln asked for 75,000 soldiers to volunteer. Four more slave states joined the Confederacy. The war that nobody wanted had started.",
                intermediate: "The attack on Fort Sumter unified the North overnight. Lincoln called for 75,000 volunteers, and four more slave states joined the Confederacy. The war everyone hoped to avoid had begun.",
                advanced: "The bombardment of Fort Sumter catalyzed Northern public opinion with extraordinary speed. Lincoln's call for 75,000 militia volunteers was oversubscribed within weeks, but it also triggered the secession of Virginia, Arkansas, Tennessee, and North Carolina \u2014 nearly doubling the Confederacy's population and industrial capacity. The calculated gamble of forcing the first shot had achieved Lincoln's immediate political objective while simultaneously expanding the conflict's scope."
            },
            reflection: {
                beginner: "Both sides said they were protecting themselves. The South said it was protecting its land. The North said it was protecting government property. Who do you think started the war, and does it matter who shot first?",
                intermediate: "Both sides claimed they were acting in self-defense. The Confederacy said it was defending its territory; the Union said it was defending federal property. Who do you think fired the first shot of the war, and does it matter?",
                advanced: "Both sides framed their actions as defensive: the Confederacy asserted sovereignty over its territory, while the Union maintained its obligation to protect federal property. Lincoln deliberately engineered the crisis so that the Confederacy would fire first. Does the question of 'who started it' matter when both sides were maneuvering toward conflict? How does the narrative of 'who fired first' shape how we judge each side?"
            },
            winner: "confederacy",
            outcome: "Confederate victory, fort surrendered",
            casualties: { union: 13, confederacy: 0 },
            keyFact: {
                beginner: "Nobody was killed in the actual battle! The only death was a Union soldier who died in an accidental explosion during the surrender ceremony on April 14.",
                intermediate: "No soldiers on either side were killed in combat during the bombardment. The only death was a Union soldier killed in an accidental explosion during the 100-gun surrender salute on April 14.",
                advanced: "Remarkably, the bombardment produced no combat fatalities on either side \u2014 the sole death was Private Daniel Hough, killed during an accidental powder explosion in the 100-gun surrender salute on April 14. This bloodless beginning belied the apocalyptic scale of violence to come: over 620,000 Americans would die before the war's end."
            }
        },

        freeplay: {
            briefing: "The first shots of the Civil War! Confederate batteries ring Charleston Harbor, surrounding the Union-held Fort Sumter. Major Anderson's tiny garrison is running low on supplies. The Confederacy must decide how to handle this standoff, and the Union must decide how to survive it.",
            difficulty: 5,
            momentumValue: 1,
            strategies: [
                {
                    name: "Hold and Endure",
                    description: "Hunker down in the fort and withstand the bombardment as long as possible.",
                    detail: "Fort Sumter's thick walls can absorb a lot of punishment. Holding out buys time for reinforcements and makes the Confederacy look like the aggressor. But you're badly outgunned.",
                    power: { union: 4, confederacy: 6 },
                    casualties: { union: 15, confederacy: 0 },
                    outcome: {
                        win: "Your stubborn defense rallies the North! The fort holds long enough for supply ships to arrive, and the garrison is reinforced.",
                        lose: "The bombardment is overwhelming. With the fort burning and ammunition gone, you're forced to surrender after a heroic stand."
                    }
                },
                {
                    name: "Concentrate Fire",
                    description: "Focus all your cannons on the most dangerous enemy battery.",
                    detail: "You can't match the enemy's firepower, but concentrating your shots on one battery might knock it out. If you silence one position, it changes the math.",
                    power: { union: 5, confederacy: 5 },
                    casualties: { union: 10, confederacy: 5 },
                    outcome: {
                        win: "Your concentrated fire disables the key enemy battery! With a gap in their ring of fire, supply ships can slip through.",
                        lose: "Your shots hit home but the battery is quickly repaired. Meanwhile, the other batteries pound your fort without opposition."
                    }
                },
                {
                    name: "Aggressive Bombardment",
                    description: "Open fire with everything you have to inflict maximum damage.",
                    detail: "Go down swinging. Use every cannon and shell to punish the enemy batteries. You won't win a slugging match, but you'll make them pay for every shot.",
                    power: { union: 3, confederacy: 7 },
                    casualties: { union: 20, confederacy: 10 },
                    outcome: {
                        win: "Your aggressive fire surprises the enemy and damages several batteries! The ferocity of your defense forces them to reconsider their assault.",
                        lose: "You burn through ammunition too quickly. The enemy batteries absorb your fire and keep pounding. Soon you have nothing left to shoot."
                    }
                }
            ],
            fogOfWar: [
                { mod: 2, text: "A Union supply ship appears on the horizon, boosting morale!" },
                { mod: 1, text: "A lucky shot damages an enemy powder magazine." },
                { mod: -1, text: "Hot shot from enemy cannons starts a fire inside the fort." },
                { mod: -2, text: "The main flagpole is shot down, causing confusion and sinking morale." }
            ],
            historicalEvent: null
        }
    },

    {
        id: "bull_run",
        name: "First Battle of Bull Run",
        date: "July 21, 1861",
        year: 1861,
        location: "Manassas, Virginia",
        image: "images/battle_of_bull_run.jpg",
        imageCredit: "Kurz & Allison, 1889",

        historical: {
            situation: {
                union: {
                    beginner: "It's been three months since Fort Sumter, and everyone in the North is screaming, 'Go get 'em!' Your army of 35,000 soldiers is marching south to fight. Most of them have never been in a real battle. People from Washington, D.C. actually brought picnic lunches to watch the fight!",
                    intermediate: "It's been three months since Fort Sumter, and the public demands action. Your army of 35,000 marches south toward the Confederate capital at Richmond. Everyone expects a quick victory. Civilians from Washington have packed picnic baskets to watch the battle.",
                    advanced: "Three months after Fort Sumter, Northern public opinion demands a decisive blow. Your army of 35,000 largely untrained volunteers is advancing on Manassas Junction, where Confederate forces guard the railroad to Richmond. The expectation of a short, glorious war is so pervasive that Washington civilians have traveled to the battlefield with picnic baskets, treating the coming battle as spectacle."
                },
                confederacy: {
                    beginner: "A big Union army is heading straight for you, only 30 miles from Washington, D.C. Your soldiers are new and haven't fought before, but you've got a good spot to defend along a creek called Bull Run. More soldiers are coming by train to help you.",
                    intermediate: "A large Union army is marching toward you at Manassas Junction, just 30 miles from Washington. Your troops are mostly untrained volunteers, but you have a strong position along Bull Run creek. Reinforcements are on the way by railroad.",
                    advanced: "A Union force of 35,000 is advancing on your position at Manassas Junction, a critical railroad hub just 30 miles from Washington. Your troops are largely untrained volunteers, but you occupy strong defensive terrain along Bull Run creek. Crucially, Johnston's forces in the Shenandoah Valley can reinforce you by rail \u2014 if they arrive in time."
                }
            },
            intel: {
                union: { forces: "35,000 troops", commander: "General Irvin McDowell", advantage: "Larger army with more supplies" },
                confederacy: { forces: "32,000 troops (after reinforcements)", commander: "Generals Beauregard & Johnston", advantage: "Defensive position along Bull Run creek" }
            },
            whatWouldYouDo: {
                union: {
                    prompt: {
                        beginner: "Your soldiers have never been in a real fight. Everyone back home expects you to win easily. How do you attack the enemy across the creek?",
                        intermediate: "Your green troops outnumber the enemy, but they've never been in battle. The public expects you to crush the rebellion in one fight. How do you attack?",
                        advanced: "Your numerically superior but untrained force faces entrenched defenders along Bull Run creek. Political pressure demands immediate action, yet your troops lack combat experience. What approach do you take?"
                    },
                    options: {
                        beginner: ["Sneak around the side of the enemy and attack from where they don't expect it", "March straight across the creek and attack head-on", "Wait and train your soldiers more before fighting"],
                        intermediate: ["Launch a flanking march around the enemy's left side", "Attack straight across Bull Run at the stone bridge", "Wait for better training before attacking at all"],
                        advanced: ["Execute a flanking maneuver around the Confederate left to roll up their line", "Launch a direct assault across the stone bridge to overwhelm the defenders", "Delay the offensive to properly drill your volunteers, despite political pressure"]
                    },
                    feedback: {
                        beginner: ["Smart move! That's actually what General McDowell tried. His soldiers almost won by sneaking around the side, but the enemy got help from soldiers who came by train just in time.", "Brave choice, but attacking head-on across a creek against soldiers behind cover would have been very bloody. McDowell chose to go around the side instead.", "That makes sense \u2014 trained soldiers fight better! But everyone in Washington was demanding action right now. Lincoln couldn't wait, so McDowell had to fight with what he had."],
                        intermediate: ["That's what McDowell did! The flanking march nearly worked, pushing Confederates back to Henry Hill. But it took too long, giving Confederate reinforcements time to arrive by rail and turn the battle.", "A bold choice, but a frontal assault across defended creek crossings would have been extremely costly. McDowell wisely chose to flank instead, though the maneuver took longer than expected.", "Militarily sound \u2014 these troops needed months more training. But the political cry of 'On to Richmond!' made waiting impossible. Lincoln needed action to maintain public support for the war."],
                        advanced: ["This mirrors McDowell's actual plan, which was tactically sound. The flanking march initially succeeded in turning the Confederate left, but the maneuver's complexity exceeded his green troops' capabilities. The delay allowed Johnston's reinforcements to arrive by rail \u2014 the first decisive use of railroads in warfare.", "A direct assault against prepared positions along a waterline would have maximized casualties for minimal tactical gain. McDowell recognized this and opted for a flanking approach, though the alternative crossing points proved harder to exploit than anticipated.", "Arguably the most strategically sound option, as these 90-day volunteers desperately needed training. However, the political calculus made delay impossible: Northern public opinion demanded immediate action, and Lincoln feared that inaction would erode support for preserving the Union."]
                    }
                },
                confederacy: {
                    prompt: {
                        beginner: "The Union army is coming and they have more soldiers than you. But more of your soldiers are on the way by train. Do you fight now or wait?",
                        intermediate: "The Union army is coming and you're outnumbered until reinforcements arrive by train. Do you attack first or dig in and hold?",
                        advanced: "The Union army is advancing with numerical superiority, but Johnston's forces are en route by rail from the Shenandoah Valley. Your defensive position along Bull Run creek is strong. How do you use the time before contact?"
                    },
                    options: {
                        beginner: ["Stay behind the creek and hold your ground until help arrives", "Attack the Union army before they're ready", "Move back to a safer spot closer to your capital"],
                        intermediate: ["Defend the creek crossings and wait for reinforcements", "Launch a surprise attack before the Union army is ready", "Fall back to a stronger position closer to Richmond"],
                        advanced: ["Defend the creek line and delay until Johnston's reinforcements arrive by rail", "Launch a spoiling attack to disrupt McDowell's advance before he can organize", "Withdraw to the Rappahannock line to consolidate with Johnston's forces"]
                    },
                    feedback: {
                        beginner: ["Great call! That's exactly what happened. The Confederate generals held the creek crossings, and when more soldiers arrived by train, they attacked and won big!", "Bold thinking! But with fewer soldiers, attacking a bigger army could have ended badly. The Confederate generals chose to wait for their reinforcements, and it paid off.", "Playing it safe makes sense, but the generals knew that giving up ground would look bad for the new Confederacy. They held their position and were rewarded when train reinforcements arrived in time."],
                        intermediate: ["Exactly right \u2014 Beauregard held the Bull Run crossings while Johnston rushed reinforcements by rail. When the fresh troops arrived, the Confederate counterattack routed the entire Union army.", "Aggressive, but risky when outnumbered. Beauregard considered it but chose to defend first. The defensive position along Bull Run was too strong to abandon for an uncertain attack.", "Strategically cautious, but retreating without a fight would have demoralized the South. By holding Bull Run, the Confederates won a victory that boosted Southern confidence enormously."],
                        advanced: ["This reflects the actual Confederate strategy, and it proved decisive. Beauregard's defense along Bull Run bought time for Johnston's Valley forces to arrive via the Manassas Gap Railroad \u2014 the first operational use of rail transport in warfare. The timely reinforcements enabled the counterattack that routed McDowell's army.", "A spoiling attack could have disrupted McDowell's preparations, but it risked engaging a numerically superior force before Johnston's reinforcements arrived. Beauregard judged correctly that his defensive position along the creek line was his greatest asset.", "While consolidation would have strengthened Confederate numbers, voluntarily ceding Northern Virginia without a fight would have been politically catastrophic for the nascent Confederacy. The Bull Run position offered both tactical advantages and the symbolic value of defending Virginia's soil."]
                    }
                }
            },
            whatHappened: {
                beginner: "McDowell's sneak attack almost worked! His soldiers pushed the Confederates back. But General Thomas Jackson and his men stood firm on a hill 'like a stone wall' \u2014 that's how he got the nickname 'Stonewall Jackson.' Then Confederate soldiers arrived by train and attacked. The whole Union army panicked and ran back to Washington, crashing into the picnicking civilians on the road!",
                intermediate: "McDowell's flanking attack nearly worked, pushing the Confederates back. But General Thomas Jackson's brigade held firm on Henry Hill 'like a stone wall,' buying time. When Confederate reinforcements arrived by railroad, a massive counterattack sent the Union army fleeing back to Washington in panic, mixed in with the civilian spectators.",
                advanced: "McDowell's flanking maneuver initially succeeded, driving Confederate forces from their positions along Bull Run. However, General Thomas Jackson's Virginia brigade established a critical defensive line on Henry Hill, earning Jackson his famous sobriquet 'Stonewall.' Jackson's stand bought time for Johnston's reinforcements to arrive via the Manassas Gap Railroad. The fresh Confederate troops launched a devastating counterattack that transformed an orderly Union withdrawal into a complete rout, with panicked soldiers and civilian spectators clogging the roads back to Washington."
            },
            tech: {
                name: "Railroads in War",
                description: {
                    beginner: "Confederate soldiers rode trains from far away to reach the battle just in time. This was the first time trains were used to move soldiers during a fight. It proved that railroads (trains) could move armies much faster than walking.",
                    intermediate: "Confederate reinforcements arrived by train from the Shenandoah Valley just in time to turn the battle. This was the first time railroads played a decisive role in combat, proving that trains could move armies faster than marching.",
                    advanced: "Johnston's forces traveled via the Manassas Gap Railroad from the Shenandoah Valley, arriving in time to execute the decisive counterattack. Bull Run demonstrated for the first time that railroads could serve as a strategic force multiplier, enabling rapid concentration of forces that fundamentally altered the calculus of 19th-century warfare."
                }
            },
            voice: {
                quote: "My very dear Sarah: The indications are very strong that we shall move in a few days, perhaps tomorrow. If it is necessary that I should fall on the battlefield for my country, I am ready. I have no misgivings about the cause in which I am engaged, and my courage does not halt or falter. Sarah, my love for you is deathless.",
                attribution: "Major Sullivan Ballou, 2nd Rhode Island Infantry (killed one week later at Bull Run)",
                source: "Library of Congress, Sullivan Ballou letter, July 14, 1861",
                explainer: "Sullivan Ballou is writing to his wife Sarah before the battle. He knows he might die, but says he believes in the cause and isn't afraid. He was killed at Bull Run one week after writing this letter."
            },
            biggerPicture: {
                beginner: "The Union lost, and everyone's dream of a quick war was over. Lincoln called for 500,000 more soldiers to sign up for three years. The South thought they had already won the whole war after just one battle \u2014 but they were wrong.",
                intermediate: "The Union defeat shattered the fantasy of a quick war. Lincoln signed bills to enlist 500,000 soldiers for three years and replaced McDowell with General McClellan. The South gained dangerous overconfidence, believing one battle had won their independence.",
                advanced: "The Union rout at Bull Run shattered Northern illusions of a swift, decisive conflict. Lincoln responded by signing legislation to enlist 500,000 volunteers for three-year terms and replacing McDowell with the methodical George McClellan. Paradoxically, the defeat may have benefited the Union long-term by forcing early recognition of the war's true scale. Meanwhile, the Confederate victory bred a dangerous overconfidence that would hamper Southern strategic planning for months."
            },
            reflection: {
                beginner: "People brought picnic baskets to watch the battle like it was a football game. What does that tell you about what they thought war would be like? How do you think they felt after seeing the real thing?",
                intermediate: "Civilians brought picnic baskets to watch the battle like a sporting event. What does that tell you about how Americans in 1861 understood war? How did Bull Run change that understanding?",
                advanced: "Washington civilians treated Bull Run as entertainment, bringing picnic baskets and opera glasses. What does this reveal about mid-19th century American conceptions of warfare? How did the reality of Bull Run transform public understanding, and what parallels can you draw to how modern media shapes our perception of conflict?"
            },
            winner: "confederacy",
            outcome: "Confederate victory",
            casualties: { union: 2896, confederacy: 1982 },
            keyFact: {
                beginner: "People from Washington, D.C. brought picnic baskets to watch the battle like a show! When the Union army started losing, the soldiers and the picnickers all tried to run home at the same time, jamming the roads.",
                intermediate: "Civilians from Washington brought picnic baskets to watch the battle like a sporting event. They fled in terror alongside retreating Union soldiers, jamming the roads back to the capital.",
                advanced: "Washington society figures brought picnic baskets and opera glasses to observe the battle as spectacle. Their panicked flight alongside retreating soldiers created a chaotic scene that graphically illustrated the nation's naive understanding of what modern warfare would entail."
            }
        },

        freeplay: {
            briefing: "The first major battle of the war! Both armies are raw and untrained. The Confederates are defending a position along Bull Run creek in Virginia, just 30 miles from Washington. Everyone thinks one big battle will decide the whole war.",
            difficulty: 6,
            momentumValue: 2,
            strategies: [
                {
                    name: "Direct Assault",
                    description: "March straight at the enemy's main defensive line along Bull Run creek.",
                    detail: "A bold frontal attack. Simple to execute with untrained troops, but you'll be attacking prepared positions head-on.",
                    power: { union: 4, confederacy: 7 },
                    casualties: { union: 2900, confederacy: 2000 },
                    outcome: {
                        win: "Your troops smash through the enemy line! The direct approach worked because the opposing army was just as inexperienced as yours.",
                        lose: "Your assault stalls against the enemy's defensive positions. Without experience, your soldiers can't adapt when the attack bogs down."
                    }
                },
                {
                    name: "Defensive Position",
                    description: "Set up strong positions and let the enemy come to you.",
                    detail: "Defense favors the prepared. Dig in and make the enemy pay for every yard. But you give up the initiative.",
                    power: { union: 5, confederacy: 6 },
                    casualties: { union: 2500, confederacy: 1500 },
                    outcome: {
                        win: "Your defensive line holds firm! The enemy's attacks break against your positions, and they eventually retreat in disorder.",
                        lose: "You held your ground, but the enemy found a way around your positions. Your defensive stance let them seize the initiative."
                    }
                },
                {
                    name: "Flanking Maneuver",
                    description: "March around the enemy's side and attack from an unexpected direction.",
                    detail: "A flanking attack can cause panic and confusion. But it's complex to coordinate with inexperienced troops and splits your forces.",
                    power: { union: 6, confederacy: 5 },
                    casualties: { union: 2700, confederacy: 1900 },
                    outcome: {
                        win: "Your flanking move catches the enemy off guard! Attacked from an unexpected direction, they can't organize a defense and fall back.",
                        lose: "The flanking march took too long with your green troops. By the time you attacked, the enemy had repositioned to meet you."
                    }
                }
            ],
            fogOfWar: [
                { mod: 2, text: "Fresh reinforcements arrive by railroad just in time!" },
                { mod: 1, text: "A key bridge is captured intact, speeding your advance." },
                { mod: -1, text: "Green troops panic at the sound of artillery and waver." },
                { mod: -2, text: "Confusion in the smoke causes friendly fire between your own units." }
            ],
            historicalEvent: { text: "Confederate reinforcements arrive by railroad just in time!", mod: { union: -1, confederacy: 1 }, basis: "First major use of railroad for troop transport in battle" }
        }
    },

    {
        id: "shiloh",
        name: "Battle of Shiloh",
        date: "April 6-7, 1862",
        year: 1862,
        location: "Pittsburg Landing, Tennessee",
        image: "images/battle_of_shiloh.jpg",
        imageCredit: "Thure de Thulstrup, 1888",

        historical: {
            situation: {
                union: {
                    beginner: "General Grant's army is camped near a little church called Shiloh in Tennessee. Your soldiers are waiting for more troops to arrive. Nobody has built any walls or dug any trenches because you don't think the enemy will attack. Grant isn't even at the camp \u2014 he's sleeping at a nice house nine miles away!",
                    intermediate: "General Grant's army is camped near Shiloh Church at Pittsburg Landing, Tennessee, waiting for reinforcements. You haven't built any defensive fortifications because you don't expect an attack. Grant is so confident, he's sleeping nine miles away at a mansion.",
                    advanced: "Grant's 40,000-man Army of the Tennessee is encamped near Pittsburg Landing, awaiting Buell's 25,000 reinforcements before advancing on Corinth, Mississippi. Critically, no defensive fortifications have been constructed \u2014 Grant's aggressive mindset left him focused on offense, not defense. His headquarters are nine miles downriver, leaving the army without its commander on the ground."
                },
                confederacy: {
                    beginner: "The Union army is camped in the open with no walls or fences to protect them. They have no idea you're coming! If you attack at sunrise, you could destroy their whole army before help arrives. Your general says, 'Tonight we will water our horses in the Tennessee River.'",
                    intermediate: "Grant's army is sitting in the open near Pittsburg Landing, completely unprepared. If you strike now with a surprise dawn attack, you can destroy his army before reinforcements arrive. Confederate General Albert Sidney Johnston tells his officers: 'Tonight we will water our horses in the Tennessee River.'",
                    advanced: "Grant's army is encamped in the open near Pittsburg Landing without defensive works \u2014 a critical vulnerability. A surprise dawn attack could destroy his force before Buell's 25,000 reinforcements arrive. General Albert Sidney Johnston, the Confederacy's highest-ranking field commander, has concentrated 44,000 troops for the assault, declaring to his officers: 'Tonight we will water our horses in the Tennessee River.'"
                }
            },
            intel: {
                union: { forces: "40,000 troops (with 25,000 reinforcements nearby)", commander: "General Ulysses S. Grant", advantage: "Gunboats on the Tennessee River for fire support" },
                confederacy: { forces: "44,000 troops", commander: "General Albert Sidney Johnston", advantage: "Complete surprise and initiative" }
            },
            whatWouldYouDo: {
                union: {
                    prompt: {
                        beginner: "Enemy soldiers just came running out of the woods at sunrise! Your soldiers were eating breakfast and had no idea this was coming. What do you do?",
                        intermediate: "Confederate forces just burst out of the woods at dawn. Your army is caught completely off guard, with soldiers still eating breakfast. What do you do?",
                        advanced: "Confederate forces have launched a surprise dawn assault, catching your army in camp without defensive positions. Units are scattered and disorganized. How do you respond to prevent a complete rout?"
                    },
                    options: {
                        beginner: ["Get the scattered soldiers together and form a defense line", "Run back to the river and wait for more troops to come help", "Fight back right away to take control of the battle"],
                        intermediate: ["Rally scattered troops and form a defensive line at the Hornets' Nest", "Retreat to the river landing and wait for reinforcements", "Counterattack immediately to regain the initiative"],
                        advanced: ["Consolidate scattered units into a defensive position to buy time for reinforcements", "Execute a fighting withdrawal to the river landing and await Buell's army", "Launch an immediate counterattack to disrupt the Confederate advance and regain initiative"]
                    },
                    feedback: {
                        beginner: ["Good thinking! That's what some brave Union soldiers did. They held a spot called the 'Hornets' Nest' for hours, which gave time for 25,000 more Union soldiers to come help overnight.", "That's actually a smart idea. Some Union soldiers did run to the river. Grant used the night to bring 25,000 fresh soldiers across the river, and they won the battle the next day!", "Brave choice! Some Union officers tried this, but it's really hard to attack when your soldiers are surprised and confused. The ones who formed a defense line did better."],
                        intermediate: ["That's what happened! Union troops held a sunken road called the 'Hornets' Nest' for six hours, absorbing Confederate attacks and buying time. It cost them dearly, but those hours saved Grant's army.", "A reasonable instinct for survival. Many soldiers did flee to the river landing. Grant used the night to ferry 25,000 reinforcements across the Tennessee, then counterattacked and won on Day 2.", "Bold but extremely difficult when caught by surprise. Scattered, disorganized troops can't mount an effective counterattack. The soldiers who formed defensive pockets did far more to save the army."],
                        advanced: ["This mirrors the critical stand at the 'Hornets' Nest,' where Union forces under Prentiss held a sunken road for approximately six hours, absorbing repeated Confederate assaults. This sacrifice bought Grant the time he needed for Buell's reinforcements to cross the Tennessee overnight, enabling the decisive Day 2 counterattack.", "Tactically defensible given the surprise, but a wholesale withdrawal risked degenerating into a rout. Grant's genius lay in combining defensive stands with the knowledge that Buell's 25,000 reinforcements would arrive overnight \u2014 turning a near-disaster into a strategic victory.", "While an immediate counterattack demonstrates aggressive leadership, it was operationally infeasible given the army's state of disorganization. Scattered units lacked the coordination for offensive action. The more effective response was establishing defensive positions to slow the Confederate advance."]
                    }
                },
                confederacy: {
                    prompt: {
                        beginner: "Your surprise attack is working great! Union camps are being overrun and soldiers are running everywhere. But your own troops are getting scattered too as they chase the enemy. What now?",
                        intermediate: "Your surprise attack is working! Union camps are overrun and thousands are fleeing. But your troops are getting disorganized chasing scattered enemies. Do you push on or regroup?",
                        advanced: "Your surprise attack has achieved tactical shock, overrunning Union camps and scattering their forward units. However, your own forces are losing cohesion as they pursue scattered enemies through difficult terrain. Time is critical \u2014 Union reinforcements will arrive by nightfall."
                    },
                    options: {
                        beginner: ["Send everyone to attack that one stubborn spot called the Hornets' Nest", "Keep attacking to finish the job before dark", "Stop and get your soldiers organized again"],
                        intermediate: ["Concentrate everything on breaking the Hornets' Nest position", "Keep pushing to finish off Grant's army before dark", "Halt and reorganize your scattered forces"],
                        advanced: ["Concentrate all available forces on reducing the Hornets' Nest position blocking your advance", "Maintain offensive momentum to destroy Grant's army before Buell's reinforcements arrive", "Halt to reorganize scattered units and resume the assault with coordinated force"]
                    },
                    feedback: {
                        beginner: ["That's what actually happened \u2014 the Confederates focused on the Hornets' Nest. They captured it, but it took six hours. That delay gave Grant time to get reinforcements across the river.", "That's what the Confederate generals tried! But they ran out of daylight. Overnight, 25,000 fresh Union soldiers arrived, and the Confederates lost the battle the next day.", "Smart thinking about staying organized. But Confederate generals were afraid that if they stopped, Union reinforcements would arrive. They kept pushing, but it wasn't enough to win before dark."],
                        intermediate: ["This is what happened \u2014 Confederates focused on the Hornets' Nest, eventually capturing it. But the six-hour delay was fatal to their campaign: it gave Grant time to establish a final defensive line and bring reinforcements across the river.", "That's what Johnston attempted, but disorganized troops couldn't maintain the pressure. Johnston himself was killed leading a charge that afternoon. The Confederates ran out of daylight, and 25,000 Union reinforcements arrived overnight.", "Reorganizing might have enabled a more effective assault, but every hour of delay brought Buell's reinforcements closer. The Confederate window to destroy Grant was closing fast."],
                        advanced: ["This mirrors the actual Confederate decision, and it proved to be a Pyrrhic success. Reducing the Hornets' Nest consumed approximately six hours and the life of General Johnston \u2014 time the Confederacy could not afford. The position's stubborn defense fulfilled its strategic purpose of buying Grant enough time for reinforcement.", "This reflects Johnston's actual approach, but maintaining momentum with disorganized forces proved impossible. Johnston was killed at 2:30 PM leading a charge, and his successor Beauregard lacked Johnston's aggressive drive. The Confederates ran out of daylight \u2014 a fatal delay that allowed Buell's 25,000 reinforcements to cross the Tennessee overnight.", "Operational reorganization had merit but presented a critical dilemma: every hour spent consolidating brought Buell's army closer. The Confederacy's narrow window to destroy Grant before reinforcement required accepting tactical disorder in exchange for strategic tempo."]
                    }
                }
            },
            whatHappened: {
                beginner: "On April 6, the Confederates attacked at sunrise and almost destroyed Grant's army. But some brave Union soldiers held a spot called the 'Hornets' Nest' for six hours, slowing the attack. The Confederate general, Johnston, was killed that afternoon. Overnight, 25,000 fresh Union soldiers crossed the river. Grant attacked on April 7 and won.",
                intermediate: "The Confederate surprise attack on April 6 nearly destroyed Grant's army. But stubborn Union resistance at the 'Hornets' Nest' bought precious hours. General Johnston was killed leading a charge that afternoon. Overnight, 25,000 Union reinforcements crossed the river. Grant counterattacked on April 7 and drove the Confederates from the field.",
                advanced: "The Confederate surprise assault on April 6 achieved devastating initial results, overrunning Union camps and driving disorganized units toward the Tennessee River. However, a stubborn Union stand at a sunken road \u2014 dubbed the 'Hornets' Nest' for the intensity of fire \u2014 absorbed repeated Confederate assaults for six hours, fatally disrupting the Confederate timetable. General Johnston, the Confederacy's highest-ranking field commander, was killed leading a charge at 2:30 PM. Overnight, Buell's 25,000 reinforcements crossed the river, and Grant's counterattack on April 7 drove the bloodied Confederates from the field."
            },
            tech: {
                name: "Gunboats",
                description: {
                    beginner: "Two Union gunboats (warships with big cannons) on the river fired huge shells at the Confederate soldiers all night long. The loud booming scared the tired Southern soldiers and helped keep them away while fresh Union troops crossed the river.",
                    intermediate: "Two Union gunboats, the USS Tyler and USS Lexington, fired massive shells into Confederate positions all night. The booming guns terrified exhausted Southern soldiers and helped protect Grant's army while reinforcements crossed the river.",
                    advanced: "The USS Tyler and USS Lexington, timber-clad gunboats on the Tennessee River, provided continuous fire support throughout the night of April 6-7. Their heavy ordnance disrupted Confederate positions and demoralized exhausted Southern troops, while simultaneously providing covering fire for Buell's reinforcements crossing the river. Shiloh demonstrated the decisive potential of joint army-navy operations in riverine warfare."
                }
            },
            voice: {
                quote: "They came pouring in at every avenue \u2014 footsore, in rags, with bundles on their heads, and terror and hope equally in their faces. Men, women, and children, all fleeing toward the sound of the Union guns. The questions they asked about freedom, and whether we would send them back, were heartbreaking beyond description.",
                attribution: "Chaplain John Eaton, who organized the first freedpeople's camps in the Western Theater",
                source: "John Eaton, 'Grant, Lincoln, and the Freedmen,' 1907 / Freedmen and Southern Society Project, National Archives",
                explainer: "Chaplain Eaton is describing enslaved people who escaped to Union army lines during the battle. They were desperate to be free and terrified that the soldiers might send them back to slavery."
            },
            biggerPicture: {
                beginner: "In just two days, 23,000 soldiers were killed or hurt \u2014 more than in all of America's previous wars put together. Everyone was shocked. The dream of a quick, easy war was dead. People criticized Grant for being unprepared, but Lincoln said: 'I can't spare this man. He fights.'",
                intermediate: "Shiloh's 23,000 casualties in two days were more than all previous American wars combined. The nation was horrified. Dreams of a quick, glorious war died on that field. Grant was criticized for being unprepared, but Lincoln said: 'I can't spare this man. He fights.'",
                advanced: "Shiloh's 23,000 casualties in forty-eight hours exceeded the combined losses of the American Revolution, the War of 1812, and the Mexican-American War. The scale of slaughter shattered any remaining illusions about the war's nature. Grant faced intense criticism and calls for his removal, but Lincoln's response \u2014 'I can't spare this man. He fights' \u2014 signaled that the president valued aggressive commanders willing to accept the war's terrible arithmetic."
            },
            reflection: {
                beginner: "After Shiloh, Grant said the only way to save the country was to completely beat the South \u2014 not just win one battle. Why do you think seeing so much fighting changed how he thought about the war?",
                intermediate: "After Shiloh, Grant wrote that he gave up all hope of saving the Union except by 'complete conquest.' Why do you think such a terrible battle changed his thinking about how the war needed to be fought?",
                advanced: "After Shiloh, Grant wrote that he abandoned all hope of saving the Union 'except by complete conquest.' How did the unprecedented scale of violence at Shiloh reshape military thinking about the war's nature? What does Grant's evolution from expecting a short war to embracing 'complete conquest' reveal about how warfare transforms those who wage it?"
            },
            winner: "union",
            outcome: "Union strategic victory",
            casualties: { union: 13047, confederacy: 10699 },
            keyFact: {
                beginner: "Over 23,000 soldiers were killed or hurt in just two days \u2014 more than in all of America's earlier wars added together. Nobody had ever seen anything like it.",
                intermediate: "Over 23,000 soldiers were killed or wounded in two days, more than all previous American wars combined at that point. The nation was horrified by the scale of the slaughter.",
                advanced: "Shiloh's 23,000 casualties in forty-eight hours exceeded the combined losses of every previous American conflict. The battle marked the moment when both sides recognized that the war would demand sacrifice on an industrial scale previously unimaginable in American warfare."
            }
        },

        freeplay: {
            briefing: "Grant's Union army is camped near Shiloh Church in Tennessee. Confederate forces are planning a surprise dawn attack. The question is whether the element of surprise can overcome the Union's numerical advantage, or whether Grant's reinforcements will arrive in time.",
            difficulty: 5,
            momentumValue: 2,
            strategies: [
                {
                    name: "Immediate Counterattack",
                    description: "Rally your surprised troops and attack back as quickly as possible.",
                    detail: "When surprised, a quick counterattack can regain the initiative. It shows leadership and stops enemy momentum, but your troops are confused.",
                    power: { union: 7, confederacy: 4 },
                    casualties: { union: 40000, confederacy: 55000 },
                    outcome: {
                        win: "Your quick counterattack catches the enemy off-balance! Showing decisive leadership, you turn chaos into a fighting retreat that becomes an advance.",
                        lose: "Your counterattack falters as confused troops can't organize fast enough. The enemy's momentum proves too strong to stop with a hasty response."
                    }
                },
                {
                    name: "Form Defensive Lines",
                    description: "Organize scattered forces into strong defensive positions and hold.",
                    detail: "Getting organized stops panic and creates solid resistance. It buys time for reinforcements but surrenders the initiative to the enemy.",
                    power: { union: 6, confederacy: 5 },
                    casualties: { union: 35000, confederacy: 45000 },
                    outcome: {
                        win: "Your defensive lines hold! The organized resistance bleeds the enemy's attack dry, and when reinforcements arrive, you launch a decisive counterattack.",
                        lose: "Your defensive lines were overwhelmed before reinforcements could arrive. The enemy's relentless pressure eventually broke through."
                    }
                },
                {
                    name: "Strategic Retreat",
                    description: "Pull back to a stronger position and regroup your forces.",
                    detail: "Retreating to better ground can save lives and set up a stronger defense. But it looks like giving up and is hard to reverse.",
                    power: { union: 3, confederacy: 7 },
                    casualties: { union: 30000, confederacy: 25000 },
                    outcome: {
                        win: "Your retreat to strong ground pays off! The enemy overextends trying to pursue, and your rested troops smash their tired advance.",
                        lose: "The retreat turned into a rout. Once soldiers started running, momentum was lost and the battle slipped away."
                    }
                }
            ],
            fogOfWar: [
                { mod: 2, text: "Union gunboats on the river open fire, pounding enemy positions!" },
                { mod: 1, text: "Reinforcements begin arriving across the river ahead of schedule." },
                { mod: -1, text: "A sudden rainstorm turns roads to mud, slowing troop movements." },
                { mod: -2, text: "A surprise attack catches your troops eating breakfast in their camps!" }
            ],
            historicalEvent: { text: "Confederate General Albert Sidney Johnston is killed leading a charge!", mod: { union: 1, confederacy: -1 }, basis: "Johnston died April 6, 1862, highest-ranking officer killed in the war" }
        }
    },

    {
        id: "antietam",
        name: "Battle of Antietam",
        date: "September 17, 1862",
        year: 1862,
        location: "Sharpsburg, Maryland",
        image: "images/battle_of_antietam.jpg",
        imageCredit: "Kurz & Allison, 1888",

        historical: {
            situation: {
                union: {
                    beginner: "Robert E. Lee has brought his army into Maryland \u2014 the war is now on Northern soil! But your soldiers found something amazing: a copy of Lee's secret plans wrapped around three cigars. You know exactly where his army is and it's split up. You have twice as many soldiers. This could end the war!",
                    intermediate: "Robert E. Lee has invaded Maryland, bringing the war to Northern soil for the first time. But your soldiers just found an incredible gift: a copy of Lee's secret battle plans wrapped around three cigars! You know exactly where his divided army is positioned. This is your chance to destroy him.",
                    advanced: "Lee has launched an audacious invasion of Maryland, seeking a decisive victory on Northern soil that could secure European recognition of the Confederacy. In an extraordinary stroke of fortune, your soldiers have discovered a copy of Lee's Special Order 191 \u2014 his complete operational plan \u2014 wrapped around three cigars at an abandoned campsite. You now know the precise disposition of his dangerously divided army and possess a 2-to-1 numerical advantage. This is perhaps the single greatest intelligence windfall of the war."
                },
                confederacy: {
                    beginner: "General Lee has taken your army into Maryland, hoping to win a big battle on Northern land. If you win here, Britain and France might help the Confederacy. But your army is spread out across miles of countryside, and you don't know that the enemy just found a copy of your secret plans!",
                    intermediate: "General Lee has boldly invaded Maryland, hoping a victory on Northern soil will convince Britain and France to recognize the Confederacy. But your army is dangerously divided, spread across miles of countryside. Worse, you don't know that the enemy has found a copy of your battle plans.",
                    advanced: "Lee's Maryland Campaign aims to achieve a decisive victory that will secure European diplomatic recognition and demoralize the Northern electorate. However, your army is dangerously dispersed across miles of countryside, with Jackson's corps detached to capture Harpers Ferry. Compounding this vulnerability, McClellan has obtained a copy of Special Order 191 \u2014 your complete operational plan \u2014 though you remain unaware of this catastrophic intelligence breach."
                }
            },
            intel: {
                union: { forces: "87,000 troops", commander: "General George McClellan", advantage: "2-to-1 numerical superiority and enemy's secret battle plans" },
                confederacy: { forces: "45,000 troops", commander: "General Robert E. Lee", advantage: "Strong defensive position with Antietam Creek as a barrier" }
            },
            whatWouldYouDo: {
                union: {
                    prompt: {
                        beginner: "You have Lee's secret plans and twice as many soldiers. His army has its back against a river with no easy escape. How do you attack?",
                        intermediate: "You have Lee's battle plans and twice his numbers. His army has its back to the Potomac River. This could end the war. How do you attack?",
                        advanced: "You possess Lee's operational plans and enjoy a 2-to-1 numerical advantage. His army has the Potomac River at its back, limiting retreat options. This may be the war's decisive moment. How do you exploit this unprecedented intelligence advantage?"
                    },
                    options: {
                        beginner: ["Hit the left side first, then the right, then the middle", "Attack everywhere at the same time so Lee can't move soldiers around", "Get behind Lee and trap his whole army against the river"],
                        intermediate: ["Hit one flank hard, then the other, then the center", "Attack everywhere at once to overwhelm Lee's thin lines", "Cut off Lee's retreat across the Potomac and trap his army"],
                        advanced: ["Execute sequential attacks on the flanks followed by a decisive blow to the weakened center", "Launch a simultaneous assault across the entire front to prevent Lee from shifting reserves", "Maneuver to cut Lee's line of retreat across the Potomac, trapping his army against the river"]
                    },
                    feedback: {
                        beginner: ["That's actually what McClellan did \u2014 and it didn't work well. By hitting one spot at a time, Lee could move his few soldiers to each danger area. If McClellan had attacked everywhere at once, Lee couldn't have done that.", "Great idea! If McClellan had attacked everywhere at once, Lee's small army couldn't have covered every spot. But McClellan was too cautious and attacked in parts, giving Lee time to move soldiers around.", "That's a brilliant strategy that could have ended the war! Unfortunately, McClellan was too careful and slow. He never tried to cut off Lee's escape, and Lee retreated safely to Virginia the next day."],
                        intermediate: ["This is essentially what McClellan did \u2014 sequential attacks north, south, then center. It gave Lee time to shift his outnumbered forces to meet each threat. The result was the bloodiest day in American history, but not the decisive victory it should have been.", "The strongest choice, and one McClellan didn't make. A coordinated assault along the entire front would have prevented Lee from shifting his thin forces. Instead, McClellan attacked in three separate waves, giving Lee time to reinforce each threatened sector.", "Perhaps the most devastating option available. Cutting Lee's retreat would have trapped his army against the Potomac. McClellan's failure to pursue after the battle \u2014 letting Lee escape to Virginia \u2014 frustrated Lincoln so much that he eventually fired McClellan."],
                        advanced: ["This approximates McClellan's actual approach, and it squandered the intelligence advantage. Sequential attacks allowed Lee to employ interior lines, shifting reserves to each threatened sector. The result was a tactical draw rather than the annihilating victory the situation demanded.", "Arguably the optimal strategy given the intelligence advantage. A simultaneous assault would have exploited the fundamental weakness of Lee's position: his 45,000 troops simply could not defend every sector against 87,000 attackers. McClellan's failure to coordinate his attacks remains one of the war's great missed opportunities.", "Strategically the most ambitious option and potentially war-ending. Interposing between Lee and the Potomac fords would have created a Cannae-like encirclement. McClellan's chronic overestimation of Confederate strength \u2014 despite holding Lee's actual plans \u2014 made him too cautious to attempt it."]
                    }
                },
                confederacy: {
                    prompt: {
                        beginner: "You're outnumbered two-to-one and there's a river behind you. If you lose, your army could be trapped. Do you stay and fight, or get out while you can?",
                        intermediate: "Your army is outnumbered 2-to-1 with the Potomac River at your back. If you lose, there's no escape. Do you stay and fight or retreat to Virginia?",
                        advanced: "Your army is outnumbered 2-to-1 with the Potomac at your back, limiting retreat options. McClellan possesses your battle plans, though you may not know this. A defeat here could destroy your army entirely. How do you respond?"
                    },
                    options: {
                        beginner: ["Stay and fight behind the creek", "Cross back over the river to safety", "Attack first to confuse McClellan"],
                        intermediate: ["Stand and fight behind Antietam Creek", "Retreat across the Potomac before McClellan attacks", "Launch a surprise counterattack to throw McClellan off balance"],
                        advanced: ["Defend behind Antietam Creek, using the terrain to offset your numerical disadvantage", "Withdraw across the Potomac to preserve the army for future operations", "Launch a preemptive counterattack to disrupt McClellan's concentration and seize the initiative"]
                    },
                    feedback: {
                        beginner: ["That's what Lee did! He bet that McClellan would be too slow and careful, and he was right. Lee's soldiers fought so hard behind the creek that even with half as many men, the Union couldn't break through.", "That's the safe choice, and many generals would have done it. But Lee refused to retreat. He believed McClellan would be too cautious to use his advantage. Lee was right \u2014 and the battle ended without destroying his army.", "Brave thinking! But with half as many soldiers, attacking a bigger army would be very risky. Lee chose to defend instead, using the creek and the hills to make his smaller army fight like a bigger one."],
                        intermediate: ["That's Lee's choice \u2014 a bold gamble that paid off. Lee correctly judged that McClellan would attack cautiously despite his advantages. By using Antietam Creek and the terrain, Lee's outnumbered army held its ground through the bloodiest day in American history.", "The safer option, and strategically defensible. But Lee believed retreating without a fight would demoralize the South and end hopes of European recognition. His decision to fight \u2014 while costly \u2014 preserved Confederate morale and nearly achieved a draw.", "Audacious, but extremely risky when outnumbered 2-to-1. Lee chose a defensive posture instead, correctly betting that the terrain advantage behind Antietam Creek would offset McClellan's numerical superiority."],
                        advanced: ["This mirrors Lee's actual decision, which reflected his astute reading of McClellan's character. Lee gambled that McClellan's constitutional caution would prevent him from exploiting his advantages \u2014 a judgment vindicated by McClellan's sequential rather than simultaneous attacks. The defensive terrain behind Antietam Creek allowed Lee to fight the battle on his terms despite being outnumbered nearly 2-to-1.", "Strategically prudent and arguably the sounder military decision. However, Lee understood that the campaign's political objectives \u2014 European recognition and Northern demoralization \u2014 required a stand. Withdrawal without battle would have rendered the entire invasion pointless.", "While audacity had served Lee well at previous engagements, a preemptive offensive against a force twice his size risked catastrophic defeat. Lee recognized that his advantage lay in defensive terrain, not offensive maneuver, and positioned accordingly."]
                    }
                }
            },
            whatHappened: {
                beginner: "McClellan attacked in three parts instead of all at once, which gave Lee time to move his soldiers around. The fighting happened in a cornfield, along a sunken road called 'Bloody Lane,' and across Burnside Bridge. Over 22,000 soldiers were killed or hurt in one day \u2014 the bloodiest single day in American history. Lee held his ground but went back to Virginia the next day.",
                intermediate: "McClellan attacked cautiously in three separate waves instead of all at once, giving Lee time to shift his thin forces. The fighting raged through a cornfield, a sunken road called 'Bloody Lane,' and across Burnside Bridge. It became the bloodiest single day in American history, with over 22,000 casualties. Lee held his ground but retreated to Virginia the next day.",
                advanced: "McClellan squandered his intelligence advantage by launching three sequential attacks \u2014 first the northern flank through Miller's Cornfield, then the center at the Sunken Road ('Bloody Lane'), and finally the southern flank across Burnside Bridge \u2014 rather than a coordinated assault. This allowed Lee to employ interior lines, shifting his thin reserves to meet each threat in turn. The result was the bloodiest single day in American history: over 22,000 casualties in twelve hours of fighting. Lee's line bent but never broke, and he withdrew to Virginia the following day with his army intact."
            },
            tech: {
                name: "Battlefield Photography",
                description: {
                    beginner: "A photographer named Alexander Gardner took pictures of dead soldiers at Antietam. These were the first photos of dead Americans on a battlefield. When people in New York saw them, they were shocked. For the first time, people at home could see what war really looked like.",
                    intermediate: "Photographer Alexander Gardner arrived at Antietam days after the battle and took the first photographs of American dead on a battlefield. When displayed in New York, viewers were shocked. For the first time, people at home could see the real horror of war.",
                    advanced: "Alexander Gardner's photographs of Antietam's dead, displayed at Mathew Brady's New York gallery, constituted the first photographic documentation of American battlefield casualties. The images created a public sensation \u2014 the New York Times reported that Brady had 'brought home the terrible reality and earnestness of war.' Photography fundamentally transformed the relationship between the home front and the battlefield, making the war's human cost viscerally real in a way that written accounts never could."
                }
            },
            voice: {
                quote: "A man lying upon the ground asked for a drink of water. I stooped to give it, and having raised him with my right hand, was holding the cup to his lips with my left, when I felt a sudden twitch of the sleeve of my dress. The poor fellow sprang from my hands and fell back quivering in the agonies of death. A ball had passed between my body and the right arm which supported him, cutting through the sleeve, and killing him.",
                attribution: "Clara Barton, volunteer nurse (later founder of the American Red Cross)",
                source: "Library of Congress, Clara Barton Papers",
                explainer: "Clara Barton was helping a wounded soldier drink water when a bullet passed through her sleeve and killed the man she was holding. She risked her life to help soldiers on the battlefield and later started the American Red Cross."
            },
            biggerPicture: {
                beginner: "Lincoln used the battle to make a huge announcement: the Emancipation Proclamation (a document that said all enslaved people in rebel states were now free). This changed the war from just a fight about keeping the country together into a fight to end slavery. Britain and France decided not to help the Confederacy.",
                intermediate: "Lincoln used the 'victory' at Antietam to issue the Emancipation Proclamation, declaring all enslaved people in rebel states to be free. This transformed the war from a fight to save the Union into a war to end slavery, and convinced Britain and France not to support the Confederacy.",
                advanced: "Lincoln leveraged the strategic outcome at Antietam to issue the Emancipation Proclamation, fundamentally redefining the war's purpose. By declaring all enslaved people in rebel states 'forever free,' Lincoln transformed the Union cause from constitutional preservation into a moral crusade against slavery. This masterstroke of statecraft achieved multiple objectives: it energized the abolitionist movement, opened military service to nearly 180,000 Black soldiers, and effectively eliminated the possibility of European intervention on behalf of a slaveholding Confederacy."
            },
            reflection: {
                beginner: "Lincoln used this battle to free enslaved people in the South. Was this because it was the right thing to do, or because it would help win the war \u2014 or both? If you were an enslaved person in Kentucky (a state NOT included in the proclamation), how would you feel?",
                intermediate: "Lincoln used the battle to issue the Emancipation Proclamation. Was this primarily a moral decision or a military strategy \u2014 or both? If you were an enslaved person in a border state like Kentucky, which was NOT included in the Proclamation, how would you feel?",
                advanced: "The Emancipation Proclamation strategically excluded border states to prevent their secession, meaning slavery remained legal in Union territory. Was Lincoln's decision primarily moral conviction, military strategy, or political pragmatism? How does the Proclamation's selective application complicate its legacy? Consider the perspective of an enslaved person in Kentucky \u2014 technically in the Union, but still in bondage."
            },
            winner: "draw",
            outcome: "Tactical draw, strategic Union victory",
            casualties: { union: 12401, confederacy: 10316 },
            keyFact: {
                beginner: "September 17, 1862 is still the bloodiest single day in American history. Over 22,000 soldiers were killed or hurt in just 12 hours. That's more people than live in many small towns.",
                intermediate: "September 17, 1862 remains the bloodiest single day in American history. Over 22,000 soldiers were killed or wounded in just 12 hours of fighting.",
                advanced: "September 17, 1862 remains the bloodiest single day in American history, with over 22,000 casualties in twelve hours. To put this in perspective, Antietam's single-day losses exceeded total American casualties in the War of 1812 and approached those of the entire Revolutionary War."
            },
            perspectives: [
                {
                    title: "The Emancipation Proclamation",
                    icon: "\uD83D\uDCDC",
                    text: "Lincoln's proclamation only freed enslaved people in rebel states \u2014 not in the border states (Missouri, Kentucky, Maryland, Delaware) that remained in the Union. This was a military strategy as much as a moral document: it turned the Union army into an army of liberation and opened the door for nearly 180,000 Black men to enlist as United States Colored Troops."
                },
                {
                    title: "Cotton Diplomacy Fails",
                    icon: "\uD83C\uDF0D",
                    text: "The Confederacy had counted on 'King Cotton' to force Britain and France to intervene. But Antietam and the Emancipation Proclamation changed everything \u2014 no European democracy would support a nation fighting to preserve slavery. The Confederacy would fight alone."
                }
            ]
        },

        freeplay: {
            briefing: "Lee has invaded Maryland, and Union forces have found his battle plans! McClellan's army outnumbers Lee nearly 2-to-1. But Lee is a master tactician fighting with desperate courage. The fate of the war may hinge on this single day of battle near Antietam Creek.",
            difficulty: 7,
            momentumValue: 3,
            strategies: [
                {
                    name: "Coordinated Assault",
                    description: "Use your intelligence advantage to attack all Confederate positions simultaneously.",
                    detail: "Since you know where the enemy is, hit them everywhere at once so they can't shift reinforcements. This requires excellent coordination.",
                    power: { union: 8, confederacy: 4 },
                    casualties: { union: 50000, confederacy: 45000 },
                    outcome: {
                        win: "Your coordinated attack overwhelms the enemy at multiple points! They can't reinforce any sector, and the line begins to crumble.",
                        lose: "The coordination broke down, and your attacks went in piecemeal. The enemy shifted reinforcements to each threatened point."
                    }
                },
                {
                    name: "Cautious Advance",
                    description: "Move slowly and carefully, securing each position before advancing.",
                    detail: "Even with enemy plans, battles are dangerous. A careful advance reduces risk but gives the enemy time to react and reposition.",
                    power: { union: 6, confederacy: 6 },
                    casualties: { union: 35000, confederacy: 35000 },
                    outcome: {
                        win: "Your steady advance pushes the enemy back step by step. The methodical approach means you never overextend, and eventually the pressure tells.",
                        lose: "Your cautious approach gave the enemy too much time. They repositioned and reinforced, turning your careful advance into a bloody stalemate."
                    }
                },
                {
                    name: "Cut Off Retreat",
                    description: "Try to get behind the enemy and trap their entire army.",
                    detail: "Instead of a frontal battle, try to cut off Lee's escape route back to Virginia. If it works, you could capture his whole army and end the war.",
                    power: { union: 7, confederacy: 3 },
                    casualties: { union: 60000, confederacy: 55000 },
                    outcome: {
                        win: "You've cut off the enemy's retreat! Trapped with the river at their back, their army begins to surrender in large numbers.",
                        lose: "The flanking march was detected, and the enemy reacted before you could close the trap. Your forces were caught spread out and vulnerable."
                    }
                }
            ],
            fogOfWar: [
                { mod: 2, text: "Intercepted dispatches reveal a gap in the enemy's defensive line!" },
                { mod: 1, text: "A ford across Antietam Creek is discovered, allowing a flanking approach." },
                { mod: -1, text: "Dense fog over the creek delays your morning attack by hours." },
                { mod: -2, text: "Enemy reinforcements arrive from Harpers Ferry just in time to plug the line." }
            ],
            historicalEvent: { text: "A Union soldier discovers Lee's secret battle plans wrapped around three cigars!", mod: { union: 2, confederacy: -2 }, basis: "Special Order 191, found September 13, 1862" }
        }
    },

    {
        id: "fredericksburg",
        name: "Battle of Fredericksburg",
        date: "December 13, 1862",
        year: 1862,
        location: "Fredericksburg, Virginia",
        image: "images/battle_of_fredericksburg.jpg",
        imageCredit: "Kurz & Allison, 1888",

        historical: {
            situation: {
                union: {
                    beginner: "General Burnside is the new commander of the Union army. He wants to cross a river and march through the town of Fredericksburg to reach Richmond. But his special bridges arrived weeks late, giving Lee time to build defenses on the hills above town. Now you have to run uphill across open fields toward a stone wall full of enemy soldiers.",
                    intermediate: "General Burnside, the new Union commander, plans to cross the Rappahannock River and push through Fredericksburg to reach Richmond. But pontoon bridges arrived weeks late, giving Lee time to fortify the heights above town. Now you must attack uphill across open ground against a stone wall bristling with Confederate rifles.",
                    advanced: "Burnside's operational plan \u2014 crossing the Rappahannock at Fredericksburg to advance on Richmond \u2014 was sound in concept but fatally delayed by the late arrival of pontoon bridges. The weeks of delay allowed Lee to fortify Marye's Heights behind a sunken road and stone wall, creating interlocking fields of fire across open ground that any attacker must cross. You now face the prospect of frontal assault against one of the strongest defensive positions of the war."
                },
                confederacy: {
                    beginner: "You've had weeks to get ready, and your position is amazing. Your army is dug in on top of a hill behind a stone wall. The enemy has to cross a river, walk through a town, and then run uphill into your guns across a wide-open field. There's no place for them to hide.",
                    intermediate: "You've had weeks to prepare the perfect defensive position. Your army is dug in along Marye's Heights behind a stone wall, with clear fields of fire across open ground. The Union army must cross a river, march through a town, and then charge uphill into your guns. Let them come.",
                    advanced: "Burnside's delay has gifted you weeks to construct arguably the war's most formidable defensive position. Your forces occupy Marye's Heights behind a sunken road and stone wall, with overlapping fields of fire covering hundreds of yards of open ground. The terrain creates a natural killing field: the Union army must cross the Rappahannock, advance through Fredericksburg's streets, and then assault uphill against concentrated rifle and artillery fire."
                }
            },
            intel: {
                union: { forces: "114,000 troops", commander: "General Ambrose Burnside", advantage: "Massive numerical superiority" },
                confederacy: { forces: "72,000 troops", commander: "General Robert E. Lee", advantage: "Fortified high ground behind a stone wall" }
            },
            whatWouldYouDo: {
                union: {
                    prompt: {
                        beginner: "The enemy is on top of a hill behind a stone wall. You'd have to run across an open field to reach them. Your generals are begging you to find another way. What do you do?",
                        intermediate: "The enemy holds the high ground behind a stone wall, and you have to cross open ground to reach them. Your generals are begging you to find another way. What do you do?",
                        advanced: "The enemy occupies fortified high ground behind a stone wall with interlocking fields of fire. A frontal assault across open ground appears suicidal. Your subordinate commanders are urging alternative approaches. How do you proceed?"
                    },
                    options: {
                        beginner: ["Keep sending soldiers at the wall until it breaks", "Find a different place to cross the river where there's no wall", "Cancel the attack and come back with a better plan"],
                        intermediate: ["Send wave after wave against the stone wall until it breaks", "Look for a river crossing upstream to avoid the defenses", "Call off the attack and wait for a better opportunity"],
                        advanced: ["Commit to successive frontal assaults, relying on numerical superiority to overwhelm the defenders", "Seek an alternative crossing point upstream to turn the Confederate flank", "Suspend the operation and seek more favorable conditions for an advance on Richmond"]
                    },
                    feedback: {
                        beginner: ["That's what Burnside actually did \u2014 and it was a disaster. He sent 14 charges at the wall, and none of them even reached it. Thousands of soldiers were killed or hurt for nothing.", "Smart thinking! Several of Burnside's generals suggested exactly this. Going around the wall instead of straight at it could have saved thousands of lives. But Burnside stubbornly stuck with his original plan.", "That takes real courage \u2014 sometimes the bravest thing is knowing when not to fight. Burnside should have done this, but he felt pressured to attack. The result was one of the worst Union defeats of the war."],
                        intermediate: ["That's tragically what Burnside did. He ordered 14 assaults against the stone wall, and not one reached it. Over 12,000 Union soldiers fell while the Confederates lost only 5,000. Courage alone cannot overcome fortified positions.", "The wisest military choice. Several Union generals recommended exactly this. Flanking the position would have avoided the killing ground entirely and forced Lee to abandon his defenses. Burnside's refusal to adapt cost thousands of lives.", "A sound decision that Burnside should have made. Political pressure to show action drove him into a battle he couldn't win. Sometimes the best strategy is patience, but Burnside was afraid of looking timid after McClellan's removal for excessive caution."],
                        advanced: ["This mirrors Burnside's catastrophic decision. Fourteen successive assaults failed to reach the stone wall, producing over 12,000 casualties against approximately 5,000 Confederate losses. The disaster demonstrated that the tactical revolution wrought by rifled weapons had made frontal assaults against prepared positions virtually suicidal \u2014 a lesson generals would repeatedly fail to learn.", "Strategically the soundest option. An upstream crossing would have turned Lee's position and potentially forced him to abandon Marye's Heights without a shot. Several subordinate commanders advocated this approach, but Burnside's rigidity and fear of appearing indecisive after McClellan's removal drove him toward the frontal assault.", "Arguably the most prudent course, though politically difficult given Lincoln's frustration with McClellan's inactivity. Burnside felt compelled to demonstrate aggression, leading to a battle that was strategically unnecessary and tactically disastrous. The episode illustrates how political pressure can override sound military judgment."]
                    }
                },
                confederacy: {
                    prompt: {
                        beginner: "The Union army is crossing the river into town. You're on the hilltop with a perfect view. Do you try to stop them at the river, or let them come to you?",
                        intermediate: "The Union army is crossing the river into Fredericksburg. You hold the perfect defensive position. Do you try to stop them at the river or let them cross and attack your wall?",
                        advanced: "The Union army is crossing the Rappahannock into Fredericksburg. You command the most formidable defensive position of the war. Do you contest the crossing or allow the enemy to advance into your killing ground?"
                    },
                    options: {
                        beginner: ["Let them cross and then mow them down in the open field below your wall", "Shoot at them while they're crossing the river", "Attack them in the town while they're still getting organized"],
                        intermediate: ["Let them cross and slaughter them in the open ground below the wall", "Shell them while they cross the river to disrupt their formations", "Launch a counterattack into the town while they're still crossing"],
                        advanced: ["Allow the crossing and engage them in the open ground below Marye's Heights, maximizing your defensive advantage", "Employ artillery to disrupt formations during the river crossing when they are most vulnerable", "Launch a spoiling counterattack into Fredericksburg to catch the enemy in the streets before they can deploy"]
                    },
                    feedback: {
                        beginner: ["That's exactly what Lee did! He let the Union soldiers come across the river and run toward the wall. His soldiers shot them down in rows. It was one of the biggest Confederate victories of the whole war.", "That would cause some damage, but the river is wide and your cannons would have trouble hitting moving targets. Lee decided it was better to let them come all the way across and then destroy them in the open field.", "Bold idea! But Lee realized his position on the hill was so strong that attacking into the town would give up his biggest advantage. Why leave a perfect position to fight in messy streets?"],
                        intermediate: ["Lee's exact strategy. By allowing the Union forces to cross and advance into the open ground, he maximized the killing power of his stone wall position. The result was a devastating Confederate victory with lopsided casualties.", "Artillery fire during the crossing could have inflicted casualties, but Lee correctly judged that the defensive position on Marye's Heights offered a far more decisive advantage. Disrupting the crossing would have deterred Burnside from the very attack Lee wanted him to make.", "Aggressive, but it would have surrendered the greatest defensive advantage of the war. Lee understood that the stone wall position was far more valuable than any gains from a counterattack. His patience turned Fredericksburg into a Confederate triumph."],
                        advanced: ["This mirrors Lee's tactical masterpiece. By ceding the initiative at the river, Lee drew the Union army into a killing ground where the convergence of terrain, fortifications, and concentrated rifle fire made any assault virtually impossible. Longstreet reportedly told Lee, 'A chicken could not live on that field when we open on it.' The result vindicated Lee's defensive patience.", "While contesting river crossings was sound doctrine, Lee recognized that the defensive position on Marye's Heights offered disproportionate tactical advantage. Disrupting the crossing might actually have deterred Burnside from committing to the very frontal assault that Lee's position was designed to destroy.", "A counterattack into Fredericksburg would have traded the war's strongest defensive position for uncertain gains in urban combat. Lee's strategic insight was recognizing that his advantage lay not in offensive action but in allowing the enemy to destroy themselves against his prepared defenses."]
                    }
                }
            },
            whatHappened: {
                beginner: "Burnside ordered his soldiers to charge the stone wall 14 different times. Not once did they reach it. The soldiers fell in rows, shot down by Confederate rifles. Over 12,000 Union soldiers were killed or hurt, while the Confederates lost only about 5,000. It was one of the most one-sided battles of the entire war.",
                intermediate: "Burnside ordered 14 separate assaults against the stone wall on Marye's Heights. Not a single one reached it. Union soldiers fell in rows, mowed down by Confederate rifle fire. Over 12,000 Union soldiers were killed or wounded compared to about 5,000 Confederates. It was one of the most lopsided battles of the war.",
                advanced: "Burnside committed to fourteen successive frontal assaults against the stone wall on Marye's Heights, each meeting the same devastating result. No Union unit came within fifty yards of the wall. The concentrated rifle fire from the sunken road, combined with artillery on the heights, created a killing field that no amount of courage could overcome. Union casualties exceeded 12,600 against approximately 5,300 Confederate losses \u2014 one of the most lopsided engagements of the war and a devastating indictment of command rigidity."
            },
            tech: {
                name: "The Mini\u00e9 Ball",
                description: {
                    beginner: "The Mini\u00e9 ball (MIN-ee ball) was a special bullet that was more accurate than old-fashioned round musket balls. It could hit a target from 500 yards away! At Fredericksburg, soldiers behind the stone wall fired these bullets at charging soldiers with deadly accuracy. This new technology made running at the enemy much more dangerous than generals realized.",
                    intermediate: "The soft lead Mini\u00e9 ball expanded when fired from a rifled musket, making it accurate up to 500 yards. At Fredericksburg, defenders behind the stone wall fired Mini\u00e9 balls into charging troops with devastating accuracy. This technology made frontal assaults far deadlier than generals realized.",
                    advanced: "The Mini\u00e9 ball \u2014 a conical soft-lead projectile that expanded upon firing to grip rifled barrel grooves \u2014 extended effective infantry range to 500 yards, roughly five times that of smoothbore muskets. At Fredericksburg, this technological revolution reached its devastating conclusion: defenders behind the stone wall delivered accurate, sustained fire into charging formations at distances that made successful frontal assault virtually impossible. The tactical implications were clear, though it would take years for military doctrine to fully adapt."
                }
            },
            voice: {
                quote: "We got the order \u2014 Irish Brigade, advance! Forward, double quick! And up that hill we went, right into the blaze of their guns, right up to the base of that stone wall. They mowed us down like grass. Of the whole brigade, barely two hundred and fifty walked off that field. We left our dead in heaps, wearing the green sprigs in their caps so they could be told from the rest.",
                attribution: "Captain William J. Nagle, 88th New York Volunteer Infantry, Irish Brigade",
                source: "Letters published in the New York Irish-American, December 1862 / Irish Brigade Association records",
                explainer: "Captain Nagle is describing the Irish Brigade's charge up the hill toward the stone wall. They wore green sprigs (small plant pieces) in their hats to show they were Irish. Of about 1,200 men, only about 250 survived."
            },
            biggerPicture: {
                beginner: "The disaster at Fredericksburg made many people in the North want to stop fighting. 'Copperhead' Democrats (Northerners who wanted peace) demanded an end to the war. Union soldiers were so angry and sad that some openly said their leaders didn't know what they were doing. Burnside was fired.",
                intermediate: "The disaster at Fredericksburg fueled the growing peace movement in the North. 'Copperhead' Democrats demanded an end to the war. Morale in the Union army hit rock bottom, with soldiers openly questioning their commanders. Burnside was removed from command.",
                advanced: "Fredericksburg's lopsided casualties catalyzed the Northern peace movement, emboldening 'Copperhead' Democrats who demanded a negotiated end to the war. Army morale plummeted to its nadir \u2014 soldiers openly questioned their leadership, and desertions spiked. Burnside was removed from command, but the damage extended beyond personnel: Fredericksburg raised existential questions about whether the Union could sustain the political will to continue a war that seemed to produce nothing but catastrophic defeats in the Eastern Theater."
            },
            reflection: {
                beginner: "Burnside sent his soldiers to charge the stone wall 14 times, and every time they were shot down. When should a leader stop doing something that isn't working? What might make a general keep trying even when it's clearly not going to work?",
                intermediate: "Burnside ordered 14 charges against the stone wall, and every one failed with heavy losses. At what point should a commander call off an attack that isn't working? What pressures might make a general keep attacking even when it's clearly failing?",
                advanced: "Burnside's fourteen futile assaults raise fundamental questions about command responsibility and the psychological dynamics of escalation of commitment. At what point does persistence become recklessness? Consider the pressures Burnside faced: political demands for action, fear of appearing timid, and the sunk-cost fallacy of previous failed charges. How do these dynamics apply beyond military contexts?"
            },
            winner: "confederacy",
            outcome: "Decisive Confederate victory",
            casualties: { union: 12653, confederacy: 5377 },
            keyFact: {
                beginner: "A Confederate officer watching the battle said, 'A chicken could not live on that field.' The Union soldiers had nowhere to hide. Some even tried to use the bodies of soldiers who had already fallen as shields from the bullets.",
                intermediate: "A Confederate officer watching the slaughter said, 'A chicken could not live on that field.' Union soldiers later tried to use the bodies of fallen comrades as cover from the relentless fire.",
                advanced: "Longstreet reportedly assured Lee that 'a chicken could not live on that field when we open on it.' The killing ground before the stone wall became so densely carpeted with Union dead and wounded that survivors used their fallen comrades' bodies as improvised cover \u2014 a grim testament to the technological revolution that had rendered Napoleonic tactics obsolete."
            },
            perspectives: [
                {
                    title: "The Irish Brigade at Marye's Heights",
                    icon: "\u2618\uFE0F",
                    text: "The Irish Brigade \u2014 mostly immigrants who had fled the Great Famine \u2014 charged the stone wall wearing sprigs of green in their caps. Of roughly 1,200 men, barely 250 walked off the field. Many fought for citizenship, to prove that Irish Catholics belonged in America. Their sacrifice became a defining moment in Irish-American identity."
                },
                {
                    title: "Rich Man's War, Poor Man's Fight",
                    icon: "\u2696\uFE0F",
                    text: "By late 1862, the war's cost fell hardest on working-class families. In the North, wealthy men could pay $300 (a year's wages for a laborer) to avoid the coming draft. In the South, the 'Twenty Negro Law' exempted planters who owned 20 or more enslaved people. On both sides, common soldiers asked: whose war are we really fighting?"
                }
            ]
        },

        freeplay: {
            briefing: "The Union army must cross the Rappahannock River and attack Lee's fortified positions on Marye's Heights. Lee has had weeks to prepare, and a stone wall provides perfect cover for his defenders. Attacking uphill across open ground against prepared defenses is extremely dangerous.",
            difficulty: 7,
            momentumValue: 2,
            strategies: [
                {
                    name: "Direct Assault",
                    description: "Charge straight at the stone wall on Marye's Heights.",
                    detail: "Sometimes courage and determination can overcome defensive advantages. A massive frontal assault might break through by sheer weight of numbers.",
                    power: { union: 3, confederacy: 8 },
                    casualties: { union: 70000, confederacy: 10000 },
                    outcome: {
                        win: "Against all odds, your assault breaks through! The sheer determination of your soldiers carries the wall.",
                        lose: "Your brave soldiers fall in rows before the stone wall. Wave after wave is repulsed. The assault is a disaster."
                    }
                },
                {
                    name: "Artillery Bombardment",
                    description: "Use your cannons to soften the defenses before sending infantry.",
                    detail: "Heavy artillery fire can damage fortifications and suppress defenders. But stone walls are hard to destroy, and the bombardment warns the enemy of your intentions.",
                    power: { union: 5, confederacy: 7 },
                    casualties: { union: 55000, confederacy: 15000 },
                    outcome: {
                        win: "Your artillery bombardment creates gaps in the enemy's defenses, and your infantry charges through before they can recover!",
                        lose: "The stone wall survived the bombardment largely intact. Your infantry charges into the same deadly fire, just slightly delayed."
                    }
                },
                {
                    name: "Find Alternative Crossing",
                    description: "Look for a different river crossing to avoid the strongest defenses.",
                    detail: "Instead of attacking the strongest point, find a way around it. This takes more time but might let you avoid the killing ground entirely.",
                    power: { union: 6, confederacy: 6 },
                    casualties: { union: 40000, confederacy: 20000 },
                    outcome: {
                        win: "You find a crossing downstream and hit the enemy's flank! Caught between two forces, their defensive line unravels.",
                        lose: "The alternative crossing was also defended, and the delay gave the enemy time to reinforce. You end up in the same terrible position."
                    }
                }
            ],
            fogOfWar: [
                { mod: 2, text: "Dense morning fog hides your river crossing from enemy observers!" },
                { mod: 1, text: "Union sharpshooters pick off key Confederate officers behind the wall." },
                { mod: -1, text: "Pontoon bridges arrive late, delaying the crossing by hours." },
                { mod: -2, text: "Confederate artillery zeroes in on your troops packed in the town streets." }
            ],
            historicalEvent: null
        }
    },
    {
        id: "chancellorsville",
        name: "Battle of Chancellorsville",
        date: "May 1-6, 1863",
        year: 1863,
        location: "Spotsylvania County, Virginia",
        image: "images/battle_of_chancellorsville.jpg",
        imageCredit: "Jedediah Hotchkiss",

        historical: {
            situation: {
                union: {
                    beginner: "You have 130,000 soldiers against Lee's 60,000 \u2014 more than twice as many! Your plan seems great: sneak around Lee's side while keeping him busy. General Hooker brags, 'My plans are perfect.' The thick forest should hide your soldiers as they move.",
                    intermediate: "You command 130,000 troops against Lee's 60,000. Your plan is brilliant: pin Lee in place while sweeping around his flank. General Hooker boasts, 'My plans are perfect.' The dense Virginia Wilderness should hide your movements.",
                    advanced: "You command 130,000 troops against Lee's 60,000, and your operational plan is genuinely innovative: pin Lee's army frontally while executing a wide flanking maneuver through the Wilderness. Hooker's confidence \u2014 'My plans are perfect' \u2014 is not entirely unfounded. The dense Virginia forest should conceal your movements. However, the same terrain that hides your maneuver also limits your ability to coordinate and deploy your numerical superiority."
                },
                confederacy: {
                    beginner: "You're outnumbered more than two-to-one, and the enemy is coming at you from different directions. Your best general, Stonewall Jackson, has a crazy idea: split your small army in half and sneak 12 miles through the forest to attack the enemy's side. It's super risky, but it might be your only chance.",
                    intermediate: "You're outnumbered more than 2-to-1, and Hooker's army is closing in from multiple directions. Your only hope is a daring gamble: split your already small army and send Stonewall Jackson on a secret 12-mile march to hit the Union flank.",
                    advanced: "Hooker's converging advance threatens to overwhelm your outnumbered army from multiple directions. Jackson proposes a characteristically audacious solution: a concealed 12-mile flanking march through the Wilderness to strike the exposed Union right. The maneuver would require dividing your already outnumbered force \u2014 leaving fewer than 15,000 to hold Hooker's attention while Jackson marches with 28,000. If detected, both halves could be destroyed in detail."
                }
            },
            intel: {
                union: { forces: "130,000 troops", commander: "Joseph Hooker", advantage: "More than 2-to-1 numerical superiority" },
                confederacy: { forces: "60,000 troops", commander: "Robert E. Lee", advantage: "Familiar terrain and bold leadership" }
            },
            whatWouldYouDo: {
                union: {
                    prompt: {
                        beginner: "You have way more soldiers than Lee, but the thick forest makes it hard to use them all. Scouts say Lee might be splitting his army in two. What do you do?",
                        intermediate: "You outnumber Lee 2-to-1, but the dense forest limits your advantage. Reports say Lee may be splitting his forces. What do you do?",
                        advanced: "Your 2-to-1 numerical advantage is constrained by the dense Wilderness terrain. Intelligence reports suggest Lee may be dividing his already outnumbered force. How do you exploit this potential vulnerability?"
                    },
                    options: {
                        beginner: ["Stay in your strong position and let Lee come to you", "Attack now while Lee's army is split in half!", "Move out of the forest to open ground where your bigger army can fight better"],
                        intermediate: ["Hold your strong defensive positions and let Lee come to you", "Attack immediately while Lee's army is divided", "Withdraw to open ground where your numbers matter more"],
                        advanced: ["Maintain your defensive positions and force Lee to attack your superior numbers", "Launch an immediate assault to defeat Lee's divided forces in detail", "Withdraw to open terrain where your numerical and artillery advantages can be fully employed"]
                    },
                    feedback: {
                        beginner: ["That sounds safe, but it's what Hooker did \u2014 and it was a mistake! By staying still, he let Lee and Jackson plan a sneaky flanking attack that smashed the Union right side.", "Great instinct! If Hooker had attacked while Lee's army was split, he could have beaten each half separately. Instead, Hooker hesitated and stayed put, giving Lee time to pull off his surprise attack.", "That's actually really smart thinking! The forest helped Lee's smaller army hide. In the open, Hooker's huge army and cannons would have crushed Lee. But Hooker lost his nerve and didn't move."],
                        intermediate: ["This is what Hooker chose, and it surrendered the initiative entirely. By halting in defensive positions, Hooker allowed Lee and Jackson to execute the very flanking maneuver that destroyed his right flank at dusk.", "Exactly right \u2014 this was the moment to strike. Hooker had reports of Confederate movement but lost his nerve and went defensive instead. Had he attacked while Jackson was on the march, Lee's divided army could have been destroyed.", "A sound strategic concept that would have neutralized the Wilderness advantage. But Hooker's sudden loss of confidence \u2014 he reportedly said 'I just lost faith in Joe Hooker' \u2014 prevented any decisive action."],
                        advanced: ["Hooker's actual decision, and it proved catastrophic. A defensive posture ceded the initiative to a commander renowned for audacity. By halting in the Wilderness, Hooker negated his numerical superiority while allowing Lee to execute the very maneuver that would destroy the Union right flank.", "Strategically optimal given the intelligence available. Attacking a divided enemy force is a fundamental principle of warfare. However, Hooker inexplicably abandoned the offensive and assumed defensive positions, surrendering the initiative at precisely the moment when Lee was most vulnerable. This failure of nerve allowed Jackson to complete his flanking march unmolested.", "Arguably the most strategically sound option, as the Wilderness terrain was Lee's greatest ally. However, Hooker's paralysis in the face of Lee's aggression meant that no coherent movement \u2014 forward, backward, or lateral \u2014 was executed, leaving 130,000 troops passive while 28,000 Confederates marched to their flank."]
                    }
                },
                confederacy: {
                    prompt: {
                        beginner: "You're outnumbered two-to-one. Jackson wants to take half your army on a secret 12-mile march through the woods to surprise-attack the enemy's side. If it fails, both halves of your army could be destroyed. Do you let him try?",
                        intermediate: "You're outnumbered 2-to-1. Jackson proposes a risky 12-mile flanking march that will leave your army dangerously split. Do you approve?",
                        advanced: "Jackson proposes dividing your outnumbered army to execute a 12-mile flanking march through the Wilderness. Success depends on concealment, speed, and Hooker's inaction. Failure would leave both halves of your army vulnerable to destruction in detail. Do you approve this extraordinary gamble?"
                    },
                    options: {
                        beginner: ["Let Jackson go for it \u2014 surprise is your best chance!", "Keep your army together \u2014 it's too risky to split up", "Pull back closer to Richmond where it's safer"],
                        intermediate: ["Send Jackson on the flanking march and hope for surprise", "Keep your army together and fight defensively", "Retreat to stronger positions closer to Richmond"],
                        advanced: ["Approve Jackson's flanking march, accepting the risk of operating with divided forces", "Maintain concentration and fight a defensive battle with your entire force", "Withdraw toward Richmond to consolidate on more defensible terrain"]
                    },
                    feedback: {
                        beginner: ["That's what Lee did! It was the biggest gamble of his career, and it worked perfectly. Jackson's soldiers burst out of the woods at sunset and destroyed the Union right side. It's considered Lee's greatest victory!", "Playing it safe makes sense when you're outnumbered. But Lee knew that fighting head-on against twice as many soldiers wouldn't work either. The risky flanking attack was actually his best chance to win.", "Retreating would have been safe, but Lee hated giving up ground. He believed that boldness and surprise could beat bigger armies. At Chancellorsville, he proved it \u2014 but the cost was terrible."],
                        intermediate: ["Lee approved, and it produced his masterpiece. Jackson's 28,000 men completed the march undetected and shattered the Union right flank at dusk. It was the boldest Confederate maneuver of the war \u2014 and it worked brilliantly.", "Understandable caution, but Lee correctly judged that a straight defensive fight against 2-to-1 odds was unwinnable. The flanking march was high-risk but offered the only realistic path to victory against Hooker's massive army.", "Strategically safe but out of character for Lee. He understood that his army's fighting spirit and Jackson's audacity were his best weapons. Retreat would have demoralized the South and ceded the initiative entirely."],
                        advanced: ["Lee's approval represents the apex of Confederate audacity. The maneuver succeeded spectacularly \u2014 Jackson's corps struck the exposed Union XI Corps at dusk, routing it completely. The gamble rested on Lee's accurate assessment of Hooker's character: a commander prone to hesitation despite numerical superiority. It is widely considered Lee's tactical masterpiece.", "Concentration of force is doctrinally sound, but Lee recognized that a direct engagement against 2-to-1 odds offered poor prospects regardless. The flanking maneuver accepted operational risk to create tactical surprise \u2014 the fundamental principle that inferior forces must rely on audacity to overcome numerical disadvantage.", "Withdrawal would have preserved the army but conceded strategic territory without a fight. Lee's aggressive philosophy held that the Confederate army's morale advantage and superior leadership could offset numerical inferiority through bold maneuver. Chancellorsville validated this approach, though the cost \u2014 Jackson's death \u2014 proved irreplaceable."]
                    }
                }
            },
            whatHappened: {
                beginner: "Lee made the boldest move of the war. He split his small army and sent Jackson on a secret march through the forest. At sunset, Jackson's 28,000 soldiers burst out of the woods and completely destroyed the Union right side. But that night, Jackson was accidentally shot by his own soldiers in the dark. He died eight days later.",
                intermediate: "Lee made his boldest gamble, splitting his army to send Jackson on a secret flanking march. At dusk, Jackson's 28,000 men burst from the woods and shattered the Union right flank. But that night, Jackson was accidentally shot by his own men and died days later.",
                advanced: "Lee executed his most audacious gamble, dividing his outnumbered army to send Jackson on a concealed 12-mile flanking march. At dusk on May 2, Jackson's 28,000 men erupted from the Wilderness and obliterated the exposed Union XI Corps. The rout cascaded through the Union right, creating panic that nearly unraveled Hooker's entire army. However, that evening, Jackson was struck by friendly fire while reconnoitering ahead of his lines. He died eight days later \u2014 an irreplaceable loss that would haunt the Confederacy for the remainder of the war."
            },
            tech: {
                name: "Field Medicine / Ambulance Corps",
                description: {
                    beginner: "Dr. Jonathan Letterman created the first organized ambulance (emergency medical transport) system for the army. He trained special teams to carry wounded soldiers off the battlefield and set up medical stations to help them. His system saved thousands of lives and is still the model for battlefield medicine today.",
                    intermediate: "Dr. Jonathan Letterman created the first organized ambulance corps system, with trained stretcher-bearers and triage stations. His system saved thousands of lives and became the model for military medicine worldwide.",
                    advanced: "Dr. Jonathan Letterman's ambulance corps represented a revolution in military medicine: an organized system of trained stretcher-bearers, field triage stations, and evacuation protocols that replaced the chaos that had previously left wounded soldiers lying on battlefields for days. Letterman's innovations \u2014 including the concept of triage (prioritizing treatment by severity) \u2014 saved thousands of lives and established principles that still undergird military and civilian emergency medicine today."
                }
            },
            voice: {
                quote: "I was enrolled as company laundress, but I did much more than wash. I taught the soldiers of the Thirty-Third to read and write \u2014 most had been enslaved and never held a book. When the wounded came in, I nursed them. I learned to handle a musket very well and could shoot straight. We were proving every day that colored troops could fight and serve as well as any in this army.",
                attribution: "Susie King Taylor, nurse and teacher with the 33rd United States Colored Troops",
                source: "Susie King Taylor, 'Reminiscences of My Life in Camp,' 1902 / Documenting the American South, University of North Carolina",
                explainer: "Susie King Taylor was a Black woman who worked with a regiment of Black soldiers. She was officially a laundress, but she also taught soldiers to read and write, nursed wounded men, and learned to shoot. She's showing that Black soldiers and the people who supported them proved they belonged in the army."
            },
            biggerPicture: {
                beginner: "Lee won his greatest victory, which made him confident enough to invade the North again (leading to Gettysburg). But losing Stonewall Jackson was a blow the Confederacy never recovered from. Jackson was Lee's best general, and Lee never found anyone as good to replace him.",
                intermediate: "Lee's greatest victory gave him the confidence to invade the North again, leading directly to Gettysburg. But losing Stonewall Jackson was a wound the Confederacy never recovered from.",
                advanced: "Chancellorsville gave Lee the confidence to launch a second invasion of the North, leading directly to the Gettysburg Campaign. However, the victory came at a cost the Confederacy could not afford: Jackson's death deprived Lee of his most capable subordinate \u2014 the only commander who could execute the audacious independent maneuvers that were central to Lee's operational art. At Gettysburg, the absence of Jackson's tactical brilliance would prove decisive."
            },
            reflection: {
                beginner: "Lee won a huge battle, but he lost his best general, Stonewall Jackson. Was this victory worth it? When can winning still feel like losing?",
                intermediate: "Lee's greatest victory cost him Stonewall Jackson. When is a victory not worth the price?",
                advanced: "Chancellorsville is often called Lee's masterpiece, yet it cost him Jackson \u2014 arguably the Confederacy's single most irreplaceable asset. How do we evaluate a tactical triumph that inflicts strategic damage on the victor? Consider the concept of a 'Pyrrhic victory': when does the cost of winning exceed the benefit?"
            },
            winner: "confederacy",
            outcome: "Confederate tactical victory at devastating cost",
            casualties: { union: 17278, confederacy: 13303 },
            keyFact: {
                beginner: "Stonewall Jackson was accidentally shot by his own soldiers in the dark! He died 8 days later. Lee said losing Jackson was like losing his right arm. No one could replace him.",
                intermediate: "Stonewall Jackson was accidentally shot by his own men in the darkness. He died 8 days later. Lee never found a replacement who could match Jackson's speed and daring.",
                advanced: "Jackson was struck by three bullets from his own troops while reconnoitering ahead of his lines in the darkness. He died eight days later. Lee's lament \u2014 'I have lost my right arm' \u2014 proved prophetic: no subsequent Confederate commander could replicate Jackson's combination of strategic vision, tactical audacity, and the speed of execution that had made Lee's operational style possible."
            }
        },

        freeplay: {
            briefing: "Hooker's massive Union army of 130,000 faces Lee's 60,000 in the dense Virginia wilderness. Lee is taking an enormous gamble: splitting his outnumbered army to send Jackson on a flanking march. It's either military genius or suicide.",
            difficulty: 6,
            momentumValue: 2,
            strategies: [
                {
                    name: "Hold Defensive Positions",
                    description: "Stay in your strong positions and use your numbers advantage.",
                    detail: "You have twice the enemy's troops and good positions. Let them make the risky moves while you stay safe. But the dense forest makes it hard to use your advantage.",
                    power: { union: 4, confederacy: 7 },
                    casualties: { union: 45000, confederacy: 30000 },
                    outcome: {
                        win: "Your defensive positions hold against the enemy's attacks. Your numerical advantage slowly grinds them down.",
                        lose: "You held your positions, but the enemy found a way around you. The surprise flank attack shattered your defensive line."
                    }
                },
                {
                    name: "Attack While Divided",
                    description: "Strike hard while the enemy's army is split in two.",
                    detail: "The enemy has taken a huge risk by dividing their smaller army. If you attack quickly, you might destroy each half before they can reunite.",
                    power: { union: 7, confederacy: 4 },
                    casualties: { union: 40000, confederacy: 35000 },
                    outcome: {
                        win: "You catch the divided enemy force and destroy one half before the other can help! The gamble of splitting their army backfires catastrophically.",
                        lose: "The dense wilderness slowed your attack, giving the enemy time to reunite. Their flanking force hit you from behind while you were committed."
                    }
                },
                {
                    name: "Withdraw to Open Ground",
                    description: "Pull back out of the wilderness to fight in open terrain.",
                    detail: "The dense forest helps the smaller army hide their movements. In open ground, your larger army would have a huge advantage.",
                    power: { union: 5, confederacy: 6 },
                    casualties: { union: 35000, confederacy: 25000 },
                    outcome: {
                        win: "In open ground, your superior numbers and artillery dominate. The enemy can't hide their movements anymore.",
                        lose: "The withdrawal was mistaken for a retreat. Enemy forces pressed your rearguard, and the orderly pullback became chaotic."
                    }
                }
            ],
            fogOfWar: [
                { mod: 2, text: "Scouts discover the route of Jackson's flanking march through the forest!" },
                { mod: 1, text: "Fresh reinforcements arrive to strengthen your defensive line." },
                { mod: -1, text: "The dense Wilderness makes it impossible to coordinate your artillery effectively." },
                { mod: -2, text: "A massive surprise flank attack catches your right wing completely off guard at dusk!" }
            ],
            historicalEvent: { text: "Jackson's corps completes a secret 12-mile flanking march through the forest!", mod: { union: -2, confederacy: 2 }, basis: "Jackson's flank attack, May 2, 1863" }
        }
    },

    {
        id: "vicksburg",
        name: "Siege of Vicksburg",
        date: "May 18 - July 4, 1863",
        year: 1863,
        location: "Vicksburg, Mississippi",
        image: "images/siege_of_vicksburg.jpg",
        imageCredit: "Kurz & Allison, 1888",

        historical: {
            situation: {
                union: {
                    beginner: "General Grant has been trying for months to capture Vicksburg, a city sitting on top of tall cliffs above the Mississippi River. The river is like a highway through the middle of the country, and the South controls it from Vicksburg. Two attacks on the city walls have already failed.",
                    intermediate: "General Grant has marched his army deep into Mississippi after months of failed attempts to reach Vicksburg. The fortress city sits on high bluffs above the Mississippi River, blocking Union control of the waterway. Two direct assaults have already failed with heavy losses.",
                    advanced: "After months of unsuccessful approaches \u2014 canal schemes, bayou expeditions, and two costly direct assaults \u2014 Grant has maneuvered his army to encircle Vicksburg. The fortress city, perched on 200-foot bluffs commanding the Mississippi River, is the last Confederate stronghold preventing Union control of the waterway. Its fall would bisect the Confederacy, but the fortifications have proven impervious to frontal assault."
                },
                confederacy: {
                    beginner: "You hold Vicksburg, called the 'Gibraltar of the Confederacy' because it seems impossible to capture. The city sits on top of 200-foot cliffs above the Mississippi River. As long as you hold it, the Confederacy stays connected. You have 30,000 soldiers and strong walls.",
                    intermediate: "You hold Vicksburg, the 'Gibraltar of the Confederacy,' perched on 200-foot bluffs above the Mississippi River. As long as you hold this city, the Confederacy remains connected. General Pemberton has 30,000 troops behind strong fortifications.",
                    advanced: "You hold Vicksburg, the 'Gibraltar of the Confederacy' \u2014 a fortress city commanding the Mississippi from 200-foot bluffs. Its strategic importance cannot be overstated: as long as Vicksburg holds, the Confederacy maintains its trans-Mississippi connection to Texas, Arkansas, and Louisiana. Pemberton commands 30,000 troops behind formidable fortifications that have already repelled two Union assaults."
                }
            },
            intel: {
                union: { forces: "77,000 troops", commander: "Ulysses S. Grant", advantage: "Complete encirclement and naval superiority" },
                confederacy: { forces: "30,000 troops", commander: "John C. Pemberton", advantage: "Strong hilltop fortifications and interior lines" }
            },
            whatWouldYouDo: {
                union: {
                    prompt: {
                        beginner: "You've already tried attacking the city walls twice, and both times your soldiers were beaten back. The city is on top of high cliffs. What do you try now?",
                        intermediate: "Two direct assaults on Vicksburg's fortifications have failed with heavy losses. The city sits on high bluffs with strong defenses. How do you take it?",
                        advanced: "Two direct assaults against Vicksburg's fortifications have been repulsed with significant casualties. The city's position on commanding bluffs makes frontal assault extremely costly. How do you reduce this fortress?"
                    },
                    options: {
                        beginner: ["Surround the city and don't let any food in until they give up", "Try one more big attack with even more soldiers", "Use the Navy's big guns to blast the city from the river"],
                        intermediate: ["Surround the city and starve it into surrender", "Launch another massive assault with more troops", "Bombard the city with naval guns until it falls"],
                        advanced: ["Invest the city completely and reduce the garrison through systematic siege and starvation", "Commit to a third and larger assault, concentrating overwhelming force on the weakest sector", "Employ sustained naval bombardment to degrade fortifications and break the garrison's will"]
                    },
                    feedback: {
                        beginner: ["That's exactly what Grant did! He surrounded Vicksburg so nothing could get in or out. After 47 days, the people inside were so hungry they ate rats and shoe leather. The city finally gave up on July 4, 1863.", "Brave idea, but the first two attacks already failed. Grant decided that another attack would just get more soldiers killed. He chose to surround the city and wait instead \u2014 and it worked!", "The Navy did try this! Gunboats fired at the city, but the cliffs were so high and the walls so thick that the shells didn't do enough damage. Grant knew he needed to starve the city out."],
                        intermediate: ["Exactly Grant's decision. He established a complete encirclement and settled in for a 47-day siege. Soldiers and civilians slowly starved until Pemberton surrendered on July 4, 1863. Patience proved more effective than courage against fortified positions.", "Understandable determination, but Grant wisely recognized that the fortifications were simply too strong for frontal assault. A third attack would have produced casualties without results. The siege was the smarter play.", "Naval bombardment was tried throughout the siege but couldn't breach fortifications built into 200-foot bluffs. The guns kept pressure on the garrison, but it was starvation \u2014 not shells \u2014 that ultimately forced the surrender."],
                        advanced: ["This mirrors Grant's actual decision and represents a masterclass in strategic patience. The 47-day siege starved the garrison into submission without the prohibitive casualties of another assault. Grant understood that time was his ally: no Confederate relief force could break through his encirclement.", "Grant had already demonstrated at the May 19 and May 22 assaults that Vicksburg's fortifications could not be carried by direct assault. A third attempt would have repeated the same bloody calculus. Grant's strategic maturity showed in his willingness to accept the slower but surer method of siege.", "Naval bombardment supplemented the siege but could not independently reduce fortifications built into natural bluffs. Admiral Porter's gunboats maintained constant pressure, but Grant recognized that the fortress's fall required the methodical strangulation of siege rather than the application of firepower alone."]
                    }
                },
                confederacy: {
                    prompt: {
                        beginner: "Grant's army has surrounded your city and nothing can get in \u2014 not food, not supplies, not help. Everyone is getting hungrier every day. What do you do?",
                        intermediate: "Grant's army surrounds your city and has cut off all supply lines. Your soldiers and civilians are running out of food. Relief armies have failed to break through.",
                        advanced: "Grant's army has completed the investment of Vicksburg, severing all supply lines. Your garrison and the civilian population face escalating starvation. Attempted relief operations have failed to penetrate Grant's encirclement. How do you respond to this deteriorating situation?"
                    },
                    options: {
                        beginner: ["Hold on and wait for a rescue army to come", "Try to break out of the trap with your whole army", "Give up now while your soldiers are still healthy enough to negotiate good terms"],
                        intermediate: ["Hold out and hope for a relief force to arrive", "Attempt a breakout with your entire garrison", "Negotiate surrender terms while you still have bargaining power"],
                        advanced: ["Continue to hold and await a Confederate relief expedition", "Attempt a breakout through Grant's siege lines with the entire garrison", "Negotiate surrender terms from a position of relative strength before the garrison deteriorates further"]
                    },
                    feedback: {
                        beginner: ["That's what Pemberton tried. He waited and waited for help, but no rescue army ever made it through. After 47 days, his soldiers were too weak to fight and he had to surrender.", "A breakout could save the army, but Grant had so many soldiers surrounding the city that there was no gap to escape through. Pemberton decided it was too risky.", "Smart thinking about timing! Pemberton waited too long to negotiate. By the time he surrendered on July 4, his soldiers were so starved and sick that he had almost no bargaining power left."],
                        intermediate: ["Pemberton's choice, and it ended in failure. No Confederate relief force could break through Grant's lines. After 47 days, the garrison was too starved and sick to continue. The delay only worsened surrender terms.", "A breakout was considered but deemed impossible \u2014 Grant's encirclement was too tight and the garrison too weakened by hunger. The attempt would likely have resulted in the army's destruction in the open.", "Arguably the wisest option. Earlier negotiation would have secured better terms while the garrison still had fighting strength. Pemberton's delay \u2014 hoping for relief that never came \u2014 meant surrendering a weakened, starving army with no leverage."],
                        advanced: ["Pemberton's actual decision, ultimately driven by hope for Johnston's relief expedition that never materialized. The delay consumed what remained of the garrison's combat effectiveness without achieving any strategic benefit. Each day of holding out simply increased civilian suffering and decreased bargaining leverage.", "A breakout attempt against Grant's fortified siege lines would have required the starving garrison to execute an offensive operation against a superior force in prepared positions \u2014 effectively inverting the defenders' disadvantage that had protected Vicksburg. The operation was operationally infeasible given the garrison's deteriorated condition.", "The most strategically sound option. Negotiating while the garrison retained combat capability would have secured better terms and spared weeks of civilian suffering. Grant eventually offered parole rather than imprisonment \u2014 terms he might not have offered to a stronger garrison, but which demonstrated his pragmatic approach to ending the siege."]
                    }
                }
            },
            whatHappened: {
                beginner: "Grant surrounded the city and waited for 47 days. Nobody could get in or out. People inside got so hungry they ate mules, rats, and even boiled shoe leather! On July 4, 1863 \u2014 the same day Lee retreated from Gettysburg \u2014 the city finally gave up.",
                intermediate: "Grant settled into a 47-day siege, surrounding the city and cutting off all supplies. Soldiers and civilians alike slowly starved. People ate mules, rats, and boiled shoe leather. On July 4, 1863, the same day Lee retreated from Gettysburg, Pemberton surrendered the entire garrison.",
                advanced: "Grant established a comprehensive siege, encircling the city with entrenchments while the Navy blockaded the river approaches. Over 47 days, the garrison and civilian population endured systematic starvation \u2014 reduced to consuming mules, rats, and boiled shoe leather. Union engineers dug approach trenches and detonated a mine under Confederate lines. On July 4, 1863 \u2014 the same day Lee retreated from Gettysburg \u2014 Pemberton surrendered his entire garrison of nearly 30,000 men, the largest capitulation of American troops until World War II."
            },
            tech: {
                name: "Trench Warfare",
                description: {
                    beginner: "Both sides dug miles of trenches (long ditches for soldiers to hide in) and tunnels around Vicksburg. Union engineers even dug a tunnel under the Confederate walls and blew it up with explosives! This kind of trench fighting was a preview of what World War I would look like 50 years later.",
                    intermediate: "Both sides dug miles of trenches, tunnels, and fortifications around Vicksburg. Union engineers even detonated a mine under Confederate lines. This style of warfare foreshadowed the trench warfare of World War I fifty years later.",
                    advanced: "The Vicksburg siege produced an elaborate system of approach trenches, parallel fortifications, and mining operations that presaged the Western Front of World War I by half a century. Union engineers constructed saps and parallels that advanced inexorably toward Confederate lines, ultimately detonating a 2,200-pound mine beneath the 3rd Louisiana Redan. The siege demonstrated that modern fortifications required methodical reduction rather than direct assault."
                }
            },
            voice: {
                quote: "We are utterly cut off from the world, surrounded by a circle of fire. People do nothing but eat what they can get, sleep when they can, and dodge the shells.",
                attribution: "Dora Miller, civilian woman in besieged Vicksburg",
                source: "Diary, Library of Congress",
                explainer: "Dora Miller was a woman living in Vicksburg during the siege. She's describing how terrible it was for regular people \u2014 trapped, always hungry, and constantly dodging cannonballs and shells falling on the city."
            },
            biggerPicture: {
                beginner: "Vicksburg fell on July 4, and Gettysburg ended the day before \u2014 two huge Union wins in two days! The Union now controlled the whole Mississippi River, cutting the Confederacy in half. Texas, Arkansas, and Louisiana were completely cut off from the rest of the South.",
                intermediate: "Vicksburg's fall on July 4, combined with Gettysburg the day before, broke the Confederacy in two. The Union now controlled the entire Mississippi River, cutting off Texas, Arkansas, and Louisiana from the rest of the South.",
                advanced: "The fall of Vicksburg on July 4, following Gettysburg by a single day, marked the war's strategic turning point. Union control of the entire Mississippi River bisected the Confederacy, severing the trans-Mississippi states \u2014 Texas, Arkansas, and Louisiana \u2014 from the Eastern Confederacy. The twin victories destroyed Confederate hopes of European intervention and shifted the strategic initiative permanently to the Union."
            },
            reflection: {
                beginner: "Regular people in Vicksburg \u2014 moms, dads, kids \u2014 had to hide in caves and eat rats because of the siege. Is it OK to make regular people suffer to win a war? Is there a better way?",
                intermediate: "Civilians in Vicksburg lived in caves and ate rats during the siege. Is it acceptable to target civilians to win a war?",
                advanced: "The Vicksburg siege inflicted severe suffering on the civilian population, raising fundamental ethical questions about the conduct of war. Is the deliberate starvation of a civilian population a legitimate military strategy? How do we weigh the military necessity of siege warfare against the humanitarian cost? Consider how modern international law \u2014 the Geneva Conventions \u2014 attempts to address these dilemmas."
            },
            winner: "union",
            outcome: "Union victory - Mississippi River secured",
            casualties: { union: 4835, confederacy: 32697 },
            keyFact: {
                beginner: "Vicksburg surrendered on July 4 \u2014 Independence Day! The people of Vicksburg were so upset about surrendering on that date that they refused to celebrate the Fourth of July for over 80 years.",
                intermediate: "Vicksburg surrendered on July 4, 1863. The city was so bitter about the date that residents refused to celebrate Independence Day for over 80 years afterward.",
                advanced: "Pemberton, a Northern-born officer serving the Confederacy, deliberately chose July 4 for the surrender, calculating that Grant would offer more generous terms on Independence Day. The gambit worked \u2014 Grant paroled the garrison rather than imprisoning them \u2014 but the date left such bitterness that Vicksburg residents reportedly refused to celebrate Independence Day until the 1940s."
            }
        },

        freeplay: {
            briefing: "Vicksburg, the 'Gibraltar of the Confederacy,' controls the Mississippi River from 200-foot bluffs. Grant's army has surrounded the fortress city after two failed assaults. Inside, 30,000 Confederate troops and thousands of civilians are slowly starving. Grant must decide how to crack this nut.",
            difficulty: 7,
            momentumValue: 4,
            strategies: [
                {
                    name: "Direct Assault",
                    description: "Storm the fortifications with overwhelming numbers.",
                    detail: "A massive frontal assault could end the siege quickly. But attacking uphill against strong fortifications is the most dangerous option. Two assaults have already failed.",
                    power: { union: 4, confederacy: 8 },
                    casualties: { union: 50000, confederacy: 20000 },
                    outcome: {
                        win: "Your troops find a weak point in the defenses and pour through! The garrison is overwhelmed before they can react.",
                        lose: "The assault is thrown back with terrible losses, just like the two before it. The bluffs and fortifications are simply too strong."
                    }
                },
                {
                    name: "Siege and Starve",
                    description: "Tighten the ring and wait for starvation to force surrender.",
                    detail: "Cut off all supplies and wait. Time is on your side. The garrison and civilians will eventually run out of food. It's slow but almost certain to work.",
                    power: { union: 8, confederacy: 4 },
                    casualties: { union: 15000, confederacy: 35000 },
                    outcome: {
                        win: "After weeks of starvation, the garrison has no choice. The white flag goes up and the entire army surrenders. The Mississippi is yours.",
                        lose: "A Confederate relief force breaks through your siege lines and resupplies the garrison. You'll have to start the siege all over again."
                    }
                },
                {
                    name: "Naval Bombardment",
                    description: "Use Union gunboats to pound the city from the river.",
                    detail: "The Union Navy has powerful ironclad gunboats on the Mississippi. Concentrated naval fire could weaken the defenses enough for ground troops to break through.",
                    power: { union: 6, confederacy: 6 },
                    casualties: { union: 30000, confederacy: 30000 },
                    outcome: {
                        win: "The naval bombardment breaches the river-facing fortifications. Combined with a ground attack, the city's defenses crumble.",
                        lose: "The high bluffs make it nearly impossible for naval guns to hit the fortifications effectively. The bombardment causes damage but doesn't break the defenses."
                    }
                }
            ],
            fogOfWar: [
                { mod: 2, text: "A daring nighttime run past the fortress guns brings fresh gunboats and supplies!" },
                { mod: 1, text: "A deserter reveals the garrison is down to quarter rations and running out of ammunition." },
                { mod: -1, text: "Disease sweeps through the siege lines, weakening your troops in the summer heat." },
                { mod: -2, text: "A Confederate relief force is approaching from the east, threatening your rear!" }
            ],
            historicalEvent: null
        }
    },

    {
        id: "gettysburg",
        name: "Battle of Gettysburg",
        date: "July 1-3, 1863",
        year: 1863,
        location: "Gettysburg, Pennsylvania",
        image: "images/battle_of_gettysburg.jpg",
        imageCredit: "Thure de Thulstrup, 1887",

        historical: {
            situation: {
                union: {
                    beginner: "Lee has marched his army into Pennsylvania \u2014 the North! Your army is racing to stop him. When Union soldiers on horses find Confederate troops near a little town called Gettysburg, you rush to grab the hilltops. Whoever holds the high ground will have a huge advantage.",
                    intermediate: "Lee has invaded the North again, marching into Pennsylvania. Your army is racing to intercept him. When Union cavalry finds Confederate troops near Gettysburg, you rush to seize the high ground on Cemetery Ridge and the surrounding hills.",
                    advanced: "Lee has launched his second invasion of the North, advancing into Pennsylvania with 71,000 veterans. Your Army of the Potomac is racing to intercept. When Buford's cavalry discovers Confederate forces near Gettysburg, you rush to seize the commanding terrain: Cemetery Ridge, Little Round Top, and Culp's Hill. The defensive advantage of this high ground could prove decisive against Lee's aggressive tactical style."
                },
                confederacy: {
                    beginner: "After your big win at Chancellorsville, Lee has brought the army into Pennsylvania. If you win a huge battle on Northern soil, the North might give up and let the Confederacy go. Your army runs into the enemy near a small town called Gettysburg.",
                    intermediate: "After your triumph at Chancellorsville, Lee has brought the war to Northern soil. A decisive victory here could force the Union to negotiate peace. Your army meets the enemy unexpectedly near the small town of Gettysburg.",
                    advanced: "Buoyed by Chancellorsville, Lee has launched an ambitious invasion of Pennsylvania, seeking a decisive victory that could fracture Northern political will and compel a negotiated peace. Your army encounters Union forces unexpectedly near Gettysburg. The engagement develops into a meeting battle on terrain that increasingly favors the defender \u2014 the Union army occupies the high ground, and without Jackson, your ability to execute the flanking maneuvers that defined Lee's operational art is diminished."
                }
            },
            intel: {
                union: { forces: "93,000 troops", commander: "George Meade", advantage: "Defensive high ground on Cemetery Ridge" },
                confederacy: { forces: "71,000 troops", commander: "Robert E. Lee", advantage: "Veteran army riding high on recent victories" }
            },
            whatWouldYouDo: {
                union: {
                    prompt: {
                        beginner: "You're on top of the hills, which is a great spot to defend. But Lee's army is getting ready to attack, and the edges of your line need more soldiers. What do you do?",
                        intermediate: "You hold the high ground on Cemetery Ridge, but Lee's army is massing for an attack. Your flanks at Little Round Top and Culp's Hill need reinforcing. Where do you focus?",
                        advanced: "You occupy the commanding high ground of Cemetery Ridge, but Lee is concentrating for an assault. Your flanks at Little Round Top and Culp's Hill are vulnerable. How do you allocate your defensive resources?"
                    },
                    options: {
                        beginner: ["Send soldiers to protect both sides so Lee can't get around you", "Make the center strong and wait for Lee to attack uphill", "Surprise Lee by attacking first before he's ready"],
                        intermediate: ["Reinforce both flanks to prevent being surrounded", "Strengthen the center and wait for Lee to attack uphill", "Launch a surprise counterattack before Lee is ready"],
                        advanced: ["Reinforce both flanks to prevent envelopment while maintaining a central reserve", "Concentrate reserves in the center, relying on terrain to defend the flanks", "Seize the initiative with a preemptive counterattack before Lee can organize his assault"]
                    },
                    feedback: {
                        beginner: ["Smart thinking! That's close to what actually happened. Meade kept soldiers ready to help wherever needed. When Lee attacked the sides, Union soldiers barely held on at Little Round Top \u2014 one of the closest calls of the whole war.", "A strong center helped, but the sides turned out to be more important! On Day 2, Lee attacked both sides. If a few more Union soldiers hadn't rushed to Little Round Top at the last second, the whole battle might have been lost.", "Bold, but risky! The high ground was such a great defensive position that leaving it to attack would throw away your biggest advantage. Meade wisely let Lee come to him."],
                        intermediate: ["Closest to Meade's actual approach. He maintained a strong central reserve and reinforced threatened points as needed. The flexibility of his defensive line \u2014 the famous 'fishhook' shape \u2014 allowed rapid shifting of troops to meet each Confederate thrust.", "A strong center proved crucial during Pickett's Charge on Day 3, but the real crisis came on Day 2 when Lee attacked both flanks. Little Round Top was nearly lost \u2014 only a desperate bayonet charge by the 20th Maine saved the position.", "Aggressive, but it would have surrendered the enormous advantage of the high ground. Lee was hoping Meade would do something like this. The Union's defensive position was so strong that attacking into it would have been the mistake."],
                        advanced: ["This approximates Meade's actual defensive approach. The 'fishhook' formation allowed interior lines and rapid reinforcement of threatened sectors. Meade's flexibility in shifting reserves to meet each Confederate thrust \u2014 without abandoning the central position \u2014 was operationally sound and historically validated.", "While the center proved critical during Pickett's Charge, the decisive moments came on the flanks. Little Round Top was nearly overrun on Day 2 \u2014 Chamberlain's 20th Maine executed a desperate bayonet charge that may have saved the entire position. A purely center-focused defense risked losing the flanks that anchored the line.", "While seizing the initiative has tactical merit, it would have surrendered the decisive advantage of the high ground. Lee's entire operational plan depended on forcing the Union off its defensive terrain. A Union counterattack into open ground would have played directly into Confederate strengths."]
                    }
                },
                confederacy: {
                    prompt: {
                        beginner: "The Union army is on top of the hills, which makes them very hard to attack. Your general Longstreet says you should go around them instead. But Lee wants to attack head-on. What do you do?",
                        intermediate: "The Union army holds strong hilltop positions. Longstreet urges you to swing around and get between Meade and Washington. But Lee wants to attack. What do you do?",
                        advanced: "The Union army occupies commanding hilltop positions with interior lines and a strong defensive formation. Longstreet advocates a strategic flanking maneuver to interpose between Meade and Washington. Lee favors a direct assault. How do you resolve this debate?"
                    },
                    options: {
                        beginner: ["Attack the middle of the Union line with everything you've got", "Go around the Union army and get between them and Washington", "Leave and find a better place to fight"],
                        intermediate: ["Attack the Union center with everything you have", "Flank around the Union position to cut them off", "Withdraw and choose better ground for the fight"],
                        advanced: ["Commit to a frontal assault against the Union center, concentrating overwhelming force at the decisive point", "Execute a strategic envelopment to interpose between the Army of the Potomac and Washington", "Disengage and maneuver to more favorable terrain, forcing the Union to abandon their defensive advantage"]
                    },
                    feedback: {
                        beginner: ["That's what Lee chose on Day 3 \u2014 Pickett's Charge. He sent 12,000 soldiers across a mile of open field toward the Union center. It was a disaster. Union cannons and rifles cut them down, and fewer than half made it back. Lee said, 'It is all my fault.'", "That's what Longstreet wanted to do! Many historians think this would have been much smarter. Going around the Union army would have forced them off the hills without a bloody charge. But Lee decided to attack instead.", "This might have been the smartest choice. Without Stonewall Jackson, Lee didn't have the right commander for the bold moves that used to work. But Lee was confident from his recent victories and refused to back down."],
                        intermediate: ["Lee chose this on Day 3 with Pickett's Charge: 12,000 men marching nearly a mile across open ground. Union artillery and rifle fire devastated the attacking columns. Fewer than half returned. It was Lee's worst defeat and the turning point of the war.", "Longstreet's recommendation, and many historians consider it the war's greatest 'what if.' A flanking maneuver would have forced Meade to abandon his defensive advantage and fight on ground of Lee's choosing. Lee's insistence on a frontal assault squandered his army.", "Arguably the wisest option. Without Jackson, Lee lacked the subordinate capable of executing the complex maneuvers his plans required. Disengagement would have preserved the army for future operations. Lee's overconfidence from Chancellorsville drove him to attack."],
                        advanced: ["Lee's actual decision on Day 3 produced the war's most infamous tactical disaster. Pickett's Charge sent 12,000 men across nearly a mile of open ground against concentrated artillery and rifle fire. The assault achieved momentary penetration at 'the Angle' before being overwhelmed. The failure demonstrated that without Jackson's execution capability, Lee's aggressive operational style became self-destructive.", "Longstreet's proposal remains one of the war's most debated 'what ifs.' A strategic envelopment would have exploited Confederate strategic mobility while negating the Union's tactical advantage of the high ground. Lee rejected it, reportedly declaring 'The enemy is there and I am going to attack him.' The decision reflects the dangerous overconfidence bred by Chancellorsville.", "Strategically the most prudent option and one that Longstreet's wing could have executed effectively. Without Jackson, Lee's army lacked the capacity for the rapid independent maneuver that had produced his previous victories. Withdrawal would have preserved the army's combat power for future operations on more favorable terms."]
                    }
                }
            },
            whatHappened: {
                beginner: "The battle lasted three terrible days. Day 1: The Confederates pushed Union soldiers back through town, but the Union grabbed the hilltops. Day 2: Lee attacked both sides and almost broke through at a spot called Little Round Top. Day 3: Lee sent 12,000 men in 'Pickett's Charge' across a mile of open field. They were mowed down by cannons and rifles. Lee retreated to Virginia.",
                intermediate: "Three days of desperate fighting. Day 1: Confederates pushed Union forces through town but failed to take the high ground. Day 2: Attacks on both flanks nearly broke through at Little Round Top. Day 3: Lee sent 12,000 men in Pickett's Charge across a mile of open ground. It was slaughtered. Lee retreated to Virginia.",
                advanced: "Three days of escalating carnage defined the war's decisive battle. Day 1: Confederate forces drove the Union through Gettysburg but failed to seize Cemetery Hill before reinforcements arrived. Day 2: Longstreet's assault on the Union left nearly succeeded at Little Round Top, saved only by Chamberlain's desperate bayonet charge, while Ewell's attack on Culp's Hill was repulsed. Day 3: Lee committed to Pickett's Charge \u2014 12,000 men advancing nearly a mile across open ground against concentrated artillery and rifle fire. The assault achieved a brief penetration at 'the Angle' before being annihilated. Lee withdrew to Virginia, his invasion force shattered."
            },
            tech: {
                name: "Artillery",
                description: {
                    beginner: "Before Pickett's Charge, over 300 cannons fired at the same time \u2014 the biggest cannonade (artillery bombardment) in North American history! The ground shook for miles. But most Confederate shells flew too far and missed the Union soldiers they were supposed to hit.",
                    intermediate: "Over 300 cannons fired in the bombardment before Pickett's Charge, the largest artillery barrage in North American history. The ground shook for miles. Despite the firepower, most Confederate shells overshot the Union line.",
                    advanced: "The bombardment preceding Pickett's Charge involved over 300 guns \u2014 the largest artillery concentration in North American history. However, Confederate shells consistently overshot the Union line on Cemetery Ridge, striking rear areas rather than the infantry and artillery they needed to suppress. This failure left Union defensive firepower largely intact for the infantry assault. The episode demonstrated that massed artillery could not reliably suppress well-positioned defenders \u2014 a lesson that would be relearned at enormous cost in World War I."
                }
            },
            voice: {
                quote: "General, I have no division now.",
                attribution: "George Pickett to Robert E. Lee, after the failed charge",
                source: "Well-documented in multiple primary accounts",
                explainer: "After Pickett's Charge failed, General Pickett told Lee that his entire division had been destroyed. Most of his soldiers were killed, wounded, or captured. Lee's response was: 'It is all my fault.'"
            },
            biggerPicture: {
                beginner: "The Confederacy would never invade the North again. Lincoln gave his famous Gettysburg Address, saying the war was a fight for equality. That same month, the 54th Massachusetts \u2014 a regiment of Black soldiers \u2014 fought bravely at Fort Wagner, proving that African Americans would fight and die for their own freedom.",
                intermediate: "The Confederate invasion of the North failed forever. Lincoln's Gettysburg Address redefined the war as a fight for equality. That same month, the 54th Massachusetts, a Black regiment, fought heroically at Fort Wagner, proving that African Americans would fight and die for their own freedom.",
                advanced: "Gettysburg ended any realistic Confederate hope of achieving independence through military victory on Northern soil. Lincoln's Gettysburg Address, delivered at the battlefield's dedication in November, reframed the war as a test of whether a nation 'conceived in liberty and dedicated to the proposition that all men are created equal' could endure. That same July, the 54th Massachusetts' heroic assault on Fort Wagner demonstrated that African Americans would fight and die for the nation's founding ideals \u2014 accelerating Black enlistment that would ultimately total nearly 180,000 soldiers."
            },
            reflection: {
                beginner: "Pickett's Charge sent 12,000 men running across an open field into cannons and rifles. Two weeks later, Black soldiers of the 54th Massachusetts charged a fort against similar odds. What makes these two charges alike? What makes them different? Is it fair for leaders to send soldiers into battles they probably can't win?",
                intermediate: "Pickett's Charge sent 12,000 men across open ground against entrenched artillery. Two weeks later, the 54th Massachusetts charged Fort Wagner against similar odds. What do these two charges have in common? What makes them different? Who bears responsibility when leaders order soldiers into battles they cannot win?",
                advanced: "Pickett's Charge and the 54th Massachusetts' assault on Fort Wagner both sent men against fortified positions with predictably devastating results. Yet they are remembered very differently: one as a tragic Confederate folly, the other as a heroic statement of Black military capability. What accounts for these divergent legacies? Consider the political context: Pickett's men fought to preserve slavery; the 54th fought to prove their humanity. How does purpose shape our moral evaluation of sacrifice?"
            },
            winner: "union",
            outcome: "Decisive Union victory - turning point of the war",
            casualties: { union: 23049, confederacy: 28063 },
            keyFact: {
                beginner: "During Pickett's Charge, 12,000 Confederate soldiers had to walk almost a mile across an open field while cannons and rifles shot at them. Fewer than half made it back. Lee told his men, 'It is all my fault.'",
                intermediate: "During Pickett's Charge, 12,000 Confederate soldiers marched nearly a mile across open ground. Union artillery and rifle fire cut them to pieces. Fewer than half made it back. Lee told his men, 'It is all my fault.'",
                advanced: "Pickett's Charge required 12,000 men to advance nearly a mile across open ground under concentrated artillery and rifle fire. The assault achieved a momentary penetration at 'the Angle' before being overwhelmed. Fewer than half the attackers returned. Lee personally rode among the survivors, accepting full responsibility: 'It is all my fault.' The failed charge became the Confederacy's 'high-water mark.'"
            },
            perspectives: [
                {
                    title: "The 54th Massachusetts at Fort Wagner",
                    icon: "\u270A",
                    text: "Two weeks after Gettysburg, the 54th Massachusetts Infantry \u2014 one of the first Black regiments \u2014 led a doomed assault on Fort Wagner, South Carolina. Sergeant William Carney, wounded twice, kept the American flag from touching the ground, becoming the first Black soldier to earn the Medal of Honor. The 54th's courage silenced doubters and led to the enlistment of nearly 180,000 Black soldiers by war's end."
                },
                {
                    title: "The New York City Draft Riots",
                    icon: "\uD83D\uDD25",
                    text: "That same July, the first military draft in U.S. history sparked four days of violence in New York City. Working-class white men, many of them Irish immigrants, attacked draft offices, then turned their rage on Black New Yorkers \u2014 burning the Colored Orphan Asylum and lynching Black men in the streets. The riots revealed deep class and racial tensions within the North itself."
                }
            ]
        },

        freeplay: {
            briefing: "The war's biggest battle! Lee has invaded Pennsylvania, and both armies have stumbled into each other at Gettysburg. The Union holds the high ground on Cemetery Ridge. Lee must decide whether to attack uphill or try to outmaneuver. Over 160,000 soldiers are about to collide.",
            difficulty: 6,
            momentumValue: 4,
            strategies: [
                {
                    name: "Hold the High Ground",
                    description: "Keep your forces on the ridges and hills, forcing the enemy to attack uphill.",
                    detail: "High ground gives enormous advantages: better visibility, artillery range, and the enemy must charge uphill into your fire. Cemetery Ridge and Little Round Top are key.",
                    power: { union: 8, confederacy: 4 },
                    casualties: { union: 35000, confederacy: 50000 },
                    outcome: {
                        win: "From the high ground, your artillery and rifles devastate the attacking enemy. They charge uphill into a wall of fire and are thrown back with terrible losses.",
                        lose: "Despite your elevated position, the enemy finds a weakness in your line. A breakthrough on your flank forces you off the high ground."
                    }
                },
                {
                    name: "Massive Frontal Assault",
                    description: "Launch your best troops in a grand charge against the enemy center.",
                    detail: "A bold gamble: throw everything at the enemy's center and split their army in two. But crossing open ground under fire is devastating.",
                    power: { union: 5, confederacy: 3 },
                    casualties: { union: 40000, confederacy: 60000 },
                    outcome: {
                        win: "Your charge breaks through the center! The enemy line splits and their army begins to collapse on both sides of the breach.",
                        lose: "The charge across open ground is a bloodbath. Enemy artillery and rifles cut your men down before they ever reach the line. Thousands fall."
                    }
                },
                {
                    name: "Flanking Maneuver",
                    description: "Try to get around the enemy's sides and attack from an unexpected direction.",
                    detail: "Instead of attacking where the enemy is strongest, find their weak point. This requires more time and coordination but avoids the strongest defenses.",
                    power: { union: 7, confederacy: 5 },
                    casualties: { union: 30000, confederacy: 45000 },
                    outcome: {
                        win: "Your flanking maneuver catches the enemy off guard! Attacked from an unexpected direction, their defensive line unravels.",
                        lose: "The flanking march was detected, and the enemy repositioned to meet your attack. You end up in a fight you didn't plan for."
                    }
                }
            ],
            fogOfWar: [
                { mod: 2, text: "Your scouts identify an undefended hill that commands the entire battlefield!" },
                { mod: 1, text: "A timely ammunition resupply reaches your troops at the front line." },
                { mod: -1, text: "Confusing orders delay your attack by several hours, giving the enemy time to dig in." },
                { mod: -2, text: "The enemy launches a devastating artillery barrage that silences your cannons!" }
            ],
            historicalEvent: { text: "Union cavalry commander Buford seizes the high ground before Confederate infantry arrives!", mod: { union: 1, confederacy: -1 }, basis: "Buford's defense on July 1, 1863" }
        }
    },

    {
        id: "chickamauga",
        name: "Battle of Chickamauga",
        date: "September 19-20, 1863",
        year: 1863,
        location: "Northwestern Georgia",
        image: "images/battle_of_chickamauga.jpg",
        imageCredit: "Kurz & Allison, 1890",

        historical: {
            situation: {
                union: {
                    beginner: "Your army is spread out in thick forests in northern Georgia. You've been chasing the Confederate army, but they just got a bunch of extra soldiers from Virginia and now they have more troops than you! The trees are so thick you can barely see what's going on.",
                    intermediate: "Your army is spread thin in the dense forests of northern Georgia, pursuing retreating Confederates toward Chattanooga. But General Bragg has received reinforcements from Virginia and now outnumbers you. The thick woods make it nearly impossible to see what's happening.",
                    advanced: "Your army is dangerously dispersed across miles of dense Georgia forest, having pursued Bragg's retreating Confederates toward Chattanooga. However, Bragg has received Longstreet's veteran corps from Lee's Army of Northern Virginia, giving him numerical superiority for the first time in the Western Theater. The impenetrable forest severely limits reconnaissance and communication, creating conditions ripe for catastrophic miscommunication."
                },
                confederacy: {
                    beginner: "For the first time, you have more soldiers than the Union! General Bragg got extra troops from Virginia, including Longstreet's tough fighters. The Union army is spread out in the thick Georgia forest. This is your big chance to crush them!",
                    intermediate: "For once, you outnumber the Union forces. General Bragg has received Longstreet's corps from Lee's army in Virginia. Rosecrans' Union army is spread out and vulnerable in the dense Georgia forests. This is your chance to destroy them.",
                    advanced: "For the first time in the Western Theater, Confederate forces enjoy numerical superiority. Longstreet's veteran corps \u2014 transferred from Lee's army by rail \u2014 provides both additional strength and experienced leadership. Rosecrans' Army of the Cumberland is dispersed across miles of dense forest, its units separated by difficult terrain. The conditions are optimal for a devastating Confederate offensive."
                }
            },
            intel: {
                union: { forces: "60,000 troops", commander: "William Rosecrans", advantage: "Recent string of successful maneuvers" },
                confederacy: { forces: "65,000 troops", commander: "Braxton Bragg", advantage: "Numerical superiority and reinforcements from Virginia" }
            },
            whatWouldYouDo: {
                union: {
                    prompt: {
                        beginner: "You're in a thick forest and the enemy just got more soldiers. Your army is spread out across miles of woods. What should you do?",
                        intermediate: "You're in dense forest and reports say the enemy has been reinforced. Your army is spread across miles of thick woods. How do you handle this?",
                        advanced: "Intelligence indicates the enemy has been reinforced to numerical superiority. Your army is dispersed across miles of impenetrable forest with poor inter-unit communication. How do you respond to this deteriorating situation?"
                    },
                    options: {
                        beginner: ["Pull all your soldiers together into one strong line", "Attack before the enemy can get organized", "Go back to the strong forts at Chattanooga"],
                        intermediate: ["Consolidate your forces into a tight defensive line", "Attack before the enemy can organize their reinforcements", "Retreat to the strong defenses of Chattanooga"],
                        advanced: ["Consolidate dispersed units into a continuous defensive line to prevent defeat in detail", "Launch a preemptive attack before Longstreet's reinforcements can be fully integrated", "Execute a fighting withdrawal to the fortified positions at Chattanooga"]
                    },
                    feedback: {
                        beginner: ["Good idea! Rosecrans tried to do this, but a confusing order accidentally pulled soldiers out of the line, leaving a big gap. The Confederates crashed right through the hole.", "Bold, but very risky when the enemy has more soldiers and you can't see through the forest. Rosecrans tried to get organized first, but a mix-up in orders created a gap that the Confederates burst through.", "This would have been the safest choice! Chattanooga had strong defenses. Rosecrans tried to fight in the forest instead, and a single mix-up in orders nearly destroyed his entire army."],
                        intermediate: ["The right instinct, and what Rosecrans attempted. But in the confusion of the dense forest, a misunderstood order pulled a division out of line, creating the gap that Longstreet exploited. The lesson: in chaotic conditions, even sound plans can unravel from simple miscommunication.", "Aggressive but extremely risky when outnumbered in terrain that limits coordination. The thick forest that conceals also confuses. Rosecrans chose to consolidate instead, but the fog of war defeated even that sensible plan.", "The most prudent option. Chattanooga's natural defenses would have offset the Confederate numerical advantage. Rosecrans' decision to fight in the open forest \u2014 where miscommunication proved fatal \u2014 was a costly gamble."],
                        advanced: ["Doctrinally sound, and Rosecrans attempted exactly this. However, the dense terrain that necessitated consolidation also made it treacherous to execute. A misinterpreted order pulled Wood's division from the line, creating the gap that Longstreet's corps exploited with devastating effect. The episode demonstrates how terrain-induced friction can defeat even well-conceived defensive plans.", "A preemptive attack might have caught Longstreet's corps before it was fully integrated into Bragg's command structure. However, the dense forest made offensive coordination extremely difficult for dispersed units, and attacking into numerical superiority carried enormous risk.", "Arguably the most strategically sound option. Chattanooga's terrain offered natural defensive advantages that would have offset Confederate numerical superiority \u2014 as Grant would later demonstrate in the battles of Lookout Mountain and Missionary Ridge. Rosecrans' decision to engage in the open forest proved unnecessarily risky."]
                    }
                },
                confederacy: {
                    prompt: {
                        beginner: "You have more soldiers and Longstreet's experienced fighters just arrived. The Union army is scattered in the forest. How do you attack?",
                        intermediate: "You outnumber the enemy and Longstreet's veterans have just arrived. The Union army is scattered in the forest. How do you exploit this?",
                        advanced: "You possess numerical superiority and Longstreet's veteran corps. The Union army is dispersed in dense forest with vulnerable communications. How do you exploit these advantages?"
                    },
                    options: {
                        beginner: ["Wait for the enemy to mess up, then attack", "Attack everywhere at once along the whole line", "Look for a weak spot and send everyone there"],
                        intermediate: ["Wait for the enemy to make a mistake, then strike", "Launch an all-out attack along the entire line", "Probe for a weak point and concentrate your forces there"],
                        advanced: ["Maintain pressure while waiting for the enemy's disposition to create an exploitable opportunity", "Launch a general assault along the entire front to prevent the enemy from consolidating", "Concentrate Longstreet's veterans at the decisive point once reconnaissance identifies a vulnerability"]
                    },
                    feedback: {
                        beginner: ["That's basically what happened! A confusing Union order created a big gap in their line, and Longstreet's veterans charged through it. Patience and waiting for the right moment paid off big time.", "Bragg tried attacking all along the line on Day 1, but it was messy and didn't break through. The big breakthrough came on Day 2 when the Confederates found a gap in the Union line and poured through it!", "This is close to what happened! On Day 2, Longstreet's soldiers found a huge gap in the Union line and smashed through it. Two-thirds of the Union army ran away. Only General Thomas on Snodgrass Hill kept the whole army from being destroyed."],
                        intermediate: ["Patience proved decisive here. On Day 2, a confused Union order pulled a division from line, creating an unintended gap. Longstreet's veterans poured through, routing two-thirds of the Union army. The Confederate victory came from exploiting an enemy mistake rather than creating one.", "Bragg's initial approach on Day 1, but broad-front assaults dissipated Confederate combat power without achieving a breakthrough. The decisive moment came on Day 2 when Longstreet found and exploited a gap created by a Union mistake.", "Close to what actually happened. On Day 2, Longstreet identified and concentrated his veterans at a gap accidentally created by a confused Union order. The breakthrough routed two-thirds of the Union army \u2014 exactly the result of finding and exploiting a weak point."],
                        advanced: ["This approximates how the breakthrough actually occurred. The Confederate victory resulted not from superior offensive planning but from the exploitation of an enemy error \u2014 a confused order that created a gap in the Union line. Longstreet's readiness to exploit the opportunity with concentrated force was the decisive factor.", "Bragg's Day 1 approach of broad-front assaults proved costly and inconclusive, dissipating combat power across the entire line without achieving decisive results. The breakthrough came only when Longstreet's concentrated force exploited a specific vulnerability on Day 2.", "This most closely mirrors the actual Confederate success. Longstreet concentrated his veteran corps at the gap created by Rosecrans' confused order, achieving the kind of focused penetration that broad-front attacks could not. The result was the rout of two-thirds of the Union army."]
                    }
                }
            },
            whatHappened: {
                beginner: "On the second day, a confusing order pulled Union soldiers out of their line, leaving a huge gap. Longstreet's experienced soldiers charged right through the hole like a battering ram and destroyed two-thirds of the Union army! Only General George Thomas refused to run. He held his ground on Snodgrass Hill, earning the nickname 'Rock of Chickamauga' and saving the army from total destruction.",
                intermediate: "On the second day, a confused order pulled a Union division out of line, creating a gaping hole. Longstreet's veterans smashed through like a battering ram, routing two-thirds of the Union army. Only General George Thomas held firm on Snodgrass Hill, earning the nickname 'Rock of Chickamauga' and saving the army from total destruction.",
                advanced: "On September 20, a fatally confused order from Rosecrans pulled Wood's division from the Union line, creating a quarter-mile gap at precisely the point where Longstreet was massing for assault. Longstreet's veterans surged through with devastating effect, routing approximately two-thirds of the Union army, including Rosecrans himself. Only General George Thomas' determined stand on Snodgrass Hill \u2014 holding against repeated assaults until nightfall \u2014 prevented the complete destruction of the Army of the Cumberland, earning Thomas the immortal sobriquet 'Rock of Chickamauga.'"
            },
            tech: {
                name: "The Telegraph",
                description: {
                    beginner: "The telegraph (a machine that sends messages through wires using electric signals) let leaders communicate across hundreds of miles almost instantly. Longstreet's soldiers were sent from Virginia to Georgia by orders sent through the telegraph. After the battle, Lincoln used it to rush General Grant to take charge.",
                    intermediate: "The telegraph allowed commanders to coordinate armies hundreds of miles apart. Longstreet's reinforcements from Virginia were ordered by telegraph. After Chickamauga, Lincoln used the telegraph to rush Grant to Chattanooga to take command.",
                    advanced: "The telegraph's strategic impact was demonstrated at Chickamauga on both sides: Confederate leadership used it to coordinate the transfer of Longstreet's corps from Virginia to Georgia \u2014 a 900-mile rail movement orchestrated by telegraph communication. After the battle, Lincoln employed the same technology to rush Grant to Chattanooga, enabling the rapid command reorganization that would produce the Union breakout at Missionary Ridge."
                }
            },
            voice: {
                quote: "I had heard and read of battlefields... but I must confess that until this I never realized the 'pomp and circumstance' of the thing called glorious war.",
                attribution: "Sam Watkins, Confederate soldier",
                source: "Published memoir, 'Co. Aytch'",
                explainer: "Sam Watkins is saying that even though he had read about battles and heard stories about the glory of war, actually being in a battle was nothing like he imagined. It was much worse than any story could describe."
            },
            biggerPicture: {
                beginner: "Even though the Confederates won, General Bragg didn't chase the Union army. He let them escape to Chattanooga, where they built strong forts. Lincoln sent General Grant to take over, setting up the next big fight.",
                intermediate: "Despite the Confederate victory, Bragg failed to pursue the beaten Union army and let them fortify Chattanooga. Lincoln sent Ulysses S. Grant to take command in the West, setting the stage for the Union breakout.",
                advanced: "Chickamauga was a tactical Confederate triumph squandered by Bragg's failure to pursue. The beaten Union army was allowed to retreat to Chattanooga and fortify, transforming a potential war-changing victory into a mere setback. Lincoln's decision to send Grant to take overall command in the Western Theater set the stage for the dramatic Union breakout at Missionary Ridge \u2014 turning Confederate victory into strategic irrelevance."
            },
            reflection: {
                beginner: "One mixed-up order created the gap that lost the whole battle. How much of war comes down to luck or mistakes versus actual skill and planning?",
                intermediate: "A simple miscommunication created the gap that lost the battle. How much of war depends on luck versus skill?",
                advanced: "A single miscommunicated order created the gap that enabled the Confederate breakthrough. To what extent does this illustrate the role of chance versus planning in warfare? The Prussian theorist Clausewitz called this 'friction' \u2014 the unpredictable factors that make real war chaotic. How do modern militaries attempt to reduce the impact of such friction?"
            },
            winner: "confederacy",
            outcome: "Confederate tactical victory",
            casualties: { union: 16170, confederacy: 18454 },
            keyFact: {
                beginner: "General George Thomas got the nickname 'Rock of Chickamauga' because he refused to run when everyone else did. He held his ground on Snodgrass Hill until dark, saving the whole Union army from being destroyed.",
                intermediate: "General George Thomas earned the nickname 'Rock of Chickamauga' for refusing to retreat. He held Snodgrass Hill against repeated Confederate assaults until nightfall, saving the Union army from total destruction.",
                advanced: "Thomas' stand on Snodgrass Hill \u2014 holding against repeated Confederate assaults until nightfall with diminishing ammunition \u2014 prevented the rout from becoming annihilation. His performance earned him the sobriquet 'Rock of Chickamauga' and was arguably the most consequential individual act of defensive leadership in the war. The army he saved would later fight at Chattanooga, Atlanta, and Nashville."
            }
        },

        freeplay: {
            briefing: "Dense forests in northern Georgia. The Confederacy has more troops here for once, thanks to reinforcements from Virginia. A confused order has created a gap in the Union line. In the chaos of the thick woods, can one side exploit the other's mistakes?",
            difficulty: 6,
            momentumValue: 2,
            strategies: [
                {
                    name: "Exploit the Gap",
                    description: "Pour troops through the opening in the enemy line.",
                    detail: "A gap in the enemy line is like an open door. Rush troops through it to attack from behind and cause a collapse. But the dense forest makes coordination difficult.",
                    power: { union: 3, confederacy: 8 },
                    casualties: { union: 55000, confederacy: 35000 },
                    outcome: {
                        win: "Your troops pour through the gap and hit the enemy from behind! Their line collapses in confusion as soldiers flee in every direction.",
                        lose: "The gap closed before you could exploit it. Now your troops are tangled in the forest with the enemy on all sides."
                    }
                },
                {
                    name: "Steady Pressure",
                    description: "Attack all along the enemy line with coordinated pressure.",
                    detail: "Instead of gambling on one breakthrough, apply pressure everywhere. This is safer and might find other weak points as the battle develops.",
                    power: { union: 5, confederacy: 6 },
                    casualties: { union: 40000, confederacy: 30000 },
                    outcome: {
                        win: "Your steady pressure finds a weak point and you break through! The enemy's entire line begins to buckle under the sustained assault.",
                        lose: "Your pressure was spread too thin. The enemy concentrated forces at key points and repulsed each of your attacks in turn."
                    }
                },
                {
                    name: "Defensive Stand",
                    description: "Form a strong defensive line and make the enemy come to you.",
                    detail: "The confusion affects both sides. Get organized and make the enemy attack your prepared positions. Defense in the forest gives you cover.",
                    power: { union: 6, confederacy: 5 },
                    casualties: { union: 35000, confederacy: 25000 },
                    outcome: {
                        win: "Your defensive stand holds firm! Using the forest as natural cover, you repulse every enemy attack and gradually push them back.",
                        lose: "Your defensive positions were outflanked in the dense forest. The enemy found a way around you that you couldn't see coming."
                    }
                }
            ],
            fogOfWar: [
                { mod: 2, text: "Reinforcements from Virginia arrive just in time to join the battle!" },
                { mod: 1, text: "A captured courier reveals the enemy's planned troop movements." },
                { mod: -1, text: "The dense forest causes two of your brigades to fire on each other by mistake." },
                { mod: -2, text: "A confused order pulls a division out of line, creating a gap in your defenses!" }
            ],
            historicalEvent: { text: "A miscommunication creates a gap in the Union defensive line!", mod: { union: -2, confederacy: 2 }, basis: "Rosecrans' order created a gap exploited by Longstreet" }
        }
    },
    // ==================== BATTLE 10: WILDERNESS ====================
    {
        id: "wilderness",
        name: "Battle of the Wilderness",
        date: "May 5-7, 1864",
        year: 1864,
        location: "Spotsylvania County, Virginia",
        image: "images/battle_of_the_wilderness.jpg",
        imageCredit: "Kurz & Allison",

        historical: {
            situation: {
                union: {
                    beginner: "General Grant is now in charge of ALL Union armies. He's marching into a thick forest called the Wilderness to fight Lee. Grant's plan is simple: keep fighting and never go backwards. The forest will make it hard to use your bigger army, but Grant doesn't care.",
                    intermediate: "General Grant has taken command of all Union armies and is marching south into the dense Virginia Wilderness to fight Lee. Grant's plan is simple: keep fighting and never retreat. The thick forest will cancel out your advantage in numbers and artillery, but Grant doesn't care.",
                    advanced: "Grant, now commanding all Union armies, has launched the Overland Campaign \u2014 a relentless advance through Virginia designed to pin Lee's army in continuous combat. The dense Wilderness terrain neutralizes Union advantages in numbers and artillery, but Grant's strategic calculus has fundamentally changed: he intends to use the Union's superior manpower and materiel to grind down Lee's irreplaceable army through constant engagement, regardless of tactical outcomes."
                },
                confederacy: {
                    beginner: "Grant's huge army is marching into the Wilderness \u2014 the same thick forest where you beat General Hooker last year. The tangled woods are your friend: they hide how few soldiers you have and turn the fight into close-up combat where your experienced soldiers do best.",
                    intermediate: "Grant's massive army is pushing into the Wilderness, the same tangled forest where you defeated Hooker last year. The dense undergrowth is your ally, hiding your smaller numbers and turning the battle into close-range chaos where your veterans thrive.",
                    advanced: "Grant's 101,000-man army is entering the Wilderness \u2014 the same impenetrable terrain where you destroyed Hooker's flank a year ago. The dense forest remains your most powerful ally: it negates Union numerical superiority and artillery advantage while favoring the close-quarters combat at which your veteran infantry excels. However, Grant is not Hooker \u2014 this commander will not retreat regardless of tactical results."
                }
            },
            intel: {
                union: { forces: "101,000 troops", commander: "Ulysses S. Grant", advantage: "Overwhelming numbers and supplies" },
                confederacy: { forces: "61,000 troops", commander: "Robert E. Lee", advantage: "Familiar terrain and veteran fighters" }
            },
            whatWouldYouDo: {
                union: {
                    prompt: {
                        beginner: "The thick forest takes away your advantages \u2014 you can't use your bigger army or your cannons well in the trees. What do you do?",
                        intermediate: "The dense forest neutralizes your big advantages. Do you push through anyway, try to outflank Lee, or bypass the Wilderness entirely?",
                        advanced: "The Wilderness terrain negates your numerical and artillery superiority. How do you advance through an environment that favors the smaller, more experienced defending force?"
                    },
                    options: {
                        beginner: ["Fight your way straight through the forest", "Try to get around Lee's side in the trees", "Go around the whole forest to open ground"],
                        intermediate: ["Push straight through despite the terrain", "Try to outflank Lee in the forest", "March around the Wilderness to open ground"],
                        advanced: ["Advance directly through the Wilderness, accepting the terrain disadvantage to maintain pressure", "Attempt to turn Lee's flank within the forest, using the terrain to mask the maneuver", "Bypass the Wilderness entirely to engage Lee on open ground where your advantages apply"]
                    },
                    feedback: {
                        beginner: ["That's what Grant did! The fighting was terrible \u2014 soldiers couldn't see 20 yards in front of them, and the forest caught fire. But the important thing is that afterward, Grant kept going south instead of going home. No Union general had ever done that before.", "Good thinking, but the forest was so thick that flanking was almost impossible. Soldiers got lost trying to find each other. Grant chose to push straight through, accepting the messy fight.", "Smart idea! But Grant wanted to stay in contact with Lee's army at all times. He didn't want Lee to escape or attack somewhere unexpected. Grant chose to fight through the forest and keep the pressure on."],
                        intermediate: ["Grant's choice. The two-day battle was savage and inconclusive, but Grant's strategic genius lay in what happened next: instead of retreating like every previous Union commander, he marched south. That decision changed the war.", "The Wilderness made flanking maneuvers nearly impossible \u2014 units couldn't maintain formation or direction in the dense undergrowth. Grant recognized that the terrain demanded a direct engagement, ugly as it would be.", "Strategically appealing, but Grant's primary objective wasn't favorable terrain \u2014 it was Lee's army. Bypassing the Wilderness risked losing contact with Lee and allowing him to maneuver freely. Grant chose to pin Lee in continuous combat."],
                        advanced: ["Grant's actual approach, and strategically sound despite the tactical disadvantage. The Wilderness produced no decisive tactical result, but Grant's refusal to retreat afterward \u2014 the first Union commander in the East to continue advancing after an inconclusive engagement with Lee \u2014 fundamentally altered the war's psychological dynamic.", "Flanking within the Wilderness was operationally infeasible given the terrain's density. Units lost formation, direction, and communication in the undergrowth. Grant recognized that the environment demanded a direct engagement and accepted the cost.", "While tactically appealing, bypassing the Wilderness would have ceded the initiative to Lee, who could have struck Grant's flanking column from prepared positions. Grant's fundamental strategic insight was that maintaining constant contact with Lee's army \u2014 regardless of terrain \u2014 was more important than seeking favorable ground."]
                    }
                },
                confederacy: {
                    prompt: {
                        beginner: "Grant has almost twice as many soldiers, but the thick forest helps even the odds. How do you use the forest to your advantage?",
                        intermediate: "Grant's army outnumbers you nearly 2-to-1, but the thick forest is your equalizer. How do you use it?",
                        advanced: "Grant's nearly 2-to-1 numerical advantage is significantly constrained by the Wilderness terrain. How do you exploit this environmental equalizer against a commander who will not retreat?"
                    },
                    options: {
                        beginner: ["Hide in the trees and ambush Grant's soldiers as they march by", "Set up behind logs and trees and let Grant come to you", "Attack hard before Grant can get his big army organized"],
                        intermediate: ["Ambush Grant's columns as they move through the forest", "Set up defensive positions and let Grant come to you", "Attack aggressively before Grant can get organized"],
                        advanced: ["Employ ambush tactics against Grant's columns as they negotiate the forest trails", "Establish prepared defensive positions to maximize the terrain advantage", "Launch an aggressive counteroffensive to disrupt Grant before he can deploy his full strength"]
                    },
                    feedback: {
                        beginner: ["Smart! Lee's soldiers did use the forest to surprise and attack Union columns. The thick trees made it a confusing, close-up fight where the Confederates' experience gave them an edge.", "Good defensive thinking! Lee's soldiers used fallen trees and the thick forest as natural shields. The terrain was so dense it was like fighting in a maze.", "That's close to what Lee did! He attacked Grant's army while it was still moving through the forest. The fighting was fierce, but neither side could land a knockout blow."],
                        intermediate: ["Lee employed elements of all three approaches, using the dense forest to ambush advancing Union columns while maintaining defensive positions. The terrain turned the battle into the close-quarters chaos that favored his experienced troops.", "A solid choice that maximized the terrain advantage. Confederate positions in the dense forest were extremely difficult to locate and assault. Lee combined defensive positions with aggressive counterattacks when opportunities arose.", "Close to Lee's actual approach. He struck Grant's army while it was strung out on forest roads, achieving tactical surprise at several points. The aggressive defense produced 17,000 Union casualties against 11,000 Confederate \u2014 but it wasn't enough to stop Grant."],
                        advanced: ["Lee effectively combined ambush and defensive tactics, exploiting the terrain to engage Grant's columns as they moved through the forest. The environment transformed the battle into close-quarters attritional combat that negated Union numerical and artillery advantages. However, Grant proved to be a fundamentally different adversary: unlike previous Union commanders, he absorbed the punishment and continued advancing.", "Prepared defensive positions maximized the Wilderness terrain's natural advantages, creating killing grounds along the narrow forest trails. Lee effectively combined static defense with aggressive counterstrokes. The tactical results were favorable, but Grant's strategic determination rendered tactical outcomes secondary.", "Lee's aggressive defense inflicted disproportionate casualties \u2014 17,000 Union against 11,000 Confederate \u2014 but Grant's willingness to absorb losses and continue the campaign revealed the fundamental weakness of the Confederate position: they could win battles but not the war of attrition that Grant was now waging."]
                    }
                }
            },
            whatHappened: {
                beginner: "Two days of horrible fighting in forest so thick soldiers couldn't see 20 yards ahead. The woods actually caught fire, and wounded soldiers who couldn't move were in danger of burning alive. Neither side really won. But here's the important part: unlike every Union general before him, Grant refused to retreat. He marched south, and his soldiers cheered.",
                intermediate: "Two days of savage fighting in dense forest so thick soldiers couldn't see 20 yards ahead. The woods caught fire, threatening to burn wounded men alive. Neither side won a clear victory. But unlike every Union general before him, Grant refused to retreat. He marched south, and his soldiers cheered.",
                advanced: "Two days of savage combat in the Wilderness produced approximately 28,000 combined casualties in conditions of appalling confusion \u2014 soldiers fought at point-blank range in undergrowth so dense that visibility was limited to twenty yards. Brushfires swept through the forest, immolating wounded soldiers unable to escape. The tactical result was inconclusive. But Grant's response was unprecedented: instead of retreating northward as every previous Army of the Potomac commander had done after an engagement with Lee, he ordered the army south toward Spotsylvania. When soldiers realized the direction of march, they erupted in cheers. The war's endgame had begun."
            },
            tech: {
                name: "Repeating Rifles",
                description: {
                    beginner: "Some Union soldiers had Spencer repeating rifles that could fire 7 shots without reloading! Most soldiers on both sides had guns that could only fire one shot before you had to reload. Having a repeating rifle was like having a superpower in battle.",
                    intermediate: "Spencer repeating rifles could fire 7 shots without reloading, giving some Union units devastating firepower compared to single-shot muskets.",
                    advanced: "The Spencer repeating rifle \u2014 capable of firing seven rounds from a tubular magazine without reloading \u2014 gave equipped Union units a dramatic firepower advantage over opponents armed with single-shot muzzle-loading muskets. While not yet widely issued, the Spencer demonstrated the future of infantry combat: volume of fire rather than individual accuracy would determine tactical outcomes."
                }
            },
            voice: {
                quote: "Now your Excellency, we have done a Soldier's Duty. Why can't we have a Soldier's pay? We have given the Government the best that could be offered \u2014 our lives. The patient, trusting descendants of Africa's clime have dyed the ground with their blood in defense of the Union. We appeal to you, Sir, as the Executive of the Nation, to have us justly dealt with.",
                attribution: "Corporal James Henry Gooding, 54th Massachusetts Infantry, in a letter to President Lincoln",
                source: "New Bedford Mercury, September 1863 / National Archives, Records of the Adjutant General",
                explainer: "Corporal Gooding, a Black soldier, is writing to President Lincoln to demand equal pay. Black soldiers were paid less than white soldiers even though they risked their lives the same way. He's asking: if we're willing to die for the country, why aren't we treated equally?"
            },
            biggerPicture: {
                beginner: "Grant's refusal to retreat was a turning point. Every Union general before him had fought Lee, lost or tied, and gone home. Grant said 'no' \u2014 he kept going south. The war had entered its final chapter.",
                intermediate: "Grant's refusal to retreat showed the war had entered its final phase. The Union would fight until the end.",
                advanced: "Grant's decision to continue south after the Wilderness marked a fundamental strategic inflection point. For the first time, the Army of the Potomac would maintain continuous offensive contact with Lee's army, denying the Confederacy the operational pauses it needed to recover. Grant's strategy of attrition \u2014 trading casualties that the Union could replace but the Confederacy could not \u2014 revealed the war's underlying mathematical reality: the South could not sustain a protracted conflict against a determined opponent with vastly superior resources."
            },
            reflection: {
                beginner: "Grant kept fighting even though thousands of soldiers were killed and hurt. Some people called him a hero for never giving up. Others called him a 'butcher' for sacrificing so many lives. What do you think, and why?",
                intermediate: "Grant kept fighting even with terrible casualties. Some called him a hero; others called him a butcher. Which do you think, and why?",
                advanced: "Grant's willingness to sustain enormous casualties in pursuit of strategic objectives earned him the label 'butcher' from critics. Yet his strategy of continuous engagement ultimately ended the war faster than any alternative approach. How do we evaluate a commander who accepts terrible losses to achieve a greater strategic purpose? Is there a moral difference between Grant's attrition and Lee's equally costly offensive gambles like Pickett's Charge?"
            },
            winner: "draw",
            outcome: "Tactical draw, strategic shift in Union's favor",
            casualties: { union: 17666, confederacy: 11125 },
            keyFact: {
                beginner: "When Union soldiers realized Grant was marching south \u2014 not north back home \u2014 they burst into cheers! For the first time ever, a Union general refused to turn back after fighting Lee. That moment changed everything.",
                intermediate: "When Union soldiers realized Grant was marching south instead of retreating north, they burst into cheers. For the first time, a Union commander refused to turn back after a brutal fight.",
                advanced: "The moment Union soldiers realized they were marching south rather than north has become one of the war's iconic turning points. After years of commanders who fought Lee, withdrew, and reorganized, Grant's refusal to retreat signaled a fundamental change in Union strategy. The cheers that erupted along the marching columns reflected soldiers' recognition that the war's endgame had finally begun."
            }
        },

        freeplay: {
            briefing: "Grant enters the dense Wilderness where Hooker was defeated a year ago. The thick forest neutralizes the Union's advantages in numbers and artillery. Lee knows this terrain well. But Grant has something no previous Union commander had: the absolute determination to keep fighting no matter the cost.",
            difficulty: 7,
            momentumValue: 2,
            strategies: [
                {
                    name: "Push Through Despite Losses",
                    description: "Keep attacking relentlessly, accepting heavy casualties to maintain pressure.",
                    detail: "Grant's strategy: use the Union's advantage in numbers and supplies. Keep fighting and never give Lee time to rest or maneuver. Brutal but effective.",
                    power: { union: 7, confederacy: 5 },
                    casualties: { union: 55000, confederacy: 35000 },
                    outcome: {
                        win: "Your relentless pressure breaks the enemy's will. They can't sustain the constant combat and begin falling back.",
                        lose: "Despite your determination, the losses mount faster than you can replace them. The relentless attacks exhaust your army without breaking through."
                    }
                },
                {
                    name: "Outmaneuver in the Forest",
                    description: "Try to find the enemy's flanks in the dense wilderness.",
                    detail: "Even in thick forest, there might be ways to get around the enemy instead of fighting through them head-on. But the dense terrain makes coordination extremely difficult.",
                    power: { union: 5, confederacy: 7 },
                    casualties: { union: 45000, confederacy: 30000 },
                    outcome: {
                        win: "Your flanking column finds a gap in the enemy's line! Emerging from the dense forest, they strike the enemy's side with devastating effect.",
                        lose: "The dense forest made flanking impossible. Your troops got lost, separated, and were defeated in detail by an enemy who knew the terrain."
                    }
                },
                {
                    name: "Bypass to Open Ground",
                    description: "March around the enemy to fight in terrain that favors your larger army.",
                    detail: "The Wilderness helps the smaller army. Get out of the forest and into open ground where your numbers and artillery will dominate.",
                    power: { union: 4, confederacy: 6 },
                    casualties: { union: 35000, confederacy: 25000 },
                    outcome: {
                        win: "You successfully disengage and move to open ground. The enemy is forced to follow, fighting on your terms now.",
                        lose: "The enemy harassed your march and caught your rearguard. The attempted bypass turned into a costly running battle."
                    }
                }
            ],
            fogOfWar: [
                { mod: 2, text: "Your scouts discover a hidden trail through the forest, allowing a surprise attack on the enemy's supply wagons." },
                { mod: 1, text: "A sudden rainstorm dampens the forest fires, giving your troops a chance to regroup." },
                { mod: -1, text: "Thick smoke from brush fires blinds your advancing columns, causing confusion and friendly fire." },
                { mod: -2, text: "The forest erupts in flames around your position. Troops must fall back or risk being burned alive." }
            ],
            historicalEvent: null
        }
    },

    // ==================== BATTLE 11: ATLANTA ====================
    {
        id: "atlanta",
        name: "Battle of Atlanta",
        date: "July 22 - September 2, 1864",
        year: 1864,
        location: "Atlanta, Georgia",
        image: "images/battle_of_atlanta.jpg",
        imageCredit: "Kurz & Allison, 1888",

        historical: {
            situation: {
                union: {
                    beginner: "After months of marching through Georgia, Sherman's army has reached Atlanta. The city makes weapons and ammunition in its factories, and its railroads connect the whole Confederacy. If you can capture Atlanta, it might help Lincoln win the upcoming election and keep the war going until the South is beaten.",
                    intermediate: "After months of maneuvering through Georgia, Sherman's army has reached Atlanta. The city's factories produce weapons and ammunition, and its railroads connect the eastern and western Confederacy. Capturing Atlanta could decide the 1864 presidential election.",
                    advanced: "After months of strategic maneuvering through Georgia, Sherman's army has invested Atlanta \u2014 the Confederacy's industrial heart and railroad nexus. The city's factories, foundries, and rail connections are critical to Confederate logistics. Beyond its military significance, Atlanta has become the political center of gravity: Lincoln faces re-election in November, and without a major Union victory, the Democratic candidate George McClellan may win on a peace platform that could end the war with the Confederacy intact."
                },
                confederacy: {
                    beginner: "Atlanta cannot fall! The city's factories make weapons, and its railroads connect the whole Confederacy. President Davis just replaced the careful General Johnston with the aggressive General Hood, who has orders to attack Sherman and save the city no matter what.",
                    intermediate: "Atlanta must not fall. Its factories, railroads, and strategic position are vital to the Confederacy's survival. President Davis has replaced the cautious General Johnston with the aggressive General Hood, ordering him to attack Sherman and save the city at all costs.",
                    advanced: "Atlanta represents an existential strategic position: its factories, foundries, and railroad junction are irreplaceable Confederate assets. Davis's decision to replace the defensively skilled Johnston with the aggressive Hood reflects the Confederacy's desperation \u2014 Hood's orders are to attack Sherman and save the city, but his aggressive temperament may prove catastrophically wasteful against Sherman's larger, well-supplied army."
                }
            },
            intel: {
                union: { forces: "100,000 troops", commander: "William T. Sherman", advantage: "Superior numbers and steady supply lines" },
                confederacy: { forces: "65,000 troops", commander: "John Bell Hood", advantage: "Fortified city defenses and interior lines" }
            },
            whatWouldYouDo: {
                union: {
                    prompt: {
                        beginner: "Atlanta has strong walls and defenses. Attacking straight at the city would cost a lot of lives. But you could cut the railroads that bring food and supplies into the city. What do you do?",
                        intermediate: "Atlanta is heavily fortified. A direct assault would be costly. But you could cut the railroads and starve the city out. What's your approach?",
                        advanced: "Atlanta's fortifications make direct assault prohibitively costly. However, the city depends on railroad supply lines that are vulnerable to interdiction. How do you approach the reduction of this critical position?"
                    },
                    options: {
                        beginner: ["Surround the city and cut all the railroad tracks", "Attack the city walls with everything you've got", "Send soldiers on horses behind the city to destroy supplies"],
                        intermediate: ["Surround the city and cut all railroad lines", "Storm the fortifications with overwhelming force", "Send cavalry deep behind the city to destroy supplies"],
                        advanced: ["Systematically sever the city's railroad supply lines through encirclement", "Commit to a direct assault against the fortifications, accepting heavy casualties", "Deploy cavalry raids deep into the Confederate rear to destroy supply infrastructure"]
                    },
                    feedback: {
                        beginner: ["That's exactly what Sherman did! He cut the railroad tracks one by one until no food or supplies could reach Atlanta. The city had to give up. Smart generals know that sometimes you beat the enemy by starving them, not fighting them.", "Brave but very costly. Sherman was smarter than that \u2014 he knew his soldiers' lives were more valuable than a quick win. By cutting the railroads instead, he took the city without a bloody assault.", "Good thinking about attacking supplies! Sherman did send cavalry on raids, but the real success came from moving his whole army to cut the railroads. When the last railroad was cut, Hood had to abandon Atlanta."],
                        intermediate: ["Sherman's exact strategy. He methodically cut the railroads feeding Atlanta one by one. When the last line was severed at Jonesborough, Hood had no choice but to evacuate. Sherman took the city through strategic patience rather than costly assault.", "Direct assault against Atlanta's fortifications would have produced Fredericksburg-level casualties. Sherman wisely recognized that the city's dependence on railroads made it vulnerable to siege rather than storm.", "Cavalry raids damaged Confederate supply lines but couldn't permanently sever them. Sherman's decisive move was sending his entire army to cut the railroads \u2014 a force too large for Hood to stop. When the Macon & Western Railroad fell, Atlanta was doomed."],
                        advanced: ["This mirrors Sherman's actual approach, which demonstrated sophisticated operational thinking. By systematically severing Atlanta's railroad supply lines \u2014 the Macon & Western being the decisive target \u2014 Sherman rendered the city's fortifications irrelevant. The garrison was forced to evacuate without Sherman having to sacrifice thousands of lives in frontal assault. It was a masterclass in logistics-based warfare.", "A frontal assault against prepared urban defenses would have been tactically reckless and strategically unnecessary. Sherman recognized that Atlanta's fortifications protected a position that was strategically dependent on its railroad connections \u2014 sever those connections, and the fortifications became irrelevant.", "Cavalry raids achieved localized disruption but lacked the sustained force necessary to permanently interdict railroad supply lines. Sherman's decisive insight was that only infantry in force could permanently sever Atlanta's rail connections, which he accomplished by swinging his entire army south of the city."]
                    }
                },
                confederacy: {
                    prompt: {
                        beginner: "The new general, Hood, wants to attack Sherman's bigger army. But attacking is risky when the enemy has more soldiers. Do you attack or defend?",
                        intermediate: "Hood wants to attack aggressively, but Sherman's army is larger. Do you follow orders or play it safe?",
                        advanced: "Hood's orders demand aggressive action against Sherman's numerically superior force. His offensive temperament aligns with Davis's directives, but the disparity in strength makes offensive operations extremely risky. How do you balance political demands with military reality?"
                    },
                    options: {
                        beginner: ["Attack! Try to drive Sherman away from Atlanta", "Stay behind the city walls and wait for Sherman to make a mistake", "Protect the railroad tracks so food and supplies can keep coming in"],
                        intermediate: ["Launch aggressive attacks to drive Sherman back", "Defend the fortifications and wait for Sherman to make a mistake", "Protect the railroads at all costs to keep supplies flowing"],
                        advanced: ["Execute aggressive sorties to disrupt Sherman's operations and potentially force a withdrawal", "Maintain a defensive posture behind fortifications, preserving combat power and forcing Sherman to assault or invest", "Prioritize defense of the railroad supply lines that sustain both the garrison and the city"]
                    },
                    feedback: {
                        beginner: ["That's what Hood did \u2014 he attacked three times in eight days. But each attack failed and cost over 15,000 soldiers. The attacks weakened Hood's army so much that he couldn't stop Sherman from cutting the railroads later.", "This was probably the better choice! Johnston had been doing exactly this before he was fired. Behind strong walls with a smaller army, defense would have kept Atlanta safe longer and forced Sherman into costly attacks.", "Smart thinking! The railroads were Atlanta's lifeline. But Hood focused on attacking Sherman instead of protecting the tracks. When Sherman cut the last railroad, Hood had to abandon the city."],
                        intermediate: ["Hood's actual choice, and it was disastrous. Three sorties in eight days cost over 15,000 irreplaceable men without achieving any strategic result. The offensive depleted the garrison that was needed to defend the city.", "Arguably the wiser course \u2014 and exactly what Johnston had been doing before Davis replaced him. Behind Atlanta's fortifications, a smaller force could have held Sherman at bay indefinitely and forced him into costly assaults. Hood's aggressive attacks wasted the defensive advantage.", "The most strategically sound option. Atlanta's survival depended entirely on its railroad connections. Once Sherman cut those lines, no amount of fortification could sustain the garrison. Concentrating on railroad defense might have prolonged the campaign past the November election."],
                        advanced: ["Hood's three sorties at Peachtree Creek, the Battle of Atlanta, and Ezra Church cost approximately 15,000 irreplaceable casualties without achieving any strategic objective. The offensive operations depleted the very garrison strength needed for sustained defense, ultimately accelerating the city's fall. Davis's demand for aggression proved catastrophically counterproductive.", "Johnston's defensive strategy \u2014 trading space for time while preserving combat power \u2014 was strategically sound. Behind fortifications, Hood's smaller force could have forced Sherman into costly assaults or a protracted siege that might have delayed Union success past the November election. Hood's departure from this approach was militarily indefensible.", "Strategically the most perceptive option. Atlanta's military value derived entirely from its railroad connections. Concentrating defensive efforts on the rail lines rather than offensive sorties could have sustained the garrison longer and potentially delayed the city's fall past Lincoln's November re-election \u2014 potentially changing the war's political trajectory."]
                    }
                }
            },
            whatHappened: {
                beginner: "Hood attacked Sherman three times in eight days, and every attack failed. He lost over 15,000 soldiers. Then Sherman started cutting the railroad tracks one by one, so no food or supplies could reach Atlanta. On September 2, Hood had to leave the city, burning what he couldn't carry. Sherman sent a famous message to Lincoln: 'Atlanta is ours, and fairly won.'",
                intermediate: "Hood attacked Sherman three times in eight days, losing over 15,000 men in failed offensives. Sherman then cut the railroads one by one, strangling Atlanta's supplies. On September 2, Hood evacuated the city, destroying what he couldn't carry. Sherman telegraphed Lincoln: 'Atlanta is ours, and fairly won.'",
                advanced: "Hood launched three costly sorties \u2014 at Peachtree Creek, the Battle of Atlanta, and Ezra Church \u2014 losing approximately 15,000 irreplaceable troops in eight days without achieving any strategic result. Sherman then executed his decisive maneuver: swinging his army south to sever the Macon & Western Railroad, Atlanta's last supply line. On September 2, Hood evacuated the city, destroying military stores he couldn't transport. Sherman's laconic telegram to Washington \u2014 'Atlanta is ours, and fairly won' \u2014 sealed Lincoln's re-election and the Confederacy's fate."
            },
            tech: {
                name: "Railroad Destruction",
                description: {
                    beginner: "Union soldiers had a special way of destroying railroad tracks. They would heat the iron rails over bonfires until they were soft, then twist them around trees. These twisted rails were called 'Sherman's neckties,' and they couldn't be straightened and used again.",
                    intermediate: "Union soldiers heated railroad rails over bonfires and twisted them around trees, creating 'Sherman's neckties' that couldn't be reused.",
                    advanced: "Union troops developed systematic methods of railroad destruction: ties were piled and ignited, and the heated rails were twisted around trees or telegraph poles into useless spirals dubbed 'Sherman's neckties.' This technique rendered the rails irreparable \u2014 the Confederacy lacked the industrial capacity to re-roll twisted iron \u2014 and proved devastatingly effective against the railroad infrastructure that sustained Confederate military operations."
                }
            },
            voice: {
                quote: "Atlanta is ours, and fairly won.",
                attribution: "William T. Sherman, telegram to Washington",
                source: "National Archives",
                explainer: "Sherman sent this short, famous message to Washington, D.C. after capturing Atlanta. It was one of the most important moments of the war because it meant Lincoln could win re-election."
            },
            biggerPicture: {
                beginner: "Atlanta's capture saved Lincoln's presidency. He won re-election in November 1864. If Lincoln had lost, the new president might have made a deal with the Confederacy and let them keep slavery. Atlanta changed everything.",
                intermediate: "Atlanta's fall guaranteed Lincoln's re-election. Without it, a peace candidate might have let the Confederacy survive.",
                advanced: "Atlanta's fall in September 1864 transformed the Northern political landscape. Lincoln's re-election, which had appeared doubtful through the summer, became virtually certain. Had McClellan won the presidency on a peace platform, the Confederacy might have survived through a negotiated settlement. Sherman's capture of Atlanta thus achieved something no purely military victory could: it ensured that the political will to continue the war until unconditional victory would survive the democratic process."
            },
            reflection: {
                beginner: "Capturing Atlanta helped Lincoln win his election and keep the war going. Should battles affect who becomes president? Can you think of ways that wars affect politics today?",
                intermediate: "Atlanta's fall helped Lincoln win re-election and continue the war. Should military victories influence elections? How do wars shape politics today?",
                advanced: "Atlanta's capture essentially determined the 1864 presidential election, ensuring the continuation of a war that might otherwise have ended in negotiated Confederate independence. What does this reveal about the relationship between military events and democratic politics? Is it healthy for military outcomes to determine electoral results, or does this create dangerous incentives for political leaders to pursue military victories for electoral rather than strategic reasons?"
            },
            winner: "union",
            outcome: "Union victory - critical political and military impact",
            casualties: { union: 3722, confederacy: 8499 },
            keyFact: {
                beginner: "Atlanta's capture helped Lincoln win re-election in 1864. If Lincoln had lost, the new president might have made peace with the Confederacy, and slavery could have continued.",
                intermediate: "Atlanta's fall helped Lincoln win re-election in 1864. If Lincoln had lost, the new president might have negotiated peace and allowed the Confederacy to survive.",
                advanced: "Atlanta's fall transformed the 1864 election from a referendum on Lincoln's management of a seemingly endless war into a validation of his determination to see it through. McClellan's Democratic platform called for an armistice and negotiated peace \u2014 terms that would likely have preserved the Confederacy. Sherman's victory ensured that possibility never materialized."
            }
        },

        freeplay: {
            briefing: "Sherman's army has reached Atlanta after months of marching through Georgia. The city is the industrial heart of the Confederacy, producing weapons and connecting railroad lines. Hood has replaced Johnston and wants to attack aggressively. The fate of the 1864 election may rest on this campaign.",
            difficulty: 5,
            momentumValue: 3,
            strategies: [
                {
                    name: "Siege and Cut Railroads",
                    description: "Surround the city and cut its supply lines one by one.",
                    detail: "Don't attack the city directly. Instead, cut the railroads that bring in food, weapons, and reinforcements. Starve the city into submission.",
                    power: { union: 7, confederacy: 5 },
                    casualties: { union: 30000, confederacy: 45000 },
                    outcome: {
                        win: "One by one, the railroads are cut. The city slowly starves and is forced to evacuate. Victory without a devastating assault.",
                        lose: "The enemy breaks out of the siege and reopens a supply line. Your forces are stretched too thin around the perimeter to hold."
                    }
                },
                {
                    name: "Attack Supply Lines",
                    description: "Send cavalry to destroy the enemy's supply and communication lines deep behind their army.",
                    detail: "Armies need constant supplies. Cut the flow of food and ammunition, and even the strongest position becomes untenable.",
                    power: { union: 6, confederacy: 6 },
                    casualties: { union: 25000, confederacy: 35000 },
                    outcome: {
                        win: "Your raids destroy critical supply depots and tear up railroad tracks. The enemy army can't sustain itself and must retreat.",
                        lose: "Your raiders are intercepted and scattered. The enemy's supply lines remain intact, and you've wasted valuable cavalry."
                    }
                },
                {
                    name: "Direct Assault",
                    description: "Storm the city's defenses with overwhelming force.",
                    detail: "The quickest way to take the city is a direct assault. You have the numbers, but attacking prepared urban defenses is always costly.",
                    power: { union: 5, confederacy: 4 },
                    casualties: { union: 35000, confederacy: 50000 },
                    outcome: {
                        win: "Your massive assault overwhelms the city's defenders! The Confederate line breaks and your troops pour into Atlanta.",
                        lose: "The city's fortifications prove too strong. Your assault is thrown back with heavy losses, and the siege drags on."
                    }
                }
            ],
            fogOfWar: [
                { mod: 2, text: "Confederate deserters reveal the location of Hood's supply depot. Your cavalry destroys it in a surprise raid." },
                { mod: 1, text: "A Union patrol captures a Confederate courier carrying Hood's battle plans." },
                { mod: -1, text: "Hood launches a surprise sortie from the city, hitting your siege lines before you can react." },
                { mod: -2, text: "A Confederate cavalry raid destroys your main supply depot, threatening your army with shortages." }
            ],
            historicalEvent: null
        }
    },

    // ==================== BATTLE 12: SHERMAN'S MARCH TO THE SEA ====================
    {
        id: "shermans_march",
        name: "Sherman's March to the Sea",
        date: "November 15 - December 21, 1864",
        year: 1864,
        location: "Georgia (Atlanta to Savannah)",
        image: "images/shermans_march.jpg",
        imageCredit: "F.O.C. Darley, 1883",

        historical: {
            situation: {
                union: {
                    beginner: "After capturing Atlanta, Sherman has a wild idea: leave your supply wagons behind and march 300 miles to the ocean, eating whatever you find along the way and destroying everything in a 60-mile-wide path. The goal is to break the South's ability to fight.",
                    intermediate: "After capturing Atlanta, Sherman proposes something radical: cut loose from your supply lines and march 300 miles to the sea, living off the land and destroying everything in a 60-mile-wide path. The goal is to break the South's ability and will to fight.",
                    advanced: "Sherman proposes an unprecedented strategic gamble: severing his own supply lines and marching 60,000 troops 300 miles from Atlanta to Savannah, subsisting on foraged resources while systematically destroying the Confederacy's agricultural and industrial infrastructure in a 60-mile-wide corridor. The objective is twofold: demonstrate that the Confederacy cannot defend its own heartland, and eliminate the economic foundation that sustains Southern armies in the field."
                },
                confederacy: {
                    beginner: "Sherman has left Atlanta and is marching across Georgia with 60,000 soldiers. You have only about 13,000 scattered soldiers to try to stop him. Georgia's farms, towns, and railroads are completely unprotected.",
                    intermediate: "Sherman has left Atlanta and is marching across Georgia with 60,000 men. You have only scattered militia and Wheeler's cavalry to oppose him. The heartland of Georgia lies exposed and defenseless.",
                    advanced: "Sherman has abandoned his supply lines and is advancing across Georgia's heartland with 60,000 veteran troops. Your available forces \u2014 approximately 13,000 militia and Wheeler's cavalry \u2014 are woefully insufficient to contest his advance. The Confederacy's agricultural breadbasket and critical rail infrastructure lie exposed to systematic destruction."
                }
            },
            intel: {
                union: { forces: "60,000 troops", commander: "William T. Sherman", advantage: "No Confederate army large enough to stop you" },
                confederacy: { forces: "13,000 scattered militia and cavalry", commander: "Various (William Hardee, Joseph Wheeler)", advantage: "Knowledge of local terrain and roads" }
            },
            whatWouldYouDo: {
                union: {
                    prompt: {
                        beginner: "You're marching through enemy land with no supply wagons. You need to eat what you find. Do you destroy everything you see, only destroy military stuff, or just move fast?",
                        intermediate: "You're marching through enemy territory with no supply line. Do you destroy everything to break the South's will, target only military supplies, or move as fast as possible?",
                        advanced: "Operating without supply lines deep in enemy territory, you must balance military objectives against the ethical implications of targeting civilian infrastructure. How do you calibrate the scope of destruction?"
                    },
                    options: {
                        beginner: ["Destroy everything: farms, railroads, factories, food supplies", "Only destroy military stuff like railroads and weapons factories", "Move fast, take only what you need to eat, and don't burn extra things"],
                        intermediate: ["Destroy everything: farms, railroads, factories, and supplies", "Target only military infrastructure and leave civilians alone", "Move fast, take what you need, and avoid unnecessary destruction"],
                        advanced: ["Implement comprehensive destruction of all infrastructure \u2014 agricultural, industrial, and transportation \u2014 to break the South's war-making capacity and civilian morale", "Restrict destruction to military objectives: railroads, arsenals, and strategic infrastructure, minimizing civilian impact", "Prioritize speed of advance, foraging as necessary but avoiding systematic destruction"]
                    },
                    feedback: {
                        beginner: ["That's close to what Sherman did. His soldiers destroyed railroads, factories, farms, and anything that could help the Confederacy fight. It was harsh, but it showed the South that the Confederacy couldn't protect them.", "That's a more humane choice, and Sherman's official orders actually said to target military stuff. But in practice, soldiers destroyed much more, including civilian farms and homes. War is hard to control.", "Speed was important, but Sherman believed the destruction was the whole point. By showing the South that the Confederacy couldn't protect its people, he hoped to break their will to fight and end the war sooner."],
                        intermediate: ["Closest to Sherman's actual approach. While his official orders limited destruction to military targets, in practice the destruction was widespread. Sherman believed that making 'Georgia howl' would break Southern civilian support for the war.", "Sherman's official orders specified military targets, but the reality was far broader. Foraging parties often stripped civilians bare. The distinction between military and civilian infrastructure was nearly impossible to maintain in practice.", "Speed was a factor, but Sherman explicitly intended the march as a demonstration of Union power and Southern vulnerability. The psychological impact of the destruction \u2014 proving the Confederacy couldn't protect its own people \u2014 was as important as the material damage."],
                        advanced: ["Sherman's approach combined all three elements but weighted toward comprehensive destruction. His Special Field Orders No. 120 technically limited foraging to military necessity, but implementation was deliberately permissive. Sherman understood that the march's strategic value lay not just in material destruction but in its psychological impact: demonstrating Confederate impotence to protect its own population.", "While Sherman's orders nominally restricted destruction to military objectives, the distinction was largely theoretical. In practice, the line between military and civilian infrastructure was impossible to maintain: farms that fed Confederate armies, cotton gins that financed the war effort, and railroads that transported troops all served dual purposes. The ethical ambiguity was inherent.", "While rapid movement was essential for security without supply lines, Sherman explicitly conceived the march as a strategic demonstration rather than merely a military maneuver. Speed alone would not achieve his objective of breaking Southern civilian morale. The destruction was integral to the strategy, not incidental to it."]
                    }
                },
                confederacy: {
                    prompt: {
                        beginner: "Sherman's army is marching across Georgia and you don't have enough soldiers to stop him. What can you do?",
                        intermediate: "Sherman's army is cutting through Georgia and you can't stop him with the forces you have. What can you do?",
                        advanced: "Sherman's 60,000 veterans are advancing virtually unopposed through Georgia's heartland. Your 13,000 scattered troops cannot contest his advance directly. What asymmetric strategy might slow or mitigate the damage?"
                    },
                    options: {
                        beginner: ["Send soldiers on horses to attack his army from the sides and slow him down", "Burn supplies and destroy bridges before Sherman gets to them", "Gather every soldier you can for one big battle"],
                        intermediate: ["Harass his columns with cavalry raids and slow him down", "Destroy supplies and bridges in his path before he arrives", "Concentrate all forces for one desperate stand"],
                        advanced: ["Employ cavalry to harass Sherman's foraging parties and disrupt his pace of advance", "Implement a scorched-earth policy ahead of Sherman's advance, denying his army the foraged supplies it depends on", "Concentrate all available forces for a decisive engagement at a defensible position"]
                    },
                    feedback: {
                        beginner: ["That's what Wheeler's cavalry tried to do! They attacked from the sides, but 13,000 soldiers just couldn't slow down 60,000 very much. Sherman's army was too big and too spread out to stop with small raids.", "Interesting idea! Burning your own supplies so Sherman couldn't take them makes sense, but it also meant your own people would go hungry. And Sherman's army was so big they could find food across a 60-mile-wide path.", "Brave, but with only 13,000 against 60,000, a big battle would have been suicide. The Confederate generals knew they just didn't have enough soldiers for a real fight."],
                        intermediate: ["Wheeler's cavalry attempted this, but 13,000 troops couldn't meaningfully slow 60,000 veterans advancing on a broad front. Raids inflicted minor damage but couldn't alter the campaign's outcome.", "Scorched earth ahead of Sherman's advance could have denied foraged supplies, but it would have devastated the very population the Confederacy claimed to protect. And Sherman's army spread across such a wide front that stripping the entire 60-mile corridor was impossible.", "Concentrating 13,000 troops against 60,000 would have resulted in their destruction without significantly impeding Sherman's advance. The numerical disparity made conventional battle impossible."],
                        advanced: ["Wheeler's cavalry operations achieved localized tactical results but could not fundamentally alter the campaign's trajectory. Sherman's advance on a 60-mile front made it impossible for cavalry to interdict more than a fraction of his foraging operations, and his veteran infantry could easily brush aside mounted opposition.", "A preemptive scorched-earth strategy \u2014 denying Sherman the foraged supplies his army depended on \u2014 was theoretically sound but practically impossible. The breadth of Sherman's advance meant destroying resources across hundreds of square miles of Georgia's heartland, which would have devastated the civilian population the Confederacy was ostensibly defending.", "With a 5-to-1 numerical disadvantage and no defensive terrain sufficient to offset it, a concentrated stand would have produced only the destruction of Confederate forces without meaningfully impeding Sherman's advance. The asymmetry was simply too great for conventional engagement."]
                    }
                }
            },
            whatHappened: {
                beginner: "Sherman's 60,000 soldiers marched 300 miles from Atlanta to the ocean city of Savannah in just five weeks. They destroyed railroads, factories, cotton gins (machines that clean cotton), and farms in a path 60 miles wide. They twisted hot railroad rails into 'Sherman's neckties' around trees. On December 21, Sherman took Savannah and offered it to Lincoln as a Christmas present!",
                intermediate: "Sherman's 60,000 troops marched 300 miles from Atlanta to Savannah in five weeks, destroying railroads, factories, cotton gins, and farms in a 60-mile-wide swath. His soldiers twisted heated rails into 'Sherman's neckties' and burned anything of military value. On December 21, Sherman captured Savannah and telegraphed Lincoln, offering the city as a Christmas gift.",
                advanced: "Sherman's 60,000 troops executed a 300-mile march from Atlanta to Savannah in thirty-five days, systematically destroying the Confederacy's agricultural and industrial infrastructure across a 60-mile-wide corridor. Railroads were methodically wrecked, cotton gins and factories burned, and livestock and provisions confiscated. Approximately 25,000 formerly enslaved people joined the march. On December 21, Sherman captured Savannah and telegraphed Lincoln his famous Christmas offering: the city and 25,000 bales of cotton."
            },
            tech: {
                name: "Total War",
                description: {
                    beginner: "Sherman invented a new kind of warfare called 'total war.' Instead of just fighting the enemy's army, he destroyed everything that helped them fight: farms, factories, railroads, and supplies. The idea was that if people couldn't eat or make weapons, the war would end faster.",
                    intermediate: "Sherman pioneered 'total war,' targeting civilian infrastructure like farms, railroads, and factories to destroy the enemy's ability to fight, not just their army.",
                    advanced: "Sherman's March to the Sea operationalized the concept of 'total war' \u2014 the systematic targeting of civilian economic infrastructure to destroy the enemy's capacity and will to sustain hostilities. By attacking the agricultural, industrial, and transportation foundations of the Confederate war effort rather than its armies directly, Sherman demonstrated that modern warfare extended beyond the battlefield to encompass the entire society that sustained military operations."
                }
            },
            voice: {
                quote: "Like demons they rush in! To my smoke-house, my dairy, pantry, kitchen, and cellar. They drove off every one of my cows, took my pigs, chickens, and flour.",
                attribution: "Dolly Sumner Lunt, Georgia plantation owner",
                source: "Diary of Dolly Sumner Lunt, University of Georgia / Library of Congress",
                explainer: "Dolly Sumner Lunt owned a plantation in Georgia. She's describing Union soldiers raiding her property, taking all her food and animals. This is what 'total war' looked like for the people living through it."
            },
            biggerPicture: {
                beginner: "By destroying so much of Georgia, Sherman proved that the Confederacy couldn't protect its own people. If the Confederate government couldn't keep farms and towns safe, many Southerners started wondering: what's the point of fighting?",
                intermediate: "By destroying the South's ability to make war, Sherman proved the Confederacy couldn't protect its own people.",
                advanced: "The March to the Sea achieved its strategic objectives on multiple levels: materially, it destroyed an estimated $100 million in Confederate infrastructure; psychologically, it demonstrated that the Confederate government was powerless to defend its own population; and politically, it further demoralized Southern civilians whose support was essential to sustaining the war effort. Sherman had discovered that in a modern democracy, the will of the civilian population was as legitimate a military target as the enemy's army."
            },
            reflection: {
                beginner: "Sherman destroyed farms, homes, and food to end the war faster. Some people think this saved lives because the war ended sooner. Others think it was wrong to make regular families suffer. What do you think? Was it worth it?",
                intermediate: "Sherman destroyed farms and homes to end the war faster. Did 'total war' save lives in the long run, or was it wrong to target civilians?",
                advanced: "Sherman's 'total war' strategy raises enduring ethical questions. He argued that making 'war so terrible' that Southerners would demand peace actually saved lives by shortening the conflict. Critics counter that deliberately targeting civilian infrastructure constitutes an immoral violation of non-combatant immunity. How do we weigh the utilitarian argument (fewer total deaths) against the deontological objection (targeting civilians is inherently wrong)? How have the Geneva Conventions attempted to resolve this tension?"
            },
            winner: "union",
            outcome: "Union victory - the Confederacy's heartland devastated",
            casualties: { union: 2200, confederacy: 2500 },
            keyFact: {
                beginner: "Sherman's army destroyed about $100 million worth of property \u2014 that's about $1.8 billion in today's money! Soldiers twisted hot railroad rails around trees, making 'neckties' that could never be used again.",
                intermediate: "Sherman's army destroyed an estimated $100 million in property (about $1.8 billion today). Soldiers bent heated railroad rails around trees, creating twisted metal 'neckties' that couldn't be straightened and reused.",
                advanced: "Sherman's army inflicted an estimated $100 million in property damage (approximately $1.8 billion in current value) across a 300-mile corridor. The systematic destruction of railroad infrastructure, cotton gins, and agricultural resources crippled the Confederate war economy. An estimated 25,000 formerly enslaved people followed the army to freedom, though their treatment by some Union soldiers was inconsistent with the liberation they sought."
            }
        },

        freeplay: {
            briefing: "Sherman has cut loose from Atlanta with 60,000 men, marching toward Savannah with no supply line. His army will live off the land, destroying everything of military value in a 60-mile-wide path. The Confederacy has no army large enough to stop him. The question is how much destruction is necessary to end the war.",
            difficulty: 5,
            momentumValue: 3,
            strategies: [
                {
                    name: "Total Destruction",
                    description: "Destroy everything in your path: railroads, factories, farms, and supplies.",
                    detail: "Wage total war on the South's infrastructure. Burn anything that could support the Confederate war effort. Brutal, but it breaks the enemy's ability to fight.",
                    power: { union: 8, confederacy: 3 },
                    casualties: { union: 15000, confederacy: 30000 },
                    outcome: {
                        win: "The scorched-earth campaign devastates the enemy's heartland. With no supplies, no railroads, and no factories, their war effort collapses.",
                        lose: "The widespread destruction scatters your forces and enrages local resistance. Guerrilla attacks multiply as civilians fight back with nothing left to lose."
                    }
                },
                {
                    name: "Targeted Military Strikes",
                    description: "Focus destruction on military targets: railroads, arsenals, and supply depots.",
                    detail: "Destroy what the enemy needs to fight, but leave civilian property alone when possible. This is slower but keeps discipline and reduces resistance.",
                    power: { union: 6, confederacy: 5 },
                    casualties: { union: 20000, confederacy: 35000 },
                    outcome: {
                        win: "Your targeted strikes cripple the enemy's military infrastructure while maintaining discipline. Key rail junctions and depots go up in flames.",
                        lose: "By limiting your destruction, you leave the enemy enough resources to organize resistance. Militia units regroup and harass your columns."
                    }
                },
                {
                    name: "Speed March",
                    description: "Move as fast as possible, taking only what you need to survive.",
                    detail: "Speed is your weapon. March so fast the enemy can't organize a defense. Take food and supplies but don't waste time burning everything. Reach Savannah before anyone can stop you.",
                    power: { union: 7, confederacy: 4 },
                    casualties: { union: 18000, confederacy: 25000 },
                    outcome: {
                        win: "Your rapid advance outpaces every attempt to organize a defense. Before the enemy can react, you've reached the coast and split the Confederacy again.",
                        lose: "Moving too fast stretches your columns thin. Enemy cavalry strikes your supply wagons and isolated units, forcing costly delays."
                    }
                }
            ],
            fogOfWar: [
                { mod: 2, text: "Freed enslaved people guide your army to hidden Confederate supply caches, providing food and intelligence." },
                { mod: 1, text: "A bridge the enemy tried to destroy is only partially burned. Your engineers repair it in hours." },
                { mod: -1, text: "Wheeler's Confederate cavalry raids your foraging parties, cutting off food supplies for two days." },
                { mod: -2, text: "Heavy rains turn Georgia's roads to mud, bogging down your wagons and artillery for days." }
            ],
            historicalEvent: {
                text: "Thousands of freed enslaved people join the march, swelling your ranks and slowing your pace.",
                mod: { union: 1, confederacy: -1 },
                basis: "An estimated 25,000 freed people followed Sherman's army"
            }
        }
    },

    // ==================== BATTLE 13: APPOMATTOX ====================
    {
        id: "appomattox",
        name: "Surrender at Appomattox Court House",
        date: "April 9, 1865",
        year: 1865,
        location: "Appomattox Court House, Virginia",
        image: "images/surrender_appomattox.jpg",
        imageCredit: "Tom Lovell",

        historical: {
            situation: {
                union: {
                    beginner: "Lee's army has left Richmond and is running west, starving and worn out. Grant's army is chasing them, and cavalry has raced ahead to block the roads. You have over 100,000 soldiers closing in on Lee's 28,000. The end of the war is almost here.",
                    intermediate: "Lee's army has abandoned Richmond and is fleeing west, starving and exhausted. Grant's forces are in pursuit, and Sheridan's cavalry has raced ahead to cut off Lee's escape. You have over 100,000 men closing in on Lee's 28,000. The end is near.",
                    advanced: "Lee's Army of Northern Virginia has evacuated Richmond and is retreating westward in a desperate attempt to reach Johnston's forces in North Carolina. The army is disintegrating \u2014 starving, exhausted, and hemorrhaging deserters. Sheridan's cavalry has outpaced Lee and blocked the road at Appomattox Court House. With over 100,000 troops converging on Lee's 28,000, the military situation is hopeless. The question now is not whether the war will end, but how."
                },
                confederacy: {
                    beginner: "Richmond, the Confederate capital, has been captured. Your army of 28,000 starving, exhausted soldiers is all that's left. You're trying to escape to the west, but Grant's army is closing in from all sides. Some officers want to break the army into small groups and fight as guerrillas (hidden fighters) for years. Lee must make the hardest decision of his life.",
                    intermediate: "Richmond has fallen. Your army of 28,000 starving, exhausted men is all that remains. You're trying to escape west to join other Confederate forces, but Grant's army is closing in from every direction. Some officers urge guerrilla warfare. Lee must decide.",
                    advanced: "Richmond has fallen, and your army of 28,000 \u2014 starving, exhausted, and disintegrating through desertion \u2014 represents the Confederacy's last organized military force. The retreat westward to link with Johnston has been cut off by Sheridan's cavalry at Appomattox Court House. Some officers advocate disbanding the army into guerrilla bands to wage an indefinite insurgency. Lee faces the war's most consequential decision: surrender or prolonged guerrilla conflict."
                }
            },
            intel: {
                union: { forces: "100,000+ troops", commander: "Ulysses S. Grant", advantage: "Overwhelming numbers and the enemy surrounded" },
                confederacy: { forces: "28,000 troops", commander: "Robert E. Lee", advantage: "Desperation and willingness to fight to the last" }
            },
            whatWouldYouDo: {
                union: {
                    prompt: {
                        beginner: "Lee's army is trapped. You could be tough and demand they give up everything, or you could be kind and let them go home peacefully. What do you do?",
                        intermediate: "Lee's army is trapped. You could demand unconditional surrender, or offer generous terms to speed the end and help heal the nation. What do you do?",
                        advanced: "Lee's army is encircled and militarily defeated. Your terms of surrender will shape the peace that follows. Do you prioritize punishment or reconciliation?"
                    },
                    options: {
                        beginner: ["Be generous \u2014 let them keep their horses and go home", "Demand total surrender and punish the rebel leaders", "Attack now and finish Lee's army off completely"],
                        intermediate: ["Offer generous terms to encourage quick surrender", "Demand unconditional surrender and punishment", "Attack immediately and destroy Lee's army"],
                        advanced: ["Offer generous terms \u2014 parole, retention of personal property \u2014 to facilitate rapid reconciliation", "Demand unconditional surrender with prosecution of Confederate leadership", "Launch a final assault to destroy Lee's army and demonstrate the cost of rebellion"]
                    },
                    feedback: {
                        beginner: ["That's exactly what Grant did! He let Lee's soldiers keep their horses for spring plowing and go home in peace. When Union soldiers started firing celebration cannons, Grant told them to stop: 'The war is over. The rebels are our countrymen again.'", "Understandable anger after four years of war, but Grant chose kindness instead. He knew that being mean to the defeated soldiers would make it harder to bring the country back together.", "With Lee's army starving and trapped, attacking would have been unnecessary bloodshed. Grant chose mercy. As he said, these men would soon be American citizens again."],
                        intermediate: ["Grant's actual decision, and one of the most significant acts of statesmanship in American history. By allowing soldiers to keep their horses and go home in peace, Grant set the tone for national reconciliation. When soldiers began firing celebration cannons, Grant stopped them: 'The rebels are our countrymen again.'", "Understandable after four years of bloody war, but Grant understood that harsh terms would create lasting bitterness and make reunification far more difficult. His generous terms helped Southern soldiers accept defeat with dignity rather than resentment.", "Militarily unnecessary and morally indefensible. Lee's army was already defeated. Further bloodshed would have served only vengeance, not national interest. Grant's restraint demonstrated the wisdom that ending wars well is as important as winning them."],
                        advanced: ["Grant's generous terms at Appomattox represent one of the most consequential acts of statesmanship in American history. By offering parole, allowing officers to retain sidearms, and permitting soldiers to keep their horses for spring plowing, Grant established a framework for reconciliation rather than retribution. His order stopping celebratory cannon fire \u2014 'The rebels are our countrymen again' \u2014 embodied Lincoln's vision of binding the nation's wounds.", "While punitive terms might have satisfied Northern desire for retribution, they risked prolonging resistance and poisoning the prospect of national reunification. Grant understood that the manner of peace would determine the character of the postwar nation. Harsh terms could have driven Confederate soldiers into the guerrilla warfare that Lee explicitly chose not to wage.", "A final assault against a defeated, starving army would have been military excess serving no strategic purpose. Grant's restraint reflected a sophisticated understanding that the war's final act would define its legacy \u2014 gratuitous violence against a defeated enemy would have undermined the moral authority the Union had fought to establish."]
                    }
                },
                confederacy: {
                    prompt: {
                        beginner: "Your army is surrounded and starving. Some officers want to break up into small groups and keep fighting for years. Others say it's time to stop the killing. What do you choose?",
                        intermediate: "Your army is surrounded and starving. Some officers want to scatter and fight as guerrillas for years. Others say it's time to end the bloodshed. What do you choose?",
                        advanced: "Your army is encircled and logistically unsustainable. Officers propose disbanding into guerrilla bands to wage an indefinite insurgency. Others argue that further resistance will only produce additional suffering without altering the outcome. What is your decision?"
                    },
                    options: {
                        beginner: ["Give up with honor and end the war", "Try one last escape attempt", "Break the army into small groups and keep fighting in the woods and hills"],
                        intermediate: ["Surrender with honor and end the war", "Attempt one final breakout to escape", "Disband the army and wage guerrilla war"],
                        advanced: ["Negotiate an honorable surrender to end the bloodshed and preserve your soldiers' dignity", "Attempt a final breakout through the Union encirclement", "Disband the army into guerrilla bands to wage an indefinite insurgency"]
                    },
                    feedback: {
                        beginner: ["That's what Lee did, and it might be the most important decision of the whole war. By surrendering with honor instead of starting a guerrilla war, Lee made it possible for the country to start healing. It was incredibly brave.", "Lee tried this at dawn on April 9, but Union soldiers blocked every road. There was nowhere left to go. Lee said he would 'rather die a thousand deaths' but knew it was time to surrender.", "Some officers really wanted this! But Lee said no. He knew that guerrilla warfare would cause years more suffering for everyone, including Southern families. By surrendering, Lee helped end the killing and gave the nation a chance to come back together."],
                        intermediate: ["Lee's decision, and arguably the most consequential choice of the entire war. By surrendering rather than disbanding into guerrilla bands, Lee spared the nation years of potential insurgency. It took extraordinary moral courage to accept defeat rather than prolonged resistance.", "Lee attempted this at dawn on April 9, but Sheridan's cavalry and Union infantry blocked every escape route. When Lee learned the roads were closed, he said, 'There is nothing left for me to do but to go and see General Grant, and I would rather die a thousand deaths.'", "Several officers advocated this, but Lee rejected it. He understood that guerrilla warfare would devastate Southern civilians and prolong suffering indefinitely without changing the outcome. Lee's choice of honorable surrender over insurgency was perhaps his greatest act of leadership."],
                        advanced: ["Lee's decision to surrender rather than wage guerrilla war may be the single most consequential choice of the entire conflict. An indefinite Confederate insurgency would have devastated the South, prevented national reunification, and potentially transformed the Civil War into a generations-long conflict. Lee's moral courage in accepting defeat \u2014 rather than prolonging resistance at the cost of further civilian suffering \u2014 made peaceful Reconstruction possible.", "Lee attempted a breakout at dawn on April 9, but discovered Union infantry blocking the Lynchburg Road behind Sheridan's cavalry screen. The military situation was irremediable. Lee's recognition of this reality \u2014 expressed in his famous statement about preferring 'a thousand deaths' to meeting Grant \u2014 reflected both the agony and the wisdom of his decision to surrender.", "This option was seriously discussed by Confederate officers and would have transformed the conflict into an indefinite insurgency. Lee explicitly rejected it, arguing that guerrilla warfare would devastate the very Southern population the Confederacy claimed to protect. His decision to surrender rather than wage insurgency spared the nation potentially decades of asymmetric conflict \u2014 a consequence whose significance cannot be overstated."]
                    }
                }
            },
            whatHappened: {
                beginner: "Lee tried one last escape at dawn on April 9, but Union soldiers blocked every road. Lee said, 'I would rather die a thousand deaths' than surrender, but he knew he had to. In the living room of a farmer's house, Grant offered kind terms: soldiers could go home, keep their horses, and officers could keep their swords. After four years, the war was finally over.",
                intermediate: "Lee attempted one last breakout at dawn on April 9, but Union infantry blocked every road. Lee said, 'There is nothing left for me to do but to go and see General Grant, and I would rather die a thousand deaths.' In the parlor of the McLean house, Grant offered generous terms: soldiers could go home, keep their horses, and officers kept their sidearms. The war was over.",
                advanced: "Lee's final breakout attempt at dawn on April 9 was stopped by Union infantry positioned behind Sheridan's cavalry screen, blocking every escape route. Confronting the irremediable military situation, Lee uttered his famous lament: 'There is nothing left for me to do but to go and see General Grant, and I would rather die a thousand deaths.' The surrender conference in the McLean house parlor produced remarkably generous terms: soldiers would be paroled, officers retained their sidearms, and enlisted men could keep their horses for spring plowing. Grant's terms embodied Lincoln's vision of reconciliation rather than retribution. Four years of war that claimed over 620,000 lives had ended."
            },
            tech: {
                name: "The Telegraph",
                description: {
                    beginner: "News that Lee surrendered traveled across the whole country in just a few hours through the telegraph (a machine that sends messages through electric wires). People in cities hundreds of miles away started celebrating almost immediately!",
                    intermediate: "News of Lee's surrender spread across the nation in hours via telegraph, allowing celebrations to erupt in cities hundreds of miles away almost immediately.",
                    advanced: "The telegraph's capacity for near-instantaneous communication transformed the surrender's impact: news reached Washington, New York, and cities across the North within hours, enabling coordinated celebrations and an immediate shift in national consciousness. The speed of communication \u2014 inconceivable at the war's outset \u2014 ensured that the end of the conflict was experienced as a shared national moment rather than a series of delayed local revelations."
                }
            },
            voice: {
                quote: "Before us in proud humiliation stood men whom neither toils and sufferings, nor the fact of death, could bend from their resolve. Was not such manhood to be welcomed back into a Union so tested and assured?",
                attribution: "Joshua Chamberlain, Union officer, on the Confederate surrender ceremony",
                source: "Joshua Chamberlain, The Passing of the Armies, 1915 / Library of Congress",
                explainer: "Joshua Chamberlain, a Union officer, is describing watching the Confederate soldiers march up to surrender. He admired their courage even though they were the enemy. He believed that these brave men deserved to be welcomed back into the United States."
            },
            biggerPicture: {
                beginner: "Lee chose to surrender instead of starting a guerrilla war that could have lasted for years. Grant's kind treatment of the defeated soldiers helped the country start to come back together. But the hardest part \u2014 rebuilding the nation and deciding what freedom meant for four million formerly enslaved people \u2014 was just beginning.",
                intermediate: "Lee chose surrender over guerrilla war. Grant's generous terms shaped how Reconstruction would unfold.",
                advanced: "Lee's decision to surrender rather than wage guerrilla war \u2014 combined with Grant's generous terms \u2014 established the framework for national reunification. However, the war's end opened questions far more difficult than those settled on the battlefield: What would freedom mean for four million formerly enslaved people? What obligations did the nation owe to those who had been enslaved? How would the Southern states be reintegrated? The answers to these questions would define Reconstruction and shape American race relations for the next century and beyond."
            },
            reflection: {
                beginner: "Grant let the Confederate soldiers go home in peace. Five days later, Lincoln was killed. How might things have been different if Lincoln had lived? When a war ends, what does a country owe to the people who suffered?",
                intermediate: "Grant offered generous surrender terms: Confederates could go home and would not be prosecuted. Five days later, Lincoln was assassinated. How might Reconstruction have been different if Lincoln had lived? What responsibilities does a nation have to its people when a war ends?",
                advanced: "Grant's generous terms embodied Lincoln's vision of reconciliation \u2014 'with malice toward none, with charity for all.' Five days later, Lincoln's assassination placed Reconstruction in the hands of Andrew Johnson, a figure far less sympathetic to Black rights. How might Reconstruction have differed under Lincoln's leadership? More broadly, how do nations balance the competing imperatives of reconciliation with former enemies and justice for those who suffered? Consider modern examples of post-conflict societies grappling with these same questions."
            },
            winner: "union",
            outcome: "Union victory - the Civil War ends",
            casualties: { union: 164, confederacy: 500 },
            keyFact: {
                beginner: "When Union soldiers started firing celebration cannons, Grant ordered them to stop immediately. He said: 'The war is over. The rebels are our countrymen again.' That tells you a lot about the kind of peace Grant wanted.",
                intermediate: "Grant's generous surrender terms set the tone for reconciliation. When Union troops began firing celebration cannons, Grant ordered them to stop: 'The war is over. The rebels are our countrymen again.'",
                advanced: "Grant's order silencing celebratory cannons \u2014 'The war is over. The rebels are our countrymen again' \u2014 encapsulated the Union's approach to the war's end. Chamberlain's decision to have Union troops present arms as Confederates marched to stack their weapons further embodied this spirit. These gestures of magnanimity, however, existed in tension with the unresolved question of justice for four million formerly enslaved people \u2014 a tension that would define the troubled era of Reconstruction."
            },
            perspectives: [
                {
                    title: "Lincoln's Assassination",
                    icon: "\uD83C\uDFAD",
                    text: "Five days after Lee's surrender, President Lincoln was shot by John Wilkes Booth at Ford's Theatre in Washington. Lincoln had been planning a generous Reconstruction. His death put Vice President Andrew Johnson \u2014 a Tennessee Democrat with little sympathy for Black rights \u2014 in the White House. Many historians believe this single act changed the course of Reconstruction and delayed racial justice by generations."
                },
                {
                    title: "The Last Confederate Surrender",
                    icon: "\uD83E\uDEB6",
                    text: "Lee surrendered at Appomattox, but the war wasn't truly over. Brigadier General Stand Watie, a Cherokee leader, was the last Confederate general to surrender \u2014 on June 23, 1865, more than two months later. The Civil War tore Indigenous nations apart just as it did the United States: the Cherokee, Choctaw, Chickasaw, Creek, and Seminole nations all split between Union and Confederate loyalties."
                },
                {
                    title: "The 13th Amendment",
                    icon: "\u2696\uFE0F",
                    text: "The war's greatest legacy was the 13th Amendment, ratified in December 1865, abolishing slavery throughout the entire United States \u2014 not just in rebel states. But freedom on paper and freedom in practice were not the same thing. The struggle over what freedom meant for four million formerly enslaved people would define the next century of American history."
                }
            ]
        },

        freeplay: {
            briefing: "The endgame. Lee's starving army of 28,000 is surrounded by Grant's 100,000+. Richmond has fallen. The Confederacy's last army is trapped at Appomattox Court House. The question isn't whether the war will end, but how.",
            difficulty: 4,
            momentumValue: 3,
            strategies: [
                {
                    name: "Fight to the Last",
                    description: "Continue fighting despite impossible odds.",
                    detail: "Some believe surrender dishonors the sacrifices already made. Fighting to the end shows ultimate commitment, but means more death in a war already decided.",
                    power: { union: 7, confederacy: 2 },
                    casualties: { union: 15000, confederacy: 25000 },
                    outcome: {
                        win: "The remaining resistance collapses under your overwhelming force. The war ends on the battlefield.",
                        lose: "Desperate fighters inflict surprising casualties, but the outcome was never in doubt. The resistance delays the inevitable at terrible cost."
                    }
                },
                {
                    name: "Attempt Breakout",
                    description: "Try to punch through the encirclement and escape.",
                    detail: "Maybe there's still a chance to break free and continue the fight elsewhere. But the odds are nearly impossible against such overwhelming numbers.",
                    power: { union: 6, confederacy: 3 },
                    casualties: { union: 10000, confederacy: 20000 },
                    outcome: {
                        win: "The breakout attempt fails as your forces close every escape route. The enemy's last gamble ends in futility.",
                        lose: "A small force breaks through, but most are captured or scattered. The escape succeeds only in prolonging suffering."
                    }
                },
                {
                    name: "Honorable Surrender",
                    description: "Negotiate generous terms to end the war with dignity.",
                    detail: "The war is decided. An honorable surrender saves lives on both sides and begins the healing process. It takes more courage than fighting.",
                    power: { union: 8, confederacy: 4 },
                    casualties: { union: 0, confederacy: 0 },
                    outcome: {
                        win: "The surrender is handled with dignity and respect. Generous terms are offered, and the nation begins to heal. The war is truly over.",
                        lose: "Surrender terms are harsh and punitive. The war ends, but bitterness will poison the peace for decades."
                    }
                }
            ],
            fogOfWar: [
                { mod: 2, text: "Confederate supply trains are captured intact, revealing how desperate Lee's army has become. Morale collapses." },
                { mod: 1, text: "A Confederate officer arrives under a white flag, requesting terms. Negotiations begin." },
                { mod: -1, text: "A Confederate rearguard fights with desperate ferocity, inflicting unexpected casualties on your pursuing forces." },
                { mod: -2, text: "Lee's cavalry finds a gap in your encirclement and a portion of his army slips through, prolonging the campaign." }
            ],
            historicalEvent: {
                text: "Lee's attempted breakout at dawn finds Union infantry blocking every road.",
                mod: { union: 1, confederacy: -1 },
                basis: "April 9, 1865: Sheridan's cavalry and infantry encirclement"
            }
        }
    }
];
