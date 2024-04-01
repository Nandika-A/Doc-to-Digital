import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import {Howl, Howler} from 'howler';

// Global BabylonJS Variables
var canvas ;
var engine ; 
var scene ;
var camera ;
var dirLight ;
var hemiLight; 
var shadowGenerator;


var ground;
var hdrTexture;
var hdrRotation = 0;
var hdrSkybox;
var currentAnimation;

var sound;
document.addEventListener("DOMContentLoaded", startGame);
console.log("check");
// Start Game
function startGame() {
    // Set Canvas & Engine //

    console.log("check");
    canvas = document.getElementById("renderCanvas");
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //console.log(canvas);
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene(engine, canvas);
    camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 0, 0), scene);
    
    var toRender = function () {
        scene.render();
    }
    engine.runRenderLoop(toRender);
    
    createCamera();

    // Hemispheric Light //
    hemiLight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.1;

    // Directional Light //
    dirLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(0,0,0), scene);
    dirLight.intensity = 1.5;
    dirLight.position = new BABYLON.Vector3(0,30,10);
    dirLight.direction = new BABYLON.Vector3(-2, -4, -5);

    // Cylinder Ground //
    ground = BABYLON.MeshBuilder.CreateCylinder("ground", {diameter: 7, height: 0.2, tessellation: 80}, scene);
    ground.position.y = -0.1;
    ground.isPickable = false;
    var groundMat = new BABYLON.PBRMaterial("groundMaterial", scene);
    groundMat.albedoColor = new BABYLON.Color3(0.95,0.95,0.95);
    groundMat.roughness = 0.15;
    groundMat.metallic = 0;
    groundMat.specularIntensity = 0;
    ground.material = groundMat;
    ground.receiveShadows = true;

    setLighting();    
    importAnimationsAndModel('static/model3.glb');//"https://models.readyplayer.me/65f86c8897e3a356389d9b8c.glb?morphTargets=ARKit&lod=1&textureFormat=webp&textureQuality=high");
    //randomAnimation();
    // scene.debugLayer.show({embedMode: true}).then(function () {
    // });
    //playIdle();
    console.log("check");
    
    //animateEyesAll();
}

// Create Scene
function createScene(engine, canvas) {
    // Set Canvas & Engine //
    var scene = new BABYLON.Scene(engine);
    return scene;
}

// Create Follow Camera
function createCamera() {  
    camera.position.z = 2.5;
    camera.position.y = 1.2;
    camera.attachControl(canvas, true);
    camera.setTarget(new BABYLON.Vector3(0, 1, 0));
}

// Setup Animations & Player
var player;
var animationsGLB = [];
// Import Animations and Models
async function importAnimationsAndModel(model) {
    await importAnimations("F_Standing_Idle_001.glb");
    await importAnimations("F_Run_Jump_001.glb");
    await importAnimations("M_Dances_001.glb");
    await importAnimations("M_Dances_002.glb");
    for (let index = 0; index < 9; index++) {
        var int = index + 1;
        if(int === 3){
            continue;
        }
        await importAnimations("M_Standing_Expressions_00" + int + ".glb");
    }
    for (let index = 9; index < 12; index++) {
        var int = index + 1;
        if(int === 3){
            continue;
        }
        await importAnimations("M_Standing_Expressions_0" + int + ".glb");
    }
    for (let index = 0; index < 9; index++) {
        
        var int = index + 1;
        await importAnimations("M_Talking_Variations_00" + int + ".glb");
    }
    await importAnimations("M_Talking_Variations_010.glb");
    importModel(model);
}


