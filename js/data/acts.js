// Civil War Battle Simulation v3.12 - Acts data
// Surfaces the 4-act structure already implicit in groupedReflections (js/ui.js).
//
// Each act has:
//   - intro: positioning sentence (3 reading levels) + map markers
//   - recall: 3 multiple-choice questions per reading level (added in later commits)
//
// Map regions are derived from the studytools/units/civil-war 1861 dataset
// (https://github.com/shiebenaderet/studytools), authored by Shie Benaderet.
// viewBox is 0 0 900 700; only eastern-theater regions are included.

const ACT_MAP_VIEWBOX = '240 100 640 560';
const ACT_MAP_REGIONS = [
    { id: 'indian-territory', name: 'Indian Territory', allegiance: 'territory', d: 'M 469.475,414.37 468.175,403.97 468.175,396.07 466.675,389.47 466.275,382.87 466.075,378.67 453.675,379.47 410.275,379.07 368.175,377.07 344.475,375.17 334.475,374.77 328.375,374.27 328.575,374.47 328.075,385.47 348.475,386.57 377.675,387.67 376.375,410.17 375.975,427.17 376.175,428.77 380.275,432.27 382.275,433.37 382.975,433.17 383.675,431.17 384.975,432.97 386.975,432.97 386.975,431.67 389.575,432.97 389.175,436.67 392.975,436.87 395.375,437.97 399.175,438.67 401.575,440.47 403.775,438.47 406.975,439.17 409.375,442.37 410.275,442.37 410.275,444.57 412.475,445.27 414.675,443.07 416.375,443.77 418.775,443.77 419.675,446.27 424.175,448.07 425.475,447.37 427.175,443.47 428.275,443.47 429.375,445.47 433.175,446.17 436.575,447.47 439.275,448.37 441.075,447.47 441.675,444.97 445.775,444.97 447.775,445.87 450.375,443.87 451.475,443.87 452.075,445.47 455.875,445.47 457.375,443.47 459.075,443.87 461.075,446.37 464.075,448.17 467.075,449.07 469.675,450.67 z' },
    { id: 'maine', name: 'Maine', allegiance: 'union', d: 'M857.7,141.8l1.9,2l2.2,3.5v1.9l-2,4.5l-1.9,0.6l-3.1,2.9l-4.5,5.3c0,0-0.6,0-1.2,0s-0.9-2-0.9-2l-1.7,0.2l-0.9,1.4l-2.3,1.4l-0.9,1.4l1.5,1.4l-0.5,0.6l-0.5,2.6l-1.9-0.2v-1.6l-0.3-1.3l-1.4,0.3l-1.7-3.1l-2,1.3l1.2,1.4l0.3,1.1l-0.8,1.3l0.3,2.9l0.1,1.6l-1.5,2.5l-2.7,0.5l-0.3,2.7l-5,2.9l-1.2,0.5l-1.6-1.4l-2.8,3.4l0.9,3l-1.4,1.3l-0.2,4.2l-1.5,7.3L817,199l-0.5-2.9l-3.4-1.4l-0.3-2.6l-6.9-22.4l-4.5-14l2.3-0.3l1.4,0.4v-2.5l0.8-5.3l2.5-4.5l1.4-3.8l-1.9-2.4v-5.7l0.8-0.9l0.8-2.7l-0.2-1.4l-0.2-4.6l1.7-4.6l2.7-8.5l2-4h1.2l1.2,0.2v1.1l1.2,2.2l2.6,0.6l0.8-0.8v-0.9l3.8-2.7l1.7-1.7l1.4,0.2l5.6,2.4l1.8,0.9l8.9,28.4h5.6l0.8,1.9l0.2,4.6l2.7,2.2h0.8l0.2-0.5l-0.5-1.1L857.7,141.8z M838.1,170.5l1.5-1.5l1.3,1l0.5,2.4l-1.6,0.9L838.1,170.5z M844.4,164.9l1.7,1.8c0,0,1.2,0.1,1.2-0.2s0.2-2,0.2-2l0.8-0.8l-0.8-1.7l-1.9,0.7L844.4,164.9z' },
    { id: 'new-hampshire', name: 'New Hampshire', allegiance: 'union', d: 'M818.5,204.3l0.3-1.5l1-3.1l-2.4-0.9l-0.5-2.9l-3.6-1.1l-0.3-2.6l-6.9-22.4l-4.3-13.8h-0.9l-0.6,1.6l-0.6-0.5l-0.9-0.9l-1.4,1.9l-0.9,5.2l0.3,5.4l1.9,2.6v3.8l-3.5,3.8l-2.5,1.1v1.1l1.1,1.7v8.2l-0.8,8.8l-0.2,4.6l0.9,1.3l-0.2,4.3l-0.5,1.7l1.4,2l16.2-3.9l2.2-0.6l2-3L818.5,204.3z' },
    { id: 'vermont', name: 'Vermont', allegiance: 'union', d: 'M784.3,214.8l-0.8-5.4l-2.7-10.4l-0.6-0.3l-2.7-1.3l0.8-2.7l-0.8-2l-2.4-4.3l0.9-3.7l-0.8-4.9l-2.2-6.2l-0.8-4.7l24.2-6.9l0.3,5.6l1.8,2.6v3.8l-3.3,3.8l-2.4,1.1v1.1l1.1,1.7v8.2l-0.8,8.8l-0.2,4.6l0.9,1.3l-0.2,4.3l-0.5,1.7l1.3,2l-6.3,1.3L784.3,214.8z' },
    { id: 'massachusetts', name: 'Massachusetts', allegiance: 'union', d: 'M835.9,233.7l2.1-0.7l0.4-1.7l1,0.1l1,2.2l-1.2,0.4l-3.6,0.1L835.9,233.7z M827.2,234.4l2.2-2.6h1.5l1.8,1.4l-2.3,1l-2.1,1L827.2,234.4L827.2,234.4z M794.6,213.5l16.3-4l2.2-0.6l2-3l3.5-1.6l2.7,4.2l-2.3,4.9l-0.3,1.4l1.9,2.5l1.1-0.8h1.7l2.2,2.5l3.6,5.7l3.3,0.5l2.2-0.9l1.7-1.7l-0.8-2.6l-2-1.6l-1.4,0.8l-0.9-1.3l0.5-0.5l2-0.2l1.7,0.8l1.8,2.4l0.9,2.7l0.3,2.4l-3.9,1.4l-3.6,1.9l-3.6,4.3l-1.9,1.4v-1l2.3-1.4l0.5-1.7l-0.8-2.9l-2.7,1.4l-0.8,1.4l0.5,2.2l-2.6,1.4l-2.6-4.3l-3.1-4.2l-1.6-1.1l-5.4,1.5l-4.8,1l-20.4,4.5l-1-5.8l0.6-10.1l4.9-0.9L794.6,213.5' },
    { id: 'rhode-island', name: 'Rhode Island', allegiance: 'union', d: 'M812.6,239.3l-0.5-4l-0.8-4.2l-1.6-5.6l5.4-1.5l1.6,1.1l3.1,4.2l2.7,4.2l-2.7,1.5l-1.2-0.2l-1.1,1.7l-2.3,1.9L812.6,239.3z' },
    { id: 'connecticut', name: 'Connecticut', allegiance: 'union', d: 'M813.1,239.3l-0.9-4l-0.8-4.2l-1.5-5.7l-4.9,1.1l-20.4,4.5l0.6,3.1l1.4,7v7.8l-1.1,2.2l1.8,2.1l4.6-3.2l3.3-3.1l1.9-2l0.8,0.6l2.6-1.4l4.9-1.1L813.1,239.3z' },
    { id: 'new-york', name: 'New York', allegiance: 'union', d: 'M768.8,249.4l-1.1-0.9l-2.5-0.2l-2.2-1.9l-2.3-5.1l-2.7-0.8l-2.2-2.1l-17.4,3.8l-40.2,8.3l-8.3,1.4l-0.7-6.7l2.6-1.8l1.2-1.1l0.9-1.6l1.7-1.1l1.9-1.7l0.5-1.6l2-2.6l1.1-0.9l-0.2-0.9l-1.2-2.9l-1.7-0.2l-1.9-5.9l2.7-1.7l4.1-1.4l3.8-1.3l3-0.5l5.9-0.2l1.9,1.3l1.5,0.2l2-1.3l2.5-1.1l4.9-0.5l2-1.7l1.7-3.1l1.5-1.9h2l1.9-1.1l0.2-2.2l-1.4-2L736,203l1.1-2v-1.4h-1.7l-1.7-0.8l-0.8-1.1l-0.2-2.5l5.5-5.3l0.6-0.8l1.4-2.7l2.7-4.3l2.6-3.5l2-2.4l2.3-1.8l2.9-1.2l5.2-1.3l3,0.2l4.2-1.4l7.1-2l0.5,4.8l2.3,6.2l0.8,4.9l-0.9,3.7l2.5,4.3l0.8,2l-0.8,2.7l2.7,1.3l0.6,0.3l2.8,10.4l0.5,4.9l-0.5,10.4l0.8,5.3l0.8,3.4l1.4,7v7.8l-1.1,2.2l1.8,1.9l-0.2,1.5l-1.9,1.6l0.3,1.3l1.2-0.3l1.4-1.3l2.2-2.5l1.1-0.6l1.5,0.6l2.2,0.2l7.5-3.7l2.7-2.6l1.2-1.4l3.9,1.6l-3.1,3.4l-3.6,2.7l-6.7,5.1l-2.5,0.9l-5.5,1.9l-3.8,1.1l-1.4-0.5l-0.6-3.2l-0.568-2.074L782.1,254.6l-1.37-0.868l-4.2-0.9l-3.806-1.438L768.8,249.4z' },
    { id: 'new-jersey', name: 'New Jersey', allegiance: 'union', d: 'M769.35,248.85l-2,2.4v2.9l-1.9,2.9l-0.2,1.6l1.2,1.3l-0.2,2.4l-2.2,1.1l0.8,2.6l0.2,1.1l2.6,0.3l0.9,2.5l3.3,2.4l2.3,1.6v0.8l-3,2.9l-1.5,2.2l-1.4,2.6l-2.2,1.3l-1.2,0.7l-0.2,1.2l-0.6,2.5l1,2.2l3,2.7l4.5,2.2l3.8,0.6l0.2,1.4l-0.8,0.9l0.3,2.6h0.8l2-2.4l0.8-4.6l2.6-3.8l2.8-6.2l1.1-5.3l-0.6-1.1l-0.2-8.9l-1.6-3.2l-1.1,0.8l-2.6,0.3l-0.5-0.5l1.1-0.9l2-1.9l0.1-1.1l-0.4-3.2l0.5-2.6l-0.2-2.1l-2.5-1.1l-4.2-0.9l-3.3-1.2L769.35,248.85z' },
    { id: 'pennsylvania', name: 'Pennsylvania', allegiance: 'union', d: 'M 772.022,272.441 768.722,270.041 767.822,267.541 765.222,267.241 765.022,266.141 764.222,263.541 766.422,262.441 766.622,260.041 765.422,258.741 765.622,257.141 767.522,254.241 767.522,251.341 769.722,248.941 768.422,248.041 765.922,247.841 763.722,245.941 761.422,240.841 758.622,239.941 756.422,237.841 739.022,241.641 698.822,249.941 690.522,251.341 690.022,244.541 684.822,249.941 683.622,250.441 679.722,253.241 682.422,271.541 684.022,281.841 687.322,300.241 691.622,299.541 702.722,298.041 738.122,290.641 751.922,288.041 759.722,286.441 760.922,285.241 762.922,283.641 765.122,284.441 766.222,283.841 768.422,282.541 769.822,279.941 771.322,277.741 774.322,274.841 774.322,274.041 z' },
    { id: 'delaware', name: 'Delaware', allegiance: 'border', d: 'M763.6,287.6l0.8-2l0.2-1.3h-1.9l-2,1.6l-1.4,1.4l1.4,4l2.2,5.4l2,9.3l1.5,6l4.7-0.2l5.8-1.2l-2.2-7.1l-0.9,0.5l-3.3-2.4l-1.7-4.5l-1.9-3.4l-2.2-0.9l-2-3.4L763.6,287.6z' },
    { id: 'maryland', name: 'Maryland', allegiance: 'border', d: 'M775.962,321.925l2-6.7l-1.1-5.1l-5.8,1.3l-4.7,0.2l-1.5-6l-2-9.3l-2.2-5.4l-1.2-4.2l-7.8,1.6l-13.8,2.6l-35,7.3l1.1,4.8l0.9,5.4l0.3-0.3l2-2.4l2.2-2.9l2.3-0.2l1.4-1.4l1.7-2.5l1.2,0.6l2.7-0.3l2.5-2l1.9-1.4l1.8-0.5l1.6,1.1l2.7,1.4l1.9,1.7l1.2,1.5l3.9,1.7v2.7l5.2,1.3l1.9,1.3l0.9-1.9l2.2,1.6l-1.4,3.1l-0.3,2.6l-1.7,2.5v2.1l0.6,1.7l4.7,1.3l4-0.1l2.8,0.9l2,0.3l0.9-2.1l-1.4-2v-1.8l-2.3-2l-2-5.3l1.2-5.1l-0.2-2l-1.2-1.3c0,0,1.4-1.6,1.4-2.2s0.5-2,0.5-2l1.9-1.3l1.9-1.6l0.5,0.9l-1.4,1.6l-1.2,3.5l0.3,1.1l1.7,0.3l0.5,5.3l-2,0.9l0.3,3.4l0.5-0.2l1.1-1.9l1.5,1.7l-1.5,1.3l-0.3,3.2l2.5,3.2l3.6,0.5l1.6-0.8l3,4.9l1.7,0.5v2.875c1.233,0,2.432,0,3.624,0L775.962,321.925z' },
    { id: 'virginia', name: 'Virginia', allegiance: 'confederate', d: 'M767.775,345.625l-3,0.6l-2.5,0.5l-0.3-0.5l2.2-1.4l-0.2-2.2l-1.2-1.6l-1.4-1.1v-1.1l-1.9-1.6v-0.9l3,1.1l0.2-1.7l-1.2-2.1l-0.2-2.2l-0.9-0.9l0.5-4.3l-1.2-1.3l-3-0.6l-2.5-2.2l-4.9-0.3l-1.8-1.5l-4.7-1.3l-0.6-1.7v-2.1l1.7-2.5l0.3-2.6l1.4-3.1l-2.2-1.6l-0.9,1.9l-1.9-1.3l-5.2-1.3v-2.7l-3.592-1.842L731.1,299.5l-1.9-1.7l-2.7-1.4l-1.6-1.1l-1.8,0.5l-1.9,1.4l-2.5,2l-2.7,0.3l-1.2-0.6l-1.7,2.5l-1.4,1.4l-2.3,0.2l-2.2,2.9l-2,2.4l-0.3,0.3l-0.9-5.4l-1.1-4.7l-11.5,1.4l-4.3,0.7l-3.2-18.8l-1.2,1.3l-0.9,1.4l1.1,2.9v4.4l-0.5,4.8l-0.3,5.4l-2.2,3.7l-2.8,3.2l-2.2,1.6l-2-0.5l-1.2,1.4l-2.2,3.2l-0.9,1.3v2.4l1.1,1.7l-0.5,1.6l-1.7,0.9l-0.5-1.7l-1.2-1.1l-1.2,0.6l-0.9,3.7l-0.2,4.8l-1.5,1.4l-0.2,2.6l-1.9,0.8l-2.1,0.1l0.2,5l0.8,1.6l2.5,1.4l0.6,2.2l2.7,3.5l2.5,2.6l2.2,1.441l-1.825,3.484l-3.9,3.4l-4.2,5.1l-1.7,1.7v2l-3.6,2l-5.3,3.2l-2.6,1.3l9.4-0.9l11.2-1.8l7.5-0.2l2.3-1.9h2l4.2,0.6l6.7-1.3l14.7-1.9l16-2.5l19.2-3.6l18-3.6l10.7-2.7l4.6-1.7l-3.8-6.7L767.775,345.625z' },
    { id: 'north-carolina', name: 'North Carolina', allegiance: 'confederate', d: 'M772.5,352.4l1.6,4.5l3.3,6.2l2.3,2.4l0.6,2.2l-2.3,0.2l0.8,0.6l-0.3,4l-2.5,1.3l-0.6,2l-1.2,2.7l-3.5,1.6l-2.3-0.3l-1.4-0.2l-1.6-1.3l0.3,1.3v0.9h1.9l0.8,1.3l-1.9,6h3.9l0.6,1.6l2.2-2.2l1.2-0.5l-1.9,3.4l-2.8,4.6h-1.2l-1.1-0.5l-2.6,0.6l-4.9,2.4l-6.1,5.1l-3.1,4.5l-1.9,6.2l-0.5,2.4l-4.4,0.5l-5.3,1.9l-9.3-7.9l-11.8-7.3l-2.7-0.8l-11.8,1.4l-4.1,0.5l-1.6-3.1l-2.2-1.9l-15.4,0.5l-6.9,0.8l-8.5,4.3l-5.8,2.5l-1.5,0.3l-5.5,1l-6.6,0.8l-6.4,0.5l0.3-4.6l1.7-1.4l2.6-0.6l0.6-3.5l3.9-2.6l3.6-1.4l3.9-3.4l4.1-2l0.6-2.9l3.6-3.7l0.6-0.2c0,0,0,1.1,0.8,1.1s2.6,0,2.6,0l1.5-3.1l2-0.6h2.9l1.37-3.138L678,374.6l0.457-1.674l0.243-4.026l3.3,0.9l6.7-1.3l14.7-1.9l16-2.5l19.2-3.6l18-3.6l10.7-2.7L772.5,352.4z M776.1,383.8l2.5-2.4l2.9-2.5l1.5-0.6l0.2-2l-0.6-5.9l-1.4-2.3l-0.6-1.8l0.7-0.2l2.6,5.3l0.4,4.2l-0.2,3.2l-3.1,1.5l-2.7,2.4l-1.2,1.1L776.1,383.8z' },
    { id: 'south-carolina', name: 'South Carolina', allegiance: 'confederate', d: 'M706.2,461.3l-1.7,0.9l-2.5-1.3l-0.6-2l-1.2-3.4l-2.2-2l-2.5-0.6l-1.6-4.6l-2.6-5.7l-3.9-1.9l-2-1.9l-1.2-2.5l-2-1.9l-2.2-1.3l-2.2-2.7l-2.8-2.2l-4.2-1.7l-0.5-1.4l-2.3-2.7l-0.4-1.2l-3.1-4.9l-3.2,0.2l-3.8-2.6l-1.2-1.3l-0.3-1.7l0.8-1.9l2.2-0.9l-0.3-2l5.8-2.5l8.5-4.3l6.9-0.8l15.4-0.5l2.2,1.9l1.6,3.1l4.1-0.5l11.8-1.4l2.7,0.8l11.8,7.3l9.5,7.8l-5.1,5.2l-2.5,5.9l-0.5,6l-1.5,0.8l-1.1,2.6l-2.3,0.6l-2,3.4l-2.6,2.6l-2.2,3.2l-1.6,0.8l-3.3,3.2l-2.7,0.2l0.9,3.1l-4.7,5.3L706.2,461.3z' },
    { id: 'georgia', name: 'Georgia', allegiance: 'confederate', d: 'M639.1,409.1l-4.5,0.8l-7.9,1.1l-8,0.9v2.1l0.2,2l0.6,3.2l3.1,7.6l2.3,9.4l1.4,5.9l1.6,4.6l1.4,6.7l2,6l2.5,3.2l0.5,3.2l1.9,0.8l0.2,2l-1.7,4.6l-0.5,3.1l-0.2,1.9l1.5,4.2l0.3,5.1l-0.8,2.4l0.6,0.8l1.4,0.8l0.6,3.2l2.5,3.7l1.4,1.4l7.5,0.2l10.2-0.6l20.1-1.3l5.1-0.7h4.3l0.2,2.7l2.5,0.8l0.3-4.2l-1.5-4.3l1.1-1.6l5.5,0.8l4.7,0.3l-1.1-5.9l2.2-9.6l1.4-4l-0.5-2.5l3.8-6.7l-0.6-1.6l-1.7,0.9l-2.5-1.3l-0.6-2l-1.2-3.4l-2.2-2l-2.5-0.6l-1.6-4.6l-2.6-5.7l-3.9-1.9l-2-1.9l-1.2-2.5l-2-1.9l-2.2-1.3l-2.2-2.7l-2.8-2.2l-4.2-1.7l-0.5-1.4l-2.3-2.7l-0.6-1.5l-3.1-4.9l-3.2,0.2l-3.8-2.6l-1.2-1.3l-0.3-1.7l0.8-1.9l2.2-0.9l-0.2-2.2l-1.7,0.5l-5.5,1l-6.5,0.9L639.1,409.1z' },
    { id: 'florida', name: 'Florida', allegiance: 'confederate', d: 'M700.9,491.1l2,7.9l3.5,9.3l5,8.9l3.5,6l4.5,5.3l3.8,3.5l1.5,2.7l-1.1,1.3l-0.8,1.3l2.7,7.1l2.7,2.7l2.5,5.1l3.3,5.6l4.2,7.9l1.2,7.3l0.5,11.4l0.6,1.7l-0.3,3.2l-2.3,1.3l0.3,1.9l-0.6,1.9l0.3,2.4l0.5,1.9l-2.6,3.1l-2.8,1.4l-3.6,0.2L728,605l-2.3,0.9l-1.2-0.5l-1.1-0.9l-0.3-2.7l-0.8-3.2l-3.2-4.9l-3.3-2.2l-3.6-0.3l-0.8,1.3l-2.8-4.2l-0.6-3.4l-2.5-3.8l-1.7-1.1l-1.5,2.1l-1.7-0.3l-2-4.8l-2.7-3.7l-2.7-5.1l-2.5-2.9l-3.3-3.5l2-2.4l3-5.3l-0.2-1.6l-4.2-0.9l-1.5,0.6l0.3,0.6l2.5,0.9l-1.4,4.3l-0.8,0.5l-1.7-3.8l-1.2-4.6l-0.3-2.7l1.4-4.5v-9.1l-2.8-3.5l-1.2-2.9l-4.9-1.3l-1.9-0.6L673,523l-3.2-1.6l-1.1-3.2l-2.6-0.9l-2.3-3.5l-3.9-1.4l-2.7-1.4h-2.3l-3.8,0.8l-0.2,1.9l0.8,1l-0.5,1.1l-2.8-0.2l-3.5,3.4l-3.3,1.9H638l-3,1.3l-0.3-2.7l-1.5-1.9l-2.7-1.1l-1.5-1.4l-7.6-3.7l-7.2-1.7l-4.1,0.6l-5.6,0.5l-5.6,2l-3.2,0.6l-0.2-7.7l-2.5-1.9l-1.7-1.7l0.3-2.9l9.6-1.3l24-2.7l6.4-0.6l5.8-0.2l2.5,3.7l1.4,1.4l7.5,0.2l10.2-0.6l20.1-1.3l5.1-0.7h4.3l0.2,2.7l2.5,0.8l0.3-4.2l-1.5-4.3l1.1-1.6l5.5,0.8L700.9,491.1z M712.4,618.1l2.3-0.6l1.2-0.2l1.4-2.3l2.2-1.6l1.2,0.5l1.6,0.3l0.4,1l-3.2,1.2l-3.9,1.4l-2.2,1.2L712.4,618.1z M725,613.3l1.2,1l2.6-2.1l5-4l3.5-3.7l2.4-6.4l0.9-1.7l0.2-3.2l-0.7,0.5l-0.9,2.7l-1.4,4.4l-3,5l-4.1,4l-3.1,1.9L725,613.3z' },
    { id: 'alabama', name: 'Alabama', allegiance: 'confederate', d: 'M578.633,512.533l-1.5-14.4l-2.6-17.9l0.2-13.4l0.8-29.6l-0.2-15.8l0.2-6.1l7.3-0.4l26-2.5l9.5-0.9l-0.1,2.1l0.2,2l0.6,3.2l3.1,7.6l2.3,9.4l1.4,5.9l1.6,4.6l1.4,6.7l2,6l2.5,3.2l0.5,3.2l1.9,0.8l0.2,2l-1.7,4.6l-0.5,3.1l-0.2,1.9l1.5,4.2l0.3,5.1l-0.8,2.4l0.6,0.8l1.4,0.8l0.8,3.4h-5.9l-6.4,0.6l-24,2.7l-9.6,1.3l-0.3,2.9l1.7,1.7l2.5,1.9l0.6,7.6l-6.2,2.5l-2.6-0.3l2.6-1.9v-0.9l-2.8-5.7l-2.2-0.6l-1.4,4.2l-1.2,2.6l-0.6-0.2L578.633,512.533z' },
    { id: 'mississippi', name: 'Mississippi', allegiance: 'confederate', d: 'M579.2,512.9l-1.1,1.2h-4.9l-1.4-0.8l-2-0.3l-6.4,1.9l-1.7-0.8l-2.5,4l-1.1,0.8l-1.1-2.4l-1.1-3.7l-3.2-3l1.1-7.3l-0.7-0.9l-1.8,0.2l-7.8,0.7l-22.7,0.7l-0.4-1.6l0.7-7.7l3.2-5.9l4.9-8.7l-0.9-2h1.1l0.7-3l-2.2-1.8l0.2-1.8l-2-4.4l-0.3-5.1l1.3-2.6l-0.4-4.1l-1.3-2.8l1.3-1.3l-1.3-2l0.4-1.8l0.9-5.9l2.7-2.6l-0.7-2l3.4-5l2.6-0.9v-2l-0.7-1.3l2.6-5l2.6-1.1l0.1-3.2l8.1-0.1l22.6-1.9l5.2-0.2v6.1l0.2,15.8l-0.8,29.6l-0.2,13.4l2.6,17.9L579.2,512.9z' },
    { id: 'louisiana', name: 'Louisiana', allegiance: 'confederate', d: 'M568.6,536.995l-3.2-2.7l-5.5-0.8l-3-2.2l1.1-2.7l2.2,0.3l0.2-0.6l-1.7-0.9v-0.5h3l1.7-2.9l-1.2-1.9l-0.3-2.6l-1.4,0.2l-1.9,2.1l-0.6,2.5l-2.8-0.6l-0.9-1.7l1.7-1.9l1.9-1.7l0.7,0.2l-1.2-2.2l-1.1-3.7l-3.2-3l1.1-7.3l-0.7-0.9l-1.8,0.2l-7.8,0.7l-22.7,0.7l-0.4-1.6l0.7-7.7l3.2-5.9l4.9-8.7l-0.9-2h1.1l0.7-3l-2.2-1.8l0.2-1.8l-2-4.4l-0.3-5.3H516l-18,0.9h-20.8v9.1l0.7,8.9l0.7,3.7l2.4,3.9l0.9,4.8l4.1,5.3l0.2,3l0.7,0.7l-0.7,8l-2.7,4.8l1.5,2l-0.7,2.4l-0.7,7l-1.3,3l0.1,3.4l4.4-1.5l7.6-0.3l9.7,3.4l6.1,1.1l3.5-1.4l3,1.1l3,0.9l0.8-2l-3-1.1l-2.5,0.5l-2.6-1.6c0,0,0.2-1.3,0.8-1.4c0.6-0.2,2.8-1,2.8-1l1.7,1.4l1.7-0.9l3,0.6l1.4,2.4l0.3,2.2l4.2,0.3l1.7,1.7l-0.8,1.6l-1.2,0.8l1.5,1.6l7.9,3.4l3.3-1.3l0.9-2.4l2.5-0.6l1.7-1.4l1.2,0.9l0.8,2.7l-2.2,0.8l0.6,0.6l3.1-1.3l2.2-3.2l0.8-0.5l-2-0.3l0.8-1.6l-0.2-1.4l2-0.5l1.1-1.3l0.6,0.8c0,0-0.2,2.9,0.6,2.9s3.9,0.6,3.9,0.6l3.8,1.9l0.9,1.4h2.7l1.1,0.9l2.2-2.9v-1.4H568.6z' },
    { id: 'tennessee', name: 'Tennessee', allegiance: 'confederate', d: 'M646,373.5l-48.6,4.8l-14.7,1.7l-4.3,0.5h-3.6v3.7l-7.9,0.5l-6.6,0.6l-10.3,0.1l-0.2,5.6l-2.1,6l-1,2.8l-1.3,4.2l-0.3,2.5l-3.7,2.1l1.4,3.4l-0.9,4.2l-1.5,1.7l7.7-0.1l22.6-1.9l5-0.2l7.6-0.5l26-2.5l9.5-0.8l8-0.9l7.9-1.1l4.5-0.8l0.3-4.6l1.7-1.4l2.6-0.6l0.6-3.5l3.9-2.6l3.6-1.4l3.9-3.4l4.1-2l0.6-2.9l3.021-3.115l1.117,0.383c0,0,0.062-0.068,0.862-0.068s1.9,0.3,1.9,0.3l2.2-3.4l2-0.6l2.2,0.3l1.5-3.4l2.7-2.5l0.5-2l0.2-3.7l-2.2,0.1l-2.3,1.9l-7.5,0.2l-11.2,1.8L646,373.5z' },
    { id: 'kentucky', name: 'Kentucky', allegiance: 'border', d: 'M670.2,351.9l-2.9,3l-3.9,3.4l-4.2,5.1l-1.7,1.7v2l-3.6,2l-5.3,3.2l-2.5,1.4l-48.6,4.7l-14.7,1.7l-4.3,0.5h-3.6v3.7l-7.9,0.5l-6.6,0.6l-9.8,0.2l1-1.2l2.1-1.7l2-1.1l0.2-3l0.9-1.8l-1.5-2.5l0.8-1.9l2.2-1.7l2-0.6l2.6,1.3l3.3,1.3l1.1-0.3l0.2-2.2l-1.2-2.4l0.3-2.2l1.9-1.4l2.5-0.6l1.5-0.6l-0.8-1.7l-0.6-1.9l1.1-0.8l1-3.1l2.8-1.7l5.5-0.9l3.3-0.5l1.4,1.9l1.7,0.8l1.7-3.1l2.7-1.4l1.9,1.6l0.8,1.1l2-0.5l-0.2-3.2l2.7-1.6l1.1-0.8l1.1,1.6h4.4l0.8-2l-0.3-2.2l2.7-3.4l4.4-3.7l0.5-4.3l2.6-0.3l3.6-1.7l2.6-1.9l-0.3-1.9l-1.4-1.4l0.5-2.1l3.8-0.2l2.3-0.8l2.7,1.6l1.6,4.2l5.5,0.3l1.7,1.7l2,0.2l2.3-1.4l2.8,0.5l1.16,0.968l2.64-2.068l1.7-1.3h1.6l0.6,2.6l1.7,0.9l3.3,2.1l0.2,5.3l0.8,1.6l2.5,1.4l0.6,2.2l2.7,3.5l2.5,2.6L670.2,351.9z' },
    { id: 'ohio', name: 'Ohio', allegiance: 'union', d: 'M679.2,253.8l-6.7,4l-3.6,2.2l-3.1,3.5l-3.8,3.7l-3,0.8l-2.7,0.5l-5.2,2.5l-2,0.2l-3.2-2.9l-4.9,0.6l-2.3-1.4l-2.3-1.3l-4.6,0.7l-9.6,1.6l-7.3,1.2l1.1,13.8l1.7,13.1l2.5,22.4l0.5,5.5l3.8-0.2l2.3-0.8l2.7,1.6l1.6,4.2l5.5,0.3l1.7,1.7l2,0.2l2.3-1.4l2.8,0.5l1.2,1.4l2.6-2.5l1.7-1.3h1.6l0.6,2.6l1.7,0.9l3.2,2.3l2.1-0.1l1.9-0.8l0.2-2.6l1.6-1.4l0.2-4.8l0.9-3.7l1.2-0.6l1.2,1.1l0.5,1.7l1.7-0.9l0.5-1.6l-1.1-1.7v-2.4l0.9-1.3l2.2-3.2l1.2-1.4l2,0.5l2.2-1.6l2.8-3.2l2.2-3.7l0.3-5.4l0.5-4.8v-4.6l-1.1-2.9l0.9-1.4l1.3-0.7l-1.8-10.3L679.2,253.8z' },
    { id: 'indiana', name: 'Indiana', allegiance: 'union', d: 'M572.8,355.6l-0.2-3.7l0.5-4.3l2.2-2.7l1.7-3.7l2.5-4l-0.5-5.6l-1.7-2.6l-0.3-3.1l0.8-5.3l-0.5-6.7l-1.2-15.2l-1.2-14.6L574,273l2.8,0.9l1.4,0.9l1.1-0.3l2-1.9l2.7-1.6l4.8-0.2l20.6-2.2l5.26-0.419l0.128,1.021L616.8,283l1.7,13.1l2.5,22.4l0.5,5.4l-0.5,2.2l1.4,1.4l0.3,1.9l-2.6,1.9l-3.6,1.7l-2.6,0.3l-0.5,4.3l-4.4,3.7l-2.7,3.4l0.3,2.2l-0.8,2h-4.4l-1.1-1.6l-1.1,0.8l-2.7,1.6l0.2,3.2l-2,0.5l-0.8-1.1l-1.9-1.6l-2.7,1.4l-1.7,3.1l-1.7-0.8l-1.4-1.9l-3.3,0.5l-5.5,0.9L572.8,355.6z' },
    { id: 'illinois', name: 'Illinois', allegiance: 'union', d: 'M572.6,355.5V352l0.5-4.3l2.2-2.7l1.7-3.7l2.5-4l-0.5-5.6l-1.7-2.6L577,326l0.8-5.3l-0.5-6.7l-1.3-15.5l-1.2-14.6l-0.8-11l-1.2-0.8l-0.8-2.5l-1.2-3.5l-1.5-1.7l-1.4-2.5l-0.2-5.2l-9.3,1.3l-25.5,1.7l-8.1-0.4l0.2,2.3l2.2,0.7l0.9,1.1l0.4,1.8l3.6,3.2l0.7,2.2l-0.7,3.2l-1.7,3.5l-0.7,2.5l-2.2,1.7l-1.8,0.7l-4.9,1.3l-0.7,1.8l-0.7,2l0.7,1.3l1.7,1.6l-0.2,3.9l-1.6,1.4l-0.7,1.6v2.6l-1.8,0.4l-1.5,1.1l-0.2,1.3l0.2,2l-1.7,1.3l-1,2.6l0.4,3.5l2.2,7l6.9,7.3l5.2,3.5l-0.2,4.1l0.9,1.3l6,0.4l2.6,1.3l-0.7,3.5l-2.2,5.7l-0.7,3l2.2,3.7l6,5l4.3,0.7l2,4.8l2,3l-0.9,2.8l1.5,3.9l1.8,2l2.7-0.3l0.6-2l2.2-1.7l2-0.6l2.6,1.3l3.3,1.3l1.1-0.3l0.2-2.2l-1.2-2.4l0.3-2.2l1.9-1.4l2.5-0.6l1.5-0.6l-0.8-1.7l-0.6-1.9l1.1-0.8L572.6,355.5z' },
    { id: 'michigan', name: 'Michigan', allegiance: 'union', d: 'M538.241,147.244l1.8-2l2.1-0.8l5.1-3.7l2.2-0.6l0.4,0.4l-4.8,4.9l-3.1,1.9l-2,0.9L538.241,147.244z' },
    { id: 'wisconsin', name: 'Wisconsin', allegiance: 'union', d: 'M567.6,258l0.1-4l-1.5-4.3l-0.6-5.9l-1.1-2.4l0.9-2.9l0.8-2.7l1.4-2.5l-0.6-3.2l-0.6-3.4l0.5-1.7l1.9-2.4l0.2-2.6l-0.8-1.3l0.6-2.5l0.5-3.1l2.6-5.4l2.7-6.5l0.2-2.2l-0.3-1l-0.8,0.5l-3.9,6l-2.6,3.8l-1.9,1.7l-0.8,2.2l-1.4,0.8l-1.1,1.9l-1.4-0.3l-0.2-1.7l1.2-2.4l2-4.5l1.7-1.6l1.1-2.2l-1.6-0.9l-1.3-1.3l-1.5-9.8l-3.4-1.1l-1.3-2.2l-11.7-2.6l-2.4-1.1l-7.8-2.2l-7.8-1.1l-3.9-5.2l-0.5,1.2l-1.1-0.2l-0.6-1.1l-2.6-0.8l-1.1,0.2l-1.7,0.9l-0.9-0.6l0.6-1.9l1.9-2.9l1.1-1.1l-1.9-1.4l-2,0.8l-2.7,1.9l-7,3l-2.7,0.6l-2.7-0.5l-0.9-0.9l-2,2.7l0.1,2.9v8.1l-1.1,1.6l-4.9,3.7l-2.2,5.7l0.4,0.2l2.4,2l0.7,3l-1.8,3v3.7l0.4,6.4l2.7,2.8h3.2l1.7,3l3.2,0.4l3.6,5.5l6.7,3.9l2,2.6l0.9,7.1l0.7,3.1l2.2,1.6l0.2,1.3l-2,3.2l0.2,3l2.4,3.7l2.4,1.1l2.7,0.4l1.2,2.5h8.6l24.9-1.6L567.6,258z' },
    { id: 'minnesota', name: 'Minnesota', allegiance: 'union', d: 'M 531,143.795 530.3,144.895 529.7,144.895 528,141.995 519.7,142.295 518.8,143.095 517.9,143.095 517.4,141.795 516.6,140.095 514.1,140.595 511.1,143.695 509.5,144.495 506.7,144.495 504.2,143.595 504.2,141.595 503,141.395 502.5,141.895 500,140.595 499.5,137.895 498.1,138.395 497.6,139.295 495.3,138.795 490.3,136.395 486.7,133.895 484,133.895 482.8,132.995 480.6,133.595 479.5,134.695 479.2,135.995 474.6,135.995 474.6,133.995 468.7,133.695 468.4,132.295 463.9,132.295 462.3,130.695 460.9,124.795 460.1,119.495 458.2,118.695 456,118.195 455.4,118.395 455.1,126.295 426.8,126.295 428.5,131.495 427.8,135.195 427.8,144.995 429.3,149.795 431.1,152.995 431.5,162.395 433.3,175.295 435.1,182.295 435.5,190.395 435.8,193.495 434.5,194.795 432.5,196.395 432.5,198.195 433.6,199.995 437.4,203.195 437.8,205.995 438,234.995 437.5,241.595 448.4,241.595 494.8,240.895 511.7,240.195 515.5,240.195 514.6,232.895 512.6,230.295 505.9,226.395 502.3,220.895 499.1,220.495 497.4,217.495 494.2,217.495 491.5,214.695 491.1,208.295 491.1,204.595 492.9,201.595 492.2,198.595 489.8,196.595 489.4,196.395 491.6,190.695 496.5,186.995 497.6,185.395 497.6,177.295 497.8,174.695 500.4,172.095 499.7,171.595 502.8,168.695 504,168.495 508.5,163.895 510.2,163.095 512.4,159.395 514.7,155.995 517.5,153.495 522,151.495 530.6,147.595 534.5,145.595 535.1,143.395 z' },
    { id: 'iowa', name: 'Iowa', allegiance: 'union', d: 'M 532.2,268.395 528.6,265.195 528.2,263.395 527.3,262.295 525.1,261.595 525,259.795 523.1,257.095 520.4,256.695 518,255.595 515.6,251.895 515.4,248.895 517.4,245.695 517.2,244.395 515,242.795 514.3,239.695 510.5,239.795 493.6,240.495 447.2,241.195 436.4,241.195 434.8,241.195 433.9,243.695 434.3,246.295 436.9,248.295 435.6,253.795 435.787,258.117 436.383,260.67 436.6,262.595 437.7,267.695 440.3,274.995 441.2,279.595 443.4,283.095 444.1,288.095 445.6,291.995 445.8,298.395 447.4,303.495 448.4,303.395 457.2,303.195 469.8,302.995 493.6,302.095 502.8,301.695 510.1,300.995 511.2,303.195 514.3,306.395 516,304.695 515.8,302.695 516,301.395 517.5,300.295 519.3,299.895 519.3,297.295 520,295.695 521.8,294.095 522,290.195 520.3,288.595 519.6,287.295 520.3,285.295 521,283.495 525.8,282.295 527.6,281.595 529.8,279.795 530.5,277.295 532.2,273.795 532.9,270.595 z' },
    { id: 'missouri', name: 'Missouri', allegiance: 'border', d: 'M 555.7,374.095 553,374.495 551.2,372.495 549.7,368.595 550.6,365.795 548.6,362.795 546.6,357.995 542.3,357.295 536.3,352.295 534.1,348.595 534.8,345.595 537,339.895 537.7,336.395 535.1,335.095 529.1,334.695 528.2,333.395 528.4,329.295 523.2,325.795 516.3,318.495 514.1,311.495 513.7,307.995 514.6,305.895 511.6,302.895 510.5,300.695 503.2,301.395 494,301.795 470.2,302.695 457.6,302.895 450.2,302.995 448,303.095 449.2,305.495 449,307.695 451.4,311.395 454.3,315.295 457.2,317.895 459.4,318.095 460.7,318.995 460.7,321.795 458.9,323.395 458.5,325.595 460.5,328.795 462.9,331.595 465.3,333.395 466.6,344.495 465.9,378.095 466.1,382.595 466.5,389.195 488.3,388.695 510.1,387.995 529.5,387.095 539.8,386.695 541.6,389.495 541.2,391.695 538.2,394.295 537.5,397.195 543.3,397.595 548,396.895 550,390.795 549.9,385.395 552.6,383.995 553.9,382.395 555.9,381.295 556.1,378.295 557,376.495 z' },
    { id: 'arkansas', name: 'Arkansas', allegiance: 'confederate', d: 'M 543.2,397.72 537.4,397.32 538.1,394.52 541.1,391.92 541.5,389.72 539.7,386.92 529.4,387.32 510,388.22 488.2,388.92 466.4,389.42 467.9,396.02 467.9,403.92 469.2,414.32 469.4,450.32 471.6,452.22 474.3,450.92 476.9,452.02 477.5,462.62 498.3,462.62 516.3,461.72 526.4,461.82 527.8,459.22 527.4,455.12 526.1,452.32 527.4,451.02 526.1,449.02 526.5,447.22 527.4,441.32 530.1,438.72 529.4,436.72 532.8,431.72 535.4,430.82 535.4,428.42 534.7,427.12 537.3,422.12 539.9,421.02 539.6,417.82 542,416.72 542.9,412.22 541.9,408.62 545.7,406.42 546,403.92 547.3,399.72 547.8,396.82 z' },
    { id: 'texas', name: 'Texas', allegiance: 'confederate', d: 'M418.181,585.329l0.07-0.234l1.2-4.3l0.856-3.24l3.944-6.06l3.799-5.613l2.001-0.387l5.5-3.4l1.7-1.4l5.9-3.2l5.3-2.4l5-3.1l2.6-2l5.3-5.1l1.2-0.8l2-1.4l2.5-1.9l0.9-1.9l9.2-4.3l5.25-2.8l0.55-2.3l1.3-3l0.7-7l0.7-2.4l-1.5-2l2.7-4.8l0.7-8l-0.7-0.7l-0.2-3l-4.1-5.3l-0.9-4.8l-2.4-3.9l-0.7-3.7l-0.7-8.9v-9.3l-0.6-10.5l-2.6-1.1l-2.7,1.3l-2.2-1.9l-2.6-1.2l-3-0.9l-3-1.8l-2-2.5l-1.7-0.4l-1.5,2h-3.8l-0.6-1.6h-1.1l-2.6,2l-2-0.9h-4.1l-0.6,2.5l-1.8,0.9l-2.7-0.9l-3.4-1.3l-3.8-0.7l-1.1-2h-1.1l-1.7,3.9l-1.3,0.7l-4.5-1.8l-0.9-2.5h-2.4l-1.7-0.7l-2.2,2.2l-2.2-0.7v-2.2h-0.9l-2.4-3.2l-3.2-0.7l-2.2,2l-2.4-1.8l-3.8-0.7l-2.4-1.1l-3.8-0.2l0.4-3.7l-2.6-1.3v1.3h-2l-1.3-1.8l-0.7,2l-0.7,0.2l-2-1.1l-4.1-3.5l-0.2-1.6l0.4-17l1.3-22.6l-29.2-1.1l-21.2-1.1l-1.2,17.7l-3.6,52.9l-2.2,22.7l-27.2-1.6l-27.2-2.6l-7.6-0.7l0.6,4.5l1.9,0.5l2.5,2.7l1.4,4.2l4.4,2.2l1.1,2.9l6.7,7.6l1.2,1.6l4.7,2l1.1,2.1l1.5,1l0.5,2.6l2.6,6.6v7.8l2.5,5.1l7,7.5l4.9,2l1.7,1.9v0.6l3.6,2.2l1.9,0.6l1.7,1.1l2.5,0.9l2.3-2.4l4.1-5.9l0.9-3.5l2.2-3.1l3.3-1.4l4.2-1.7l2.8,2.2l7,0.6l6.4,1.1l2.5,2v1l2.5,2.9l5.6,5.1l0.2,1.4l1.7,1.9l0.8,4l5,11.7l-0.2,1.9l3.9,2.5l3.3,6.4l3.2,4.1l3,1.3l1.5,2.2l-1.2,4.2l0.6,0.9l1.2,0.6l-0.3,3.2l-0.6,0.6l0.6,2.2l3,1.9l1.2,6.2l2,3.7l7.2,3.2l4.9,1.1l3.9,2.9l3,0.6l1.2-0.5l5.2,1.1l5.3,3.7l2.8-1.9l0.9-1.4l-1.7-2.7l-0.9-5.9l-1.7-6.7l-0.8-2.4l0.8-4.3L418.181,585.329' },
    { id: 'kansas', name: 'Kansas', allegiance: 'union', d: 'M 465.3,333.295 462.9,331.495 460.5,328.695 458.5,325.495 458.9,323.295 460.7,321.695 460.7,318.895 459.4,317.995 457.2,317.795 454.3,315.195 448.6,315.195 407.3,314.795 369.5,313.495 349.1,312.695 345.2,375.395 367.9,376.695 410,378.695 453.4,379.095 465.8,378.395 466.6,344.395 z' }
];

