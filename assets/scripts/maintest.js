import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';


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
var leftEye, rightEye;

document.addEventListener("DOMContentLoaded", startGame);

// Start Game
function startGame() {
    // Set Canvas & Engine //
    canvas = document.getElementById("renderCanvas");
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //console.log(canvas);
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene(engine, canvas);
    camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 0, 0), scene);
    console.log(camera);
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

    setLighting();    //https://models.readyplayer.me/--READYPLAYERME--.glb?morphTargets=ARKit&lod=1&textureFormat=webp
    importAnimationsAndModel("https://models.readyplayer.me/65f86c8897e3a356389d9b8c.glb?morphTargets=ARKit&lod=1&textureFormat=webp&textureQuality=high");
    //randomAnimation();
    // scene.debugLayer.show({embedMode: true}).then(function () {
    // });
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
    console.log(model);
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
        
        //scene.animationGroups[24].play(true, 1.0);
        //console.log("Animations: " + scene.animationGroups);
        //console.log("Animations: " + scene.animationGroups.length);
        //currentAnimation = scene.animationGroups[1];
        hideLoadingView();
        const headMesh = scene.getMeshByName("Wolf3D_Avatar");
//{    
//   "targetNames": [
//     0"browDownLeft",
//     1"browDownRight",
//     2"browInnerUp",
//     3"browOuterUpLeft",
//     4"browOuterUpRight",
//     5"eyeSquintLeft",
//     6"eyeSquintRight",
//     7"eyeWideLeft",
//     8"eyeWideRight",
//     9"jawForward",
//     10"jawLeft",
//     11"jawRight",
//     12"mouthFrownLeft",
//     13"mouthFrownRight",
//     14"mouthPucker",
//     15"mouthShrugLower",
//     16"mouthShrugUpper",
//     17"noseSneerLeft",
//     18"noseSneerRight",
//     19"mouthLowerDownLeft",
//     20"mouthLowerDownRight",
//     21"mouthLeft",
//     22"mouthRight",
//     23"eyeLookDownLeft",
//     24"eyeLookDownRight",
//     25"eyeLookUpLeft",
//     26"eyeLookUpRight",
//     27"eyeLookInLeft",
//     28"eyeLookInRight",
//     29"eyeLookOutLeft",
//     30"eyeLookOutRight",
//     31"cheekPuff",
//     32"cheekSquintLeft",
//     33"cheekSquintRight",
//     34"jawOpen",
//     35"mouthClose",
//     36"mouthFunnel",
//     37mouthDimpleLeft",
//     38"mouthDimpleRight",
//     39"mouthStretchLeft",
//     40"mouthStretchRight",
//     41"mouthRollLower",
//     42"mouthRollUpper",
//     43"mouthPressLeft",
//     44"mouthPressRight",
//     45"mouthUpperUpLeft",
//     46"mouthUpperUpRight",
//     47"mouthSmileLeft",
//     48"mouthSmileRight",
//     49"tongueOut",
//     50"eyeBlinkLeft",
//     51"eyeBlinkRight"
//   ],
//   "name": "Wolf3D_Avatar"
// }
        
        // // Animate Face Morphs
        animateFaceMorphs();
    });
}
//idle face movements
function animateFaceMorphs() {

    const mesh = scene.getMeshByName("Wolf3D_Avatar");
    console.log(77);
    const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    // Animate Eyes
    const animateEyes = async () => {
        const randomNumber = getRandomNumber(1, 2);
        if (randomNumber === 1) {
            const targetValue = randomNumber;
            const initialValue = mesh.morphTargetManager.getTarget(50).influence;
            animateMorphTarget(50, initialValue, targetValue, 1);
            animateMorphTarget(51, initialValue, targetValue, 1);
            var randomNo = getRandomNumber(100, 200);
            await wait(randomNo);
            animateMorphTarget(50, targetValue, initialValue, 1);
            animateMorphTarget(51, targetValue, initialValue, 1);
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
        animateMorphTarget(2, initialValue, targetValue, 15);
        animateMorphTarget(3, initialValue, targetValue, 15);
        animateMorphTarget(4, initialValue, targetValue, 15);
    };

    // Smile
    const animateSmile = () => {
        const random = Math.random() * 0.18 + 0.02;
        const initialValue = mesh.morphTargetManager.getTarget(47).influence;
        const targetValue = random;
        animateMorphTarget(47, initialValue, targetValue, 30);
        animateMorphTarget(48, initialValue, targetValue, 30);
    };

    // Mouth Left / Right
    const animateMouthLeftRight = () => {
        const random1 = Math.random() * 0.7;
        const randomLeftOrRight = getRandomNumber(0, 1);
        const targetIndex = randomLeftOrRight === 1 ? 22 : 21;
        const initialValue = mesh.morphTargetManager.getTarget(targetIndex).influence;
        const targetValue = random1;
        animateMorphTarget(targetIndex, initialValue, targetValue, 90);
    };

    // Nose
    const animateNose = () => {
        const random = Math.random() * 0.7;
        const initialValue = mesh.morphTargetManager.getTarget(17).influence;
        const targetValue = random;
        animateMorphTarget(17, initialValue, targetValue, 60);
        animateMorphTarget(18, initialValue, targetValue, 60);
    };

    // Jaw Forward
    const animateJawForward = () => {
        const random = Math.random() * 0.5;
        const initialValue = mesh.morphTargetManager.getTarget(9).influence;
        const targetValue = random;
        animateMorphTarget(9, initialValue, targetValue, 60);
    };

    // Cheeks
    const animateCheeks = () => {
        const random = Math.random() * 1;
        const initialValue = mesh.morphTargetManager.getTarget(32).influence;
        const targetValue = random;
        animateMorphTarget(32, initialValue, targetValue, 60);
        animateMorphTarget(33, initialValue, targetValue, 60);
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
