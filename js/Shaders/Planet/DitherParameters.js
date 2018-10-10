var DitherPattern = [0,  32, 8,  40, 2,  34, 10, 42,
                     48, 16, 56, 24, 50, 18, 58, 26,
                     12, 44, 4,  36, 14, 46, 6,  38,
                     60, 28, 52, 20, 62, 30, 54, 22,
                     3,  35, 11, 43, 1,  33, 9,  41,
                     51, 19, 59, 27, 49, 17, 57, 25,
                     15, 47, 7,  39, 13, 45, 5,  37,
                     63, 31, 55, 23, 61, 29, 53, 21];

var DitherPattern2 = [0,  48, 12, 60, 3,  51, 15, 63,
                      32, 16, 44, 28, 35, 19, 47, 31,
                      8,  56, 4,  52, 11, 59, 7,  55,
                      40, 24, 36, 20, 43, 27, 39, 23,
                      2,  50, 14, 62, 1,  49, 13, 61,
                      34, 18, 46, 30, 33, 17, 45, 29,
                      10, 58, 6,  54, 9,  57, 5,  53,
                      42, 26, 38, 22, 41, 25, 37, 21];


var DitherPattern4x4 =  [ 0, 8, 1, 10,
                          12, 4, 14, 6,
                          3, 11, 1, 9,
                          15, 7, 13, 5,
                        ];
var Dither3x3 = 
[
  6, 8, 4,
  1, 0, 3,
  5, 2, 7,
];
//This is giving Wierd Results at times so will need to test or change later
var GrayScalePallete = [new THREE.Vector3( 0.0, 0.0, 0.0),
                        new THREE.Vector3( .14, .14, .14 ),
                        new THREE.Vector3( .28, .28, .28 ),
                        new THREE.Vector3( .43, .43, .43 ),
                        new THREE.Vector3( .57, .57, .57 ),
                        new THREE.Vector3( .71, .71, .71 ),
                        new THREE.Vector3( .85, .85, .85 ),
                        new THREE.Vector3( .9, .9, .9)];