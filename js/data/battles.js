// Battle data for Civil War Battle Simulation
// 10 battles in chronological order with Historical Mode and Free-play Mode content

const battles = [
    {
        id: "bull_run",
        name: "First Battle of Bull Run",
        date: "July 21, 1861",
        year: 1861,
        location: "Manassas, Virginia",
        image: "images/battle_of_bull_run.jpg",
        imageCredit: "Kurz & Allison, 1889",

        historical: {
            overview: "The first major battle of the Civil War took place just 30 miles from Washington D.C. Both armies were mostly untrained volunteers, and hundreds of civilians from the capital packed picnic baskets to watch what they thought would be a quick, entertaining fight. They were terribly wrong.",
            union: {
                perspective: "As a Union commander, you march south with confidence. Your army outnumbers the rebels, and everyone in Washington expects you to crush this rebellion in a single afternoon. Civilians have come to watch your triumph.",
                experience: "Your troops fought bravely at first, pushing the Confederates back. But when rebel reinforcements arrived and General Thomas Jackson stood firm 'like a stone wall,' your inexperienced soldiers panicked. The retreat became a chaotic rout, with soldiers and civilian spectators fleeing together back to Washington.",
                aftermath: "This humiliating defeat shocked the North into reality. The war would not be quick or easy. President Lincoln began building a much larger, better-trained army and appointed new commanders."
            },
            confederacy: {
                perspective: "You're defending Virginia against the invading Union army. Your troops are brave but green. You need to hold the line at Bull Run creek until reinforcements arrive by railroad.",
                experience: "The battle nearly went against you when Union forces pushed hard in the morning. But General Thomas Jackson's brigade held firm on Henry Hill, earning him the nickname 'Stonewall.' When reinforcements arrived by train, your counterattack sent the Union army running.",
                aftermath: "Victory gave the South enormous confidence, but also dangerous overconfidence. Many Southerners believed the war was already won. Your army was too disorganized after the battle to pursue the fleeing Union forces toward Washington."
            },
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
            ]
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
            overview: "General Grant's Union army was camping near Shiloh Church in Tennessee when Confederate forces launched a devastating surprise attack at dawn. The two-day battle became one of the bloodiest so far, shocking both sides with its scale of destruction.",
            union: {
                perspective: "Your army is camped near Pittsburg Landing, waiting for reinforcements to arrive. You haven't bothered to set up defensive positions because you don't expect an attack. General Grant is confident.",
                experience: "At dawn, Confederate forces burst out of the woods and caught your army completely unprepared. Thousands of soldiers fled to the river in panic. But pockets of stubborn resistance held on all day, buying time. When reinforcements arrived overnight, you launched a massive counterattack on day two that drove the Confederates back.",
                aftermath: "Despite the surprise, Grant's determination to counterattack proved decisive. But the 23,000 total casualties shocked the nation. Grant was criticized for being unprepared but kept his command because Lincoln said, 'I can't spare this man. He fights.'"
            },
            confederacy: {
                perspective: "You've gathered your forces for a surprise attack on Grant's army before his reinforcements can arrive. If you strike fast and hard at dawn, you might destroy his army completely.",
                experience: "Your dawn attack was devastating! Union camps were overrun and thousands of soldiers fled. But you couldn't finish the job before nightfall. Confederate General Albert Sidney Johnston was killed leading a charge. Overnight, Union reinforcements arrived, and their counterattack on day two overwhelmed your exhausted troops.",
                aftermath: "Despite a brilliant surprise attack, the Confederate army was forced to retreat. The death of General Johnston was a severe loss. This battle proved that even a successful surprise attack couldn't guarantee victory against the North's superior numbers and resources."
            },
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
            ]
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
            overview: "Robert E. Lee invaded Maryland, hoping a victory on Northern soil would convince European nations to support the Confederacy. But Union soldiers found a copy of Lee's battle plans wrapped around three cigars! General McClellan now knew exactly where Lee's divided forces were positioned.",
            union: {
                perspective: "You've just received an incredible gift: a copy of Lee's actual battle plans found wrapped around cigars by a Union soldier. You know exactly where every Confederate unit is positioned. This could be your chance to destroy Lee's army and end the war.",
                experience: "Despite knowing Lee's plans, General McClellan attacked cautiously, sending forces in waves rather than all at once. The fighting raged across a cornfield, a sunken road called 'Bloody Lane,' and Burnside Bridge. By the end of the bloodiest single day in American history, Lee's army still held its ground, but barely.",
                aftermath: "McClellan failed to destroy Lee's army, but forced him to retreat to Virginia. Lincoln used this 'victory' to issue the Emancipation Proclamation, officially making the war about ending slavery. This convinced Britain and France not to support the Confederacy."
            },
            confederacy: {
                perspective: "General Lee has boldly invaded Maryland, bringing the war to Union territory. But your army is dangerously divided, and somehow the enemy has obtained your battle plans. You must fight with your back to the Potomac River.",
                experience: "Your army fought desperately all day against a much larger force. At the Cornfield, soldiers charged back and forth until the ground was covered with the dead. At Bloody Lane, your men held a sunken road until it became a death trap. A.P. Hill's division arrived just in time to prevent a collapse on your right flank.",
                aftermath: "Although you held the field for a day, Lee was forced to retreat to Virginia. The invasion of the North had failed. Worse, Lincoln used the battle to announce the Emancipation Proclamation, changing the entire nature of the war."
            },
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
            ]
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
            overview: "General Burnside's Union army attempted to cross the Rappahannock River and assault fortified Confederate positions on Marye's Heights. Lee had weeks to prepare his defenses, including a devastating stone wall. The result was one of the most lopsided Union defeats of the war.",
            union: {
                perspective: "You need to cross the Rappahannock River and push through Fredericksburg to reach Richmond, the Confederate capital. But Lee's army has had weeks to dig in on the heights above the town. A stone wall at the base of Marye's Heights provides perfect cover for Confederate rifles.",
                experience: "Wave after wave of Union soldiers charged across open ground toward the stone wall. Confederate defenders mowed them down with devastating fire. General Burnside ordered 14 separate assaults, and every single one was repulsed with terrible losses. Soldiers fell in rows, unable to even reach the wall.",
                aftermath: "The disaster at Fredericksburg destroyed Northern morale. Burnside was removed from command. A Confederate officer watching the slaughter said, 'It is well that war is so terrible, or we should grow too fond of it.' The Union had to rethink its approach."
            },
            confederacy: {
                perspective: "Lee has positioned your army perfectly on Marye's Heights behind a stone wall, with clear fields of fire across open ground. The Union army must cross the river and attack uphill. You've had weeks to prepare.",
                experience: "The battle was a one-sided triumph. From behind the stone wall, your riflemen cut down wave after wave of charging Union soldiers. 'A chicken could not live on that field,' one of your officers said. Fourteen Union assaults were thrown back with devastating losses.",
                aftermath: "Fredericksburg was the Confederacy's most complete defensive victory. But Lee knew he couldn't just keep defending. The North had more men and would keep coming. He needed to find a way to win the war, not just battles."
            },
            winner: "confederacy",
            outcome: "Decisive Confederate victory",
            casualties: { union: 12653, confederacy: 5377 },
            keyFact: "General Lee, watching the slaughter from the heights, said: 'It is well that war is so terrible, otherwise we should grow too fond of it.' Union soldiers later tried to use the bodies of fallen comrades as cover."
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
            ]
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
            overview: "General Hooker's Union army of 130,000 faced Lee's 60,000 in the tangled Virginia wilderness. Despite being outnumbered over 2-to-1, Lee made his most audacious move: splitting his already smaller army to send Stonewall Jackson on a secret flanking march. It was military brilliance, but victory came at a devastating cost.",
            union: {
                perspective: "You command the largest army yet assembled, outnumbering Lee more than 2-to-1. Your plan is solid: pin Lee in place with half your army while the other half sweeps around his flank. 'My plans are perfect,' General Hooker declared.",
                experience: "Everything fell apart when Jackson's 28,000 men burst from the woods at dusk, hitting your right flank like a thunderbolt. Entire divisions were overrun in minutes. Soldiers eating dinner were swept away by the tide of panicked troops. Despite outnumbering Lee, you were forced to retreat.",
                aftermath: "The defeat at Chancellorsville, despite having twice Lee's numbers, was deeply demoralizing. But there was a silver lining: the Confederacy paid an enormous price. Stonewall Jackson was accidentally shot by his own men and died, depriving Lee of his best general forever."
            },
            confederacy: {
                perspective: "You face the largest Union army yet, with more than double your numbers. Your only hope is a daring gamble: split your small army and send Jackson on a secret 12-mile march through the wilderness to hit the Union flank.",
                experience: "Jackson's march was one of the greatest flanking maneuvers in military history. At 5:15 PM, his men burst from the forest and rolled up the Union right flank. The surprise was total. But that night, tragedy struck: Jackson was accidentally shot by his own soldiers while scouting in the dark.",
                aftermath: "Chancellorsville was Lee's masterpiece, his greatest victory. But the death of Stonewall Jackson was a wound the Confederacy never recovered from. Lee said, 'I have lost my right arm.' Without Jackson, future campaigns would never be the same."
            },
            winner: "confederacy",
            outcome: "Confederate tactical victory at devastating cost",
            casualties: { union: 17278, confederacy: 13303 },
            keyFact: "Stonewall Jackson was accidentally shot by his own men in the darkness after the battle. He died 8 days later. Lee said, 'He has lost his left arm, but I have lost my right arm.' The Confederacy never replaced him."
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
            ]
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
            overview: "Often called the turning point of the Civil War, this three-day battle in Pennsylvania began almost by accident when Confederate soldiers looking for shoes bumped into Union cavalry. It became the bloodiest battle of the war, with over 50,000 total casualties.",
            union: {
                perspective: "Lee has invaded the North again, and your army is racing to catch him. When your cavalry finds Confederate troops near the town of Gettysburg, you rush to seize the high ground south of town: Cemetery Ridge, Cemetery Hill, and Little Round Top.",
                experience: "Day 1: Your forces were pushed through town but held Cemetery Hill. Day 2: Desperate fighting at Little Round Top, the Peach Orchard, and Devil's Den, but your lines held. Day 3: Lee threw 12,000 men in 'Pickett's Charge' straight at your center. They marched a mile across open ground under devastating fire. The charge was crushed. Nearly 6,000 Confederates fell in less than an hour.",
                aftermath: "Gettysburg was the Union's greatest victory and the turning point of the war. Lee's invasion of the North failed utterly. He would never again have the strength to attack. President Lincoln later gave his famous Gettysburg Address at the battlefield cemetery."
            },
            confederacy: {
                perspective: "Lee has brought the war to Northern soil, hoping a decisive victory will force the Union to negotiate peace. Your army meets the enemy unexpectedly near Gettysburg, and the biggest battle of the war begins.",
                experience: "Day 1: You pushed the Union through town, but they dug in on the high ground. Day 2: Attacks on both flanks came close to breaking through but ultimately failed. Day 3: Lee ordered Pickett's Charge, sending 12,000 men across a mile of open field into the teeth of the Union line. It was a slaughter. 'It's all my fault,' Lee told his retreating men.",
                aftermath: "Gettysburg was a catastrophic defeat. Over 28,000 Confederate soldiers were killed, wounded, or captured. Lee retreated to Virginia and never invaded the North again. The dream of winning the war through military victory began to die."
            },
            winner: "union",
            outcome: "Decisive Union victory - turning point of the war",
            casualties: { union: 23049, confederacy: 28063 },
            keyFact: "During Pickett's Charge on Day 3, 12,000 Confederate soldiers marched nearly a mile across open ground. Union artillery and rifle fire cut them to pieces. Fewer than half made it back. Lee told his men, 'It is all my fault.'"
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
            ]
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
            overview: "In the thick forests of northern Georgia, Confederate General Bragg caught Union General Rosecrans' forces spread out and vulnerable. A confused order in the Union line created a fatal gap. It was one of the few battles where the Confederacy had more troops than the Union.",
            union: {
                perspective: "Your army is spread thin in the dense forests of northern Georgia, pursuing the retreating Confederates. But Bragg has received reinforcements and is about to turn and fight with superior numbers. The thick woods make it nearly impossible to see what's happening.",
                experience: "Disaster struck when a confused order pulled a division out of line, creating a gaping hole. Confederate General Longstreet's corps smashed through like a battering ram. Two-thirds of your army fled toward Chattanooga in chaos. Only General George Thomas held firm, rallying a stubborn defense that prevented total destruction.",
                aftermath: "Despite the terrible defeat, Thomas's heroic stand earned him the nickname 'Rock of Chickamauga' and saved your army from destruction. The army retreated to Chattanooga, where it was besieged but would eventually be reinforced and break out."
            },
            confederacy: {
                perspective: "For once, you outnumber the Union forces. General Bragg plans to use reinforcements from Lee's army, led by General Longstreet, to crush Rosecrans in the dense Georgia forests.",
                experience: "On the second day, Longstreet's corps found and exploited a gap in the Union line. The breakthrough was spectacular, sending most of the Union army fleeing toward Chattanooga. But General Thomas's stubborn defense on Snodgrass Hill prevented you from destroying the entire Union force.",
                aftermath: "Chickamauga was one of the Confederacy's greatest tactical victories but a strategic failure. Bragg failed to pursue the beaten Union army and allowed them to fortify Chattanooga. The victory bought time but couldn't reverse the war's direction."
            },
            winner: "confederacy",
            outcome: "Confederate tactical victory",
            casualties: { union: 16170, confederacy: 18454 },
            keyFact: "General George Thomas earned the nickname 'Rock of Chickamauga' for his stubborn defense that saved the Union army from total destruction. He held his position against repeated Confederate assaults until nightfall."
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
            ]
        }
    },

    {
        id: "wilderness",
        name: "Battle of the Wilderness",
        date: "May 5-7, 1864",
        year: 1864,
        location: "Spotsylvania County, Virginia",
        image: "images/battle_of_the_wilderness.jpg",
        imageCredit: "Kurz & Allison",

        historical: {
            overview: "Ulysses S. Grant, now commanding all Union armies, launched his Overland Campaign by marching into the same dense Virginia forest where Hooker was defeated a year earlier. The fighting was so intense that the forest caught fire, threatening to burn wounded soldiers alive. But unlike every Union commander before him, Grant refused to retreat.",
            union: {
                perspective: "General Grant has taken command with a simple strategy: keep fighting Lee no matter what. No more retreating after a tough battle. You march into the Wilderness, knowing the dense forest will limit your advantages in numbers and artillery.",
                experience: "The fighting was horrific. In the dense undergrowth, soldiers couldn't see more than a few yards. Units fired into the smoke and confusion, sometimes hitting their own men. The forest caught fire, and wounded soldiers screamed as flames approached. After two days of terrible fighting with no clear winner, every previous Union commander would have retreated north. Grant didn't.",
                aftermath: "Grant's losses were staggering, but instead of retreating, he marched south toward Spotsylvania. When soldiers realized they were advancing, not retreating, they cheered. Grant told Lincoln, 'I propose to fight it out on this line if it takes all summer.' This marked a new, relentless Union strategy."
            },
            confederacy: {
                perspective: "Grant is coming with the largest army you've ever faced, but he's fighting in your territory, in the dense Wilderness where you defeated Hooker last year. The forest neutralizes his advantages in numbers and artillery.",
                experience: "Your soldiers fought brilliantly in familiar terrain, using the dense forest to ambush and confuse the larger Union army. Forest fires added to the horror. After two days of savage fighting, you had held your ground and inflicted more casualties than you received. By every measure of previous battles, you had won.",
                aftermath: "But something was different this time. Instead of retreating like every Union commander before him, Grant marched south. For the first time, a Union general was willing to absorb terrible losses and keep coming. Lee told his officers, 'This is a very different kind of general.' The long, grinding endgame of the war had begun."
            },
            winner: "draw",
            outcome: "Tactical draw, strategic shift in Union's favor",
            casualties: { union: 17666, confederacy: 11125 },
            keyFact: "When Union soldiers realized Grant was marching south (advancing) instead of north (retreating), they burst into cheers. For the first time in the war, a Union commander refused to retreat after a tough battle."
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
            ]
        }
    },

    {
        id: "atlanta",
        name: "Battle of Atlanta",
        date: "July 22, 1864",
        year: 1864,
        location: "Atlanta, Georgia",
        image: "images/battle_of_atlanta.jpg",
        imageCredit: "Kurz & Allison, 1888",

        historical: {
            overview: "General Sherman's Union army threatened Atlanta, the industrial heart of the Confederacy. Atlanta's factories produced weapons and supplies, and its railroads connected the eastern and western halves of the South. Confederate General Hood replaced the cautious Johnston and launched desperate attacks to save the city.",
            union: {
                perspective: "After months of maneuvering through Georgia, you've reached Atlanta. The city's factories and railroads make it the most important target in the South outside of Richmond. If you capture it, the Confederacy is cut in half.",
                experience: "Confederate General Hood launched several desperate attacks against your army, but each one was repulsed with heavy Confederate losses. You gradually cut the railroads leading into the city one by one, strangling Atlanta's supplies. On September 2, Confederate forces evacuated, and your army marched into the city.",
                aftermath: "The fall of Atlanta was a political earthquake. Northern voters had been growing tired of the war, and some wanted to negotiate peace. Atlanta's capture proved the Union was winning and helped Lincoln win re-election in November. Sherman's famous telegram read: 'Atlanta is ours, and fairly won.'"
            },
            confederacy: {
                perspective: "Atlanta must not fall. Its factories, railroads, and strategic position make it vital to the Confederacy's survival. President Davis has replaced the cautious General Johnston with the aggressive General Hood, ordering him to attack Sherman and save the city.",
                experience: "Hood attacked Sherman three times in eight days, each time suffering terrible losses. Your army lost over 15,000 men in failed offensives while Sherman lost far fewer. As Sherman cut the railroads one by one, Atlanta was slowly strangled. On September 1, Hood ordered the evacuation, destroying supplies and ammunition to keep them from the enemy.",
                aftermath: "The loss of Atlanta was devastating to Confederate morale and to the Southern war effort. Without Atlanta's factories and railroads, the Confederacy's ability to fight was severely weakened. Lincoln won re-election, ensuring the war would continue until total Union victory."
            },
            winner: "union",
            outcome: "Union victory - critical political and military impact",
            casualties: { union: 3722, confederacy: 8499 },
            keyFact: "Atlanta's fall helped Lincoln win re-election in 1864. If Lincoln had lost, the new president might have negotiated peace and allowed the Confederacy to survive. Sherman's capture of Atlanta may have saved the Union more than any single battle."
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
            ]
        }
    },

    {
        id: "appomattox",
        name: "Surrender at Appomattox Court House",
        date: "April 9, 1865",
        year: 1865,
        location: "Appomattox Court House, Virginia",
        image: "images/surrender_appomattox.jpg",
        imageCredit: "Tom Lovell",

        historical: {
            overview: "Lee's army, starving and exhausted after the fall of Richmond and Petersburg, attempted to escape west but was surrounded by Grant's forces near the small Virginia town of Appomattox Court House. With only 28,000 men against Grant's 100,000+, the end had come.",
            union: {
                perspective: "After months of siege at Petersburg, Lee's army has finally broken. You've been pursuing his exhausted, starving forces for days. Your cavalry has gotten ahead of Lee and cut off his escape. The largest Confederate army is trapped.",
                experience: "Lee's army attempted one last breakout at dawn on April 9 but found Union infantry blocking their path. With no escape and no hope of reinforcement, Lee sent a flag of truce. Grant met Lee in the parlor of Wilmer McLean's house. Grant offered generous terms: Confederates could go home, keep their horses, and officers could keep their sidearms.",
                aftermath: "When Union troops began firing celebration cannons, Grant ordered them to stop. 'The war is over,' he said. 'The rebels are our countrymen again.' The generous terms helped begin the long process of reunification. The Civil War was effectively over."
            },
            confederacy: {
                perspective: "Your army is starving, exhausted, and surrounded. Richmond has fallen. You have 28,000 men left against over 100,000. Some officers want to scatter into the mountains and fight as guerrillas. Lee must make the hardest decision of his life.",
                experience: "Lee's final attempt to break through failed when Union infantry blocked the road west. 'Then there is nothing left for me to do but to go and see General Grant,' Lee said, 'and I would rather die a thousand deaths.' Lee dressed in his best uniform and rode to Appomattox Court House. Grant's terms were unexpectedly generous, allowing your soldiers to go home in peace.",
                aftermath: "Lee chose surrender over guerrilla war, a decision that saved countless lives and allowed the nation to begin healing. When his soldiers wept, Lee told them: 'Go home now, and if you make as good citizens as you have soldiers, you will do well, and I shall always be proud of you.' The war was over."
            },
            winner: "union",
            outcome: "Union victory - the Civil War ends",
            casualties: { union: 164, confederacy: 500 },
            keyFact: "Grant's generous surrender terms set the tone for reconciliation. Confederate soldiers could go home, keep their horses for spring planting, and officers kept their sidearms. When Union troops began celebrating, Grant silenced them, saying, 'The war is over. The rebels are our countrymen again.'"
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
            ]
        }
    }
];