// Import Animations
async function importAnimations(animation) {
    //console.log(animation)
    return BABYLON.SceneLoader.ImportMeshAsync(null, "static/animations/", animation, scene)
       .then((result) => {
        result.meshes.forEach(element => {
            if (element)
                element.dispose();  
        });
        animationsGLB.push(result.animationGroups[0]);
    });
}
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Import Model
function importModel(model) {
    
    BABYLON.SceneLoader.ImportMeshAsync(null, model, null, scene)
       .then((result) => {

        player = result.meshes[0];
        player.name = "Character";

        var modelTransformNodes = player.getChildTransformNodes();
        
        animationsGLB.forEach((animation) => {

          const modelAnimationGroup = animation.clone(model.replace(".glb", "_") + animation.name, (oldTarget) => {
            return modelTransformNodes.find((node) => node.name === oldTarget.name);
          });
          //console.log(modelAnimationGroup);
          animation.dispose();
        });
        
        animationsGLB = [];

        
    
        setReflections();
        setShadows();   //3 is weird dance 4 is wave hi
        //5 is point //6 is shrug yes //7 is shrug maybe //8 is stretch  //9 is body laugh  
        //10 point and come on gesture //11 bend and come on gesture //12 come on gesture
        //13 really bad/ no gesture //14 good job gesture //15 this is how it is hand subtle movements
        //16 more explain hand movements //17 no explanation hand movements //18 absoluteky not
        //19 explanation hand movements //20 explanation g=hand movements //21 explanation hand movements
        //22 no explanation hand movements //23 not sure explanation hand movements //24 explanation hand movements
        
        playIdle();
        document.addEventListener('click', function() {
            playAudio();
        });
        hideLoadingView();
        // // Animate Face Morphs
        
    });
};

// {
//     "targetNames": [
//       0"viseme_sil",
//       1"viseme_PP",
//       2"viseme_FF",
//       3"viseme_TH",
//       4"viseme_DD",
//       5"viseme_kk",
//       6"viseme_CH",
//       7"viseme_SS",
//       8"viseme_nn",
//       9"viseme_RR",
//       10"viseme_aa",
//       11"viseme_E",
//       12"viseme_I",
//       13"viseme_O",
//       14"viseme_U",
//       15"browDownLeft",
//       16"browDownRight",
//       17"browInnerUp",
//       18"browOuterUpLeft",
//       19"browOuterUpRight",
//       20"eyeSquintLeft",
//       21"eyeSquintRight",
//       22"eyeWideLeft",
//       23"eyeWideRight",
//       24"jawForward",
//       25"jawLeft",
//       26"jawRight",
//       27"mouthFrownLeft",
//       28"mouthFrownRight",
//       29"mouthPucker",
//       30"mouthShrugLower",
//       31"mouthShrugUpper",
//       32"noseSneerLeft",
//       33"noseSneerRight",
//       34"mouthLowerDownLeft",
//       35"mouthLowerDownRight",
//       36"mouthLeft",
//       37"mouthRight",
//       38"eyeLookDownLeft",
//       39"eyeLookDownRight",
//       40"eyeLookUpLeft",
//       41"eyeLookUpRight",
//       42"eyeLookInLeft",
//       43"eyeLookInRight",
//       44"eyeLookOutLeft",
//       45"eyeLookOutRight",
//       46"cheekPuff",
//       47"cheekSquintLeft",
//       48"cheekSquintRight",
//       49"jawOpen",
//       50"mouthClose",
//       51"mouthFunnel",
//       52"mouthDimpleLeft",
//       53"mouthDimpleRight",
//       54"mouthStretchLeft",
//       55"mouthStretchRight",
//       56"mouthRollLower",
//       57"mouthRollUpper",
//       58"mouthPressLeft",
//       59"mouthPressRight",
//       60"mouthUpperUpLeft",
//       61"mouthUpperUpRight",
//       62"mouthSmileLeft",
//       63"mouthSmileRight",
//       64"tongueOut",
//       65"eyeBlinkLeft",
//       66"eyeBlinkRight"
//     ],
//     "name": "Wolf3D_Avatar"
//   }