const acts = [
    {
        id: 'war_begins',
        number: 'I',
        name: 'The War Begins',          // matches groupedReflections[0].theme
        years: '1861-1862',
        battleIndices: [0, 1, 2],        // Fort Sumter, Bull Run, Shiloh
        reflectionBattleIndex: 2,
        intro: {
            // Positioning sentence at three reading levels.
            // Source: each level draws on battles[2].historical.biggerPicture (Shiloh's bigger-picture
            // section, which summarizes the escalation arc of the first three battles).
            positioning: {
                beginner: 'The first three battles teach a hard lesson: this war will not be quick, and no one is ready for what it costs.',
                intermediate: "Across the first three battles, the dream of a 90-day war collapses, and the country begins to glimpse the scale of what it has started.",
                advanced: "From Charleston Harbor to Pittsburg Landing, the war's opening year shatters the illusion of a brief, contained conflict and reveals an industrial-scale violence neither side anticipated."
            },
            positioningSource: {
                beginner: 'battles[2].historical.biggerPicture.beginner',
                intermediate: 'battles[2].historical.biggerPicture.intermediate',
                advanced: 'battles[2].historical.biggerPicture.advanced'
            },
            // Map markers in studytools-1861 coordinate system (viewBox 0 0 900 700).
            // Coordinates verified visually in mockup; pin centers labelled below.
            markers: [
                {
                    battleId: 'fort_sumter',
                    label: 'FORT SUMTER \u00B7 APR 1861',
                    coords: { x: 715, y: 442 },     // Charleston Harbor, SC
                    labelBox: { x: 627, y: 461, w: 176, h: 18 },
                    labelText: { x: 715, y: 474 },
                    source: 'battles[0].date'
                },
                {
                    battleId: 'bull_run',
                    label: 'BULL RUN \u00B7 JUL 1861',
                    coords: { x: 725, y: 305 },     // Manassas, VA
                    labelBox: { x: 650, y: 281, w: 150, h: 18 },
                    labelText: { x: 725, y: 294 },
                    source: 'battles[1].date'
                },
                {
                    battleId: 'shiloh',
                    label: 'SHILOH \u00B7 APR 1862',
                    coords: { x: 560, y: 408 },     // Pittsburg Landing, TN
                    labelBox: { x: 478, y: 424, w: 140, h: 18 },
                    labelText: { x: 548, y: 437 },
                    source: 'battles[2].date'
                }
            ]
        },
        recall: {
            beginner: [
                {
                    question: "Who fired first at Fort Sumter?",
                    options: [
                        "The Confederate batteries surrounding the fort",
                        "The Union soldiers inside the fort",
                        "The Union supply ship trying to reach the fort",
                        "A reporter who fired a celebratory shot"
                    ],
                    correctIndex: 0,
                    explanation: " Confederate batteries opened fire on Fort Sumter at 4:30 AM on April 12, 1861. Union forces inside the fort fired back, but the Confederates fired the first shot of the war.",
                    nudge: " Think about which side surrounded the fort, and which side was inside it.",
                    source: 'battles[0].historical.whatHappened.intermediate'
                },
                {
                    question: "How many days did the Battle of Bull Run last?",
                    options: [
                        "One day",
                        "Three days",
                        "A week",
                        "Most of the summer"
                    ],
                    correctIndex: 0,
                    explanation: " Bull Run was fought on July 21, 1861. It started in the morning and was over by evening, ending in a Union rout.",
                    nudge: " Look at the date the battle is associated with. Most early Civil War battles were single days, not extended campaigns.",
                    source: 'battles[1].date'
                },
                {
                    question: "What made Shiloh shocking to Americans?",
                    options: [
                        "It was the first battle of the war",
                        "The huge number of soldiers killed and wounded in just two days",
                        "The Union surrendered",
                        "Confederate spies attacked Lincoln"
                    ],
                    correctIndex: 1,
                    explanation: " Shiloh produced more than 23,000 casualties in two days, more than all previous American wars combined. The nation had not imagined this level of bloodshed possible.",
                    nudge: " Think about what surprised the country. It was not who won or lost, it was a number.",
                    source: 'battles[2].historical.keyFact.intermediate'
                }
            ],
            intermediate: [
                {
                    question: "Why did the South attack Fort Sumter when they did?",
                    options: [
                        "They wanted to prevent a Union supply ship from resupplying the fort",
                        "They needed the fort's cannons for their own army",
                        "A Confederate general lost control of his troops",
                        "Britain promised to recognize the Confederacy if they fired first"
                    ],
                    correctIndex: 0,
                    explanation: " Confederate leaders concluded that letting the Union supply ship reach Fort Sumter would make their new government look powerless. They chose to fire before the resupply arrived, accepting the political cost of starting the war.",
                    nudge: " Think about what was happening on the day they attacked, not the day the war started in their minds.",
                    source: 'battles[0].historical.situation.intermediate'
                },
                {
                    question: "Why did the Confederacy win at Bull Run despite being outnumbered?",
                    options: [
                        "They had better weapons",
                        "Reinforcements arrived by railroad just in time",
                        "A storm flooded the Union camp",
                        "Most Union soldiers refused to fight"
                    ],
                    correctIndex: 1,
                    explanation: " Confederate troops under General Johnston traveled by railroad from the Shenandoah Valley to reinforce Beauregard's line. This was the first decisive use of railroads in combat history, and it turned the battle.",
                    nudge: " Think about the new technology that made it possible to move soldiers quickly. The Union did not have the same option in time.",
                    source: 'battles[1].historical.tech.intermediate'
                },
                {
                    question: "After Shiloh, why did Grant believe the war would have to be 'complete conquest'?",
                    options: [
                        "He was angry about being criticized",
                        "The scale of the killing convinced him a peace deal was impossible",
                        "He had received new orders from Lincoln",
                        "He needed an excuse for being surprised at the start"
                    ],
                    correctIndex: 1,
                    explanation: " Shiloh's casualties showed Grant that the war had become something much larger than either side imagined. He concluded that only the complete defeat of the Confederate armies could end it.",
                    nudge: " Think about how the bloodshed at Shiloh shaped what was thinkable about the war's outcome.",
                    source: 'battles[2].historical.biggerPicture.intermediate'
                }
            ],
            advanced: [
                {
                    question: "What does it reveal about both sides that civilians brought picnic baskets to watch Bull Run?",
                    options: [
                        "Most people thought the war would be quick and not very costly",
                        "Both armies welcomed civilian observers as honored guests",
                        "It was a tradition borrowed from European armies",
                        "The civilians were political officials with official roles"
                    ],
                    correctIndex: 0,
                    explanation: " The picnic baskets reveal how thoroughly Americans on both sides had failed to imagine industrial-scale war. Spectators expected a single decisive battle that would settle the conflict, like an Independence Day parade with cannons.",
                    nudge: " What does the act of bringing food to watch a battle suggest about the watchers' assumptions?",
                    source: 'battles[1].historical.keyFact.intermediate'
                },
                {
                    question: "Why did Fort Sumter unify the North even though Anderson's garrison surrendered?",
                    options: [
                        "Lincoln's call for volunteers turned a defeat into a national cause",
                        "The South immediately offered peace terms",
                        "Confederate sympathizers in the North quickly converted to the Union cause",
                        "All of the above"
                    ],
                    correctIndex: 0,
                    explanation: " Fort Sumter ended in Confederate victory militarily, but Lincoln used the attack to call for 75,000 volunteers. Northern enlistment became a moral response to the firing on the flag, not just a political response to secession.",
                    nudge: " Think about how Lincoln responded politically, and how that response changed what Fort Sumter meant in Northern eyes.",
                    source: 'battles[0].historical.biggerPicture.intermediate'
                },
                {
                    question: "What pattern emerges across Fort Sumter, Bull Run, and Shiloh that would define the rest of the war?",
                    options: [
                        "Each battle revealed that this war would be far longer and bloodier than either side had imagined",
                        "The North consistently won battles even when outnumbered",
                        "The South's reliance on cavalry would prove decisive",
                        "Foreign powers would intervene to end the war within months"
                    ],
                    correctIndex: 0,
                    explanation: " Fort Sumter started the war that 'no one wanted.' Bull Run shattered the fantasy of a 90-day conflict. Shiloh showed bloodshed at a scale Americans had never imagined possible. The opening year established that this war would be unprecedented in length and cost.",
                    nudge: " Read the three battles together as one arc, not three separate events. What did each one teach Americans they had not known before it?",
                    source: 'battles[2].historical.biggerPicture.advanced'
                }
            ]
        },
        review: {
            beginner: "### How the war got worse, fast\n\n- Fort Sumter: Almost no one died. Both sides treated war like a show.\n- Bull Run: People brought picnic baskets to watch. The Union army ran for its life.\n- Shiloh: 23,000 killed or wounded in two days. More than all previous American wars combined.\n\n### What people expected vs. what they got\n\n- Before Sumter, most thought secession could be settled without much bloodshed.\n- After Bull Run, Lincoln signed up 500,000 soldiers for three years. The dream of a 90-day war was over.\n- After Shiloh, Grant decided the only way to win was to keep fighting until the South gave up completely.\n\n### What changed in how the war was fought\n\n- Trains carried soldiers faster than they could march (Bull Run).\n- Industrial-scale battle was real. Shiloh proved it.\n- Civilians stopped being spectators and started being witnesses.",
            intermediate: "### The escalation\n\n- Fort Sumter: A symbolic standoff with almost no combat deaths. Both sides still believed war was theater.\n- Bull Run: Civilians brought picnic baskets to watch a single decisive battle. The Union army's panicked retreat shattered that fantasy.\n- Shiloh: 23,000 casualties in two days. The nation's first encounter with industrial-scale slaughter.\n\n### What changed in expectations\n\n- Before Sumter, both North and South believed the conflict could be brief and contained.\n- After Bull Run, Lincoln signed bills enlisting 500,000 soldiers for three years and replaced McDowell with McClellan.\n- After Shiloh, Grant concluded that only 'complete conquest' could end the war. Lincoln defended him: 'I can't spare this man. He fights.'\n\n### What changed in how the war was fought\n\n- Railroads moved Confederate reinforcements in time to win Bull Run, the first decisive use of rail in combat history.\n- Rifled artillery at Fort Sumter showed brick-and-stone coastal forts were obsolete.\n- Civilians transitioned from spectators to witnesses. The picnic baskets at Bull Run were the last gasp of the old way of thinking about war.",
            advanced: "### The escalation\n\n- Fort Sumter (April 1861): A 34-hour bombardment producing zero combat fatalities, yet politically transformative. Lincoln converted a Confederate military victory into a Northern moral cause.\n- Bull Run (July 1861): A flanking maneuver tactically sound but undone by Confederate rail-borne reinforcements; the Union rout shattered the 90-day-war fantasy.\n- Shiloh (April 1862): 23,000 casualties in 48 hours, more than the cumulative toll of every previous American war combined. Industrial warfare became impossible to deny.\n\n### Expectations and political reality\n\n- Pre-Sumter, both Lincoln and Davis assumed the conflict could be brief and limited; Sumter's bloodless beginning seemed to confirm this.\n- Bull Run forced Lincoln to authorize 500,000 three-year enlistments and to replace McDowell with the methodical McClellan, signaling that the Union now planned for a multi-year war.\n- Shiloh shifted Grant's strategic philosophy decisively: only 'complete conquest' could resolve the war. Lincoln's public defense, 'I can't spare this man. He fights,' established the partnership that would direct Union grand strategy through 1865.\n\n### Transformations in the conduct of war\n\n- Railroads emerged at Bull Run as a decisive operational tool, allowing Johnston's Shenandoah forces to concentrate with Beauregard in time to turn the battle.\n- Rifled artillery at Fort Sumter rendered Third System masonry fortifications strategically obsolete.\n- The civilian-spectator phenomenon at Bull Run, with its picnic baskets and opera glasses, marked the last performance of the war-as-theater conception. After 1862, war became something witnessed, suffered, and survived, not consumed."
        }
    },
    {
        id: 'human_cost',
        number: 'II',
        name: 'The Human Cost',
        years: '1862-1863',
        battleIndices: [3, 4, 5],        // Antietam, Fredericksburg, Chancellorsville
        reflectionBattleIndex: 5,
        intro: {
            positioning: {
                beginner: "The next three battles show the war's real price: tens of thousands of casualties, broken families, and a turning point in what the war was even about.",
                intermediate: "In these three battles the war's human cost becomes impossible to ignore, and Lincoln answers it by changing what the war is for: not just saving the Union, but ending slavery in the rebel states.",
                advanced: "Across Antietam, Fredericksburg, and Chancellorsville the war's true cost emerges, both in the casualty lists and in the political reckoning that followed: Lincoln responds to Antietam's bloodletting by issuing the Emancipation Proclamation, redefining the conflict's purpose even as the killing continues."
            },
            positioningSource: {
                beginner: 'battles[3].historical.biggerPicture.beginner',
                intermediate: 'battles[3].historical.biggerPicture.intermediate',
                advanced: 'battles[3].historical.biggerPicture.advanced'
            },
            // All three battles in MD/VA cluster; labels offset to avoid overlap.
            // Antietam: label above pin. Fredericksburg + Chancellorsville: side-by-side stack below.
            markers: [
                {
                    battleId: 'antietam',
                    label: 'ANTIETAM · SEP 1862',
                    coords: { x: 713, y: 295 },
                    labelBox: { x: 638, y: 273, w: 150, h: 18 },
                    labelText: { x: 713, y: 286 },
                    source: 'battles[3].date'
                },
                {
                    battleId: 'fredericksburg',
                    label: 'FREDERICKSBURG · DEC 1862',
                    coords: { x: 728, y: 320 },
                    labelBox: { x: 619, y: 332, w: 218, h: 18 },
                    labelText: { x: 728, y: 345 },
                    source: 'battles[4].date'
                },
                {
                    battleId: 'chancellorsville',
                    label: 'CHANCELLORSVILLE · MAY 1863',
                    coords: { x: 705, y: 335 },
                    labelBox: { x: 583, y: 357, w: 244, h: 18 },
                    labelText: { x: 705, y: 370 },
                    source: 'battles[5].date'
                }
            ]
        },
                recall: {
            beginner: [
                {
                    question: "What is Antietam known as?",
                    options: [
                        "The first battle of the Civil War",
                        "The bloodiest single day in American history",
                        "The Confederacy's biggest victory",
                        "The battle where Lincoln was wounded"
                    ],
                    correctIndex: 1,
                    explanation: " September 17, 1862 remains the bloodiest single day in American military history. Over 22,000 soldiers were killed or wounded in just 12 hours of fighting at Antietam.",
                    nudge: " Think about what makes Antietam memorable. It is not who won. It is a number.",
                    source: 'battles[3].historical.keyFact.intermediate'
                },
                {
                    question: "What did Lincoln issue after Antietam?",
                    options: [
                        "A surrender offer to the Confederacy",
                        "The Emancipation Proclamation",
                        "A declaration of war on Britain",
                        "An order to retreat from the South"
                    ],
                    correctIndex: 1,
                    explanation: " Lincoln used the strategic outcome of Antietam to issue the Emancipation Proclamation, declaring enslaved people in Confederate-held territory to be free.",
                    nudge: " Lincoln had been waiting for a Union battlefield outcome before announcing this. It changed what the war was about.",
                    source: 'battles[3].historical.biggerPicture.intermediate'
                },
                {
                    question: "Who died at Chancellorsville from being shot by his own men?",
                    options: [
                        "Robert E. Lee",
                        "Ulysses S. Grant",
                        "Stonewall Jackson",
                        "Abraham Lincoln"
                    ],
                    correctIndex: 2,
                    explanation: " Stonewall Jackson was accidentally shot by his own men in the darkness after his successful flanking attack at Chancellorsville. He died eight days later.",
                    nudge: " He was the Confederacy's most famous general after Lee, and the Confederacy never found a replacement who could match his speed.",
                    source: 'battles[5].historical.keyFact.intermediate'
                }
            ],
            intermediate: [
                {
                    question: "Why was the Emancipation Proclamation important even though it did not free all enslaved people immediately?",
                    options: [
                        "It changed what the war was for, and it kept Britain and France from supporting the Confederacy",
                        "It immediately freed every enslaved person in the country",
                        "It convinced the Confederacy to surrender within months",
                        "It gave the right to vote to formerly enslaved men"
                    ],
                    correctIndex: 0,
                    explanation: " The Proclamation only applied to Confederate-held territory, so it freed no one immediately in places the Union did not yet control. But it transformed the war from a fight to save the Union into a war to end slavery, and it kept European powers from siding with the Confederacy.",
                    nudge: " Think about what changed politically and diplomatically, not what changed for individuals on the day it was signed.",
                    source: 'battles[3].historical.biggerPicture.intermediate'
                },
                {
                    question: "Why was Fredericksburg called a disaster for the Union?",
                    options: [
                        "Burnside ordered 14 separate attacks against an impossible position, and over 12,000 Union soldiers fell",
                        "A Confederate spy stole the Union battle plans",
                        "A storm destroyed the Union army's gunpowder supply",
                        "Lee captured the entire Union army"
                    ],
                    correctIndex: 0,
                    explanation: " Burnside ordered 14 separate assaults against the stone wall on Marye's Heights. Not a single one reached it. Over 12,000 Union soldiers were killed or wounded compared to about 5,000 Confederates.",
                    nudge: " Look at the casualty difference between sides. What does that tell you about how the battle was fought?",
                    source: 'battles[4].historical.whatHappened.intermediate'
                },
                {
                    question: "Why did losing Stonewall Jackson hurt the Confederacy so much, even though they won Chancellorsville?",
                    options: [
                        "Lee never found another general who could move as fast or take as many risks",
                        "Jackson was the only Confederate general the soldiers respected",
                        "Jackson was the only one who knew Lee's secret battle plans",
                        "Jackson controlled all the Confederate money"
                    ],
                    correctIndex: 0,
                    explanation: " Jackson's speed and willingness to gamble made Lee's most aggressive battle plans possible. Lee never found a replacement who could execute risky flanking maneuvers the way Jackson did, and the Confederacy felt the loss for the rest of the war.",
                    nudge: " Think about what Jackson contributed that no one else could. It was a way of fighting, not a position or possession.",
                    source: 'battles[5].historical.biggerPicture.intermediate'
                }
            ],
            advanced: [
                {
                    question: "How did Antietam's strategic outcome differ from its battlefield outcome?",
                    options: [
                        "The battle itself was tactically inconclusive, but Lee's retreat let Lincoln claim enough of a victory to issue the Emancipation Proclamation",
                        "The Union won decisively in the field, but Lincoln treated it as a defeat for political reasons",
                        "The Confederacy won the battle but lost the war",
                        "Neither side considered the day militarily significant at the time"
                    ],
                    correctIndex: 0,
                    explanation: " Antietam was tactically a draw. Both armies stood bloodied at sundown. But because Lee retreated back to Virginia, Lincoln could plausibly call it a Union victory, and that was the political moment he had been waiting for to issue the Proclamation.",
                    nudge: " What matters here is the gap between what happened on the field and what Lincoln could claim happened. The Proclamation needed political cover.",
                    source: 'battles[3].historical.biggerPicture.advanced'
                },
                {
                    question: "What does the rise of the Copperhead movement after Fredericksburg reveal about the war's political fragility?",
                    options: [
                        "A significant minority in the North wanted to negotiate peace and let the Confederacy survive rather than continue the war",
                        "Northern Democrats had secretly funded the Confederacy from the start",
                        "The Republican Party was about to dissolve",
                        "Lincoln had lost the support of his own cabinet"
                    ],
                    correctIndex: 0,
                    explanation: " After Fredericksburg's catastrophic losses, 'Copperhead' Democrats openly demanded an end to the war. Their movement showed that the Union's political will to keep fighting was not guaranteed, and a string of Union defeats might have given them enough power to force a negotiated end.",
                    nudge: " Think about what would have had to be true for a peace party to gain support after 12,000 Union casualties in one day.",
                    source: 'battles[4].historical.biggerPicture.intermediate'
                },
                {
                    question: "Why does Chancellorsville complicate the simple story that the Confederacy was 'doomed' by 1863?",
                    options: [
                        "It was Lee's most brilliant tactical victory, and it convinced him he could invade the North again, leading directly to Gettysburg",
                        "It proved the Union army was not yet capable of winning under any circumstances",
                        "Britain was about to recognize the Confederacy after the battle",
                        "The Confederate army was far larger than the Union army at this point"
                    ],
                    correctIndex: 0,
                    explanation: " Chancellorsville was a brilliant Confederate victory against a Union force nearly twice its size. It gave Lee the confidence to invade Pennsylvania, which led directly to Gettysburg. The arc of the war was not a steady Union climb. Confederate momentum was real, until it wasn't.",
                    nudge: " Think about what Lee's response to winning at Chancellorsville was, and what that response led to next.",
                    source: 'battles[5].historical.biggerPicture.intermediate'
                }
            ]
        },
        review: {
            beginner: '',
            intermediate: '',
            advanced: ''
        }
    },
    {
        id: 'turning_points',
        number: 'III',
        name: 'Turning Points',
        years: '1863',
        battleIndices: [6, 7, 8],        // Vicksburg, Gettysburg, Chickamauga
        reflectionBattleIndex: 8,
        intro: {
            positioning: {
                beginner: "In one summer week the war turns. Vicksburg falls, Lee is beaten at Gettysburg, and the South's chance to win starts running out. But Chickamauga proves the war is far from over.",
                intermediate: "The summer of 1863 breaks the Confederacy's momentum: Vicksburg falls on July 4, Lee retreats from Gettysburg the next day, and the war's strategic balance shifts north. Chickamauga that fall reminds everyone the South can still win battles.",
                advanced: "July 1863 marks the war's strategic inflection point: Vicksburg's surrender splits the Confederacy along the Mississippi, Gettysburg ends Lee's offensive capacity in the East, and the political weight of the war begins to settle. Yet Chickamauga in September demonstrates that the Confederacy's defeat, however inevitable in retrospect, is anything but immediate."
            },
            positioningSource: {
                beginner: 'battles[7].historical.biggerPicture.beginner',
                intermediate: 'battles[7].historical.biggerPicture.intermediate',
                advanced: 'battles[7].historical.biggerPicture.advanced'
            },
            // Three battles geographically spread (MS, PA, GA) so labels don't collide.
            markers: [
                {
                    battleId: 'vicksburg',
                    label: 'VICKSBURG · JUL 1863',
                    coords: { x: 525, y: 460 },
                    labelBox: { x: 446, y: 476, w: 158, h: 18 },
                    labelText: { x: 525, y: 489 },
                    source: 'battles[6].date'
                },
                {
                    battleId: 'gettysburg',
                    label: 'GETTYSBURG · JUL 1863',
                    coords: { x: 722, y: 270 },
                    labelBox: { x: 638, y: 248, w: 168, h: 18 },
                    labelText: { x: 722, y: 261 },
                    source: 'battles[7].date'
                },
                {
                    battleId: 'chickamauga',
                    label: 'CHICKAMAUGA · SEP 1863',
                    coords: { x: 645, y: 425 },
                    labelBox: { x: 555, y: 442, w: 180, h: 18 },
                    labelText: { x: 645, y: 455 },
                    source: 'battles[8].date'
                }
            ]
        },
                recall: {
            beginner: [
                {
                    question: "What date did Vicksburg surrender?",
                    options: [
                        "July 4, 1863 (Independence Day)",
                        "New Year's Day, 1863",
                        "Christmas Day, 1862",
                        "Memorial Day, 1864"
                    ],
                    correctIndex: 0,
                    explanation: " Vicksburg surrendered on July 4, 1863. The city was so bitter about the date that residents refused to celebrate Independence Day for over 80 years afterward.",
                    nudge: " It was a date Americans already celebrated. That made it doubly painful for Confederate Vicksburg residents.",
                    source: 'battles[6].historical.keyFact.intermediate'
                },
                {
                    question: "What was Pickett's Charge?",
                    options: [
                        "A Confederate cavalry raid on Washington",
                        "A failed Confederate attack at Gettysburg where 12,000 men marched across open ground",
                        "A Union plan to capture Richmond",
                        "A naval battle on the Mississippi River"
                    ],
                    correctIndex: 1,
                    explanation: " On the third day of Gettysburg, Lee ordered 12,000 Confederate soldiers to march nearly a mile across open ground into Union artillery and rifle fire. Fewer than half made it back. Lee told his men, 'It is all my fault.'",
                    nudge: " Pickett was a Confederate general. The 'charge' is the part of Gettysburg most Americans remember.",
                    source: 'battles[7].historical.keyFact.intermediate'
                },
                {
                    question: "Why does Chickamauga matter even though the Confederacy won it?",
                    options: [
                        "It proved the South could still win battles, even after losing Vicksburg and Gettysburg the same summer",
                        "It led to Lincoln's assassination",
                        "It ended the war",
                        "It was the battle where Stonewall Jackson died"
                    ],
                    correctIndex: 0,
                    explanation: " Chickamauga came two months after Vicksburg and Gettysburg, when many people thought the war was nearly over. It proved the Confederacy still had fight left in it, and that the war's end was not as close as many had hoped.",
                    nudge: " Think about what people might have assumed in summer 1863, and what Chickamauga forced them to reconsider that fall.",
                    source: 'battles[8].historical.biggerPicture.intermediate'
                }
            ],
            intermediate: [
                {
                    question: "Why did Vicksburg's fall hurt the Confederacy so much beyond losing one city?",
                    options: [
                        "It gave the Union control of the entire Mississippi River, cutting Texas, Arkansas, and Louisiana off from the rest of the South",
                        "It was the Confederate capital",
                        "It contained most of the Confederate army",
                        "It was the only Confederate port on the Atlantic"
                    ],
                    correctIndex: 0,
                    explanation: " Vicksburg sat on the Mississippi River. With its fall, the Union controlled the entire Mississippi from Minnesota to the Gulf, splitting the Confederacy in two and cutting the western states off from supplies and reinforcements.",
                    nudge: " Think about Vicksburg's location, not its size. What does the Mississippi River do, geographically?",
                    source: 'battles[6].historical.biggerPicture.intermediate'
                },
                {
                    question: "Why was Lincoln's Gettysburg Address so important?",
                    options: [
                        "It redefined the war as a fight for equality, not just for the Union",
                        "It announced the surrender of Confederate forces",
                        "It declared a Christmas truce",
                        "It was the longest speech of the war"
                    ],
                    correctIndex: 0,
                    explanation: " Lincoln's Gettysburg Address, delivered four months after the battle, redefined the meaning of the war. The Union was no longer just fighting to keep the country together. It was fighting for 'a new birth of freedom' and the proposition that all men are created equal.",
                    nudge: " Think about what changed in how the war was understood, not what changed on the battlefield.",
                    source: 'battles[7].historical.biggerPicture.intermediate'
                },
                {
                    question: "Why did Chickamauga not finish the Union army even though it was a major Confederate victory?",
                    options: [
                        "General George Thomas held Snodgrass Hill, and Bragg failed to pursue the retreating Union forces",
                        "A storm forced both armies to stop fighting",
                        "Lincoln sent reinforcements by train overnight",
                        "The Confederate army ran out of ammunition"
                    ],
                    correctIndex: 0,
                    explanation: " On the second day, with the Union army nearly broken, General George Thomas held Snodgrass Hill against repeated Confederate assaults until nightfall, earning the nickname 'Rock of Chickamauga.' Bragg then failed to pursue the retreating Union forces, letting them fortify Chattanooga.",
                    nudge: " Two things saved the Union army. One was a Union officer's defense. The other was a Confederate decision not to follow up.",
                    source: 'battles[8].historical.biggerPicture.intermediate'
                }
            ],
            advanced: [
                {
                    question: "Why did losing Vicksburg and Gettysburg in the same week represent a strategic catastrophe for the Confederacy beyond the casualty numbers?",
                    options: [
                        "Vicksburg lost the western Confederacy's geographic spine while Gettysburg ended Lee's offensive capacity in the East",
                        "They were both the largest battles of the entire war",
                        "Both battles killed key Confederate political leaders",
                        "Both battles allowed the Union to capture Richmond"
                    ],
                    correctIndex: 0,
                    explanation: " Each defeat was strategic in a different way. Vicksburg gave the Union the Mississippi River, splitting the Confederacy geographically. Gettysburg ended Lee's ability to invade the North or impose terms through battlefield victory. Together, the two losses meant the Confederacy could no longer project force in either theater.",
                    nudge: " Think about what each defeat made impossible going forward, not how many soldiers each one killed.",
                    source: 'battles[6].historical.biggerPicture.intermediate'
                },
                {
                    question: "How does the 54th Massachusetts at Fort Wagner connect to the political meaning of summer 1863?",
                    options: [
                        "A Black regiment proved in combat that African Americans would fight for their own freedom, redefining what the war was about",
                        "The 54th Massachusetts captured Fort Wagner and ended the war in the South",
                        "It was the only Black regiment in the war",
                        "The 54th Massachusetts was made up of Confederate deserters"
                    ],
                    correctIndex: 0,
                    explanation: " The 54th Massachusetts, a Black regiment, fought heroically at Fort Wagner that same month as Gettysburg. They did not capture the fort, but they proved in the most public way possible that African Americans would fight and die for their own freedom. Combined with the Gettysburg Address, this redefined the war's purpose in real time.",
                    nudge: " Think about what the war was 'for' in 1861 and what it was 'for' by July 1863. The 54th Massachusetts was part of that change.",
                    source: 'battles[7].historical.biggerPicture.intermediate'
                },
                {
                    question: "What does Bragg's failure to pursue after Chickamauga reveal about Confederate command failures in the war's second half?",
                    options: [
                        "The Confederacy often won battles tactically but lacked leadership willing to take strategic risks for follow-through",
                        "Bragg was a Union spy",
                        "The Confederacy never learned to use cavalry",
                        "Bragg was disabled in the battle"
                    ],
                    correctIndex: 0,
                    explanation: " Bragg won Chickamauga but failed to pursue and destroy the retreating Union army, letting them fortify Chattanooga. This pattern of tactical victory without strategic exploitation hurt the Confederacy repeatedly. By 1864, Lincoln had moved Grant west specifically to break this kind of stalemate.",
                    nudge: " Think about the difference between winning a battle and using a battle to actually win a war.",
                    source: 'battles[8].historical.biggerPicture.intermediate'
                }
            ]
        },
        review: {
            beginner: '',
            intermediate: '',
            advanced: ''
        }
    },
    {
        id: 'war_legacy',
        number: 'IV',
        name: "The War's Legacy",
        years: '1864-1865',
        battleIndices: [9, 10, 11, 12],  // Wilderness, Atlanta, Sherman's March, Appomattox
        reflectionBattleIndex: 12,
        intro: {
            positioning: {
                beginner: "The final battles end the war but raise harder questions. Grant won't stop fighting until the South gives up. Sherman destroys what's left. And after Appomattox, the country has to figure out what freedom really means for four million people just released from slavery.",
                intermediate: "In the war's final year Grant refuses to retreat, Sherman targets civilians, and Lincoln's re-election keeps the Union committed to ending the rebellion. But the surrender at Appomattox settles the war on the battlefield without settling what the country owes to four million formerly enslaved people.",
                advanced: "The war's final year transforms its character: Grant accepts unprecedented casualties to maintain pressure, Sherman makes Southern civilians strategic targets, and Atlanta's fall secures Lincoln's re-election against a peace movement that might have let the Confederacy survive. Yet Appomattox closes the military conflict without resolving the political one, and the questions left open about freedom, citizenship, and Reconstruction will shape American life for generations."
            },
            positioningSource: {
                beginner: 'battles[12].historical.biggerPicture.beginner',
                intermediate: 'battles[12].historical.biggerPicture.intermediate',
                advanced: 'battles[12].historical.biggerPicture.advanced'
            },
            // Four battles, two in central VA (Wilderness, Appomattox), two in GA (Atlanta, Sherman's March).
            // Labels carefully offset to avoid the VA pair colliding.
            markers: [
                {
                    battleId: 'wilderness',
                    label: 'WILDERNESS · MAY 1864',
                    coords: { x: 715, y: 320 },
                    labelBox: { x: 632, y: 298, w: 166, h: 18 },
                    labelText: { x: 715, y: 311 },
                    source: 'battles[9].date'
                },
                {
                    battleId: 'atlanta',
                    label: 'ATLANTA · JUL 1864',
                    coords: { x: 660, y: 455 },
                    labelBox: { x: 585, y: 437, w: 150, h: 18 },
                    labelText: { x: 660, y: 450 },
                    source: 'battles[10].date'
                },
                {
                    battleId: 'shermans_march',
                    label: "SHERMAN'S MARCH · NOV 1864",
                    coords: { x: 705, y: 470 },
                    labelBox: { x: 584, y: 486, w: 242, h: 18 },
                    labelText: { x: 705, y: 499 },
                    source: 'battles[11].date'
                },
                {
                    battleId: 'appomattox',
                    label: 'APPOMATTOX · APR 1865',
                    coords: { x: 685, y: 350 },
                    labelBox: { x: 604, y: 362, w: 162, h: 18 },
                    labelText: { x: 685, y: 375 },
                    source: 'battles[12].date'
                }
            ]
        },
                recall: {
            beginner: [
                {
                    question: "What was different about Grant compared to Union generals before him?",
                    options: [
                        "He refused to retreat after a hard fight",
                        "He fought only at night",
                        "He had been a Confederate general",
                        "He never met Lincoln in person"
                    ],
                    correctIndex: 0,
                    explanation: " After the Wilderness, where two days of brutal fighting ended without a clear winner, Grant marched south instead of retreating north. When Union soldiers realized he was not turning back, they cheered. No Union commander before him had refused to retreat after a fight that bloody.",
                    nudge: " Think about what previous generals did after a difficult battle. Grant did the opposite.",
                    source: 'battles[9].historical.keyFact.intermediate'
                },
                {
                    question: "What did Sherman destroy on his march from Atlanta to Savannah?",
                    options: [
                        "Railroads, factories, cotton gins, and farms across a 60-mile-wide path",
                        "Only military bases",
                        "Nothing, the march was peaceful",
                        "Confederate prisons"
                    ],
                    correctIndex: 0,
                    explanation: " Sherman's 60,000 troops marched 300 miles from Atlanta to Savannah in five weeks, destroying railroads, factories, cotton gins, and farms in a 60-mile-wide swath. Soldiers twisted heated rails into 'Sherman's neckties' and burned anything of military value.",
                    nudge: " Sherman's goal was to make the South unable to keep fighting. Think about what kinds of things would have to be destroyed to do that.",
                    source: 'battles[11].historical.whatHappened.intermediate'
                },
                {
                    question: "What happened at Appomattox?",
                    options: [
                        "Lee surrendered to Grant in a private home",
                        "Lincoln gave the Gettysburg Address",
                        "Sherman's march ended at the Atlantic Ocean",
                        "Confederate forces won their last major battle"
                    ],
                    correctIndex: 0,
                    explanation: " On April 9, 1865, in the parlor of the McLean house at Appomattox Court House, Lee surrendered to Grant. Grant offered generous terms: soldiers could keep their horses, officers their sidearms, and everyone could go home.",
                    nudge: " Think about who surrendered to whom, and where it happened. The location was a private parlor, not a battlefield.",
                    source: 'battles[12].historical.whatHappened.intermediate'
                }
            ],
            intermediate: [
                {
                    question: "Why did Atlanta's fall help Lincoln win re-election in 1864?",
                    options: [
                        "It gave voters a reason to believe the war was being won, weakening the peace candidate's argument",
                        "Atlanta voters all moved north and voted for Lincoln",
                        "The Confederate government endorsed Lincoln",
                        "Lincoln personally captured Atlanta"
                    ],
                    correctIndex: 0,
                    explanation: " Before Atlanta fell, the Northern peace movement was gaining strength, and a peace candidate against Lincoln might have won the November election. Sherman's capture of Atlanta in September 1864 changed Northern public opinion, made the war's end look closer, and gave Lincoln the momentum to win re-election.",
                    nudge: " Think about what 1864 voters knew the day before Atlanta fell, and what they knew the day after. That difference reshaped the election.",
                    source: 'battles[10].historical.biggerPicture.intermediate'
                },
                {
                    question: "Why was Sherman's destruction of civilian property considered a new kind of warfare?",
                    options: [
                        "He targeted what civilians needed to support a war, not just enemy armies",
                        "He used weapons that had been banned by international treaty",
                        "He fought only at night",
                        "He attacked towns the Confederacy had already abandoned"
                    ],
                    correctIndex: 0,
                    explanation: " Sherman believed that an army cannot fight without the food, transportation, and manufacturing that civilians produce behind the lines. By destroying those things across Georgia and the Carolinas, he targeted the South's ability to wage war itself, not just its soldiers in the field. This approach is now called 'total war.'",
                    nudge: " Think about what a war needs to keep going besides soldiers. What did Sherman destroy that earlier wars had usually left alone?",
                    source: 'battles[11].historical.tech.intermediate'
                },
                {
                    question: "Why did Lee surrender at Appomattox instead of leading Confederates into a guerrilla war?",
                    options: [
                        "He believed continued fighting would only cause more suffering without changing the outcome",
                        "He had been wounded and could no longer command",
                        "Grant captured him personally",
                        "His soldiers refused to obey orders"
                    ],
                    correctIndex: 0,
                    explanation: " Lee considered breaking his army into small bands to keep fighting from the hills and forests. Instead, he chose to surrender. He believed continued resistance would only prolong suffering for soldiers and civilians on both sides without changing the war's eventual outcome. That decision shaped how Reconstruction would unfold.",
                    nudge: " Think about what Lee had the power to do versus what he chose to do. His choice was deliberate.",
                    source: 'battles[12].historical.biggerPicture.intermediate'
                }
            ],
            advanced: [
                {
                    question: "How did Grant's strategy in 1864 represent a different theory of how to end the war than earlier Union approaches?",
                    options: [
                        "Grant accepted heavier casualties in exchange for continuous pressure that the Confederacy could not match",
                        "Grant used spies more than any Union commander before him",
                        "Grant refused to fight any battles unless he had a 10-to-1 advantage",
                        "Grant's strategy was identical to McClellan's"
                    ],
                    correctIndex: 0,
                    explanation: " Earlier Union commanders fought set-piece battles and then withdrew to refit. Grant understood that the Union had a population and industrial advantage the Confederacy could not match, and that continuous pressure across multiple theaters, even at high cost, would exhaust Southern manpower and supplies in a way that single decisive battles never had. The Wilderness, Spotsylvania, and Cold Harbor cost the Union over 50,000 casualties in six weeks, but Grant kept moving.",
                    nudge: " What did Grant know about the difference in resources between North and South, and how did that knowledge shape what he was willing to spend?",
                    source: 'battles[9].historical.biggerPicture.intermediate'
                },
                {
                    question: "What questions about freedom did Appomattox leave unanswered, and why does that matter?",
                    options: [
                        "Appomattox ended the military conflict but did not settle citizenship, voting rights, or what the country owed to four million formerly enslaved people",
                        "Appomattox automatically gave full citizenship to all freed people",
                        "Appomattox declared the South an independent nation",
                        "Appomattox ended slavery in every state immediately"
                    ],
                    correctIndex: 0,
                    explanation: " The 13th Amendment, which ended slavery nationwide, was ratified in December 1865, eight months after Appomattox. The 14th Amendment (citizenship) and 15th Amendment (voting for Black men) came later. Appomattox closed the war on the battlefield but left the questions of what freedom would look like, who would have it, and what the country owed people just released from slavery to be settled politically. Reconstruction was the answer to those questions, and its successes and failures shape American life to this day.",
                    nudge: " Think about the difference between ending a war and settling what the war was about. The Constitution had to be amended three more times after Appomattox.",
                    source: 'battles[12].historical.biggerPicture.advanced'
                },
                {
                    question: "What does it reveal about the war's complexity that Sherman is celebrated by some historians and condemned by others?",
                    options: [
                        "The same actions can be defended as ending the war faster and condemned for the suffering they caused, and historians weigh those differently",
                        "One group of historians has misread the documents",
                        "Sherman's reputation is fixed and not actually debated",
                        "Historians only condemn Sherman because of recent political changes"
                    ],
                    correctIndex: 0,
                    explanation: " Sherman's defenders argue his march broke Confederate morale and shortened the war, ultimately saving lives. His critics point to deliberate civilian suffering, especially among enslaved people who followed his army and were left vulnerable. Both readings draw on the same evidence and weigh it differently. The Civil War is full of decisions like this, where strategy, ethics, and consequence are tangled in ways no single judgment can resolve.",
                    nudge: " Think about why two careful, honest historians could read the same evidence about Sherman and reach different conclusions. The disagreement is real and ongoing.",
                    source: 'battles[11].historical.biggerPicture.intermediate'
                }
            ]
        },
        review: {
            beginner: '',
            intermediate: '',
            advanced: ''
        }
    }
];
