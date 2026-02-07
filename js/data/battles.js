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
                union: "You command Fort Sumter, a small federal fort sitting on an island in Charleston Harbor. South Carolina seceded months ago, and now Confederate batteries surround you. Your supplies are running out, and President Lincoln is sending a relief ship.",
                confederacy: "South Carolina has seceded and the new Confederate government demands that all federal property be turned over. Fort Sumter sits in the middle of Charleston Harbor like a splinter. If you let a Union supply ship through, you look weak. If you fire, you start a war."
            },
            intel: {
                union: { forces: "85 soldiers", commander: "Major Robert Anderson", advantage: "Stone fortress with thick walls" },
                confederacy: { forces: "500 soldiers, 43 cannons in surrounding batteries", commander: "General P.G.T. Beauregard", advantage: "Overwhelming firepower from all sides" }
            },
            whatWouldYouDo: {
                union: { prompt: "Your fort is surrounded by enemy cannons and you're almost out of food. A supply ship is coming but may not get through. What do you do?", options: ["Hold the fort and wait for the supply ship", "Surrender now to avoid bloodshed", "Try to spike the cannons and evacuate by boat at night"] },
                confederacy: { prompt: "A Union supply ship is headed for Fort Sumter. If it arrives, the fort can hold out indefinitely. Do you act before it gets there?", options: ["Open fire on the fort before supplies arrive", "Block the harbor but hold fire unless fired upon", "Allow the supplies through to avoid starting a war"] }
            },
            whatHappened: "At 4:30 AM on April 12, Confederate batteries opened fire on Fort Sumter from all directions. The bombardment lasted 34 hours. Anderson's men fired back but were hopelessly outgunned. With the fort on fire and ammunition nearly gone, Anderson surrendered on April 13.",
            tech: { name: "Coastal Artillery", description: "Fort Sumter was designed to withstand wooden warships, but Confederate guns included new rifled cannons that were far more accurate than old smoothbore cannons. The age of brick-and-stone coastal forts was ending." },
            voice: { quote: "I do not pretend to sleep. How can I? If Anderson does not accept terms at four, the orders are he shall be fired upon. I count four, St. Michael's bells chime out and I begin to hope. At half-past four the heavy booming of a cannon. I sprang out of bed, and on my knees prostrate I prayed as I never prayed before.", attribution: "Mary Chesnut, wife of Confederate Senator James Chesnut Jr.", source: "Library of Congress, Mary Chesnut's Civil War diary" },
            biggerPicture: "The attack on Fort Sumter unified the North overnight. Lincoln called for 75,000 volunteers, and four more slave states joined the Confederacy. The war everyone hoped to avoid had begun.",
            reflection: "Both sides claimed they were acting in self-defense. The Confederacy said it was defending its territory; the Union said it was defending federal property. Who do you think fired the first shot of the war, and does it matter?",
            winner: "confederacy",
            outcome: "Confederate victory, fort surrendered",
            casualties: { union: 13, confederacy: 0 },
            keyFact: "No soldiers on either side were killed in combat during the bombardment. The only death was a Union soldier killed in an accidental explosion during the 100-gun surrender salute on April 14."
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
                union: "It's been three months since Fort Sumter, and the public demands action. Your army of 35,000 marches south toward the Confederate capital at Richmond. Everyone expects a quick victory. Civilians from Washington have packed picnic baskets to watch the battle.",
                confederacy: "A large Union army is marching toward you at Manassas Junction, just 30 miles from Washington. Your troops are mostly untrained volunteers, but you have a strong position along Bull Run creek. Reinforcements are on the way by railroad."
            },
            intel: {
                union: { forces: "35,000 troops", commander: "General Irvin McDowell", advantage: "Larger army with more supplies" },
                confederacy: { forces: "32,000 troops (after reinforcements)", commander: "Generals Beauregard & Johnston", advantage: "Defensive position along Bull Run creek" }
            },
            whatWouldYouDo: {
                union: { prompt: "Your green troops outnumber the enemy, but they've never been in battle. The public expects you to crush the rebellion in one fight. How do you attack?", options: ["Launch a flanking march around the enemy's left side", "Attack straight across Bull Run at the stone bridge", "Wait for better training before attacking at all"] },
                confederacy: { prompt: "The Union army is coming and you're outnumbered until reinforcements arrive by train. Do you attack first or dig in and hold?", options: ["Defend the creek crossings and wait for reinforcements", "Launch a surprise attack before the Union army is ready", "Fall back to a stronger position closer to Richmond"] }
            },
            whatHappened: "McDowell's flanking attack nearly worked, pushing the Confederates back. But General Thomas Jackson's brigade held firm on Henry Hill 'like a stone wall,' buying time. When Confederate reinforcements arrived by railroad, a massive counterattack sent the Union army fleeing back to Washington in panic, mixed in with the civilian spectators.",
            tech: { name: "Railroads in War", description: "Confederate reinforcements arrived by train from the Shenandoah Valley just in time to turn the battle. This was the first time railroads played a decisive role in combat, proving that trains could move armies faster than marching." },
            voice: { quote: "My very dear Sarah: The indications are very strong that we shall move in a few days, perhaps tomorrow. If it is necessary that I should fall on the battlefield for my country, I am ready. I have no misgivings about the cause in which I am engaged, and my courage does not halt or falter. Sarah, my love for you is deathless.", attribution: "Major Sullivan Ballou, 2nd Rhode Island Infantry (killed one week later at Bull Run)", source: "Library of Congress, Sullivan Ballou letter, July 14, 1861" },
            biggerPicture: "The Union defeat shattered the fantasy of a quick war. Lincoln signed bills to enlist 500,000 soldiers for three years and replaced McDowell with General McClellan. The South gained dangerous overconfidence, believing one battle had won their independence.",
            reflection: "Civilians brought picnic baskets to watch the battle like a sporting event. What does that tell you about how Americans in 1861 understood war? How did Bull Run change that understanding?",
            winner: "confederacy",
            outcome: "Confederate victory",
            casualties: { union: 2896, confederacy: 1982 },
            keyFact: "Civilians from Washington brought picnic baskets to watch the battle like a sporting event. They fled in terror alongside retreating Union soldiers, jamming the roads back to the capital."
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
                union: "General Grant's army is camped near Shiloh Church at Pittsburg Landing, Tennessee, waiting for reinforcements. You haven't built any defensive fortifications because you don't expect an attack. Grant is so confident, he's sleeping nine miles away at a mansion.",
                confederacy: "Grant's army is sitting in the open near Pittsburg Landing, completely unprepared. If you strike now with a surprise dawn attack, you can destroy his army before reinforcements arrive. Confederate General Albert Sidney Johnston tells his officers: 'Tonight we will water our horses in the Tennessee River.'"
            },
            intel: {
                union: { forces: "40,000 troops (with 25,000 reinforcements nearby)", commander: "General Ulysses S. Grant", advantage: "Gunboats on the Tennessee River for fire support" },
                confederacy: { forces: "44,000 troops", commander: "General Albert Sidney Johnston", advantage: "Complete surprise and initiative" }
            },
            whatWouldYouDo: {
                union: { prompt: "Confederate forces just burst out of the woods at dawn. Your army is caught completely off guard, with soldiers still eating breakfast. What do you do?", options: ["Rally scattered troops and form a defensive line at the Hornets' Nest", "Retreat to the river landing and wait for reinforcements", "Counterattack immediately to regain the initiative"] },
                confederacy: { prompt: "Your surprise attack is working! Union camps are overrun and thousands are fleeing. But your troops are getting disorganized chasing scattered enemies. Do you push on or regroup?", options: ["Keep pushing to finish off Grant's army before dark", "Halt and reorganize your scattered forces", "Concentrate everything on breaking the Hornets' Nest position"] }
            },
            whatHappened: "The Confederate surprise attack on April 6 nearly destroyed Grant's army. But stubborn Union resistance at the 'Hornets' Nest' bought precious hours. General Johnston was killed leading a charge that afternoon. Overnight, 25,000 Union reinforcements crossed the river. Grant counterattacked on April 7 and drove the Confederates from the field.",
            tech: { name: "Gunboats", description: "Two Union gunboats, the USS Tyler and USS Lexington, fired massive shells into Confederate positions all night. The booming guns terrified exhausted Southern soldiers and helped protect Grant's army while reinforcements crossed the river." },
            voice: { quote: "I saw an open field, in our possession on the second day, over which the Confederates had made repeated charges the day before, so covered with dead that it would have been possible to walk across the clearing, in any direction, stepping on dead bodies, without a foot touching the ground.", attribution: "General Ulysses S. Grant", source: "Library of Congress, Personal Memoirs of U.S. Grant, 1885" },
            biggerPicture: "Shiloh's 23,000 casualties in two days were more than all previous American wars combined. The nation was horrified. Dreams of a quick, glorious war died on that field. Grant was criticized for being unprepared, but Lincoln said: 'I can't spare this man. He fights.'",
            reflection: "After Shiloh, Grant wrote that he gave up all hope of saving the Union except by 'complete conquest.' Why do you think such a terrible battle changed his thinking about how the war needed to be fought?",
            winner: "union",
            outcome: "Union strategic victory",
            casualties: { union: 13047, confederacy: 10699 },
            keyFact: "Over 23,000 soldiers were killed or wounded in two days, more than all previous American wars combined at that point. The nation was horrified by the scale of the slaughter."
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
                union: "Robert E. Lee has invaded Maryland, bringing the war to Northern soil for the first time. But your soldiers just found an incredible gift: a copy of Lee's secret battle plans wrapped around three cigars! You know exactly where his divided army is positioned. This is your chance to destroy him.",
                confederacy: "General Lee has boldly invaded Maryland, hoping a victory on Northern soil will convince Britain and France to recognize the Confederacy. But your army is dangerously divided, spread across miles of countryside. Worse, you don't know that the enemy has found a copy of your battle plans."
            },
            intel: {
                union: { forces: "87,000 troops", commander: "General George McClellan", advantage: "2-to-1 numerical superiority and enemy's secret battle plans" },
                confederacy: { forces: "45,000 troops", commander: "General Robert E. Lee", advantage: "Strong defensive position with Antietam Creek as a barrier" }
            },
            whatWouldYouDo: {
                union: { prompt: "You have Lee's battle plans and twice his numbers. His army has its back to the Potomac River. This could end the war. How do you attack?", options: ["Attack everywhere at once to overwhelm Lee's thin lines", "Hit one flank hard, then the other, then the center", "Cut off Lee's retreat across the Potomac and trap his army"] },
                confederacy: { prompt: "Your army is outnumbered 2-to-1 with the Potomac River at your back. If you lose, there's no escape. Do you stay and fight or retreat to Virginia?", options: ["Stand and fight behind Antietam Creek", "Retreat across the Potomac before McClellan attacks", "Launch a surprise counterattack to throw McClellan off balance"] }
            },
            whatHappened: "McClellan attacked cautiously in three separate waves instead of all at once, giving Lee time to shift his thin forces. The fighting raged through a cornfield, a sunken road called 'Bloody Lane,' and across Burnside Bridge. It became the bloodiest single day in American history, with over 22,000 casualties. Lee held his ground but retreated to Virginia the next day.",
            tech: { name: "Battlefield Photography", description: "Photographer Alexander Gardner arrived at Antietam days after the battle and took the first photographs of American dead on a battlefield. When displayed in New York, viewers were shocked. For the first time, people at home could see the real horror of war." },
            voice: { quote: "A man lying upon the ground asked for a drink of water. I stooped to give it, and having raised him with my right hand, was holding the cup to his lips with my left, when I felt a sudden twitch of the sleeve of my dress. The poor fellow sprang from my hands and fell back quivering in the agonies of death. A ball had passed between my body and the right arm which supported him, cutting through the sleeve, and killing him.", attribution: "Clara Barton, volunteer nurse (later founder of the American Red Cross)", source: "Library of Congress, Clara Barton Papers" },
            biggerPicture: "Lincoln used the 'victory' at Antietam to issue the Emancipation Proclamation, declaring all enslaved people in rebel states to be free. This transformed the war from a fight to save the Union into a war to end slavery, and convinced Britain and France not to support the Confederacy.",
            reflection: "McClellan had Lee's secret plans and twice his troops, but still didn't destroy Lee's army. What does this tell you about the difference between having an advantage and using it? Can you think of other examples where someone had every advantage but didn't follow through?",
            winner: "draw",
            outcome: "Tactical draw, strategic Union victory",
            casualties: { union: 12401, confederacy: 10316 },
            keyFact: "September 17, 1862 remains the bloodiest single day in American history. Over 22,000 soldiers were killed or wounded in just 12 hours of fighting."
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
                union: "General Burnside, the new Union commander, plans to cross the Rappahannock River and push through Fredericksburg to reach Richmond. But pontoon bridges arrived weeks late, giving Lee time to fortify the heights above town. Now you must attack uphill across open ground against a stone wall bristling with Confederate rifles.",
                confederacy: "You've had weeks to prepare the perfect defensive position. Your army is dug in along Marye's Heights behind a stone wall, with clear fields of fire across open ground. The Union army must cross a river, march through a town, and then charge uphill into your guns. Let them come."
            },
            intel: {
                union: { forces: "114,000 troops", commander: "General Ambrose Burnside", advantage: "Massive numerical superiority" },
                confederacy: { forces: "72,000 troops", commander: "General Robert E. Lee", advantage: "Fortified high ground behind a stone wall" }
            },
            whatWouldYouDo: {
                union: { prompt: "The enemy holds the high ground behind a stone wall, and you have to cross open ground to reach them. Your generals are begging you to find another way. What do you do?", options: ["Send wave after wave against the stone wall until it breaks", "Look for a river crossing upstream to avoid the defenses", "Call off the attack and wait for a better opportunity"] },
                confederacy: { prompt: "The Union army is crossing the river into Fredericksburg. You hold the perfect defensive position. Do you try to stop them at the river or let them cross and attack your wall?", options: ["Let them cross and slaughter them in the open ground below the wall", "Shell them while they cross the river to disrupt their formations", "Launch a counterattack into the town while they're still crossing"] }
            },
            whatHappened: "Burnside ordered 14 separate assaults against the stone wall on Marye's Heights. Not a single one reached it. Union soldiers fell in rows, mowed down by Confederate rifle fire. Over 12,000 Union soldiers were killed or wounded compared to about 5,000 Confederates. It was one of the most lopsided battles of the war.",
            tech: { name: "The Minié Ball", description: "The soft lead Minié ball expanded when fired from a rifled musket, making it accurate up to 500 yards. At Fredericksburg, defenders behind the stone wall fired Minié balls into charging troops with devastating accuracy. This technology made frontal assaults far deadlier than generals realized." },
            voice: { quote: "It is well that war is so terrible, otherwise we should grow too fond of it.", attribution: "General Robert E. Lee, watching the Union assaults from Marye's Heights", source: "Recorded by staff officers; widely cited in Lee biographies and National Park Service records" },
            biggerPicture: "The disaster at Fredericksburg fueled the growing peace movement in the North. 'Copperhead' Democrats demanded an end to the war. Morale in the Union army hit rock bottom, with soldiers openly questioning their commanders. Burnside was removed from command.",
            reflection: "Burnside ordered 14 charges against the stone wall, and every one failed with heavy losses. At what point should a commander call off an attack that isn't working? What pressures might make a general keep attacking even when it's clearly failing?",
            winner: "confederacy",
            outcome: "Decisive Confederate victory",
            casualties: { union: 12653, confederacy: 5377 },
            keyFact: "A Confederate officer watching the slaughter said, 'A chicken could not live on that field.' Union soldiers later tried to use the bodies of fallen comrades as cover from the relentless fire."
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
                union: "You command 130,000 troops against Lee's 60,000. Your plan is brilliant: pin Lee in place while sweeping around his flank. General Hooker boasts, 'My plans are perfect.' The dense Virginia Wilderness should hide your movements.",
                confederacy: "You're outnumbered more than 2-to-1, and Hooker's army is closing in from multiple directions. Your only hope is a daring gamble: split your already small army and send Stonewall Jackson on a secret 12-mile march to hit the Union flank."
            },
            intel: {
                union: { forces: "130,000 troops", commander: "Joseph Hooker", advantage: "More than 2-to-1 numerical superiority" },
                confederacy: { forces: "60,000 troops", commander: "Robert E. Lee", advantage: "Familiar terrain and bold leadership" }
            },
            whatWouldYouDo: {
                union: {
                    prompt: "You outnumber Lee 2-to-1, but the dense forest limits your advantage. Reports say Lee may be splitting his forces. What do you do?",
                    options: [
                        "Attack immediately while Lee's army is divided",
                        "Hold your strong defensive positions and let Lee come to you",
                        "Withdraw to open ground where your numbers matter more"
                    ]
                },
                confederacy: {
                    prompt: "You're outnumbered 2-to-1. Jackson proposes a risky 12-mile flanking march that will leave your army dangerously split. Do you approve?",
                    options: [
                        "Send Jackson on the flanking march and hope for surprise",
                        "Keep your army together and fight defensively",
                        "Retreat to stronger positions closer to Richmond"
                    ]
                }
            },
            whatHappened: "Lee made his boldest gamble, splitting his army to send Jackson on a secret flanking march. At dusk, Jackson's 28,000 men burst from the woods and shattered the Union right flank. But that night, Jackson was accidentally shot by his own men and died days later.",
            tech: { name: "Field Medicine / Ambulance Corps", description: "Dr. Jonathan Letterman created the first organized ambulance corps system, with trained stretcher-bearers and triage stations. His system saved thousands of lives and became the model for military medicine worldwide." },
            voice: { quote: "He has lost his left arm, but I have lost my right arm.", attribution: "Robert E. Lee, on learning of Jackson's wounding", source: "Well-documented in multiple primary sources" },
            biggerPicture: "Lee's greatest victory gave him the confidence to invade the North again, leading directly to Gettysburg. But losing Stonewall Jackson was a wound the Confederacy never recovered from.",
            reflection: "Lee's greatest victory cost him Stonewall Jackson. When is a victory not worth the price?",
            winner: "confederacy",
            outcome: "Confederate tactical victory at devastating cost",
            casualties: { union: 17278, confederacy: 13303 },
            keyFact: "Stonewall Jackson was accidentally shot by his own men in the darkness. He died 8 days later. Lee never found a replacement who could match Jackson's speed and daring."
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
                union: "General Grant has marched his army deep into Mississippi after months of failed attempts to reach Vicksburg. The fortress city sits on high bluffs above the Mississippi River, blocking Union control of the waterway. Two direct assaults have already failed with heavy losses.",
                confederacy: "You hold Vicksburg, the 'Gibraltar of the Confederacy,' perched on 200-foot bluffs above the Mississippi River. As long as you hold this city, the Confederacy remains connected. General Pemberton has 30,000 troops behind strong fortifications."
            },
            intel: {
                union: { forces: "77,000 troops", commander: "Ulysses S. Grant", advantage: "Complete encirclement and naval superiority" },
                confederacy: { forces: "30,000 troops", commander: "John C. Pemberton", advantage: "Strong hilltop fortifications and interior lines" }
            },
            whatWouldYouDo: {
                union: {
                    prompt: "Two direct assaults on Vicksburg's fortifications have failed with heavy losses. The city sits on high bluffs with strong defenses. How do you take it?",
                    options: [
                        "Launch another massive assault with more troops",
                        "Surround the city and starve it into surrender",
                        "Bombard the city with naval guns until it falls"
                    ]
                },
                confederacy: {
                    prompt: "Grant's army surrounds your city and has cut off all supply lines. Your soldiers and civilians are running out of food. Relief armies have failed to break through.",
                    options: [
                        "Attempt a breakout with your entire garrison",
                        "Hold out and hope for a relief force to arrive",
                        "Negotiate surrender terms while you still have bargaining power"
                    ]
                }
            },
            whatHappened: "Grant settled into a 47-day siege, surrounding the city and cutting off all supplies. Soldiers and civilians alike slowly starved. People ate mules, rats, and boiled shoe leather. On July 4, 1863, the same day Lee retreated from Gettysburg, Pemberton surrendered the entire garrison.",
            tech: { name: "Trench Warfare", description: "Both sides dug miles of trenches, tunnels, and fortifications around Vicksburg. Union engineers even detonated a mine under Confederate lines. This style of warfare foreshadowed the trench warfare of World War I fifty years later." },
            voice: { quote: "We are utterly cut off from the world, surrounded by a circle of fire. People do nothing but eat what they can get, sleep when they can, and dodge the shells.", attribution: "Dora Miller, civilian woman in besieged Vicksburg", source: "Diary, Library of Congress" },
            biggerPicture: "Vicksburg's fall on July 4, combined with Gettysburg the day before, broke the Confederacy in two. The Union now controlled the entire Mississippi River, cutting off Texas, Arkansas, and Louisiana from the rest of the South.",
            reflection: "Civilians in Vicksburg lived in caves and ate rats during the siege. Is it acceptable to target civilians to win a war?",
            winner: "union",
            outcome: "Union victory - Mississippi River secured",
            casualties: { union: 4835, confederacy: 32697 },
            keyFact: "Vicksburg surrendered on July 4, 1863. The city was so bitter about the date that residents refused to celebrate Independence Day for over 80 years afterward."
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
                union: "Lee has invaded the North again, marching into Pennsylvania. Your army is racing to intercept him. When Union cavalry finds Confederate troops near Gettysburg, you rush to seize the high ground on Cemetery Ridge and the surrounding hills.",
                confederacy: "After your triumph at Chancellorsville, Lee has brought the war to Northern soil. A decisive victory here could force the Union to negotiate peace. Your army meets the enemy unexpectedly near the small town of Gettysburg."
            },
            intel: {
                union: { forces: "93,000 troops", commander: "George Meade", advantage: "Defensive high ground on Cemetery Ridge" },
                confederacy: { forces: "71,000 troops", commander: "Robert E. Lee", advantage: "Veteran army riding high on recent victories" }
            },
            whatWouldYouDo: {
                union: {
                    prompt: "You hold the high ground on Cemetery Ridge, but Lee's army is massing for an attack. Your flanks at Little Round Top and Culp's Hill need reinforcing. Where do you focus?",
                    options: [
                        "Strengthen the center and wait for Lee to attack uphill",
                        "Reinforce both flanks to prevent being surrounded",
                        "Launch a surprise counterattack before Lee is ready"
                    ]
                },
                confederacy: {
                    prompt: "The Union army holds strong hilltop positions. Longstreet urges you to swing around and get between Meade and Washington. But Lee wants to attack. What do you do?",
                    options: [
                        "Attack the Union center with everything you have",
                        "Flank around the Union position to cut them off",
                        "Withdraw and choose better ground for the fight"
                    ]
                }
            },
            whatHappened: "Three days of desperate fighting. Day 1: Confederates pushed Union forces through town but failed to take the high ground. Day 2: Attacks on both flanks nearly broke through at Little Round Top. Day 3: Lee sent 12,000 men in Pickett's Charge across a mile of open ground. It was slaughtered. Lee retreated to Virginia.",
            tech: { name: "Artillery", description: "Over 300 cannons fired in the bombardment before Pickett's Charge, the largest artillery barrage in North American history. The ground shook for miles. Despite the firepower, most Confederate shells overshot the Union line." },
            voice: { quote: "General, I have no division now.", attribution: "George Pickett to Robert E. Lee, after the failed charge", source: "Well-documented in multiple primary accounts" },
            biggerPicture: "The Confederate invasion of the North failed forever. Lincoln's Gettysburg Address redefined the war as a fight for equality. That same month, the 54th Massachusetts, a Black regiment, fought heroically at Fort Wagner, proving that African Americans would fight and die for their own freedom.",
            reflection: "Pickett's Charge sent 12,000 men across open ground into cannon fire. Was this brave or reckless? Who bears responsibility?",
            winner: "union",
            outcome: "Decisive Union victory - turning point of the war",
            casualties: { union: 23049, confederacy: 28063 },
            keyFact: "During Pickett's Charge, 12,000 Confederate soldiers marched nearly a mile across open ground. Union artillery and rifle fire cut them to pieces. Fewer than half made it back. Lee told his men, 'It is all my fault.'"
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
                union: "Your army is spread thin in the dense forests of northern Georgia, pursuing retreating Confederates toward Chattanooga. But General Bragg has received reinforcements from Virginia and now outnumbers you. The thick woods make it nearly impossible to see what's happening.",
                confederacy: "For once, you outnumber the Union forces. General Bragg has received Longstreet's corps from Lee's army in Virginia. Rosecrans' Union army is spread out and vulnerable in the dense Georgia forests. This is your chance to destroy them."
            },
            intel: {
                union: { forces: "60,000 troops", commander: "William Rosecrans", advantage: "Recent string of successful maneuvers" },
                confederacy: { forces: "65,000 troops", commander: "Braxton Bragg", advantage: "Numerical superiority and reinforcements from Virginia" }
            },
            whatWouldYouDo: {
                union: {
                    prompt: "You're in dense forest and reports say the enemy has been reinforced. Your army is spread across miles of thick woods. How do you handle this?",
                    options: [
                        "Consolidate your forces into a tight defensive line",
                        "Attack before the enemy can organize their reinforcements",
                        "Retreat to the strong defenses of Chattanooga"
                    ]
                },
                confederacy: {
                    prompt: "You outnumber the enemy and Longstreet's veterans have just arrived. The Union army is scattered in the forest. How do you exploit this?",
                    options: [
                        "Launch an all-out attack along the entire line",
                        "Probe for a weak point and concentrate your forces there",
                        "Wait for the enemy to make a mistake, then strike"
                    ]
                }
            },
            whatHappened: "On the second day, a confused order pulled a Union division out of line, creating a gaping hole. Longstreet's veterans smashed through like a battering ram, routing two-thirds of the Union army. Only General George Thomas held firm on Snodgrass Hill, earning the nickname 'Rock of Chickamauga' and saving the army from total destruction.",
            tech: { name: "The Telegraph", description: "The telegraph allowed commanders to coordinate armies hundreds of miles apart. Longstreet's reinforcements from Virginia were ordered by telegraph. After Chickamauga, Lincoln used the telegraph to rush Grant to Chattanooga to take command." },
            voice: { quote: "I had heard and read of battlefields... but I must confess that until this I never realized the 'pomp and circumstance' of the thing called glorious war.", attribution: "Sam Watkins, Confederate soldier", source: "Published memoir, 'Co. Aytch'" },
            biggerPicture: "Despite the Confederate victory, Bragg failed to pursue the beaten Union army and let them fortify Chattanooga. Lincoln sent Ulysses S. Grant to take command in the West, setting the stage for the Union breakout.",
            reflection: "A simple miscommunication created the gap that lost the battle. How much of war depends on luck versus skill?",
            winner: "confederacy",
            outcome: "Confederate tactical victory",
            casualties: { union: 16170, confederacy: 18454 },
            keyFact: "General George Thomas earned the nickname 'Rock of Chickamauga' for refusing to retreat. He held Snodgrass Hill against repeated Confederate assaults until nightfall, saving the Union army from total destruction."
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
                union: "General Grant has taken command of all Union armies and is marching south into the dense Virginia Wilderness to fight Lee. Grant's plan is simple: keep fighting and never retreat. The thick forest will cancel out your advantage in numbers and artillery, but Grant doesn't care.",
                confederacy: "Grant's massive army is pushing into the Wilderness, the same tangled forest where you defeated Hooker last year. The dense undergrowth is your ally, hiding your smaller numbers and turning the battle into close-range chaos where your veterans thrive."
            },
            intel: {
                union: { forces: "101,000 troops", commander: "Ulysses S. Grant", advantage: "Overwhelming numbers and supplies" },
                confederacy: { forces: "61,000 troops", commander: "Robert E. Lee", advantage: "Familiar terrain and veteran fighters" }
            },
            whatWouldYouDo: {
                union: {
                    prompt: "The dense forest neutralizes your big advantages. Do you push through anyway, try to outflank Lee, or bypass the Wilderness entirely?",
                    options: [
                        "Push straight through despite the terrain",
                        "Try to outflank Lee in the forest",
                        "March around the Wilderness to open ground"
                    ]
                },
                confederacy: {
                    prompt: "Grant's army outnumbers you nearly 2-to-1, but the thick forest is your equalizer. How do you use it?",
                    options: [
                        "Ambush Grant's columns as they move through the forest",
                        "Set up defensive positions and let Grant come to you",
                        "Attack aggressively before Grant can get organized"
                    ]
                }
            },
            whatHappened: "Two days of savage fighting in dense forest so thick soldiers couldn't see 20 yards ahead. The woods caught fire, threatening to burn wounded men alive. Neither side won a clear victory. But unlike every Union general before him, Grant refused to retreat. He marched south, and his soldiers cheered.",
            tech: { name: "Repeating Rifles", description: "Spencer repeating rifles could fire 7 shots without reloading, giving some Union units devastating firepower compared to single-shot muskets." },
            voice: {
                quote: "Oh, I am heartily tired of hearing about what Lee is going to do. Go back to your command, and try to think what we are going to do ourselves, instead of what Lee is going to do.",
                attribution: "Ulysses S. Grant, as recorded by aide Horace Porter",
                source: "Horace Porter, Campaigning with Grant, 1897 / Library of Congress"
            },
            biggerPicture: "Grant's refusal to retreat showed the war had entered its final phase. The Union would fight until the end.",
            reflection: "Grant kept fighting even with terrible casualties. Some called him a hero; others called him a butcher. Which do you think, and why?",
            winner: "draw",
            outcome: "Tactical draw, strategic shift in Union's favor",
            casualties: { union: 17666, confederacy: 11125 },
            keyFact: "When Union soldiers realized Grant was marching south instead of retreating north, they burst into cheers. For the first time, a Union commander refused to turn back after a brutal fight."
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
                union: "After months of maneuvering through Georgia, Sherman's army has reached Atlanta. The city's factories produce weapons and ammunition, and its railroads connect the eastern and western Confederacy. Capturing Atlanta could decide the 1864 presidential election.",
                confederacy: "Atlanta must not fall. Its factories, railroads, and strategic position are vital to the Confederacy's survival. President Davis has replaced the cautious General Johnston with the aggressive General Hood, ordering him to attack Sherman and save the city at all costs."
            },
            intel: {
                union: { forces: "100,000 troops", commander: "William T. Sherman", advantage: "Superior numbers and steady supply lines" },
                confederacy: { forces: "65,000 troops", commander: "John Bell Hood", advantage: "Fortified city defenses and interior lines" }
            },
            whatWouldYouDo: {
                union: {
                    prompt: "Atlanta is heavily fortified. A direct assault would be costly. But you could cut the railroads and starve the city out. What's your approach?",
                    options: [
                        "Surround the city and cut all railroad lines",
                        "Storm the fortifications with overwhelming force",
                        "Send cavalry deep behind the city to destroy supplies"
                    ]
                },
                confederacy: {
                    prompt: "Hood wants to attack aggressively, but Sherman's army is larger. Do you follow orders or play it safe?",
                    options: [
                        "Launch aggressive attacks to drive Sherman back",
                        "Defend the fortifications and wait for Sherman to make a mistake",
                        "Protect the railroads at all costs to keep supplies flowing"
                    ]
                }
            },
            whatHappened: "Hood attacked Sherman three times in eight days, losing over 15,000 men in failed offensives. Sherman then cut the railroads one by one, strangling Atlanta's supplies. On September 2, Hood evacuated the city, destroying what he couldn't carry. Sherman telegraphed Lincoln: 'Atlanta is ours, and fairly won.'",
            tech: { name: "Railroad Destruction", description: "Union soldiers heated railroad rails over bonfires and twisted them around trees, creating 'Sherman's neckties' that couldn't be reused." },
            voice: {
                quote: "Atlanta is ours, and fairly won.",
                attribution: "William T. Sherman, telegram to Washington",
                source: "National Archives"
            },
            biggerPicture: "Atlanta's fall guaranteed Lincoln's re-election. Without it, a peace candidate might have let the Confederacy survive.",
            reflection: "Atlanta's fall helped Lincoln win re-election and continue the war. Should military victories influence elections? How do wars shape politics today?",
            winner: "union",
            outcome: "Union victory - critical political and military impact",
            casualties: { union: 3722, confederacy: 8499 },
            keyFact: "Atlanta's fall helped Lincoln win re-election in 1864. If Lincoln had lost, the new president might have negotiated peace and allowed the Confederacy to survive."
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
                union: "After capturing Atlanta, Sherman proposes something radical: cut loose from your supply lines and march 300 miles to the sea, living off the land and destroying everything in a 60-mile-wide path. The goal is to break the South's ability and will to fight.",
                confederacy: "Sherman has left Atlanta and is marching across Georgia with 60,000 men. You have only scattered militia and Wheeler's cavalry to oppose him. The heartland of Georgia lies exposed and defenseless."
            },
            intel: {
                union: { forces: "60,000 troops", commander: "William T. Sherman", advantage: "No Confederate army large enough to stop you" },
                confederacy: { forces: "13,000 scattered militia and cavalry", commander: "Various (William Hardee, Joseph Wheeler)", advantage: "Knowledge of local terrain and roads" }
            },
            whatWouldYouDo: {
                union: {
                    prompt: "You're marching through enemy territory with no supply line. Do you destroy everything to break the South's will, target only military supplies, or move as fast as possible?",
                    options: [
                        "Destroy everything: farms, railroads, factories, and supplies",
                        "Target only military infrastructure and leave civilians alone",
                        "Move fast, take what you need, and avoid unnecessary destruction"
                    ]
                },
                confederacy: {
                    prompt: "Sherman's army is cutting through Georgia and you can't stop him with the forces you have. What can you do?",
                    options: [
                        "Harass his columns with cavalry raids and slow him down",
                        "Destroy supplies and bridges in his path before he arrives",
                        "Concentrate all forces for one desperate stand"
                    ]
                }
            },
            whatHappened: "Sherman's 60,000 troops marched 300 miles from Atlanta to Savannah in five weeks, destroying railroads, factories, cotton gins, and farms in a 60-mile-wide swath. His soldiers twisted heated rails into 'Sherman's neckties' and burned anything of military value. On December 21, Sherman captured Savannah and telegraphed Lincoln, offering the city as a Christmas gift.",
            tech: { name: "Total War", description: "Sherman pioneered 'total war,' targeting civilian infrastructure like farms, railroads, and factories to destroy the enemy's ability to fight, not just their army." },
            voice: {
                quote: "Like demons they rush in! To my smoke-house, my dairy, pantry, kitchen, and cellar. They drove off every one of my cows, took my pigs, chickens, and flour.",
                attribution: "Dolly Sumner Lunt, Georgia plantation owner",
                source: "Diary of Dolly Sumner Lunt, University of Georgia / Library of Congress"
            },
            biggerPicture: "By destroying the South's ability to make war, Sherman proved the Confederacy couldn't protect its own people.",
            reflection: "Sherman destroyed farms and homes to end the war faster. Did 'total war' save lives in the long run, or was it wrong to target civilians?",
            winner: "union",
            outcome: "Union victory - the Confederacy's heartland devastated",
            casualties: { union: 2200, confederacy: 2500 },
            keyFact: "Sherman's army destroyed an estimated $100 million in property (about $1.8 billion today). Soldiers bent heated railroad rails around trees, creating twisted metal 'neckties' that couldn't be straightened and reused."
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
                union: "Lee's army has abandoned Richmond and is fleeing west, starving and exhausted. Grant's forces are in pursuit, and Sheridan's cavalry has raced ahead to cut off Lee's escape. You have over 100,000 men closing in on Lee's 28,000. The end is near.",
                confederacy: "Richmond has fallen. Your army of 28,000 starving, exhausted men is all that remains. You're trying to escape west to join other Confederate forces, but Grant's army is closing in from every direction. Some officers urge guerrilla warfare. Lee must decide."
            },
            intel: {
                union: { forces: "100,000+ troops", commander: "Ulysses S. Grant", advantage: "Overwhelming numbers and the enemy surrounded" },
                confederacy: { forces: "28,000 troops", commander: "Robert E. Lee", advantage: "Desperation and willingness to fight to the last" }
            },
            whatWouldYouDo: {
                union: {
                    prompt: "Lee's army is trapped. You could demand unconditional surrender, or offer generous terms to speed the end and help heal the nation. What do you do?",
                    options: [
                        "Offer generous terms to encourage quick surrender",
                        "Demand unconditional surrender and punishment",
                        "Attack immediately and destroy Lee's army"
                    ]
                },
                confederacy: {
                    prompt: "Your army is surrounded and starving. Some officers want to scatter and fight as guerrillas for years. Others say it's time to end the bloodshed. What do you choose?",
                    options: [
                        "Surrender with honor and end the war",
                        "Attempt one final breakout to escape",
                        "Disband the army and wage guerrilla war"
                    ]
                }
            },
            whatHappened: "Lee attempted one last breakout at dawn on April 9, but Union infantry blocked every road. Lee said, 'There is nothing left for me to do but to go and see General Grant, and I would rather die a thousand deaths.' In the parlor of the McLean house, Grant offered generous terms: soldiers could go home, keep their horses, and officers kept their sidearms. The war was over.",
            tech: { name: "The Telegraph", description: "News of Lee's surrender spread across the nation in hours via telegraph, allowing celebrations to erupt in cities hundreds of miles away almost immediately." },
            voice: {
                quote: "Before us in proud humiliation stood men whom neither toils and sufferings, nor the fact of death, could bend from their resolve. Was not such manhood to be welcomed back into a Union so tested and assured?",
                attribution: "Joshua Chamberlain, Union officer, on the Confederate surrender ceremony",
                source: "Joshua Chamberlain, The Passing of the Armies, 1915 / Library of Congress"
            },
            biggerPicture: "Lee chose surrender over guerrilla war. Grant's generous terms shaped how Reconstruction would unfold.",
            reflection: "Lee chose surrender over guerrilla warfare. Grant offered generous terms. How did these choices affect what came after the war?",
            winner: "union",
            outcome: "Union victory - the Civil War ends",
            casualties: { union: 164, confederacy: 500 },
            keyFact: "Grant's generous surrender terms set the tone for reconciliation. When Union troops began firing celebration cannons, Grant ordered them to stop: 'The war is over. The rebels are our countrymen again.'"
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