function playIdle(){
    scene.animationGroups[0].play(true, 1.0);
        //console.log("Animations: " + scene.animationGroups);
        //console.log("Animations: " + scene.animationGroups.length);
    currentAnimation = scene.animationGroups[1];
    //animateEyesAll();
    //animateFaceMorphs();
};
function animateEyesAll(){
    const mesh = scene.getMeshByName("Wolf3D_Avatar");
    // animateMorphTarget registerBeforeRender
    const animateMorphTarget = (targetIndex, initialValue, targetValue, numSteps) => {
        let currentStep = 0;
        const morphTarget = mesh.morphTargetManager.getTarget(targetIndex);

        const animationCallback = () => {
            currentStep++;
            const t = currentStep / numSteps;
            morphTarget.influence = BABYLON.Scalar.Lerp(initialValue, targetValue, t);
            if (currentStep >= numSteps) {
                scene.unregisterBeforeRender(animationCallback);
            }
        };

        scene.registerBeforeRender(animationCallback);
    };

    // Animate Eyes
    const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const animateEyes = async () => {
        const randomNumber = getRandomNumber(1, 2);
        if (randomNumber === 1) {
            const targetValue = randomNumber;
            const initialValue = mesh.morphTargetManager.getTarget(50).influence;
            animateMorphTarget(65, initialValue, targetValue, 1);
            animateMorphTarget(66, initialValue, targetValue, 1);
            var randomNo = getRandomNumber(100, 200);
            await wait(randomNo);
            animateMorphTarget(65, targetValue, initialValue, 1);
            animateMorphTarget(66, targetValue, initialValue, 1);
            randomNo = getRandomNumber(100, 200);
            await wait(randomNo);
        }
    };
    setInterval(animateEyes, 1200);

}

function animateSyllableMorphs(index){
    const mesh = scene.getMeshByName("Wolf3D_Avatar");
    // animateMorphTarget registerBeforeRender
    const easingFunction = new BABYLON.QuadraticEase();
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    const animateMorphTarget = (targetIndex, initialValue, targetValue, numSteps) => {
        let currentStep = 0;
        const morphTarget = mesh.morphTargetManager.getTarget(targetIndex);

        const animationCallback = () => {
            currentStep++;
            const t = currentStep / numSteps;
            morphTarget.influence = BABYLON.Scalar.Lerp(initialValue, targetValue, t);
            if (currentStep >= numSteps) {
                scene.unregisterBeforeRender(animationCallback);
            }
        };

        scene.registerBeforeRender(animationCallback);
    };
    
    const animateJawForward = () => {
        const random = 0.2;
        //console.log("ele");
        const initialValue = mesh.morphTargetManager.getTarget(index).influence;
        
        animateMorphTarget(index, initialValue, 0.3, 0.5);
    };
    animateJawForward();
    
}
//idle face movements
function animateFaceMorphs() {

    const mesh = scene.getMeshByName("Wolf3D_Avatar");
    const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    // Animate Eyes
    const animateEyes = async () => {
        const randomNumber = getRandomNumber(1, 2);
        if (randomNumber === 1) {
            const targetValue = randomNumber;
            const initialValue = mesh.morphTargetManager.getTarget(50).influence;
            animateMorphTarget(65, initialValue, targetValue, 1);
            animateMorphTarget(66, initialValue, targetValue, 1);
            var randomNo = getRandomNumber(100, 200);
            await wait(randomNo);
            animateMorphTarget(65, targetValue, initialValue, 1);
            animateMorphTarget(66, targetValue, initialValue, 1);
            randomNo = getRandomNumber(100, 200);
            await wait(randomNo);
        }
    }
    
    
    
    // animateMorphTarget registerBeforeRender
    const animateMorphTarget = (targetIndex, initialValue, targetValue, numSteps) => {
        let currentStep = 0;
        const morphTarget = mesh.morphTargetManager.getTarget(targetIndex);

        const animationCallback = () => {
            currentStep++;
            const t = currentStep / numSteps;
            morphTarget.influence = BABYLON.Scalar.Lerp(initialValue, targetValue, t);
            if (currentStep >= numSteps) {
                scene.unregisterBeforeRender(animationCallback);
            }
        };

        scene.registerBeforeRender(animationCallback);
    };

    // Brows
    const animateBrow = () => {
        const random = Math.random() * 0.1;
        const initialValue = mesh.morphTargetManager.getTarget(2).influence;
        const targetValue = random;
        animateMorphTarget(17, initialValue, targetValue, 15);
        animateMorphTarget(18, initialValue, targetValue, 15);
        animateMorphTarget(19, initialValue, targetValue, 15);
    };

    // Smile
    const animateSmile = () => {
        const random = Math.random() * 0.18 + 0.02;
        const initialValue = mesh.morphTargetManager.getTarget(62).influence;
        const targetValue = random;
        animateMorphTarget(62, initialValue, targetValue, 30);
        animateMorphTarget(63, initialValue, targetValue, 30);
    };

    // Mouth Left / Right
    const animateMouthLeftRight = () => {
        const random1 = Math.random() * 0.7;
        const randomLeftOrRight = getRandomNumber(0, 1);
        const targetIndex = randomLeftOrRight === 1 ? 37 : 36;
        const initialValue = mesh.morphTargetManager.getTarget(targetIndex).influence;
        const targetValue = random1;
        animateMorphTarget(targetIndex, initialValue, targetValue, 90);
    };

    // Nose
    const animateNose = () => {
        const random = Math.random() * 0.7;
        const initialValue = mesh.morphTargetManager.getTarget(32).influence;
        const targetValue = random;
        animateMorphTarget(32, initialValue, targetValue, 60);
        animateMorphTarget(33, initialValue, targetValue, 60);
    };

    // Jaw Forward
    const animateJawForward = () => {
        const random = Math.random() * 0.5;
        const initialValue = mesh.morphTargetManager.getTarget(24).influence;
        const targetValue = random;
        animateMorphTarget(24, initialValue, targetValue, 60);
    };

    // Cheeks
    const animateCheeks = () => {
        const random = Math.random() * 1;
        const initialValue = mesh.morphTargetManager.getTarget(47).influence;
        const targetValue = random;
        animateMorphTarget(47, initialValue, targetValue, 60);
        animateMorphTarget(48, initialValue, targetValue, 60);
    };

    setInterval(animateEyes, 1200);
    setInterval(animateBrow, 7000);
    setInterval(animateSmile, 2000);
    setInterval(animateMouthLeftRight, 1500);
    setInterval(animateNose, 1000);
    setInterval(animateJawForward, 2000);
    setInterval(animateCheeks, 1200);
};

function randomAnimation() {  //set for web socket

    var randomNumber = 4; //getInt(1, 13);
    var newAnimation = scene.animationGroups[randomNumber];
    scene.onBeforeRenderObservable.runCoroutineAsync(animationBlending(currentAnimation, 1.0, newAnimation, 1.0, true, 0.02));
    //document.getElementById("info-text").innerHTML = "Current Animation<br>" + newAnimation.name;
}

// Animation Blending
function* animationBlending(fromAnim, fromAnimSpeedRatio, toAnim, toAnimSpeedRatio, repeat, speed)
{
    let currentWeight = 1;
    let newWeight = 0;
    fromAnim.stop();
    toAnim.play(repeat);
    fromAnim.speedRatio = fromAnimSpeedRatio;
    toAnim.speedRatio = toAnimSpeedRatio;
    while(newWeight < 1)
    {
        newWeight += speed;
        currentWeight -= speed;
        toAnim.setWeightForAllAnimatables(newWeight);
        fromAnim.setWeightForAllAnimatables(currentWeight);
        yield;
    }

    currentAnimation = toAnim;
}

var smoothMorphTarget= true;
var morphTargetSmoothing= 0.5;

function playAudio(){
    
    const music = new BABYLON.Sound("Music", "media/audio/santa.wav", scene, null, {
        loop: false,
        autoplay: true,
    });
    async function loadLipSync() {
        const response = await fetch('static/lip-synch/santa.json');
        const data = await response.json();
        return data;
    }
    var lipsync =loadLipSync();//{};//= JSON.parse('static/lip-synch/santa.json');
    // fetch('static/lip-synch/santa.json')
    //     .then(response => response.json())
    //     .then(data => {
    //         lipsync = data;
    //         //console.log(data);
    //     }
        
    // );
    var mouthcues={};
    lipsync.then(data => {
        const mouthCues = data.mouthCues;
        mouthcues=mouthCues; 
    });
    const corresponding = {
        A: 1,//"viseme_PP",
        B: 5,//"viseme_kk",
        C: 12,//"viseme_I",
        D: 10,//"viseme_AA",
        E: 13,//"viseme_O",
        F: 14,//"viseme_U",
        G: 2,//"viseme_FF",
        H: 3,//"viseme_TH",
        X: 1,//"viseme_PP",
    };
    animateEyesAll();
    scene.registerBeforeRender(() => {        
        if (music.paused || music.ended) {
          //setAnimation("Idle");
          animateFaceMorphs();
          
        }
        
        const mesh = scene.getMeshByName("Wolf3D_Avatar");
        let manager = mesh.morphTargetManager;

        // Function to set the influence of a morph target based on a mouth cue
        function setMouthShape(cue) {
            let targetIndex = corresponding[cue.value];
            manager.getTarget(targetIndex).influence = 1;
        }

        // Function to reset all morph targets
        function resetMouthShape() {
            for (let i = 0; i < manager.numTargets; i++) {
                manager.getTarget(i).influence = 0;
            }
        }

        // Iterate over the mouth cues and set the mouth shape at the appropriate times
        function updateMouthShape() {
            let currentAudioTime = music.currentTime;
            for (let i = 0; i < mouthcues.length; i++) {
                let cue = mouthcues[i];
                if (currentAudioTime >= cue.start && currentAudioTime <= cue.end) {
                    resetMouthShape();
                    setMouthShape(cue);
                    break;
                }
            }
        }
        scene.registerBeforeRender(updateMouthShape);
    
       });
    
    
}
// Environment Lighting
function setLighting() {
    hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("./static/environment.env", scene);
    hdrTexture.rotationY = BABYLON.Tools.ToRadians(hdrRotation);
    hdrSkybox = BABYLON.MeshBuilder.CreateBox("skybox", {size: 1024}, scene);
    var hdrSkyboxMaterial = new BABYLON.PBRMaterial("skybox", scene);
    hdrSkyboxMaterial.backFaceCulling = false;
    hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
    hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    hdrSkyboxMaterial.microSurface = 0.4;
    hdrSkyboxMaterial.disableLighting = true;
    hdrSkybox.material = hdrSkyboxMaterial;
    hdrSkybox.infiniteDistance = true;
}

// Set Shadows
function setShadows() {
    shadowGenerator = new BABYLON.ShadowGenerator(2048, dirLight, true);
    scene.meshes.forEach(function(mesh) {
        if (mesh.name != "skybox" 
        && mesh.name != "ground")
        {
            shadowGenerator.darkness = 0.1;
            shadowGenerator.bias = 0.00001;
            shadowGenerator.useBlurExponentialShadowMap = true;
            shadowGenerator.addShadowCaster(mesh);
        }
    });
}

// Set Reflections
function setReflections() {
    scene.materials.forEach(function (material) {
        if (material.name != "skybox") {
            material.reflectionTexture = hdrTexture;
            material.reflectionTexture.level = 0.9;
            material.environmentIntensity = 0.7;
            material.disableLighting = false;
        }
    });
}

// Hide Loading View
function hideLoadingView() {
    document.getElementById("loadingDiv").style.display = "none";
}

// Resize Window
window.addEventListener("resize", function () {
    engine.resize();
});
